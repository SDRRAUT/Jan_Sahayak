# Security Policy

The **JanSahayk (जनसहायक)** platform handles sensitive civic communications, public infrastructure telemetry, and citizen grievance data. Maintaining high standards of security, privacy, and integrity is fundamental to our civic mission.

---

## 🛡️ Supported Versions

We provide security patches and vulnerability evaluations for the following release branches:

| Version | Supported          | Security Maintenance Status |
| ------- | ------------------ | --------------------------- |
| 1.0.x   | :white_check_mark: | Active Support              |
| < 1.0   | :x:                | Deprecated                  |

---

## 🔒 Reporting a Vulnerability

If you discover a security issue, vulnerability, or potential exploit in JanSahayk, we appreciate your help in disclosing it responsibly.

### How to Report:
1. **Private Vulnerability Reporting**:
   - Use GitHub's built-in **[Security Advisory / Report a Vulnerability](https://github.com/SDRRAUT/Jan_Sahayak/security/advisories/new)** feature.
   - Alternatively, email: `security@jansahayk.gov.in` with the subject: `[VULNERABILITY] <Component> - <Brief Description>`.

2. **Include in Your Report:**
   - Detailed description of the vulnerability.
   - Exact steps to reproduce or a Minimal Reproducible Example (PoC).
   - Potential impact (e.g., unauthorized privilege escalation, citizen PII leakage, denial of service).
   - Suggested mitigations or patches (if known).

### Responsible Disclosure Timeline:
- **Acknowledgement**: Within 48 hours.
- **Triage & Assessment**: Within 5 business days.
- **Fix & Patch Release**: Within 14 business days for critical vulnerabilities.
- **Public Disclosure**: Only coordinated after patches have been tested and deployed.

---

## 🏛️ Civic Data Protection Standards

1. **PII Masking**: Citizen phone numbers and exact residential addresses are masked in public endpoints and read-only officer triage dashboards.
2. **Role-Based Access Control (RBAC)**: Strict server-side verification using `requireRole` middleware prevents horizontal and vertical privilege escalation.
3. **Audit Log Immutability**: Administrative interventions, status transitions, and duplicate mergers generate immutable audit trail entries with cryptographic identifiers.
4. **Environment Safeguards**: Sensitive keys (`AI_API_KEY`, `AUTH_SECRET`) are never committed to version control and are strictly managed via environment variables.

---

Thank you for helping keep public grievance systems secure and trustworthy.
