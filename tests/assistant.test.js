import test from 'node:test';
import assert from 'node:assert/strict';
import { createDeterministicResponse } from '../src/assistant/deterministic.js';
import { retrieveKnowledge } from '../src/assistant/knowledge.js';
import { validateEnhancedReply } from '../server/grounding.js';

test('retrieves documented services and projects', () => {
  assert.equal(retrieveKnowledge('Power BI dashboard')[0].id, 'service:bi');
  assert.ok(retrieveKnowledge('field tracker').some((entry) => entry.title === 'Field Tracker System'));
});

test('generic wording does not outrank the requested toolkit topic', () => {
  assert.match(retrieveKnowledge('Tell me about the tools you use')[0].id, /^toolkit:/);
});

test('routes a documented AI need into qualification', () => {
  const result = createDeterministicResponse('We need an AI assistant for our documents');
  assert.equal(result.serviceId, 'ai');
  assert.equal(result.action, 'qualify');
  assert.match(result.reply, /AI Implementation/);
});

test('handles greetings without accidental knowledge matches', () => {
  const result = createDeterministicResponse('hi');
  assert.equal(result.action, 'greeting');
  assert.match(result.reply, /What would you like/i);
  assert.equal(result.entries.length, 0);
});

test('maintains application-controlled qualification state', () => {
  const start = createDeterministicResponse('I would like to know about SaaS services');
  assert.equal(start.state.stage, 'business');
  assert.match(start.reply, /what kind of business/i);
  const business = createDeterministicResponse('We operate a logistics company', start.state);
  assert.equal(business.state.stage, 'questions');
  assert.match(business.reply, /Which part of the business/i);
  const problem = createDeterministicResponse('Manual operations', business.state);
  assert.match(problem.reply, /Who will use it/i);
  const users = createDeterministicResponse('Business customers', problem.state);
  const stage = createDeterministicResponse('Early idea', users.state);
  assert.equal(stage.state.stage, 'timeframe');
  const timeframe = createDeterministicResponse('Within 3 months', stage.state);
  assert.equal(timeframe.action, 'contact');
  assert.equal(timeframe.state.answers.timeframe, 'Within 3 months');
  assert.ok(timeframe.actions.some((action) => action.id === 'booking'));
  assert.ok(timeframe.actions.some((action) => action.id === 'whatsapp' && action.label.includes('+966511493209')));
});

test('specific SaaS intent wins over generic services overview', () => {
  const result = createDeterministicResponse('I like to know about SaaS services');
  assert.equal(result.action, 'qualify');
  assert.equal(result.serviceId, 'saas');
});

test('appointment request returns a direct booking action', () => {
  const result = createDeterministicResponse('Can I book an appointment?');
  assert.equal(result.action, 'booking');
  assert.ok(result.actions.some((action) => action.id === 'booking' && action.href.startsWith('https://')));
});

test('contact request returns direct calendar and WhatsApp actions', () => {
  const result = createDeterministicResponse('I want to contact Shaikh');
  assert.equal(result.action, 'contact');
  assert.ok(result.actions.some((action) => action.id === 'booking'));
  assert.ok(result.actions.some((action) => action.id === 'whatsapp' && action.href.includes('966511493209')));
});

for (const question of [
  'What are your prices?', 'Which clients hired you?', 'Who were your employers?',
  'How many years of experience?', 'Are you available next week?', 'What results did you guarantee?',
  'Do you guarantee delivery?', 'What credentials do you have?'
]) {
  test(`does not invent sensitive information: ${question}`, () => {
    const result = createDeterministicResponse(question);
    assert.equal(result.action, 'contact');
    assert.match(result.reply, /don't have verified information/i);
  });
}

test('rejects an unsupported enhanced answer', () => {
  const context = retrieveKnowledge('AI Implementation');
  assert.equal(validateEnhancedReply('Shaikh guarantees 40% savings and has ten years of experience.', context, 'Safe baseline.'), false);
});
