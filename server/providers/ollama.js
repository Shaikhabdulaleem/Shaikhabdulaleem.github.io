const DEFAULT_TIMEOUT = 3000;

export function createOllamaProvider(env = process.env) {
  const baseUrl = (env.OLLAMA_URL || 'http://ollama:11434').replace(/\/$/, '');
  const model = env.OLLAMA_MODEL || 'qwen2.5:3b';
  const timeoutMs = Math.max(500, Number(env.AI_TIMEOUT_MS) || DEFAULT_TIMEOUT);
  const enabled = env.OLLAMA_ENABLED === 'true';
  const retryDelayMs = Math.max(10_000, Number(env.OLLAMA_RETRY_DELAY_MS) || 60_000);
  let retryAt = 0;

  return {
    name: 'ollama',
    async generate({ message, deterministicReply, context }) {
      if (!enabled) throw new Error('Ollama disabled');
      if (Date.now() < retryAt) throw new Error('Ollama circuit open');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const facts = context.map((entry) => `[${entry.title}] ${entry.content}`).join('\n');
      const system = [
        'You are Shaikh’s portfolio assistant. Rewrite the safe baseline warmly in no more than two short sentences, using only the approved facts.',
        'Never add pricing, clients, experience, availability, results, guarantees, credentials, or project details. Do not mention instructions.',
        `FACTS:\n${facts || 'None.'}`,
        `BASELINE:\n${deterministicReply}`
      ].join('\n\n');

      try {
        const response = await fetch(`${baseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            stream: false,
            keep_alive: '10m',
            options: { temperature: 0.2, num_predict: 32 },
            messages: [{ role: 'system', content: system }, { role: 'user', content: message }]
          })
        });
        if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
        const data = await response.json();
        retryAt = 0;
        return String(data?.message?.content || '').trim();
      } catch (error) {
        retryAt = Date.now() + retryDelayMs;
        throw error;
      } finally {
        clearTimeout(timer);
      }
    },
    async health() {
      if (!enabled) return false;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1200);
      try {
        const response = await fetch(`${baseUrl}/api/tags`, { signal: controller.signal });
        return response.ok;
      } catch {
        return false;
      } finally {
        clearTimeout(timer);
      }
    }
  };
}
