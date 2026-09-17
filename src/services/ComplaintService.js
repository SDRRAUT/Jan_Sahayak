/**
 * JAN_SAHAYAK — AUTHORITATIVE COMPLAINT SERVICE
 * Single entry point for all complaint mutations and queries.
 */

function getAuthHeaders(token) {
  const t = token || localStorage.getItem('jansahayk_token');
  return {
    'Content-Type': 'application/json',
    ...(t ? { Authorization: `Bearer ${t}` } : {})
  };
}

export const ComplaintService = {
  async getComplaints(token) {
    const res = await fetch('/api/grievances', {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error(`Failed to fetch complaints (${res.status})`);
    const data = await res.json();
    return data.grievances || [];
  },

  async getComplaintById(id, token) {
    const res = await fetch(`/api/grievances/${id}`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error(`Grievance ${id} not found`);
    const data = await res.json();
    return data.grievance;
  },

  async getTimeline(id, token) {
    const res = await fetch(`/api/grievances/${id}/timeline`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error(`Timeline for ${id} not available`);
    const data = await res.json();
    return data.timeline || [];
  },

  async createComplaint(payload, token) {
    const res = await fetch('/api/grievances', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create complaint (${res.status})`);
    }
    return res.json();
  },

  async transitionStatus(id, { newStatus, reason, actionType, notes, evidenceUrl }, token) {
    const res = await fetch(`/api/grievances/${id}/transition-status`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ newStatus, reason, actionType, notes, evidenceUrl })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Status transition failed (${res.status})`);
    }
    return res.json();
  },

  async resolveComplaint(id, { resolutionNotes, resolutionPhotoUrl }, token) {
    const res = await fetch(`/api/grievances/${id}/resolve`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ resolutionNotes, resolutionPhotoUrl })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Resolution failed (${res.status})`);
    }
    return res.json();
  },

  async verifyComplaint(id, { satisfaction, feedbackText, evidencePhotos, rating }, token) {
    const res = await fetch(`/api/grievances/${id}/verify`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ satisfaction, feedbackText, evidencePhotos, rating })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Verification failed (${res.status})`);
    }
    return res.json();
  },

  async reopenComplaint(id, { disputeReason }, token) {
    const res = await fetch(`/api/grievances/${id}/reopen`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ disputeReason })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Reopening failed (${res.status})`);
    }
    return res.json();
  },

  async requestInfo(id, { question }, token) {
    const res = await fetch(`/api/grievances/${id}/request-info`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ question })
    });
    if (!res.ok) throw new Error(`Request info failed (${res.status})`);
    return res.json();
  },

  async respondInfo(id, { requestId, answer }, token) {
    const res = await fetch(`/api/grievances/${id}/respond-info`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ requestId, answer })
    });
    if (!res.ok) throw new Error(`Respond info failed (${res.status})`);
    return res.json();
  }
};
