/**
 * JAN_SAHAYAK — AUTHORITATIVE INCIDENT SERVICE
 * Single entry point for Civic Incident operations and graph queries.
 */

function getAuthHeaders(token) {
  const t = token || localStorage.getItem('jansahayk_token');
  return {
    'Content-Type': 'application/json',
    ...(t ? { Authorization: `Bearer ${t}` } : {})
  };
}

export const IncidentService = {
  async getIncidents(token) {
    const res = await fetch('/api/intelligence/incidents', {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error(`Failed to fetch incidents (${res.status})`);
    const data = await res.json();
    return data.incidents || [];
  },

  async getIncidentById(id, token) {
    const res = await fetch(`/api/intelligence/incidents/${id}`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error(`Incident ${id} not found`);
    const data = await res.json();
    return data.incident;
  },

  async getIncidentTimeline(id, token) {
    const res = await fetch(`/api/intelligence/incidents/${id}/timeline`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error(`Timeline for incident ${id} not available`);
    const data = await res.json();
    return data.timeline || [];
  },

  async getGraphData(token) {
    const res = await fetch('/api/intelligence/graph', {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error(`Graph data query failed (${res.status})`);
    return res.json();
  },

  async recordDecision(id, { decision, actionSelected, notes }, token) {
    const res = await fetch(`/api/intelligence/incidents/${id}/decision`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ decision, actionSelected, notes })
    });
    if (!res.ok) throw new Error(`Decision recording failed (${res.status})`);
    return res.json();
  },

  async verifyIncident(id, { isConfirmed, citizenName, citizenId, notes }, token) {
    const res = await fetch(`/api/intelligence/incidents/${id}/verify`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ isConfirmed, citizenName, citizenId, notes })
    });
    if (!res.ok) throw new Error(`Incident verification failed (${res.status})`);
    return res.json();
  }
};
