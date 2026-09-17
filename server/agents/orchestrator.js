import { db } from '../db/database.js';
import { ComplaintAnalyzerAgent } from './ComplaintAnalyzerAgent.js';
import { ComplaintDNAAgent } from './ComplaintDNAAgent.js';
import { SimilarityClusterAgent } from './SimilarityClusterAgent.js';
import { CivicIncidentAgent } from './CivicIncidentAgent.js';
import { RootCauseAgent } from './RootCauseAgent.js';
import { ResolutionAgent } from './ResolutionAgent.js';
import { AuthorityRoutingAgent } from './AuthorityRoutingAgent.js';
import { CivicMemoryAgent } from './CivicMemoryAgent.js';
import { VerificationAgent } from './VerificationAgent.js';

/**
 * CIVIC INTELLIGENCE ORCHESTRATOR
 * Coordinates the connected multi-agent AI pipeline.
 * Output of one agent becomes input/context to the next agent.
 * Emits real-time events to connected clients via SSE.
 */
export class CivicIntelligenceOrchestrator {
  constructor() {
    this.sseClients = new Set();
  }

  /**
   * Register an SSE client connection
   */
  addSSEClient(res) {
    this.sseClients.add(res);
  }

  /**
   * Remove an SSE client connection
   */
  removeSSEClient(res) {
    this.sseClients.delete(res);
  }

  /**
   * Broadcast real-time event to all connected clients
   */
  broadcastEvent(eventType, payload) {
    const data = JSON.stringify({ eventType, payload, timestamp: new Date().toISOString() });
    for (const client of this.sseClients) {
      try {
        client.write(`event: ${eventType}\ndata: ${data}\n\n`);
      } catch (e) {
        this.sseClients.delete(client);
      }
    }
  }

  /**
   * Main Pipeline Execution: Processes a citizen complaint through the 9 connected agents
   */
  async processComplaint(complaintData) {
    console.log(`[Orchestrator] Ingesting complaint: ${complaintData.id || 'NEW'}`);

    // Save initial complaint to DB
    let complaint = db.saveComplaint({
      ...complaintData,
      status: 'INGESTED',
      timestamp: complaintData.timestamp || new Date().toISOString(),
      createdAt: complaintData.createdAt || new Date().toLocaleString()
    });

    db.logEvent({
      incidentId: null,
      eventType: 'COMPLAINT_INGESTED',
      actorType: 'CITIZEN',
      actorId: complaint.citizenId || 'CITIZEN',
      payload: { complaintId: complaint.id, title: complaint.title }
    });

    this.broadcastEvent('complaint_created', { complaintId: complaint.id, title: complaint.title });

    try {
      // 1. AGENT 1: Complaint Analyzer
      console.log(`[Orchestrator] Running Agent 1 (ComplaintAnalyzerAgent)...`);
      const analysis = await ComplaintAnalyzerAgent.analyze(complaint);
      complaint.analysis = analysis;
      complaint.category = analysis.category || complaint.category;
      complaint.urgency = analysis.urgency >= 8 ? 'CRITICAL' : analysis.urgency >= 6 ? 'HIGH' : 'MEDIUM';
      complaint.urgencyScore = analysis.urgency * 10;
      complaint.status = 'ANALYZED';
      db.saveComplaint(complaint);

      this.broadcastEvent('complaint_analyzed', { complaintId: complaint.id, analysis });

      // 2. AGENT 2: Complaint DNA
      console.log(`[Orchestrator] Running Agent 2 (ComplaintDNAAgent)...`);
      const dna = ComplaintDNAAgent.generateDNA(analysis, complaint);
      complaint.dna = dna;
      complaint.status = 'DNA_GENERATED';
      db.saveComplaint(complaint);

      this.broadcastEvent('dna_generated', { complaintId: complaint.id, dnaId: dna.dnaId });

      // 3. AGENT 3: Similarity & Clustering
      console.log(`[Orchestrator] Running Agent 3 (SimilarityClusterAgent)...`);
      const existingComplaints = db.getComplaints().filter(c => c.id !== complaint.id);
      const existingClusters = db.getClusters();

      const clusterResult = SimilarityClusterAgent.clusterComplaint(complaint, existingComplaints, existingClusters);
      let cluster = null;

      if (clusterResult.action === 'JOIN_CLUSTER') {
        cluster = db.getClusterById(clusterResult.clusterId);
        if (cluster && !cluster.complaintIds.includes(complaint.id)) {
          cluster.complaintIds.push(complaint.id);
          cluster.updatedAt = new Date().toISOString();
          db.saveCluster(cluster);
        }
      } else {
        // Create new cluster
        cluster = {
          id: clusterResult.clusterId,
          title: `${complaint.location?.ward || 'Ward'} ${analysis.category} Cluster`,
          leadDepartment: analysis.category.includes('Water') ? 'Delhi Jal Board (DJB)' : 'Public Works Department (PWD)',
          centroid: clusterResult.initialCentroid || { lat: 28.7180, lng: 77.1260 },
          radiusMeters: 150,
          complaintIds: [complaint.id],
          incidentId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        db.saveCluster(cluster);
      }

      complaint.clusterId = cluster.id;
      complaint.clusterConfidence = clusterResult.confidence;
      complaint.status = 'CLUSTERED';
      db.saveComplaint(complaint);

      this.broadcastEvent('cluster_updated', { clusterId: cluster.id, complaintCount: cluster.complaintIds.length });

      // 4. AGENT 4: Civic Incident Agent
      console.log(`[Orchestrator] Running Agent 4 (CivicIncidentAgent)...`);
      const allClusterComplaints = db.getComplaints().filter(c => cluster.complaintIds.includes(c.id));
      
      let existingIncident = cluster.incidentId ? db.getIncidentById(cluster.incidentId) : null;
      if (!existingIncident) {
        existingIncident = db.getIncidents().find(inc => inc.clusterIds && inc.clusterIds.includes(cluster.id));
      }

      const synthesizedIncident = CivicIncidentAgent.synthesizeIncident(cluster, allClusterComplaints, existingIncident);
      cluster.incidentId = synthesizedIncident.id;
      complaint.incidentId = synthesizedIncident.id;
      db.saveCluster(cluster);
      db.saveComplaint(complaint);

      // 5. AGENT 8: Civic Memory Agent
      console.log(`[Orchestrator] Running Agent 8 (CivicMemoryAgent)...`);
      const civicMemory = CivicMemoryAgent.analyzeMemory(synthesizedIncident, allClusterComplaints);
      synthesizedIncident.civicMemory = civicMemory;

      // 6. AGENT 5: Root Cause Agent
      console.log(`[Orchestrator] Running Agent 5 (RootCauseAgent)...`);
      const rootCause = await RootCauseAgent.inferRootCause(synthesizedIncident, allClusterComplaints, civicMemory);
      synthesizedIncident.rootCause = rootCause;

      // 7. AGENT 6: Resolution Agent
      console.log(`[Orchestrator] Running Agent 6 (ResolutionAgent)...`);
      const simulations = await ResolutionAgent.generateSimulations(synthesizedIncident, rootCause);
      synthesizedIncident.simulations = simulations;

      // 8. AGENT 7: Authority Routing Agent
      console.log(`[Orchestrator] Running Agent 7 (AuthorityRoutingAgent)...`);
      const routing = AuthorityRoutingAgent.routeIncident(synthesizedIncident, allClusterComplaints);
      synthesizedIncident.leadDepartment = routing.leadDepartment;
      synthesizedIncident.participatingDepartments = routing.participatingDepartments;
      synthesizedIncident.crossDeptCoordination = routing.crossDeptCoordination;
      synthesizedIncident.crossDepartmentImpact = routing.crossDeptCoordination;

      // Populate UI-compatible properties
      synthesizedIncident.signalCount = allClusterComplaints.length;
      synthesizedIncident.formalComplaintsCount = allClusterComplaints.length;
      synthesizedIncident.citizenObservationsCount = 0;
      
      const firstCompTime = allClusterComplaints[0]?.createdAt || allClusterComplaints[0]?.timestamp || new Date().toISOString();
      synthesizedIncident.firstDetectedAt = new Date(firstCompTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      synthesizedIncident.rootCauseHypotheses = [
        {
          id: 'HYP-01',
          title: rootCause.probable_root_cause || 'Subsurface drainage capacity constraint and gradient depression',
          confidence: (rootCause.confidence || 0.88) >= 0.8 ? 'HIGH' : 'MEDIUM',
          confidenceScore: Math.round((rootCause.confidence || 0.88) * 100),
          evidence: (rootCause.supporting_evidence && rootCause.supporting_evidence.length > 0) 
            ? rootCause.supporting_evidence 
            : allClusterComplaints.slice(0, 3).map(c => `Report (${c.citizenName || 'Resident'}): "${(c.descriptionRaw || c.title || '').slice(0, 65)}..."`),
          recommendedVerification: rootCause.recommended_diagnostic || 'Conduct joint field gradient inspection and acoustic correlation'
        }
      ];

      synthesizedIncident.complaintDna = {
        issueType: complaint.dna?.problem || complaint.category || 'Drainage & Waterlogging',
        subIssue: rootCause.probable_root_cause || complaint.title || 'Water logging after rainfall',
        asset: complaint.dna?.infrastructure || 'Stormwater Culvert / Roadway',
        service: synthesizedIncident.leadDepartment || 'MCD / DJB / PWD',
        symptoms: [
          complaint.dna?.problem || 'Corridor waterlogging',
          complaint.dna?.time_pattern || 'Post-rainfall retention',
          ...allClusterComplaints.slice(0, 2).map(c => (c.descriptionRaw || c.title || '').slice(0, 45))
        ],
        entities: (complaint.dna?.landmarks && complaint.dna.landmarks.length > 0)
          ? complaint.dna.landmarks
          : [synthesizedIncident.affectedArea, 'Ward Corridor']
      };

      synthesizedIncident.timeline = allClusterComplaints.map((c, idx) => ({
        stage: idx === 0 
          ? 'First Signal Detected' 
          : idx === allClusterComplaints.length - 1 
            ? 'Corridor Escalation' 
            : 'Signal Corroborated',
        date: new Date(c.createdAt || c.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: new Date(c.createdAt || c.timestamp || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        desc: c.descriptionRaw || c.title || 'Citizen grievance logged',
        source: c.sourceType || 'Citizen Mobile App',
        count: idx + 1
      }));

      // Generate spreadGeo observations from complaints
      if (allClusterComplaints.length > 0) {
        synthesizedIncident.spreadGeo = allClusterComplaints.map((c, idx) => ({
          step: `Signal ${idx + 1}`,
          ward: c.location?.ward || synthesizedIncident.affectedArea,
          lat: Number(c.location?.lat) || 28.7180,
          lng: Number(c.location?.lng) || 77.1260,
          radiusMeters: Math.round(100 + (idx * 50)),
          signalCount: idx + 1,
          label: c.descriptionRaw ? `${c.descriptionRaw.slice(0, 50)}...` : c.title,
          color: idx === 0 ? '#10B981' : idx === allClusterComplaints.length - 1 ? '#EF4444' : '#F59E0B'
        }));
      }

      // Persist synthesized incident
      db.saveIncident(synthesizedIncident);

      db.logEvent({
        incidentId: synthesizedIncident.id,
        eventType: 'INCIDENT_INTELLIGENCE_UPDATED',
        actorType: 'AGENT_ORCHESTRATOR',
        actorId: 'CivicIntelligenceOrchestrator',
        payload: {
          stage: synthesizedIncident.stage,
          complaintCount: synthesizedIncident.complaintCount,
          leadDepartment: synthesizedIncident.leadDepartment
        }
      });

      this.broadcastEvent('incident_updated', {
        incidentId: synthesizedIncident.id,
        stage: synthesizedIncident.stage,
        complaintCount: synthesizedIncident.complaintCount
      });

      console.log(`[Orchestrator] Pipeline completed successfully for ${complaint.id} -> Incident ${synthesizedIncident.id}`);

      return {
        success: true,
        complaint,
        cluster,
        incident: synthesizedIncident
      };
    } catch (err) {
      console.error('[Orchestrator] Pipeline error:', err);
      return {
        success: false,
        complaint,
        error: err.message
      };
    }
  }

  /**
   * Handle Closed-Loop Verification
   */
  processVerification(incidentId, verificationPayload) {
    const result = VerificationAgent.processCitizenVerification(incidentId, verificationPayload);
    this.broadcastEvent('verification_submitted', {
      incidentId,
      status: result.incident.status,
      verificationStatus: result.incident.verificationStatus
    });
    return result;
  }
}

export const orchestrator = new CivicIntelligenceOrchestrator();
