import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getToolsForRole, executeAssistantTool, CITIZEN_TOOL_DECLARATIONS, OFFICER_TOOL_DECLARATIONS, SUPER_ADMIN_TOOL_DECLARATIONS } from '../server/services/assistantTools.js';
import { geminiAssistant } from '../server/services/geminiAssistant.js';

describe('Jan_Sahayak Gemini AI Assistant Unit Tests', () => {
  
  it('should return role-segregated tool declarations', () => {
    const citizenTools = getToolsForRole('citizen');
    assert.strictEqual(citizenTools.length, CITIZEN_TOOL_DECLARATIONS.length);
    assert.ok(citizenTools.some(t => t.name === 'get_my_complaints'));
    assert.ok(!citizenTools.some(t => t.name === 'get_citywide_incidents'));

    const officerTools = getToolsForRole('civic_officer');
    assert.strictEqual(officerTools.length, OFFICER_TOOL_DECLARATIONS.length);
    assert.ok(officerTools.some(t => t.name === 'get_assigned_incidents'));
    assert.ok(officerTools.some(t => t.name === 'get_root_cause'));

    const adminTools = getToolsForRole('super_admin');
    assert.strictEqual(adminTools.length, SUPER_ADMIN_TOOL_DECLARATIONS.length);
    assert.ok(adminTools.some(t => t.name === 'get_system_summary'));
    assert.ok(adminTools.some(t => t.name === 'get_emerging_problems'));
  });

  it('should execute citizen tools against real/fallback data', async () => {
    const userContext = { id: 'USR-CITIZEN-01', role: 'citizen', current_entity_id: 'JS-10482' };

    const complaints = await executeAssistantTool('get_my_complaints', {}, userContext);
    assert.ok(complaints.count >= 0);
    assert.ok(Array.isArray(complaints.complaints));

    const details = await executeAssistantTool('get_my_complaint_details', { complaint_id: 'JS-10482' }, userContext);
    assert.ok(details.id || details.error);

    const timeline = await executeAssistantTool('get_complaint_timeline', { complaint_id: 'JS-10482' }, userContext);
    assert.ok(timeline.timeline || timeline.error);

    const related = await executeAssistantTool('get_related_incident', { complaint_id: 'JS-10482' }, userContext);
    assert.ok(related.incidentId || related.error);
  });

  it('should execute civic officer tools and return operational structure', async () => {
    const userContext = { id: 'USR-CIVICOFFICER-01', role: 'civic_officer', department: 'Delhi Jal Board (DJB)' };

    const assigned = await executeAssistantTool('get_assigned_incidents', {}, userContext);
    assert.ok(assigned.total >= 0);
    assert.ok(Array.isArray(assigned.incidents));

    const rootCause = await executeAssistantTool('get_root_cause', { incident_id: 'INC-2026-089' }, userContext);
    assert.ok(rootCause.primaryCause);
    assert.ok(Array.isArray(rootCause.contributingFactors));

    const recommendation = await executeAssistantTool('get_recommendation', { incident_id: 'INC-2026-089' }, userContext);
    assert.ok(recommendation.recommendedAction);
    assert.ok(recommendation.sopCode);
  });

  it('should execute super admin tools and return real citywide metrics', async () => {
    const userContext = { id: 'USR-SUPERADMIN-01', role: 'super_admin' };

    const summary = await executeAssistantTool('get_system_summary', {}, userContext);
    assert.ok(summary.citywideMetrics);
    assert.ok(summary.citywideMetrics.totalComplaintsProcessed > 0);
    assert.ok(summary.citywideMetrics.activeIncidents >= 0);

    const emerging = await executeAssistantTool('get_emerging_problems', {}, userContext);
    assert.ok(Array.isArray(emerging.emergingClusters));
    assert.ok(emerging.emergingClusters.length > 0);
  });

  it('should detect high-impact actions and require confirmation', () => {
    const reopenProposal = geminiAssistant.detectActionProposal('Is problem ko reopen kar do', { current_entity_id: 'JS-10482' }, 'citizen');
    assert.ok(reopenProposal);
    assert.strictEqual(reopenProposal.actionType, 'REOPEN_COMPLAINT');
    assert.strictEqual(reopenProposal.requiresConfirmation, true);

    const escalateProposal = geminiAssistant.detectActionProposal('Please escalate this to senior officer', { current_entity_id: 'INC-2026-089' }, 'civic_officer');
    assert.ok(escalateProposal);
    assert.strictEqual(escalateProposal.actionType, 'ESCALATE_INCIDENT');

    const verifyProposal = geminiAssistant.detectActionProposal('Maine ground par check kar liya theek ho gaya', { current_entity_id: 'JS-10482' }, 'citizen');
    assert.ok(verifyProposal);
    assert.strictEqual(verifyProposal.actionType, 'VERIFY_RESOLUTION');
  });

  it('should process chat message in Hinglish and return grounded response', async () => {
    const citizenRes = await geminiAssistant.processChatMessage({
      message: 'Meri complaint ka status kya hai?',
      history: [],
      user: { id: 'USR-CITIZEN-01', name: 'Aditya Verma', role: 'citizen' },
      context: { current_route: '/citizen/complaints/JS-10482', current_entity_id: 'JS-10482' }
    });

    assert.ok(citizenRes.reply);
    assert.ok(citizenRes.toolsCalled.length > 0);
    assert.ok(typeof citizenRes.reply === 'string');
  });

});
