import test from 'node:test';
import assert from 'node:assert/strict';
import { createDeterministicResponse } from '../src/assistant/deterministic.js';
import { retrieveKnowledge } from '../src/assistant/knowledge.js';
import { validateEnhancedReply } from '../server/grounding.js';
import { PORTFOLIO_SERVICES } from '../src/data/portfolioExperience.js';

test('retrieves documented services and projects', () => {
  assert.equal(retrieveKnowledge('Power BI dashboard')[0].id, 'service:bi');
  assert.ok(retrieveKnowledge('field tracker').some((entry) => entry.title === 'Field Tracker System'));
});

test('uses the full name in the formal portfolio profile', () => {
  const profile = retrieveKnowledge('Who is Shaikh?')[0];
  assert.equal(profile.id, 'profile');
  assert.match(profile.title, /Shaikh Abdul Aleem/);
});

test('documents a client-fit description for every service', () => {
  assert.ok(PORTFOLIO_SERVICES.every((service) => typeof service.bestFor === 'string' && service.bestFor.length > 20));
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
  assert.match(result.reply, /\+966511493209/);
  assert.ok(result.actions.some((action) => action.id === 'booking'));
  assert.ok(result.actions.some((action) => action.id === 'whatsapp' && action.href.includes('966511493209')));
});

test('start project begins discovery before showing contact routes', () => {
  const result = createDeterministicResponse('Start a project');
  assert.equal(result.action, 'discover');
  assert.match(result.reply, /what would you like to build/i);
  assert.equal(result.actions, undefined);
});

test('uses business context already provided for a software inquiry', () => {
  const result = createDeterministicResponse('I need software for my construction company');
  assert.equal(result.serviceId, 'saas');
  assert.equal(result.state.stage, 'questions');
  assert.doesNotMatch(result.reply, /what kind of business/i);
  assert.match(result.reply, /Which part of the business/i);
});

test('routes a mobile application request to SaaS planning', () => {
  const result = createDeterministicResponse('We need a mobile application');
  assert.equal(result.serviceId, 'saas');
  assert.equal(result.action, 'qualify');
});

test('does not present website development as a documented service', () => {
  const result = createDeterministicResponse('I need a website for my company');
  assert.equal(result.action, 'contact');
  assert.match(result.reply, /not listed as a documented service/i);
});

test('explains that email is not an offered contact route', () => {
  const result = createDeterministicResponse('What is your email address?');
  assert.equal(result.action, 'contact');
  assert.match(result.reply, /email address is not listed/i);
});

test('asks a useful discovery question for a broad business need', () => {
  const result = createDeterministicResponse('I need help improving my business');
  assert.equal(result.action, 'discover');
  assert.match(result.reply, /main business problem/i);
});

test('does not repeat the business question when context is included', () => {
  const result = createDeterministicResponse('I run a logistics company and need SaaS for operations');
  assert.equal(result.state.stage, 'questions');
  assert.doesNotMatch(result.reply, /what kind of business/i);
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
