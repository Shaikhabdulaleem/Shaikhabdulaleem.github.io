export const BOOKING_URL = 'https://calendar.app.google/ZUKvx1Anky67afRRA';
export const WHATSAPP_NUMBER = '966511493209';
export const UPWORK_URL = 'https://www.upwork.com/freelancers/~01d014da7be413bde3?mp_source=share';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/abdulaleemshaikh48/';

export const PORTFOLIO_PROFILE = {
  name: 'Shaikh Abdul Aleem',
  role: 'Digital Transformation Consultant',
  summary: 'Helps growing businesses replace manual, scattered processes with structured digital systems they can manage, measure, and scale.',
  approach: 'Connect business needs, system requirements, and practical delivery so the business becomes easier to run, understand, and improve.'
};

export const DELIVERY_STEPS = [
  'Business Understanding',
  'Requirement Gathering',
  'Workflow & System Design',
  'Development / Implementation',
  'Testing & Improvement',
  'Handover & Support'
];

export const TOOLKIT_CATEGORIES = [
  { label: 'AI-Assisted Delivery', tools: ['OpenAI GPT-4', 'Claude API', 'LangChain', 'Pinecone', 'Whisper'] },
  { label: 'SaaS & Product Engineering', tools: ['React', 'Next.js', 'Supabase', 'PostgreSQL', 'Tailwind CSS'] },
  { label: 'Custom Development', tools: ['Node.js', 'REST APIs', 'GraphQL', 'Zapier', 'Make (Integromat)'] },
  { label: 'Operations & ERP', tools: ['Notion', 'Airtable', 'ClickUp', 'Jira', 'Google Workspace'] },
  { label: 'Analytics & BI', tools: ['Power BI', 'Google Looker Studio', 'Excel', 'BigQuery', 'Metabase'] }
];

export const SOCIAL_PROFILES = [
  {
    id: 'upwork',
    label: 'Upwork',
    eyebrow: 'Hire the system builder',
    url: UPWORK_URL,
    logo: '/profile-connect/upwork-logo.svg',
    color: '#14a800',
    glow: 'rgba(20,168,0,0.24)',
    pose: 'upwork',
    accessibleName: "Open Shaikh Abdul Aleem's Upwork profile in a new tab"
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    eyebrow: 'Build the connection',
    url: LINKEDIN_URL,
    logo: '/profile-connect/linkedin-in.png',
    color: '#0a66c2',
    glow: 'rgba(10,102,194,0.28)',
    pose: 'linkedin',
    accessibleName: "Open Shaikh Abdul Aleem's LinkedIn profile in a new tab"
  }
];

export const PORTFOLIO_SERVICES = [
  {
    id: 'saas',
    code: '01',
    title: 'SaaS Planning',
    short: 'Shape a viable product before development begins.',
    description: 'Turn an idea or manual operation into a structured SaaS product with clear users, workflows, roles, priorities, and a practical delivery roadmap.',
    bestFor: 'Early product ideas or manual operations that need a defined product direction before development.',
    examples: ['Product roadmap', 'User roles', 'Feature architecture', 'MVP scope'],
    color: '#22d3ee',
    patterns: /saas|platform|portal|product|mvp|software|applications?|mobile app|web app|digital system|\bapp\b|booking system|crm/i,
    questions: [
      { key: 'problem', prompt: 'Which part of the business should the SaaS product improve or replace?', suggestions: ['Manual operations', 'Disconnected tools', 'Customer experience', 'New digital service'] },
      { key: 'users', prompt: 'Who will use it most, and what do those users need to accomplish?', suggestions: ['Internal team', 'Business customers', 'Consumers', 'Multiple user roles'] },
      { key: 'stage', prompt: 'Where is the product today - early idea, planned, already being built, or live?', suggestions: ['Early idea', 'Planning stage', 'In development', 'Already live'] }
    ]
  },
  {
    id: 'ai',
    code: '02',
    title: 'AI Implementation',
    short: 'Place AI where it removes real work.',
    description: 'Design practical AI assistants, document workflows, guided support, reporting, and knowledge experiences around a defined business use case.',
    bestFor: 'A defined business use case where AI can support people, documents, reporting, or knowledge access.',
    examples: ['AI assistants', 'Document analysis', 'Knowledge search', 'Smart reporting'],
    color: '#c084fc',
    patterns: /\bai\b|artificial intelligence|chatbot|assistant|gpt|document analysis|knowledge base|llm/i,
    questions: [
      { key: 'useCase', prompt: 'What should the AI help people do faster or better?', suggestions: ['Answer questions', 'Analyze documents', 'Create reports', 'Guide a workflow'] },
      { key: 'data', prompt: 'What information would it work with - documents, business data, conversations, or something else?', suggestions: ['Documents', 'Business data', 'Customer conversations', 'Mixed sources'] },
      { key: 'outcome', prompt: 'What result would make this AI implementation valuable to you?', suggestions: ['Faster response', 'Less manual work', 'Better decisions', 'Consistent support'] }
    ]
  },
  {
    id: 'automation',
    code: '03',
    title: 'Automation',
    short: 'Remove repetitive work from daily operations.',
    description: 'Map approvals, reminders, lead handling, reporting, and recurring tasks into a connected workflow your team can run and measure.',
    bestFor: 'Recurring manual work, slow handoffs, and disconnected operational tools.',
    examples: ['Approvals', 'CRM flows', 'Reminders', 'Recurring reports'],
    color: '#34d399',
    patterns: /automat|manual|workflow|approval|reminder|repetitive|crm|integration|zapier|make\.com/i,
    questions: [
      { key: 'workflow', prompt: 'Which process is still being handled manually today?', suggestions: ['Approvals', 'Lead handling', 'Reporting', 'Recurring admin'] },
      { key: 'blocker', prompt: 'Where does that process slow down or create the most mistakes?', suggestions: ['Handoffs', 'Data entry', 'Follow-ups', 'Visibility'] },
      { key: 'volume', prompt: 'How often does the workflow run, and roughly how many items move through it?', suggestions: ['Daily', 'Weekly', 'Monthly', 'High volume'] }
    ]
  },
  {
    id: 'bi',
    code: '04',
    title: 'BI Dashboards',
    short: 'Turn scattered data into decision visibility.',
    description: 'Connect the right data, KPIs, and management views so teams can understand revenue, finance, operations, and performance without manual reporting.',
    bestFor: 'Teams that need clearer decision visibility from data spread across existing systems.',
    examples: ['KPI design', 'Power BI', 'Operations views', 'Management reporting'],
    color: '#60a5fa',
    patterns: /dashboard|business intelligence|\bbi\b|analytics|kpi|report|power bi|looker|data visualization/i,
    questions: [
      { key: 'sources', prompt: 'Where does the data live today?', suggestions: ['Excel or Sheets', 'ERP or CRM', 'Database', 'Multiple systems'] },
      { key: 'audience', prompt: 'Who needs the dashboard most?', suggestions: ['Leadership', 'Operations', 'Sales', 'Finance'] },
      { key: 'metrics', prompt: 'Which decisions or KPIs should become easier to see?', suggestions: ['Revenue', 'Performance', 'Operations', 'Custom KPIs'] }
    ]
  },
  {
    id: 'delivery',
    code: '05',
    title: 'Project Delivery',
    short: 'Bring structure to complex digital delivery.',
    description: 'Clarify requirements, scope, roles, sprints, testing, and handover so a digital project moves from uncertainty to a controlled launch.',
    bestFor: 'Digital projects that need clearer requirements, coordination, testing, or handover.',
    examples: ['Requirements', 'Delivery planning', 'QA coordination', 'Handover'],
    color: '#fbbf24',
    patterns: /project|delivery|requirements|scope|sprint|stakeholder|qa|testing|handover|manage/i,
    questions: [
      { key: 'stage', prompt: 'What stage is the project currently in?', suggestions: ['Discovery', 'Planning', 'In development', 'Needs recovery'] },
      { key: 'team', prompt: 'Who is already involved in delivery?', suggestions: ['Internal team', 'External developers', 'Multiple vendors', 'No team yet'] },
      { key: 'blocker', prompt: 'What is the biggest obstacle to moving forward?', suggestions: ['Unclear scope', 'Slow delivery', 'Quality issues', 'Coordination'] }
    ]
  }
];

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
