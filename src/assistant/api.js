export async function requestAssistant(message, history, state, signal) {
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
