import {
  BOOKING_URL,
  DELIVERY_STEPS,
  LINKEDIN_URL,
  PORTFOLIO_PROFILE,
  PORTFOLIO_SERVICES,
  TOOLKIT_CATEGORIES,
  UPWORK_URL
} from '../data/portfolioExperience.js';
import { caseStudies } from '../data/caseStudies.js';

export const SENSITIVE_CLAIM_PATTERN = /\b(prices?|pricing|rates?|costs?|budgets?|clients?|employers?|hired|years? (?:of )?experience|available|availability|guarantees?|guaranteed|certif\w*|credentials?|awards?|revenue|saved|increased|decreased|\d+%|\$\d+)\b/i;

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').trim();
const STOP_TOKENS = new Set(['about', 'and', 'are', 'can', 'does', 'for', 'from', 'how', 'tell', 'the', 'use', 'using', 'what', 'with', 'you', 'your']);
const tokens = (value) => new Set(normalize(value).split(/\s+/).filter((token) => token.length >= 3 && !STOP_TOKENS.has(token)));

export const knowledgeEntries = [
  {
    id: 'profile',
    type: 'profile',
    title: `${PORTFOLIO_PROFILE.name} — ${PORTFOLIO_PROFILE.role}`,
    content: `${PORTFOLIO_PROFILE.summary} ${PORTFOLIO_PROFILE.approach}`,
    href: '#about',
    keywords: ['about', 'who', 'consultant', 'approach', 'profile']
  },
  ...PORTFOLIO_SERVICES.map((service) => ({
    id: `service:${service.id}`,
    type: 'service',
    title: service.title,
    content: `${service.short} ${service.description} Typical deliverables: ${service.examples.join(', ')}.`,
    href: '#services',
    serviceId: service.id,
    keywords: [service.id, service.title, ...service.examples]
  })),
  ...caseStudies.map((study) => ({
    id: `case-study:${study.id}`,
    type: 'case-study',
    title: study.title,
    content: `Challenge: ${study.challenge} Solution: ${study.solution} Workflow: ${study.workflow.join(' to ')}. Outcome: ${study.outcome}`,
    href: '#case-studies',
    keywords: [study.tag, study.title, ...study.workflow]
  })),
  {
    id: 'delivery-process',
    type: 'process',
    title: 'Delivery Process',
    content: `The delivery process is: ${DELIVERY_STEPS.join(', ')}.`,
    href: '#process',
    keywords: ['process', 'method', 'delivery', 'steps', 'work']
  },
  ...TOOLKIT_CATEGORIES.map((category, index) => ({
    id: `toolkit:${index + 1}`,
    type: 'toolkit',
    title: category.label,
    content: `Tools shown in the portfolio: ${category.tools.join(', ')}.`,
    href: '#toolkit',
    keywords: [category.label, ...category.tools]
  })),
  {
    id: 'contact',
    type: 'contact',
    title: 'Contact and booking options',
    content: `Visitors can shape a project brief with the assistant, continue on WhatsApp, book a Google Meet discovery call, or connect through LinkedIn and Upwork. Booking: ${BOOKING_URL}. LinkedIn: ${LINKEDIN_URL}. Upwork: ${UPWORK_URL}.`,
    href: '#contact',
    keywords: ['contact', 'book', 'call', 'meet', 'whatsapp', 'linkedin', 'upwork', 'hire', 'start']
  }
];

export function retrieveKnowledge(query, limit = 4) {
  const queryTokens = tokens(query);
  if (!queryTokens.size) return [];
  return knowledgeEntries
    .map((entry) => {
      const searchable = tokens(`${entry.id} ${entry.type} ${entry.title} ${entry.content} ${entry.keywords.join(' ')}`);
      let score = 0;
      queryTokens.forEach((token) => {
        if (searchable.has(token)) score += 2;
        else if (token.length >= 5 && [...searchable].some((word) => word.startsWith(token) || token.startsWith(word))) score += 1;
      });
      if (entry.type === 'contact' && /contact|hire|book|call|start|email|whatsapp/i.test(query)) score += 4;
      return { ...entry, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function hasUnsupportedSensitiveClaim(text, contextEntries = []) {
  if (!SENSITIVE_CLAIM_PATTERN.test(text)) return false;
  const approved = normalize(contextEntries.map((entry) => `${entry.title} ${entry.content}`).join(' '));
  return text.split(/[.!?]+/).some((sentence) => SENSITIVE_CLAIM_PATTERN.test(sentence) && !approved.includes(normalize(sentence)));
}
