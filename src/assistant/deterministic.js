import { BOOKING_URL, PORTFOLIO_SERVICES, buildWhatsAppUrl } from '../data/portfolioExperience.js';
import { retrieveKnowledge, SENSITIVE_CLAIM_PATTERN } from './knowledge.js';

const UNKNOWN = "I don't have verified information about that in Shaikh's portfolio, so I don't want to guess. You can send Shaikh a project brief, continue on WhatsApp, or book a discovery call to confirm it directly.";
const SERVICE_OVERVIEW = `Shaikh helps with ${PORTFOLIO_SERVICES.map((service) => service.title).join(', ')}. Tell me what you want to build, improve, or automate and I'll point you toward the most relevant option.`;
const GENERAL_SERVICES = /what.*service|services|what do you (do|offer)|how can you help|capabilities|explore services/i;
const GREETING = /^(hi|hello|hey|good (morning|afternoon|evening)|salaam|assalamu alaikum)[!.\s]*$/i;
const BUSINESS_CONTEXT = /\b(i|we)\s+(run|operate|own|manage)\b|\b(company|business|agency|firm|store|shop|clinic|restaurant|construction|logistics|retail|e-?commerce|manufactur\w*|real estate)\b/i;
const UNSUPPORTED_WEBSITE = /\b(website|landing page|wordpress|shopify)\b/i;
const GENERAL_DISCOVERY = /help.*business|improv\w*.*business|digital solution|not sure|something else/i;

export const initialSuggestions = ['Explore services', 'See relevant projects', 'Ask about the process', 'Start a project'];
export const createConversationState = () => ({ stage: 'discovery', serviceId: null, questionIndex: 0, answers: {}, originalNeed: '' });

const conversionActions = (message = 'Hi Shaikh, I would like to discuss a project after using your portfolio assistant.') => [
  { id: 'booking', label: 'Book meeting on Google Calendar', href: BOOKING_URL, tone: 'purple' },
  { id: 'whatsapp', label: 'WhatsApp +966511493209', href: buildWhatsAppUrl(message), tone: 'green' }
];

export function detectService(message) {
  return PORTFOLIO_SERVICES.find((service) => service.patterns.test(message));
}

function beginQualification(service, value) {
  if (BUSINESS_CONTEXT.test(value)) {
    const question = service.questions[0];
    return {
      reply: `That sounds like a ${service.title} conversation, and you have already given me useful business context. ${question.prompt}`,
      entries: retrieveKnowledge(service.title, 1),
      suggestions: question.suggestions,
      serviceId: service.id,
      action: 'qualify',
      state: { stage: 'questions', serviceId: service.id, questionIndex: 0, answers: { business: value }, originalNeed: value }
    };
  }
  return {
    reply: `That sounds like a ${service.title} conversation. Before suggesting a solution, what kind of business do you run, and what does the business do today?`,
    entries: retrieveKnowledge(service.title, 1),
    suggestions: ['Professional services', 'Retail / e-commerce', 'Operations / logistics', 'Something else'],
    serviceId: service.id,
    action: 'qualify',
    state: { stage: 'business', serviceId: service.id, questionIndex: 0, answers: {}, originalNeed: value }
  };
}

function continueQualification(value, state, service) {
  if (state.stage === 'business') {
    const question = service.questions[0];
    return {
      reply: `Thanks — that gives me useful context. ${question.prompt}`,
      entries: retrieveKnowledge(service.title, 1),
      suggestions: question.suggestions,
      serviceId: service.id,
      action: 'qualify',
      state: { ...state, stage: 'questions', questionIndex: 0, answers: { ...state.answers, business: value } }
    };
  }

  if (state.stage === 'questions') {
    const currentQuestion = service.questions[state.questionIndex];
    const answers = { ...state.answers, [currentQuestion.key]: value };
    const nextIndex = state.questionIndex + 1;
    if (nextIndex < service.questions.length) {
      const nextQuestion = service.questions[nextIndex];
      return {
        reply: `Understood. ${nextQuestion.prompt}`,
        entries: [],
        suggestions: nextQuestion.suggestions,
        serviceId: service.id,
        action: 'qualify',
        state: { ...state, questionIndex: nextIndex, answers }
      };
    }
    return {
      reply: 'Thanks — what timing are you working toward?',
      entries: [],
      suggestions: ['As soon as possible', 'Within 1 month', 'Within 3 months', 'Still exploring'],
      serviceId: service.id,
      action: 'qualify',
      state: { ...state, stage: 'timeframe', answers }
    };
  }

  if (state.stage === 'timeframe') {
    const answers = { ...state.answers, timeframe: value };
    const completedState = { ...state, stage: 'contact', answers };
    return {
      reply: `Your ${service.title} brief is ready. Book a meeting with Shaikh on Google Calendar or continue on WhatsApp at +966511493209.`,
      entries: [],
      suggestions: [],
      actions: conversionActions(`Hi Shaikh, I completed a project brief on your portfolio and would like to discuss it.\n\n${buildProjectBrief(completedState)}`),
      serviceId: service.id,
      action: 'contact',
      state: completedState
    };
  }
  return null;
}

export function createDeterministicResponse(message, rawState = createConversationState()) {
  const value = String(message || '').trim();
  const state = sanitizeConversationState(rawState);
  const activeService = PORTFOLIO_SERVICES.find((service) => service.id === state.serviceId);

  if (GREETING.test(value)) {
    return { reply: "Hi! I can answer questions grounded in Shaikh's portfolio or help you shape a project. What would you like to build, improve, or automate?", entries: [], suggestions: initialSuggestions, action: 'greeting', state };
  }
  if (/^(reset|start over|change service)$/i.test(value)) {
    return { reply: 'No problem. What would you like to build, improve, or automate?', entries: [], suggestions: initialSuggestions, action: 'reset', state: createConversationState() };
  }

  const matchedService = detectService(value);
  const entries = retrieveKnowledge(value);

  if (/book|appointment|schedule|discovery call|meeting/i.test(value)) {
    return { reply: 'Absolutely. Choose an available Google Meet time below. The booking page will show times in your timezone.', entries: [], suggestions: [], actions: conversionActions(), action: 'booking', state };
  }
  if (/whatsapp|speak to|talk to|contact shaikh/i.test(value)) {
    return { reply: 'You can continue directly with Shaikh on WhatsApp at +966511493209 or reserve a discovery call.', entries: [], suggestions: [], actions: conversionActions(), action: 'contact', state };
  }
  if (/\bemail\b/i.test(value)) {
    return { reply: 'An email address is not listed as a contact route in this portfolio. You can reach Shaikh on WhatsApp at +966511493209 or choose a Google Meet time.', entries: [], suggestions: [], actions: conversionActions(), action: 'contact', state };
  }
  if (SENSITIVE_CLAIM_PATTERN.test(value)) {
    return { reply: UNKNOWN, entries: [], suggestions: ['Start a project'], actions: conversionActions(), action: 'contact', state };
  }
  if (/start a project|project brief/i.test(value)) {
    return { reply: 'Great — what would you like to build, improve, automate, or understand better? Choose the closest area or describe the problem in your own words.', entries: [], suggestions: PORTFOLIO_SERVICES.map((service) => service.title), action: 'discover', state: { ...createConversationState(), originalNeed: value } };
  }
  if (/contact me|\bhire (you|shaikh)\b/i.test(value)) {
    return { reply: 'You can book a meeting on Google Calendar or contact Shaikh directly on WhatsApp at +966511493209.', entries: [], suggestions: [], actions: conversionActions(), action: 'contact', state: { ...state, stage: 'contact' } };
  }

  if (activeService && ['business', 'questions', 'timeframe'].includes(state.stage)) return continueQualification(value, state, activeService);

  if (/case stud|see relevant projects|portfolio example|past work/i.test(value) && !matchedService) {
    const projects = retrieveKnowledge('case study project valuation equipment field tracker', 3);
    return { reply: `The portfolio documents three projects: ${projects.map((entry) => entry.title).join(', ')}. Select one for its challenge, solution, workflow, and documented outcome.`, entries: projects, suggestions: ['AI Chatbot & Equipment Management', 'Valuation Management Modules', 'Field Tracker System'], action: 'explore', state };
  }

  if (UNSUPPORTED_WEBSITE.test(value)) {
    return { reply: "Website development is not listed as a documented service in Shaikh's portfolio, so I do not want to imply that it is offered. You can still describe the business need on WhatsApp or discuss it in a discovery call.", entries: [], suggestions: ['Explore documented services'], actions: conversionActions(), action: 'contact', state };
  }

  if (GENERAL_DISCOVERY.test(value)) {
    return { reply: 'I can help narrow it down. What is the main business problem you want to solve: repetitive work, scattered data, a new software product, an AI use case, or a delivery problem?', entries: [], suggestions: PORTFOLIO_SERVICES.map((service) => service.title), action: 'discover', state };
  }

  // Specific service intent must win over the generic word "services".
  if (matchedService) return beginQualification(matchedService, value);
  if (GENERAL_SERVICES.test(value)) {
    return { reply: SERVICE_OVERVIEW, entries: retrieveKnowledge('services SaaS AI automation dashboards delivery', 5), suggestions: PORTFOLIO_SERVICES.map((service) => service.title), action: 'explore', state };
  }
  if (entries.length) {
    const top = entries[0];
    return { reply: `${top.title}: ${top.content}`, entries: [top], suggestions: ['Tell me what you need', 'Start a project', 'Book a call'], action: 'answer', state };
  }
  return { reply: UNKNOWN, entries: [], suggestions: ['Explore services', 'Start a project'], actions: conversionActions(), action: 'unknown', state };
}

export function sanitizeConversationState(input) {
  const service = PORTFOLIO_SERVICES.find((item) => item.id === input?.serviceId);
  const allowedStages = new Set(['discovery', 'business', 'questions', 'timeframe', 'contact']);
  const stage = allowedStages.has(input?.stage) ? input.stage : 'discovery';
  if (!service && !['discovery', 'contact'].includes(stage)) return createConversationState();
  const maxIndex = service ? service.questions.length - 1 : 0;
  const questionIndex = Math.max(0, Math.min(Number(input?.questionIndex) || 0, maxIndex));
  const answers = {};
  if (input?.answers && typeof input.answers === 'object') {
    Object.entries(input.answers).slice(0, 10).forEach(([key, answer]) => {
      const clean = String(answer || '').trim().slice(0, 500);
      if (clean) answers[String(key).slice(0, 50)] = clean;
    });
  }
  return { stage, serviceId: service?.id || null, questionIndex, answers, originalNeed: String(input?.originalNeed || '').trim().slice(0, 1000) };
}

const ANSWER_LABELS = { business: 'Business', problem: 'Business need', users: 'Primary users', stage: 'Current stage', timeframe: 'Timeline', useCase: 'AI use case', data: 'Available data', outcome: 'Desired outcome', workflow: 'Current workflow', blocker: 'Main blocker', volume: 'Frequency / volume', sources: 'Data sources', audience: 'Dashboard audience', metrics: 'KPIs', team: 'Delivery team' };

function buildProjectBrief(state) {
  const clean = sanitizeConversationState(state);
  const service = PORTFOLIO_SERVICES.find((item) => item.id === clean.serviceId);
  return [service ? `Service: ${service.title}` : '', clean.originalNeed ? `Initial need: ${clean.originalNeed}` : '', ...Object.entries(clean.answers).map(([key, value]) => `${ANSWER_LABELS[key] || key}: ${value}`)].filter(Boolean).join('\n');
}
