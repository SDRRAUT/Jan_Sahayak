# ==============================================================================
# JanSahayk (जनसहायक) — Production Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build the React + Vite Frontend Bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy full application source
COPY . .

# Build production assets into /app/dist
RUN npm run build

# Stage 2: Production Server Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server code, scripts, public directory, and built frontend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.example ./.env.example

# Expose standard production port
EXPOSE 3001

# Healthcheck verification
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start the unified production server
CMD ["node", "server/index.js"]
