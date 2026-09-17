# Contributing to JanSahayk (जनसहायक)

Thank you for your interest in contributing to **JanSahayk**! We welcome civic technologists, AI researchers, frontend/backend developers, and public administration specialists to build transparent, closed-loop civic intelligence for public grievance redressal.

Please take a moment to review this guide before submitting contributions.

---

## 🏛️ Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please ensure interactions remain respectful, inclusive, and professional.

---

## 🚀 Quick Setup

### Prerequisites
- **Node.js**: v18.x or v20.x LTS
- **npm**: v9.x or higher
- **Git**

### Local Development Setup

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/SDRRAUT/Jan_Sahayak.git
   cd Jan_Sahayak
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   *(Runs 100% offline out of the box with zero external configuration or API key requirements.)*

3. **Start the Integrated Development Environment:**
   ```bash
   # Starts both Express API server (port 3001) and Vite dev server (port 3737)
   npm start
   ```
   Alternatively, you can run them in separate terminals:
   - Terminal 1: `npm run server`
   - Terminal 2: `npm run dev`

---

## 🌿 Branching Strategy & Workflow

We follow a structured Git feature branch workflow:

1. **Branch Naming Conventions:**
   - Feature: `feat/short-description` (e.g., `feat/whatsapp-ingestion`)
   - Bug Fix: `fix/short-description` (e.g., `fix/sla-countdown-timer`)
   - Documentation: `docs/short-description` (e.g., `docs/api-specs`)
   - Performance/Refactor: `refactor/short-description`
   - AI Engine: `ai/short-description` (e.g., `ai/hinglish-embeddings`)

2. **Create your feature branch from `main`:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes with incremental, meaningful commits.**

---

## 📝 Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

### Supported Types:
- `feat`: A new user-facing feature or API capability
- `fix`: A bug fix
- `docs`: Documentation updates or additions
- `style`: Formatting, missing semi-colons, styling changes (no code logic changes)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance or bundle size
- `test`: Adding or correcting tests
- `chore`: Maintenance tasks, dependency updates, tooling configuration

### Example:
```bash
git commit -m "feat(ai): add 4-way duplicate clustering confidence thresholding"
```

---

## 🧪 Testing & Verification Before Submitting

Before submitting a Pull Request, verify your changes locally:

1. **Verify Backend and Script Syntax:**
   ```bash
   npm run verify:syntax
   ```

2. **Verify Frontend Production Build:**
   ```bash
   npm run build
   ```

3. **Run Pipeline Verification Tests:**
   ```bash
   npm run test:agents
   ```

Ensure there are no build warnings, syntax errors, or unhandled promise rejections.

---

## 📥 Submitting a Pull Request (PR)

1. Push your branch to your fork or origin:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request targeting the `main` branch.
3. Fill out the **Pull Request Template**:
   - Provide a clear summary of what changed.
   - Tag any relevant issues (e.g., `Closes #12`).
   - Confirm all items in the verification checklist.
   - Include screenshots or recordings for UI changes.
4. Continuous Integration (GitHub Actions) will automatically run on your PR to verify:
   - Node.js syntax checks
   - Production Vite bundle compilation
5. A project maintainer will review your PR and provide constructive feedback.

---

## 🛡️ Security Vulnerabilities

If you discover a security vulnerability, please do **NOT** open a public issue. Instead, follow our responsible disclosure protocol described in [SECURITY.md](SECURITY.md).

---

Thank you for helping make civic infrastructure smarter and more responsive for all citizens!
