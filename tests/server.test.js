import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../server/app.js';

const downProvider = { generate: async () => { throw new Error('down'); }, health: async () => false };

test('chat returns deterministic answer when Ollama is down', async () => {
  const response = await request(createApp({ env: {}, provider: downProvider })).post('/api/chat').send({ message: 'What services do you offer?' });
  assert.equal(response.status, 200);
  assert.equal(response.body.mode, 'deterministic');
  assert.match(response.body.reply, /SaaS Planning/);
});

test('chat accepts a grounded model enhancement', async () => {
  const provider = { generate: async ({ deterministicReply }) => deterministicReply, health: async () => true };
  const response = await request(createApp({ env: {}, provider })).post('/api/chat').send({ message: 'Tell me about your toolkit' });
  assert.equal(response.status, 200);
  assert.equal(response.body.mode, 'enhanced');
});

test('greetings bypass the model', async () => {
  let calls = 0;
  const provider = { generate: async () => { calls += 1; return 'wrong'; }, health: async () => false };
  const response = await request(createApp({ env: {}, provider })).post('/api/chat').send({ message: 'hi' });
  assert.equal(response.status, 200);
  assert.equal(response.body.action, 'greeting');
  assert.equal(calls, 0);
});

test('server advances qualification using controlled state', async () => {
  const app = createApp({ env: {}, provider: downProvider });
  const start = await request(app).post('/api/chat').send({ message: 'I need SaaS development' });
  const next = await request(app).post('/api/chat').send({ message: 'We run a logistics company', state: start.body.state });
  assert.equal(next.status, 200);
  assert.equal(next.body.state.stage, 'questions');
  assert.equal(next.body.state.questionIndex, 0);
  assert.match(next.body.reply, /Which part of the business/i);
});

test('chat rejects invalid payloads', async () => {
  const response = await request(createApp({ env: {}, provider: downProvider })).post('/api/chat').send({ message: '' });
  assert.equal(response.status, 400);
});

test('health reports deterministic readiness independently', async () => {
  const response = await request(createApp({ env: {}, provider: downProvider })).get('/api/health');
  assert.deepEqual(response.body, { status: 'ok', deterministic: true, ollama: false });
});

test('server applies production security headers', async () => {
  const response = await request(createApp({ env: {}, provider: downProvider })).get('/api/health');
  assert.match(response.headers['content-security-policy'], /default-src 'self'/);
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.equal(response.headers['referrer-policy'], 'strict-origin-when-cross-origin');
  assert.equal(response.headers['x-powered-by'], undefined);
});
