import { hasUnsupportedSensitiveClaim } from '../src/assistant/knowledge.js';

const STOP_WORDS = new Set(['about', 'after', 'again', 'also', 'and', 'are', 'because', 'been', 'being', 'but', 'can', 'for', 'from', 'have', 'into', 'just', 'more', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'through', 'use', 'using', 'what', 'when', 'where', 'which', 'will', 'with', 'would', 'your']);
const words = (value) => String(value).toLowerCase().match(/[a-z0-9+#.]{3,}/g)?.filter((word) => !STOP_WORDS.has(word)) || [];

export function validateEnhancedReply(reply, context, baseline) {
  if (!reply || reply.length < 20 || reply.length > 1400) return false;
  if (hasUnsupportedSensitiveClaim(reply, context)) return false;
  if (!context.length) return reply === baseline;
  const approvedWords = new Set(words(`${context.map((entry) => `${entry.title} ${entry.content}`).join(' ')} ${baseline}`));
  const replyWords = words(reply);
  if (!replyWords.length) return false;
  const overlap = replyWords.filter((word) => approvedWords.has(word)).length / replyWords.length;
  return overlap >= 0.42;
}
