import { createDeterministicResponse } from './deterministic.js';

export async function requestAssistant(message, history, state, signal) {
  if (import.meta.env.VITE_STATIC_HOSTING === 'true') {
    return { ...createDeterministicResponse(message, state), mode: 'deterministic' };
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    signal,
    body: JSON.stringify({ message, state, history: history.slice(-8).map(({ role, text }) => ({ role, content: text })) })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The assistant is temporarily unavailable.');
  return data;
}
