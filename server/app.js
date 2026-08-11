import path from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import { createDeterministicResponse } from '../src/assistant/deterministic.js';
import { validateEnhancedReply } from './grounding.js';
import { createOllamaProvider } from './providers/ollama.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');

function createRateLimiter({ windowMs = 60_000, max = 30 } = {}) {
  const buckets = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || 'unknown';
    const bucket = buckets.get(key);
    if (!bucket || bucket.expires <= now) {
      buckets.set(key, { count: 1, expires: now + windowMs });
      return next();
    }
    bucket.count += 1;
    if (bucket.count > max) return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    return next();
  };
}

function sameOriginGuard(env) {
  const allowed = env.PUBLIC_ORIGIN;
  return (req, res, next) => {
    const origin = req.get('origin');
    if (allowed && origin && origin !== allowed) return res.status(403).json({ error: 'Origin is not allowed.' });
    return next();
  };
}

export function createApp({ env = process.env, provider = createOllamaProvider(env) } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"]
      }
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }));
  app.use(compression());
  app.use(express.json({ limit: env.MAX_JSON_SIZE || '32kb' }));
  app.use('/api', sameOriginGuard(env), createRateLimiter({ max: Number(env.RATE_LIMIT_PER_MINUTE) || 30 }));

  app.post('/api/chat', async (req, res) => {
    const message = String(req.body?.message || '').trim();
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
    if (!message || message.length > 1000) return res.status(400).json({ error: 'Message must be between 1 and 1000 characters.' });
    if (history.some((item) => !['user', 'assistant'].includes(item?.role) || String(item?.content || '').length > 1200)) {
      return res.status(400).json({ error: 'Conversation history is invalid.' });
    }

    const deterministic = createDeterministicResponse(message, req.body?.state);
    let reply = deterministic.reply;
    let mode = 'deterministic';
    if (['answer', 'explore'].includes(deterministic.action)) {
      try {
        const enhanced = await provider.generate({ message, history, deterministicReply: reply, context: deterministic.entries });
        if (validateEnhancedReply(enhanced, deterministic.entries, reply)) {
          reply = enhanced;
          mode = 'enhanced';
        }
      } catch {
        // The deterministic assistant is deliberately the guaranteed path.
      }
    }
    return res.json({ ...deterministic, reply, mode, entries: deterministic.entries.map(({ score, keywords, ...entry }) => entry) });
  });

  app.get('/api/health', async (_req, res) => {
    const ollama = await provider.health().catch(() => false);
    res.json({ status: 'ok', deterministic: true, ollama });
  });

  if (env.NODE_ENV === 'production') {
    app.use('/assets', express.static(path.join(distPath, 'assets'), { immutable: true, maxAge: '1y' }));
    app.use(express.static(distPath, { index: false }));
    app.get('*path', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
  return app;
}
