/**
 * Citizen Privacy & Data Protection Utility
 * Masks personal identifiable information (PII) for government officer and administrative views.
 */

/**
 * Masks a citizen's full name to show only their First Name and Last Initial.
 * Example: "Rahul Shirole" -> "Rahul S."
 * Example: "Aditya Verma" -> "Aditya V."
 * Example: "Priyanka" -> "Priyanka"
 * 
 * @param {string} fullName - Full citizen name
 * @returns {string} Masked privacy-protected name
 */
export function maskCitizenName(fullName) {
  if (!fullName || typeof fullName !== 'string') return 'Citizen';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || '';
  return `${firstName} ${lastInitial}.`;
}

/**
 * Redacts citizen phone number for officer and public views.
 * 
 * @param {string} phone - Raw phone number
 * @returns {string} Masked privacy label
 */
export function maskCitizenPhone(phone) {
  return '🔒 Contact Hidden (Privacy Protected)';
}
