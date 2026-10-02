/**
 * JAN_SAHAYAK — MULTI-KEY GEMINI ROTATION & FAILOVER POOL
 * 
 * Features:
 * - Seamless automatic shifting across multiple Gemini API keys when rate limit (429) or quota exhaustion occurs.
 * - Secure server-side isolation: API keys are never leaked to client or log files.
 * - Automatic exponential/adaptive cooldown on rate-limited keys.
 * - Round-robin and immediate failover execution wrapper.
 */

// Known active API keys are loaded strictly from environment variables
const DEFAULT_KEY_POOL = [];

export class GeminiKeyPool {
  constructor() {
    this.keys = [];
    this.currentIndex = 0;
    this.refreshKeyPool();
  }

  /**
   * Masks sensitive API keys for secure logging
   * Example: key_1234567890 -> key_12...7890
   */
  maskKey(key) {
    if (!key || typeof key !== 'string') return '[NO_KEY]';
    if (key.length <= 10) return '***';
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
  }

  /**
   * Loads all configured keys from env vars and fallback pool
   */
  refreshKeyPool() {
    const rawKeys = [];

    // 1. Check GEMINI_API_KEYS (comma or semicolon separated)
    if (process.env.GEMINI_API_KEYS) {
      const split = process.env.GEMINI_API_KEYS.split(/[,;]/).map(k => k.trim()).filter(Boolean);
      rawKeys.push(...split);
    }

    // 2. Check numbered keys (GEMINI_API_KEY_1 .. GEMINI_API_KEY_10)
    for (let i = 1; i <= 10; i++) {
      const k = process.env[`GEMINI_API_KEY_${i}`];
      if (k && k.trim()) rawKeys.push(k.trim());
    }

    // 3. Check individual standard env vars
    if (process.env.GEMINI_API_KEY) rawKeys.push(process.env.GEMINI_API_KEY.trim());
    if (process.env.AI_API_KEY) rawKeys.push(process.env.AI_API_KEY.trim());

    // Deduplicate preserving order
    const uniqueKeys = Array.from(new Set(rawKeys.filter(k => k && k.length > 20)));

    // Preserve existing health state if key is already tracked
    const existingMap = new Map((this.keys || []).map(entry => [entry.key, entry]));

    this.keys = uniqueKeys.map((key, index) => {
      const existing = existingMap.get(key);
      if (existing) {
        return existing;
      }
      return {
        key,
        id: `Key-${index + 1}`,
        masked: this.maskKey(key),
        rateLimitedUntil: 0,
        successCount: 0,
        failureCount: 0,
        lastUsed: 0
      };
    });

    if (this.currentIndex >= this.keys.length) {
      this.currentIndex = 0;
    }
  }

  /**
   * Returns all keys in pool with their status
   */
  getKeys() {
    if (!this.keys || this.keys.length === 0) {
      this.refreshKeyPool();
    }
    return this.keys;
  }

  /**
   * Returns current primary key without modifying rotation
   */
  getPrimaryApiKey() {
    const entry = this.getActiveKeyEntry();
    return entry ? entry.key : null;
  }

  /**
   * Gets the current best active key entry (skipping rate-limited ones)
   */
  getActiveKeyEntry() {
    const keys = this.getKeys();
    if (!keys || keys.length === 0) return null;

    const now = Date.now();

    // Check if currentIndex key is usable
    const current = keys[this.currentIndex];
    if (current && current.rateLimitedUntil <= now) {
      return current;
    }

    // Scan for the first non-rate-limited key
    for (let i = 0; i < keys.length; i++) {
      const idx = (this.currentIndex + i) % keys.length;
      if (keys[idx].rateLimitedUntil <= now) {
        this.currentIndex = idx;
        return keys[idx];
      }
    }

    // If all keys are currently rate-limited, find the key that will become available earliest
    let earliest = keys[0];
    let earliestIdx = 0;
    for (let i = 1; i < keys.length; i++) {
      if (keys[i].rateLimitedUntil < earliest.rateLimitedUntil) {
        earliest = keys[i];
        earliestIdx = i;
      }
    }

    const waitSec = Math.max(0, Math.ceil((earliest.rateLimitedUntil - now) / 1000));
    console.warn(`[GeminiKeyPool] ⚠️ All ${keys.length} API keys currently in cooldown. Earliest available (${earliest.masked}) in ~${waitSec}s.`);
    this.currentIndex = earliestIdx;
    return earliest;
  }

  /**
   * Marks a key as rate-limited and shifts current index to next key
   */
  markRateLimited(key, cooldownMs = 60000, reason = 'HTTP 429 Rate Limit / Quota Exceeded') {
    const entry = this.keys.find(k => k.key === key);
    if (entry) {
      entry.rateLimitedUntil = Date.now() + cooldownMs;
      entry.failureCount += 1;
      const cooldownSec = Math.round(cooldownMs / 1000);
      console.warn(`[GeminiKeyPool] 🚨 ${entry.id} (${entry.masked}) hit limit [${reason}]. Cooling down for ${cooldownSec}s. Shifting to next key...`);
    }

    // Advance to next key immediately
    if (this.keys.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    }
  }

  /**
   * Records a successful execution on a key
   */
  markSuccess(key) {
    const entry = this.keys.find(k => k.key === key);
    if (entry) {
      entry.successCount += 1;
      entry.failureCount = 0;
      entry.rateLimitedUntil = 0;
      entry.lastUsed = Date.now();
    }
  }

  /**
   * Executes an operation with automatic key rotation and failover on rate limits
   * 
   * @param {Function} operation - async (apiKey, keyEntry) => { success: boolean, data: any, response: Response, isRateLimited: boolean }
   * @returns {Promise<any>}
   */
  async executeWithKeyRotation(operation) {
    const keys = this.getKeys();
    if (!keys || keys.length === 0) {
      throw new Error('No Gemini API keys configured in pool.');
    }

    const maxAttempts = keys.length;
    let lastError = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const activeEntry = this.getActiveKeyEntry();
      if (!activeEntry) break;

      const apiKey = activeEntry.key;

      try {
        const result = await operation(apiKey, activeEntry);

        // Check if caller signaled rate limit via return value
        if (result && result.isRateLimited) {
          this.markRateLimited(apiKey, 60000, result.errorMessage || 'Rate Limit Detected');
          continue; // Try next key
        }

        // Success!
        this.markSuccess(apiKey);
        return result;
      } catch (err) {
        lastError = err;
        const msg = String(err?.message || '');
        const isQuotaErr = msg.includes('429') || 
                           msg.includes('RESOURCE_EXHAUSTED') || 
                           msg.includes('Quota exceeded') || 
                           msg.includes('rate limit');

        if (isQuotaErr) {
          this.markRateLimited(apiKey, 60000, msg.slice(0, 100));
          continue; // Shift to next key immediately
        }

        // For other network/timeout errors, also attempt shift if available
        if (attempt < maxAttempts - 1) {
          console.warn(`[GeminiKeyPool] Execution error on ${activeEntry.id} (${activeEntry.masked}): ${msg.slice(0, 80)}. Trying next key in pool...`);
          this.currentIndex = (this.currentIndex + 1) % this.keys.length;
          continue;
        }

        throw err;
      }
    }

    throw lastError || new Error('All Gemini API keys in pool failed or exhausted quota.');
  }

  /**
   * Safe status report for health checks and telemetry (never exposes raw keys)
   */
  getPoolStatus() {
    const now = Date.now();
    const keys = this.getKeys();
    const readyCount = keys.filter(k => k.rateLimitedUntil <= now).length;

    return {
      totalKeys: keys.length,
      availableKeys: readyCount,
      rateLimitedKeys: keys.length - readyCount,
      activeKeyIndex: this.currentIndex,
      activeKeyMasked: keys[this.currentIndex]?.masked || 'none',
      pool: keys.map((k, idx) => ({
        index: idx + 1,
        id: k.id,
        masked: k.masked,
        status: k.rateLimitedUntil > now ? 'cooling_down' : 'ready',
        cooldownRemainingSec: Math.max(0, Math.ceil((k.rateLimitedUntil - now) / 1000)),
        successCount: k.successCount,
        failureCount: k.failureCount,
        isCurrent: idx === this.currentIndex
      }))
    };
  }
}

// Export singleton instance
export const geminiKeyPool = new GeminiKeyPool();
