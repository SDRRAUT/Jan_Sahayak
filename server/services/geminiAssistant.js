/**
 * JAN_SAHAYAK AI ASSISTANT — GEMINI CONVERSATIONAL REASONING SERVICE
 * 
 * Server-Side Only Google Gemini REST API Integration
 * Multi-Turn Tool Calling & Indic NLP Grounding
 * Zero Client-Side API Key Exposure
 */

import { getToolsForRole, executeAssistantTool } from './assistantTools.js';

export class GeminiAssistantService {
  constructor() {
    this.defaultModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.modelsToTry = [this.defaultModel, 'gemini-2.0-flash', 'gemini-1.5-flash-8b'];
  }

  getApiKey() {
    return process.env.GEMINI_API_KEY || process.env.AI_API_KEY || null;
  }

  /**
   * Builds the strict system prompt incorporating active role and current page/entity context
   */
  buildSystemInstruction(user = {}, context = {}) {
    const role = (user.role || 'citizen').toUpperCase();
    const entityContext = context.current_entity_id 
      ? `Active entity context: ${context.current_entity_type || 'entity'} ID: ${context.current_entity_id}. Current route: ${context.current_route || 'unknown'}.`
      : `Current route: ${context.current_route || '/'}. Current page: ${context.current_page || 'Overview'}.`;

    return `You are Jan_Sahayak Assistant, the official civic intelligence AI for the JanSahayak Municipal Grievance & Resolution Platform.

AUTHENTICATED USER CONTEXT:
- Name: ${user.name || 'Citizen'}
- User ID: ${user.id || 'USR-CITIZEN-01'}
- Role: ${role}
- Department: ${user.department || 'N/A'}
- Ward: ${user.ward || 'N/A'}
- ${entityContext}

CRITICAL RULES:
1. NEVER INVENT OR HALLUCINATE: You must never guess or fabricate complaint statuses, incident numbers, officer assignments, resolution timelines, or citywide counts.
2. ALWAYS USE AUTHORIZED TOOLS: Whenever the user asks about specific complaints, incidents, timelines, evidence, root causes, emerging clusters, or municipal metrics, call the appropriate tool.
3. DATA GROUNDING: Only state facts that were directly returned in the tool response. If no record is found or data is missing, respond: "Mujhe is information ka verified record nahi mil raha."
4. ROLE BOUNDARIES: You are strictly scoped to the user's role (${role}).
   - CITIZEN: Provide empathetic, simple, reassuring, and clear updates. Avoid bureaucratic jargon. Explain what is happening on the ground and what steps are next.
   - CIVIC OFFICER: Provide crisp, operational summaries: (1) Situation, (2) Possible Cause, (3) Supporting Evidence, (4) Recommended Next Step, (5) Verification Needed.
   - SUPER ADMIN: Provide high-level governance insights: cluster growth, cross-department dependencies, SLA compliance, and ward hotspots.
5. MULTILINGUAL HINGLISH: Understand and reply naturally in Hindi, Hinglish, or English depending on how the user addresses you.
   Example: If user asks "Meri complaint ka status kya hai?", reply in friendly Hinglish like "Aapki complaint field inspection ke liye assign ho chuki hai..."
6. SENSITIVE ACTIONS REQUIRE CONFIRMATION:
   - If the user asks to perform a high-impact operation (e.g. "Reopen this complaint", "Escalate to SE", "Approve resolution"), DO NOT claim the action succeeded!
   - Ask for confirmation first, specifying the reason and entity.
   - Mark in your response that user confirmation is needed.
7. CONTEXT AWARENESS: If the user asks an ambiguous question like "Ab iska kya hoga?" or "Short summary do", resolve it using the active entity context (${context.current_entity_id || 'none'}).`;
  }

  /**
   * Main Chat Processor: Performs Gemini Function Calling loop against authorized tools
   */
  async processChatMessage({ message, history = [], user = {}, context = {} }) {
    const role = (user.role || 'citizen').toLowerCase();
    const apiKey = this.getApiKey();
    const systemInstruction = this.buildSystemInstruction(user, context);
    const tools = getToolsForRole(role);

    // Limit conversation history to last 8 messages to maintain bounded context window & cost control
    const boundedHistory = Array.isArray(history) ? history.slice(-8) : [];

    // Format contents array for Gemini REST API
    const contents = [];

    // Append prior history turns
    for (const item of boundedHistory) {
      if (item.sender === 'user') {
        contents.push({ role: 'user', parts: [{ text: item.text }] });
      } else if (item.sender === 'assistant' || item.sender === 'bot') {
        contents.push({ role: 'model', parts: [{ text: item.text }] });
      }
    }

    // Append current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const toolsCalled = [];
    let actionProposal = null;

    // Check if user is requesting a sensitive action that requires confirmation
    actionProposal = this.detectActionProposal(message, context, role);

    // ------------------------------------------------------------------------
    // REMOTE GEMINI API CALL WITH FUNCTION CALLING
    // ------------------------------------------------------------------------
    if (apiKey) {
      for (const model of this.modelsToTry) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const requestBody = {
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            contents,
            tools: [{ functionDeclarations: tools }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 800
            }
          };

          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });

          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            console.warn(`[GeminiAssistant] Model ${model} returned ${res.status}:`, errJson?.error?.message?.slice(0, 120));
            continue; // try next model
          }

          const resData = await res.json();
          const candidate = resData.candidates?.[0];
          const part = candidate?.content?.parts?.[0];

          // CASE 1: Gemini wants to call a tool (functionCall)
          if (part && part.functionCall) {
            const { name, args } = part.functionCall;
            toolsCalled.push({ name, args });

            // Execute the authorized tool
            const toolResult = await executeAssistantTool(name, args, { ...user, ...context });

            // Send tool result back to Gemini in turn 2 to get final grounded response
            const turn2Contents = [
              ...contents,
              { role: 'model', parts: [{ functionCall: { name, args } }] },
              {
                role: 'function',
                parts: [{
                  functionResponse: {
                    name,
                    response: toolResult
                  }
                }]
              }
            ];

            const turn2Res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents: turn2Contents,
                generationConfig: { temperature: 0.2, maxOutputTokens: 800 }
              })
            });

            if (turn2Res.ok) {
              const turn2Data = await turn2Res.json();
              const finalReply = turn2Data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (finalReply) {
                return {
                  reply: finalReply,
                  toolsCalled,
                  actionProposal,
                  groundedData: toolResult
                };
              }
            }

            // If turn 2 had an issue, formulate from the tool result
            return {
              reply: this.formatDirectToolSummary(name, toolResult, role),
              toolsCalled,
              actionProposal,
              groundedData: toolResult
            };
          }

          // CASE 2: Direct conversational response from Gemini
          if (part && part.text) {
            return {
              reply: part.text,
              toolsCalled,
              actionProposal
            };
          }
        } catch (err) {
          console.warn(`[GeminiAssistant] Model ${model} execution error:`, err.message);
        }
      }
    }

    // ------------------------------------------------------------------------
    // OFFLINE / DETERMINISTIC INDIC GROUNDING FALLBACK
    // ------------------------------------------------------------------------
    return this.fallbackGroundingEngine(message, user, context, toolsCalled, actionProposal);
  }

  /**
   * Action Confirmation Detector: Identifies if the user is asking to execute a mutation
   */
  detectActionProposal(message, context, role) {
    const text = message.toLowerCase();

    // Reopen complaint
    if (text.includes('reopen') || text.includes('re-open') || text.includes('wapas kholo') || text.includes('phir se open')) {
      const complaintId = context.current_entity_id || 'JS-10482';
      return {
        actionType: 'REOPEN_COMPLAINT',
        entityId: complaintId,
        entityType: 'complaint',
        title: `Confirm Reopening Ticket #${complaintId}`,
        description: 'Reopen this complaint with escalation to the Superintending Engineer.',
        promptQuestion: `Aapki complaint abhi recorded hai. Kya aap complaint ${complaintId} ko reopen karke reason submit karna chahte hain?`,
        requiresConfirmation: true
      };
    }

    // Escalate to authority
    if (text.includes('escalate') || text.includes('senior officer') || text.includes('urgent mark')) {
      const entityId = context.current_entity_id || 'INC-2026-089';
      return {
        actionType: 'ESCALATE_INCIDENT',
        entityId,
        entityType: 'incident',
        title: `Escalate Incident #${entityId}`,
        description: 'Trigger Priority 1 SLA alert and notify Superintending Engineer.',
        promptQuestion: `Kya aap incident ${entityId} ko Executive Division level par escalate karna chahte hain?`,
        requiresConfirmation: true
      };
    }

    // Citizen Verify Resolution
    if (text.includes('verify') || text.includes('confirm solve') || text.includes('theek ho gaya')) {
      const complaintId = context.current_entity_id || 'JS-10482';
      return {
        actionType: 'VERIFY_RESOLUTION',
        entityId: complaintId,
        entityType: 'complaint',
        title: `Confirm Resolution for Ticket #${complaintId}`,
        description: 'Mark issue as verified on ground and log confirmation to Civic Memory.',
        promptQuestion: `Kya aap confirm karte hain ki complaint ${complaintId} ki samasya ground par hal ho chuki hai?`,
        requiresConfirmation: true
      };
    }

    return null;
  }

  /**
   * Deterministic indic NLP fallback when remote Gemini is offline or rate-limited
   */
  async fallbackGroundingEngine(message, user, context, toolsCalled, actionProposal) {
    const role = (user.role || 'citizen').toLowerCase();
    const text = message.toLowerCase();

    // 1. Citizen queries
    if (role === 'citizen') {
      if (text.includes('status') || text.includes('kya hua') || text.includes('scene') || text.includes('kahan pahunchi')) {
        const toolRes = await executeAssistantTool('get_my_complaint_details', {}, { ...user, ...context });
        toolsCalled.push({ name: 'get_my_complaint_details', args: {} });
        if (toolRes.error) {
          return {
            reply: 'Mujhe aapki complaint ka verified record nahi mil raha. Kripya complaint number check karein ya citizen dashboard par dekhein.',
            toolsCalled
          };
        }
        return {
          reply: `Aapki complaint **#${toolRes.id}** (${toolRes.title}) abhi **${toolRes.status}** stage par hai. Yeh **${toolRes.department}** ke officer **${toolRes.officer}** ko assign ki gayi hai. Expected resolution SLA mein abhi lagbhag **${toolRes.slaHoursLeft} ghante** bache hain.`,
          toolsCalled,
          actionProposal,
          groundedData: toolRes
        };
      }

      if (text.includes('connect') || text.includes('cluster') || text.includes('23 report') || text.includes('incident')) {
        const toolRes = await executeAssistantTool('get_related_incident', {}, { ...user, ...context });
        toolsCalled.push({ name: 'get_related_incident', args: {} });
        return {
          reply: `Aapki complaint ko **${toolRes.incidentId}** (${toolRes.incidentTitle}) se connect kiya gaya hai. Is cluster mein Rohini Ward 14 ke aas-paas ke **${toolRes.totalComplaintsInCluster} citizens** ki similar problems mili hain. Reason: ${toolRes.connectionReason}`,
          toolsCalled,
          groundedData: toolRes
        };
      }

      if (text.includes('ai') || text.includes('dna') || text.includes('kyu') || text.includes('identify')) {
        const toolRes = await executeAssistantTool('get_ai_explanation', {}, { ...user, ...context });
        toolsCalled.push({ name: 'get_ai_explanation', args: {} });
        return {
          reply: `JanSahayak Grievance DNA™ ne is problem ko **${toolRes.aiDiagnosis.category}** identify kiya hai (${toolRes.aiDiagnosis.clusterConfidence} confidence). Main reasons:\n• ${toolRes.aiDiagnosis.factors.join('\n• ')}`,
          toolsCalled,
          groundedData: toolRes
        };
      }

      if (text.includes('verification') || text.includes('photo') || text.includes('solve')) {
        const toolRes = await executeAssistantTool('get_verification_status', {}, { ...user, ...context });
        toolsCalled.push({ name: 'get_verification_status', args: {} });
        return {
          reply: `Verification Status: **${toolRes.verificationStatus}**. Jab field inspection team ground par kaam poora karegi, aapko app par completion photo aur verification prompt dikhai dega jahan aap sign-off kar sakte hain.`,
          toolsCalled,
          actionProposal,
          groundedData: toolRes
        };
      }

      // Default citizen answer
      const complaintsRes = await executeAssistantTool('get_my_complaints', {}, { ...user, ...context });
      toolsCalled.push({ name: 'get_my_complaints', args: {} });
      return {
        reply: `Namaste ${user.name || 'Citizen'}! Aapke account mein abhi **${complaintsRes.count || 0} active grievances** hain. Aap kisi bhi complaint ke baare mein pooch sakte hain, jaise status, timeline, ya AI explanation.`,
        toolsCalled,
        actionProposal
      };
    }

    // 2. Civic Officer queries
    if (['civic_officer', 'officer', 'dept_admin'].includes(role)) {
      if (text.includes('summary') || text.includes('incident') || text.includes('detail')) {
        const toolRes = await executeAssistantTool('get_incident_details', {}, { ...user, ...context });
        toolsCalled.push({ name: 'get_incident_details', args: {} });
        return {
          reply: `### Operational Summary: ${toolRes.id}
**Situation:** ${toolRes.title} in ${toolRes.ward} (${toolRes.complaintCount} linked citizen reports).
**Severity / SLA:** ${toolRes.severity} | ${toolRes.slaHoursLeft} hours remaining.
**Possible Cause:** ${toolRes.rootCauseSummary}
**Current Stage:** ${toolRes.status} (${toolRes.currentPhase}).
**Recommended Next Step:** Deploy excavation crew with ductile sleeve and verify ground pressure.`,
          toolsCalled,
          groundedData: toolRes
        };
      }

      if (text.includes('root cause') || text.includes('cause') || text.includes('karan')) {
        const toolRes = await executeAssistantTool('get_root_cause', {}, { ...user, ...context });
        toolsCalled.push({ name: 'get_root_cause', args: {} });
        return {
          reply: `**AI Root-Cause Diagnosis:** ${toolRes.primaryCause} (${toolRes.evidenceConfidence} confidence).\n**Contributing factors:**\n• ${toolRes.contributingFactors.join('\n• ')}`,
          toolsCalled,
          groundedData: toolRes
        };
      }

      if (text.includes('recommendation') || text.includes('step') || text.includes('karna hai')) {
        const toolRes = await executeAssistantTool('get_recommendation', {}, { ...user, ...context });
        toolsCalled.push({ name: 'get_recommendation', args: {} });
        return {
          reply: `**Recommended Operational Action:** ${toolRes.recommendedAction}\n**Estimated Time:** ${toolRes.estimatedTime}\n**Resource Required:** ${toolRes.manpowerRequired} (SOP: ${toolRes.sopCode}).`,
          toolsCalled,
          groundedData: toolRes
        };
      }

      // Default officer answer
      const assigned = await executeAssistantTool('get_assigned_incidents', {}, { ...user, ...context });
      toolsCalled.push({ name: 'get_assigned_incidents', args: {} });
      return {
        reply: `Hello Officer ${user.name || ''}. You currently have **${assigned.total || 0} active incidents** in your jurisdiction. Let me know if you need an operational brief, root cause diagnosis, or contractor verification summary.`,
        toolsCalled,
        actionProposal
      };
    }

    // 3. Super Admin queries
    if (role === 'super_admin' || role === 'admin') {
      if (text.includes('emerging') || text.includes('problems') || text.includes('nayi')) {
        const toolRes = await executeAssistantTool('get_emerging_problems', {}, { ...user, ...context });
        toolsCalled.push({ name: 'get_emerging_problems', args: {} });
        const list = toolRes.emergingClusters.map(c => `• **${c.title}** (${c.area}) — ${c.velocity}, ${c.complaintsAccumulated} complaints. Departments: ${c.department}`).join('\n');
        return {
          reply: `### Citywide Emerging Problems\n${list}\n\nAll clusters are automatically tracked by the multi-agent civic swarm.`,
          toolsCalled,
          groundedData: toolRes
        };
      }

      if (text.includes('critical') || text.includes('sla breach')) {
        const toolRes = await executeAssistantTool('get_critical_incidents', {}, { ...user, ...context });
        toolsCalled.push({ name: 'get_critical_incidents', args: {} });
        const list = toolRes.incidents.map(inc => `• **${inc.id}**: ${inc.title} (${inc.ward}) — ${inc.hoursToBreach}h until SLA breach. Department: ${inc.department}`).join('\n');
        return {
          reply: `### Critical Incidents (${toolRes.criticalCount} Active)\n${list}`,
          toolsCalled,
          groundedData: toolRes
        };
      }

      if (text.includes('summary') || text.includes('metrics') || text.includes('health') || text.includes('city')) {
        const toolRes = await executeAssistantTool('get_system_summary', {}, { ...user, ...context });
        toolsCalled.push({ name: 'get_system_summary', args: {} });
        const m = toolRes.citywideMetrics;
        return {
          reply: `### Delhi Municipal System Overview
• **Total Complaints:** ${m.totalComplaintsProcessed.toLocaleString()}
• **Active Incidents:** ${m.activeIncidents} (${m.criticalIncidents} Critical)
• **Citywide Resolution Rate:** ${m.citywideResolutionRate}
• **SLA Compliance:** ${m.slaComplianceRate}
• **Monitored Wards:** ${m.monitoredWards}`,
          toolsCalled,
          groundedData: toolRes
        };
      }

      // Default admin answer
      return {
        reply: `JanSahayak Executive Intelligence online. You can ask for emerging problem clusters, SLA risk alerts, cross-department incidents, or ward hotspot heatmaps.`,
        toolsCalled
      };
    }

    return {
      reply: 'AI Assistant ready. Ask any question about your complaints or municipal services.',
      toolsCalled: []
    };
  }

  formatDirectToolSummary(toolName, result, role) {
    if (result.error) {
      return `Mujhe is information ka verified record nahi mil raha: ${result.error}`;
    }
    if (toolName === 'get_my_complaint_details') {
      return `Complaint **#${result.id}** (${result.title}) is currently in **${result.status}** with ${result.department}. SLA hours remaining: ${result.slaHoursLeft} hrs.`;
    }
    if (toolName === 'get_incident_details') {
      return `Incident **${result.id}**: ${result.title}. Severity: ${result.severity}. Status: ${result.status}. Root cause: ${result.rootCauseSummary}`;
    }
    return JSON.stringify(result);
  }
}

export const geminiAssistant = new GeminiAssistantService();
