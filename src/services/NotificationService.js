/**
 * JAN_SAHAYAK — AUTHORITATIVE NOTIFICATION SERVICE
 * Real-time notification retrieval and state synchronization.
 */

function getAuthHeaders(token) {
  const t = token || localStorage.getItem('jansahayk_token');
  return {
    'Content-Type': 'application/json',
    ...(t ? { Authorization: `Bearer ${t}` } : {})
  };
}

export const NotificationService = {
  async getNotifications(token) {
    const t = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('jansahayk_token') : null);
    if (!t) return [];
    try {
      const res = await fetch('/api/notifications', {
        headers: getAuthHeaders(t)
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.notifications || [];
    } catch {
      return [];
    }
  },

  async markAsRead(id, token) {
    const res = await fetch(`/api/notifications/${id}/read`, {
      method: 'POST',
      headers: getAuthHeaders(token)
    });
    return res.ok;
  },

  async markAllRead(token) {
    const res = await fetch('/api/notifications/mark-all-read', {
      method: 'POST',
      headers: getAuthHeaders(token)
    });
    return res.ok;
  }
};
