// To show Figma/screenshot designs on a project: drop the exported PNGs into
// public/projects/ and list them in `images` as { src, alt }. Leave `images`
// empty (or omit it) and the project detail simply shows no gallery.
// e.g. images: [{ src: '/projects/valuation-dashboard.png', alt: 'Valuation dashboard' }]
// `liveUrl` adds an "Open live prototype" button. Tip: publishing the Figma Make
// app gives a clean app link; the editor links below still show Figma's UI chrome.
export const caseStudies = [
  {
    id: 1,
    title: 'Valuation Management Modules',
    tag: 'Operations System',
    challenge: 'Multiple valuation categories relied on repeated proposal preparation, manual formatting, and disconnected review steps.',
    solution: 'A structured system covering the journey from proposal creation and category-specific data capture through internal review and final TAQEEM approval report preparation.',
    workflow: ['Client request', 'Proposal', 'Valuation', 'Review', 'Final report'],
    outcome: 'Improved process control, reduced repeated report preparation, and created a scalable valuation workflow.',
    liveUrl: 'https://www.figma.com/make/vw2gszwCuk3FxZJ9VJdbzC/Design-Valuation-System?t=366LxWVE4A98KtQc-6',
    images: []
  },
  {
    id: 2,
    title: 'AI Chatbot & Equipment Management',
    tag: 'AI & Operations',
    challenge: 'Customer inquiries, equipment availability, proposal preparation, and sales reporting lived across separate manual processes.',
    solution: 'An AI-supported operating flow connecting guided customer assistance, equipment schedules, reusable proposal layouts, and management dashboards.',
    workflow: ['Inquiry', 'AI guidance', 'Schedule', 'Proposal', 'Dashboard'],
    outcome: 'Improved support responsiveness, equipment planning, proposal consistency, and management visibility.',
    liveUrl: 'https://www.figma.com/make/00697bwkaLOl2Abh6XM8MS/B2B-CRM-for-Equipment-Rental?t=366LxWVE4A98KtQc-6',
    images: []
  },
  {
    id: 3,
    title: 'Field Tracker System',
    tag: 'Field Operations',
    challenge: 'Managers needed to plan daily surveys across cities and districts while tracking drivers, coverage, finance, delays, and completion.',
    solution: 'A field operations system for area planning, driver assignments, daily task tracking, route progress, finance visibility, and KPI reporting.',
    workflow: ['Define area', 'Estimate scope', 'Assign drivers', 'Track progress', 'Review KPIs'],
    outcome: 'Improved field visibility, driver planning, survey completion tracking, and operational reporting.',
    images: []
  },
  {
    id: 4,
    title: 'Salon Management Suite',
    tag: 'SaaS Product Design',
    challenge: 'Salons handle bookings, billing, inventory, and customer history across notebooks and separate tools, with no single view of daily revenue.',
    solution: 'A complete salon suite covering the counter flow — cart with live offers and tax, multiple payment methods, printable token and receipts with loyalty, and a real-time analytics module for revenue, cash, and discounts.',
    workflow: ['Booking', 'Cart & offers', 'Payment', 'Receipt & loyalty', 'Live analytics'],
    outcome: 'One platform for the full counter-to-analytics flow across gents and ladies salons, with live daily revenue visibility.',
    liveUrl: 'https://www.figma.com/make/DM4Kw5ODsaIKzNWC6OM9O7/Salon-Management-System-Prototype?t=366LxWVE4A98KtQc-6',
    images: []
  },
  {
    id: 5,
    title: 'Multi-Tenant SaaS Console',
    tag: 'Multi-Tenant SaaS',
    challenge: 'Agencies managing many client accounts lose track of per-client integration costs, revenue, and profitability across tenants.',
    solution: 'A multi-tenant console with per-tenant revenue vs. expenses, integration cost tracking with inline editing and on/off toggles, and net profit and margin per client at a glance.',
    workflow: ['Add tenant', 'Connect integrations', 'Track costs', 'Revenue vs expenses', 'Profit & margin'],
    outcome: 'Instant per-client profitability visibility and a single console for managing integrations across every tenant.',
    liveUrl: 'https://www.figma.com/make/NyDWphqH0rGhHNDVO8vTIQ/SaaS-System-Design?t=366LxWVE4A98KtQc-6',
    images: []
  },
  {
    id: 6,
    title: 'Executive CRM & Sales Automation',
    tag: 'CRM & Automation',
    challenge: 'Marketing and sales teams track leads, pipeline, quotations, and finance in disconnected sheets, with no executive view and heavy manual deal admin.',
    solution: 'An executive CRM covering the full lead-to-won journey with a sales automation that auto-drafts contracts, captures digital signatures, and fires CRM and ops actions the moment a deal closes.',
    workflow: ['Lead', 'Pipeline', 'Quotation', 'Agreement', 'Signature', 'Won'],
    outcome: 'A connected executive dashboard with automated deal closing — contracts, signatures, and follow-up actions triggered instantly.',
    liveUrl: 'https://www.figma.com/make/w5bHBH94308aKpPy4kM9ob/Update-Markdown-File?t=366LxWVE4A98KtQc-6',
    images: []
  }
];
