// ═══════════════ INITIALIZE LUCIDE ICONS ═══════════════
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initSmoothScroll();
  initHeroTerminal();
});

// ═══════════════ NAVBAR SCROLL EFFECT ═══════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// ═══════════════ MOBILE MENU ═══════════════
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');

    if (isOpen) {
      menu.classList.add('hidden');
      toggle.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
    } else {
      menu.classList.remove('hidden');
      toggle.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
    }

    lucide.createIcons();
  });

  // Close menu when clicking nav links
  menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      toggle.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
      lucide.createIcons();
    });
  });
}

// ═══════════════ SCROLL REVEAL ═══════════════
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-section');

  // Use IntersectionObserver with generous margins
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '100px 0px 0px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // Fallback: also check on scroll + reveal elements already in viewport
  function checkReveal() {
    const windowHeight = window.innerHeight;
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 30) {
        el.classList.add('revealed');
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  // Initial check for elements already visible
  checkReveal();
}

// ═══════════════ USE CASE MODAL ═══════════════
let currentSlideIndex = 0;
let currentSlides = [];
let currentSectorKey = '';

const useCaseData = {
  healthcare: {
    title: 'Healthcare & Telemedicine',
    icon: 'heart-pulse',
    iconBg: 'rgba(239, 68, 68, 0.1)',
    iconColor: '#f87171',
    slides: [
      {
        title: 'The Healthcare Software Crisis',
        subtitle: 'An industry trapped in legacy thinking',
        old: { label: 'The Old Reality', title: '$500K+ to build an EMR system', text: 'Traditional healthcare software required 12-18 months, massive teams, and HIPAA consultants costing $200/hr. Most startups failed before launching.', stat: '$500K+', statLabel: 'Average development cost' },
        new: { label: 'The AI-First Reality', title: 'Full EMR platform in 8 weeks', text: 'AI-powered development with pre-built HIPAA modules, automated compliance checks, and intelligent workflows. Ship a production EMR in weeks, not years.', stat: '$25K', statLabel: 'With AI-driven development' }
      },
      {
        title: 'Patient Records & Data Entry',
        subtitle: 'Hours wasted on manual documentation',
        old: { label: 'Legacy Approach', title: 'Manual data entry, paper forms', text: 'Doctors spend 2+ hours daily on documentation. Handwritten notes get lost. Patient data scattered across disconnected systems.', stat: '2hrs/day', statLabel: 'Wasted on paperwork' },
        new: { label: 'AI-Powered', title: 'Voice-to-record AI documentation', text: 'AI transcribes doctor-patient conversations in real-time, auto-fills records, extracts diagnoses, and updates patient history instantly.', stat: '5 min', statLabel: 'AI handles documentation' }
      },
      {
        title: 'Appointment Scheduling',
        subtitle: 'The broken booking experience',
        old: { label: 'Legacy Approach', title: 'Phone calls and spreadsheets', text: 'Receptionists juggle phone lines, manage paper calendars, and manually call patients for reminders. 30% no-show rate.', stat: '30%', statLabel: 'Patient no-show rate' },
        new: { label: 'AI-Powered', title: 'AI scheduling with smart routing', text: 'Patients self-book online. AI predicts no-shows, sends smart reminders, auto-fills cancellations, and routes to the right specialist.', stat: '8%', statLabel: 'No-show rate with AI' }
      },
      {
        title: 'Diagnosis Support',
        subtitle: 'When second opinions take weeks',
        old: { label: 'Legacy Approach', title: 'Referrals and waiting lists', text: 'Patients wait 3-6 weeks for specialist opinions. Misdiagnosis rates of 10-15%. No decision support for primary care doctors.', stat: '12%', statLabel: 'Misdiagnosis rate' },
        new: { label: 'AI-Powered', title: 'AI-assisted diagnostic tools', text: 'AI analyzes symptoms, lab results, and medical history to suggest differential diagnoses. Real-time clinical decision support at the point of care.', stat: '95%', statLabel: 'Diagnostic accuracy with AI' }
      },
      {
        title: 'Telemedicine Infrastructure',
        subtitle: 'Video calls are just the beginning',
        old: { label: 'Legacy Approach', title: 'Basic Zoom calls, no integration', text: 'Doctors use generic video tools with no EHR integration. Notes taken separately, prescriptions faxed, billing done manually afterward.', stat: '$80K', statLabel: 'Custom video platform cost' },
        new: { label: 'AI-Powered', title: 'Integrated AI telehealth platform', text: 'Video + AI symptom pre-screening + auto-generated visit notes + e-prescriptions + insurance billing — all in one seamless flow.', stat: '$12K', statLabel: 'Full telehealth platform' }
      },
      {
        title: 'Medical Billing & Claims',
        subtitle: 'The most hated process in healthcare',
        old: { label: 'Legacy Approach', title: 'Manual coding, 20% claim denials', text: 'Medical coders manually assign CPT/ICD codes. Claims submitted via clearinghouses. Average 20% denial rate. Revenue cycle: 60-90 days.', stat: '90 days', statLabel: 'Average revenue cycle' },
        new: { label: 'AI-Powered', title: 'AI auto-coding & instant claims', text: 'AI reads visit notes, assigns correct codes, validates against payer rules, and submits claims automatically. Denials flagged before submission.', stat: '14 days', statLabel: 'AI-optimized revenue cycle' }
      },
      {
        title: 'Patient Engagement',
        subtitle: 'Beyond the waiting room',
        old: { label: 'Legacy Approach', title: 'Generic pamphlets and callbacks', text: 'Patients leave the office and forget care instructions. Follow-ups rely on phone tag. Medication adherence drops to 50%.', stat: '50%', statLabel: 'Medication adherence' },
        new: { label: 'AI-Powered', title: 'AI health companion app', text: 'Personalized care plans, medication reminders, symptom tracking, and an AI chatbot for 24/7 health questions. Proactive outreach for at-risk patients.', stat: '85%', statLabel: 'Adherence with AI nudges' }
      },
      {
        title: 'Compliance & Security',
        subtitle: 'HIPAA is not optional',
        old: { label: 'Legacy Approach', title: '$150K/year for compliance teams', text: 'Dedicated compliance officers, annual audits, manual access logging. One breach costs $1.5M+ in fines and reputation damage.', stat: '$150K/yr', statLabel: 'Compliance overhead' },
        new: { label: 'AI-Powered', title: 'Automated HIPAA compliance', text: 'AI monitors data access in real-time, auto-generates audit logs, detects anomalies, and enforces encryption policies. Built into the platform from day one.', stat: '$5K/yr', statLabel: 'AI-automated compliance' }
      },
      {
        title: 'The Numbers Don\'t Lie',
        subtitle: 'Legacy vs AI-powered healthcare development',
        old: { label: 'Legacy Stack', title: 'The traditional way', text: '12-18 months development. Team of 15+ developers. $300K-$500K budget. Manual everything. High error rates. Slow to adapt.', stat: '18 months', statLabel: 'Time to market' },
        new: { label: 'AI-First Stack', title: 'The new way with Arjun', text: '6-10 weeks to MVP. Team of 3-5. $20K-$50K budget. AI-automated workflows. 95%+ accuracy. Instant scalability.', stat: '8 weeks', statLabel: 'Time to market' }
      },
      {
        type: 'cta',
        title: 'Ready to Transform Healthcare?',
        text: 'Your competitors are already building with AI. Every month you wait on legacy systems costs you patients, revenue, and market position. Let\'s build your AI-powered healthcare platform — fast, compliant, and future-proof.',
      }
    ]
  },
  fintech: {
    title: 'FinTech & Banking',
    icon: 'landmark',
    iconBg: 'rgba(34, 197, 94, 0.1)',
    iconColor: '#4ade80',
    slides: [
      {
        title: 'Banking\'s $200 Billion Legacy Problem',
        subtitle: 'Financial systems built on 40-year-old code',
        old: { label: 'The Old Reality', title: 'COBOL mainframes still running 70% of banking', text: 'Major banks run on code written in the 1970s. A single mainframe change costs $500K+ and takes months of testing. The average bank has 500+ disconnected systems.', stat: '70%', statLabel: 'Banks still on COBOL' },
        new: { label: 'The AI-First Reality', title: 'Cloud-native microservices with AI', text: 'Modern event-driven architecture, real-time processing, AI risk models, and API-first design. Deploy new features in hours, not months.', stat: '100x', statLabel: 'Faster deployment cycles' }
      },
      {
        title: 'Fraud Detection',
        subtitle: 'Catching criminals faster than they move',
        old: { label: 'Legacy Approach', title: 'Rule-based systems with 40% false positives', text: 'Static rules flag legitimate transactions. Customers get blocked, call centers overwhelmed. Real fraud patterns evolve faster than rules can be updated.', stat: '40%', statLabel: 'False positive rate' },
        new: { label: 'AI-Powered', title: 'Real-time ML fraud detection', text: 'AI analyzes 200+ variables per transaction in milliseconds. Learns new fraud patterns automatically. Reduces false positives while catching 99.5% of real fraud.', stat: '3%', statLabel: 'False positive rate with AI' }
      },
      {
        title: 'KYC & Customer Onboarding',
        subtitle: 'From 5 days to 5 minutes',
        old: { label: 'Legacy Approach', title: 'Manual document review, 5-day process', text: 'Customers mail photocopies. Compliance teams manually verify identities. Background checks take days. 60% of applicants abandon the process.', stat: '5 days', statLabel: 'Average onboarding time' },
        new: { label: 'AI-Powered', title: 'AI instant verification', text: 'AI reads IDs via OCR, runs facial recognition, verifies against global databases, and completes AML screening — all in under 5 minutes. Fully automated.', stat: '5 min', statLabel: 'AI-powered onboarding' }
      },
      {
        title: 'Lending & Credit Decisions',
        subtitle: 'Beyond the FICO score',
        old: { label: 'Legacy Approach', title: 'Credit scores and manual underwriting', text: 'Loan decisions based on limited data. Manual underwriting takes 2-4 weeks. 40% of creditworthy applicants rejected by rigid score thresholds.', stat: '4 weeks', statLabel: 'Loan processing time' },
        new: { label: 'AI-Powered', title: 'AI underwriting with alternative data', text: 'AI analyzes bank statements, spending patterns, employment history, and 500+ signals. Instant decisions. 30% more approvals with lower default rates.', stat: '30 sec', statLabel: 'AI decision time' }
      },
      {
        title: 'Regulatory Compliance',
        subtitle: 'The most expensive checkbox in business',
        old: { label: 'Legacy Approach', title: '$100M+ annual compliance costs for banks', text: 'Armies of compliance officers manually reviewing transactions, generating reports, and interpreting new regulations. One fine can cost billions.', stat: '$100M+', statLabel: 'Annual compliance cost' },
        new: { label: 'AI-Powered', title: 'RegTech AI automation', text: 'AI monitors transactions 24/7, auto-generates regulatory reports, interprets new rules, and flags violations before they happen. 80% cost reduction.', stat: '$20M', statLabel: 'With AI RegTech' }
      },
      {
        title: 'Payment Processing',
        subtitle: 'Speed is the new currency',
        old: { label: 'Legacy Approach', title: '3-5 day settlement, high fees', text: 'Cross-border payments route through 5+ intermediary banks. Each takes a cut. Settlement takes days. Tracking is nearly impossible.', stat: '3-5 days', statLabel: 'Cross-border settlement' },
        new: { label: 'AI-Powered', title: 'Instant intelligent payments', text: 'AI-optimized routing finds the fastest, cheapest path. Real-time settlement. Smart currency conversion. Predictive cash flow management.', stat: 'Instant', statLabel: 'AI-routed settlement' }
      },
      {
        title: 'Customer Experience',
        subtitle: 'Beyond the branch visit',
        old: { label: 'Legacy Approach', title: 'Branch-first, form-heavy experiences', text: 'Customers wait in lines, fill paper forms, and get generic product offers. Mobile apps are slow clones of desktop websites.', stat: '45 min', statLabel: 'Average branch visit' },
        new: { label: 'AI-Powered', title: 'AI-first digital banking', text: 'Conversational AI handles 80% of inquiries. Personalized product recommendations. Proactive financial insights. Banking that comes to you.', stat: '2 min', statLabel: 'AI resolves in' }
      },
      {
        title: 'The Transformation Metrics',
        subtitle: 'Legacy banking vs AI-first fintech',
        old: { label: 'Legacy Bank', title: 'The traditional institution', text: '12-24 months for new products. $5M+ per feature. 500+ person IT teams. Months of testing. Customer complaints rising yearly.', stat: '$5M+', statLabel: 'Cost per new feature' },
        new: { label: 'AI-First FinTech', title: 'Built with Arjun', text: '4-8 weeks to market. $30K-$80K per product. Lean AI-augmented team. Continuous deployment. NPS scores 3x higher.', stat: '$40K', statLabel: 'Average feature cost' }
      },
      {
        type: 'cta',
        title: 'Ready to Disrupt Finance?',
        text: 'Neobanks are eating market share because they build 10x faster with AI. Whether you\'re a startup or a legacy institution ready to modernize — I\'ll build your AI-powered fintech platform from the ground up.',
      }
    ]
  },
  legal: {
    title: 'Legal & Compliance',
    icon: 'scale',
    iconBg: 'rgba(234, 179, 8, 0.1)',
    iconColor: '#facc15',
    slides: [
      {
        title: 'Legal Tech is 20 Years Behind',
        subtitle: 'An industry drowning in paper',
        old: { label: 'The Old Reality', title: 'Lawyers billing $400/hr to read documents', text: 'Legal work is 60% document review. Associates spend 10+ hours reading contracts. Research done manually in law libraries. Billing by the hour incentivizes inefficiency.', stat: '$400/hr', statLabel: 'Associate billing rate' },
        new: { label: 'The AI-First Reality', title: 'AI reads 1000 documents in minutes', text: 'AI-powered contract analysis, automated legal research, intelligent document generation, and predictive case outcomes. Same quality, 90% less time.', stat: '10 min', statLabel: 'AI reviews 1000 docs' }
      },
      {
        title: 'Contract Review & Analysis',
        subtitle: 'Finding the needle in the haystack',
        old: { label: 'Legacy Approach', title: 'Manual review at $300-500/hr', text: 'Junior associates read every clause line by line. Miss critical terms under fatigue. A single M&A deal requires reviewing 10,000+ documents.', stat: '6 weeks', statLabel: 'Due diligence timeline' },
        new: { label: 'AI-Powered', title: 'AI contract intelligence', text: 'AI extracts key terms, flags unusual clauses, compares against standards, and highlights risks — across 10,000 documents in hours. Never misses a clause.', stat: '2 days', statLabel: 'AI-powered due diligence' }
      },
      {
        title: 'Legal Research',
        subtitle: 'From law libraries to AI assistants',
        old: { label: 'Legacy Approach', title: 'Hours in Westlaw and LexisNexis', text: 'Paralegals spend 8+ hours searching case law databases. Results depend on search skill. Critical precedents frequently missed.', stat: '8+ hrs', statLabel: 'Per research task' },
        new: { label: 'AI-Powered', title: 'AI legal research assistant', text: 'AI understands legal context, finds relevant case law, summarizes precedents, and drafts research memos. Cites sources automatically. Learns from feedback.', stat: '15 min', statLabel: 'Comprehensive research' }
      },
      {
        title: 'Document Generation',
        subtitle: 'Stop copy-pasting templates',
        old: { label: 'Legacy Approach', title: 'Word templates with manual filling', text: 'Lawyers copy old documents, manually update fields, forget to change client names. Version control chaos. One typo can invalidate a contract.', stat: '4 hrs', statLabel: 'Per document draft' },
        new: { label: 'AI-Powered', title: 'AI document generation', text: 'AI generates customized legal documents from templates, auto-fills client data, ensures consistency, and validates against current regulations.', stat: '10 min', statLabel: 'AI generates & validates' }
      },
      {
        title: 'Compliance Monitoring',
        subtitle: 'Regulations change daily',
        old: { label: 'Legacy Approach', title: 'Manual regulatory tracking', text: 'Compliance teams manually track regulatory changes across jurisdictions. Updates communicated via email. Policies updated quarterly at best.', stat: 'Quarterly', statLabel: 'Policy update cycle' },
        new: { label: 'AI-Powered', title: 'Real-time compliance AI', text: 'AI monitors regulatory feeds 24/7, identifies relevant changes, maps impact to existing policies, and drafts updated procedures automatically.', stat: 'Real-time', statLabel: 'Continuous monitoring' }
      },
      {
        title: 'Case Prediction & Strategy',
        subtitle: 'Data-driven litigation',
        old: { label: 'Legacy Approach', title: 'Gut instinct and experience', text: 'Case strategy based on partner experience. No data on judge tendencies, opposing counsel patterns, or settlement probability. Clients take blind risks.', stat: 'Guesswork', statLabel: 'Success probability' },
        new: { label: 'AI-Powered', title: 'Predictive case analytics', text: 'AI analyzes historical case data, judge ruling patterns, similar case outcomes, and settlement ranges. Provides data-driven strategy recommendations.', stat: '87%', statLabel: 'Prediction accuracy' }
      },
      {
        title: 'Client Communication',
        subtitle: 'No more chasing for updates',
        old: { label: 'Legacy Approach', title: 'Email chains and phone tag', text: 'Clients call asking for updates. Lawyers forget to respond. Case status trapped in individual inboxes. No transparency or self-service.', stat: '3 days', statLabel: 'Average response time' },
        new: { label: 'AI-Powered', title: 'AI client portal', text: 'Clients get real-time case tracking, AI-generated status updates, secure document sharing, and an AI chatbot for common questions 24/7.', stat: 'Instant', statLabel: 'Self-service access' }
      },
      {
        title: 'The Business Impact',
        subtitle: 'Traditional law firm vs AI-powered practice',
        old: { label: 'Traditional Firm', title: 'The billable hour model', text: '80% of revenue from manual work. High associate burnout. Clients increasingly price-sensitive. Losing business to legal tech startups.', stat: '2,000 hrs', statLabel: 'Billable hours per associate' },
        new: { label: 'AI-First Practice', title: 'Built with Arjun', text: 'AI handles 70% of routine work. Lawyers focus on strategy. Fixed-fee pricing becomes profitable. Serve 5x more clients with the same team.', stat: '5x', statLabel: 'More clients served' }
      },
      {
        type: 'cta',
        title: 'Ready to Modernize Legal?',
        text: 'AI is not replacing lawyers — it\'s making them superhuman. Build your AI-powered legal platform and serve more clients, win more cases, and spend time on what matters: strategy and advocacy.',
      }
    ]
  },
  ecommerce: {
    title: 'E-Commerce & Retail',
    icon: 'shopping-cart',
    iconBg: 'rgba(59, 130, 246, 0.1)',
    iconColor: '#60a5fa',
    slides: [
      {
        title: 'Retail\'s AI Revolution',
        subtitle: 'Generic storefronts are dead',
        old: { label: 'The Old Reality', title: 'One-size-fits-all online stores', text: 'Cookie-cutter Shopify templates. Same product recommendations for everyone. Manual inventory management. Marketing based on gut feeling.', stat: '2.5%', statLabel: 'Average conversion rate' },
        new: { label: 'The AI-First Reality', title: 'Hyper-personalized shopping AI', text: 'Every visitor sees a personalized store. AI predicts what they want before they search. Dynamic pricing, smart inventory, and automated marketing.', stat: '8%+', statLabel: 'AI-optimized conversion' }
      },
      {
        title: 'Product Discovery',
        subtitle: 'When search bars fail shoppers',
        old: { label: 'Legacy Approach', title: 'Keyword search and category browsing', text: 'Customers type exact product names. Search returns irrelevant results. 72% of shoppers leave if they can\'t find what they want in 3 clicks.', stat: '72%', statLabel: 'Abandon after poor search' },
        new: { label: 'AI-Powered', title: 'Visual & conversational search', text: 'Upload a photo and find similar products. Ask in natural language: "red dress for summer wedding under $200." AI understands intent, not just keywords.', stat: '35%', statLabel: 'Higher product discovery' }
      },
      {
        title: 'Inventory & Supply Chain',
        subtitle: 'The hidden profit killer',
        old: { label: 'Legacy Approach', title: 'Manual forecasting, gut-based ordering', text: 'Buyers guess demand based on last year. Overstock costs millions in markdowns. Stockouts lose sales. Excel spreadsheets everywhere.', stat: '25%', statLabel: 'Overstock/stockout losses' },
        new: { label: 'AI-Powered', title: 'Predictive inventory AI', text: 'AI forecasts demand by SKU using weather, trends, events, and social media signals. Auto-reorders at optimal quantities. Reduces waste by 60%.', stat: '5%', statLabel: 'AI-optimized waste' }
      },
      {
        title: 'Customer Service',
        subtitle: '24/7 support without the headcount',
        old: { label: 'Legacy Approach', title: 'Call centers and email tickets', text: '45-minute average wait times. Agents handle 20 tickets/day. "Your call is important to us" while customers switch to competitors.', stat: '45 min', statLabel: 'Average wait time' },
        new: { label: 'AI-Powered', title: 'AI customer service agent', text: 'AI resolves 80% of inquiries instantly — order tracking, returns, sizing help, product questions. Seamless handoff to humans for complex issues.', stat: '< 1 min', statLabel: 'AI response time' }
      },
      {
        title: 'Marketing & Personalization',
        subtitle: 'From spray-and-pray to precision',
        old: { label: 'Legacy Approach', title: 'Batch emails and generic ads', text: 'Same promotional email to entire list. 2% open rate. Ad spend based on broad demographics. No attribution. "Half my ad budget is wasted, I just don\'t know which half."', stat: '2%', statLabel: 'Email conversion rate' },
        new: { label: 'AI-Powered', title: 'AI-driven marketing engine', text: 'AI segments customers into micro-cohorts. Personalizes email content, timing, and channel per user. Optimizes ad spend in real-time. Predictive LTV scoring.', stat: '12%', statLabel: 'AI-personalized conversion' }
      },
      {
        title: 'Pricing Strategy',
        subtitle: 'The science of the right price',
        old: { label: 'Legacy Approach', title: 'Fixed pricing, manual markdowns', text: 'Set price once, markdown when it doesn\'t sell. Competitors undercut you before you notice. Leaving money on the table every single day.', stat: 'Static', statLabel: 'Price updates' },
        new: { label: 'AI-Powered', title: 'Dynamic AI pricing', text: 'AI adjusts prices based on demand, competition, inventory levels, time of day, and customer willingness to pay. Maximizes margin on every transaction.', stat: '15%', statLabel: 'Revenue increase' }
      },
      {
        title: 'Returns & Fraud Prevention',
        subtitle: 'Protecting your margins',
        old: { label: 'Legacy Approach', title: '30% return rate, wardrobing fraud', text: 'Generous return policies abused. Serial returners cost thousands. Manual review catches only obvious fraud. Returns eat 10% of revenue.', stat: '30%', statLabel: 'Average return rate' },
        new: { label: 'AI-Powered', title: 'AI return prediction & prevention', text: 'AI predicts return likelihood before purchase. Better size recommendations reduce fit-related returns. Identifies fraud patterns. Saves millions annually.', stat: '18%', statLabel: 'Return rate with AI' }
      },
      {
        title: 'The Bottom Line',
        subtitle: 'Traditional e-commerce vs AI-first platform',
        old: { label: 'Traditional Store', title: 'Generic Shopify + plugins', text: 'Template site, manual operations, generic marketing, reactive inventory. Competing on price alone. Margins shrinking every year.', stat: '3%', statLabel: 'Net margin' },
        new: { label: 'AI-First Platform', title: 'Built with Arjun', text: 'Custom AI-powered platform. Personalized everything. Predictive operations. Automated marketing. Competing on experience and intelligence.', stat: '12%', statLabel: 'AI-optimized net margin' }
      },
      {
        type: 'cta',
        title: 'Ready to Dominate E-Commerce?',
        text: 'Amazon and Shopify use AI everywhere. Your customers expect the same intelligence. Let me build your AI-powered commerce platform that converts, retains, and grows — automatically.',
      }
    ]
  },
  education: {
    title: 'Education & EdTech',
    icon: 'graduation-cap',
    iconBg: 'rgba(168, 85, 247, 0.1)',
    iconColor: '#c084fc',
    slides: [
      {
        title: 'Education\'s One-Size-Fits-All Crisis',
        subtitle: 'Teaching methods haven\'t changed in 100 years',
        old: { label: 'The Old Reality', title: 'Static curricula, passive lectures', text: 'Same textbook for every student. Lectures at one pace. Teachers discover learning gaps only at exam time. 40% of students fall behind silently.', stat: '40%', statLabel: 'Students falling behind' },
        new: { label: 'The AI-First Reality', title: 'Adaptive AI learning paths', text: 'AI creates personalized curricula for each student. Identifies knowledge gaps in real-time. Adjusts difficulty dynamically. Every student gets a private tutor.', stat: '95%', statLabel: 'Students on track with AI' }
      },
      {
        title: 'Content Creation',
        subtitle: 'Teachers aren\'t content factories',
        old: { label: 'Legacy Approach', title: 'Manual lesson planning, 15 hrs/week', text: 'Teachers spend 15+ hours weekly creating materials, worksheets, and presentations. Rarely personalized. Most resources are 5+ years outdated.', stat: '15 hrs/wk', statLabel: 'On content creation' },
        new: { label: 'AI-Powered', title: 'AI course generator', text: 'AI generates lesson plans, quizzes, interactive exercises, and video scripts from learning objectives. Teachers curate and customize, not create from scratch.', stat: '2 hrs/wk', statLabel: 'With AI assistance' }
      },
      {
        title: 'Assessment & Grading',
        subtitle: 'The 200-essay weekend nightmare',
        old: { label: 'Legacy Approach', title: 'Manual grading, 2-week turnaround', text: 'Teachers grade 200+ papers per assignment. Subjective scoring. Students get feedback too late to improve. Standardized tests measure memorization, not understanding.', stat: '2 weeks', statLabel: 'Feedback turnaround' },
        new: { label: 'AI-Powered', title: 'AI-powered assessment', text: 'AI grades essays with rubric consistency, provides instant personalized feedback, identifies conceptual misunderstandings, and suggests targeted practice.', stat: 'Instant', statLabel: 'AI feedback delivery' }
      },
      {
        title: 'Student Engagement',
        subtitle: 'Competing with TikTok for attention',
        old: { label: 'Legacy Approach', title: 'Passive videos and PDF readings', text: 'Students watch recorded lectures at 2x speed. Engagement drops after 6 minutes. Discussion forums are ghost towns. Completion rates below 10% for online courses.', stat: '8%', statLabel: 'MOOC completion rate' },
        new: { label: 'AI-Powered', title: 'Gamified AI learning', text: 'Interactive simulations, AI-generated practice scenarios, adaptive challenges, peer competitions, and real-time progress streaks. Learning feels like gaming.', stat: '72%', statLabel: 'Completion with AI gamification' }
      },
      {
        title: 'Language Learning',
        subtitle: 'Beyond flashcards and grammar drills',
        old: { label: 'Legacy Approach', title: 'Textbook exercises, no conversation', text: 'Students memorize vocabulary lists and grammar rules. No speaking practice. Travel abroad as the only way to become fluent. 95% never reach conversational level.', stat: '5%', statLabel: 'Reach fluency traditionally' },
        new: { label: 'AI-Powered', title: 'AI conversation partner', text: 'AI provides unlimited speaking practice with real-time pronunciation feedback. Adapts to student level. Simulates real-world scenarios. Available 24/7.', stat: '40%', statLabel: 'Reach fluency with AI' }
      },
      {
        title: 'Early Intervention',
        subtitle: 'Catching struggles before they become failures',
        old: { label: 'Legacy Approach', title: 'Report cards every 3 months', text: 'Parents and teachers discover problems at report card time. By then, students are months behind. Tutoring arranged too late. Confidence already damaged.', stat: '3 months', statLabel: 'To identify at-risk students' },
        new: { label: 'AI-Powered', title: 'Predictive student analytics', text: 'AI tracks engagement, performance patterns, and behavioral signals daily. Alerts teachers and parents within days of emerging struggles. Recommends interventions.', stat: '48 hrs', statLabel: 'AI early warning system' }
      },
      {
        title: 'Platform Economics',
        subtitle: 'Building EdTech that scales',
        old: { label: 'Traditional EdTech', title: 'Content-heavy, tech-light platforms', text: '$2M+ to build a course platform. Manual content management. No personalization. High instructor costs. Revenue limited by instructor availability.', stat: '$2M+', statLabel: 'Platform development cost' },
        new: { label: 'AI-First EdTech', title: 'Built with Arjun', text: 'AI-powered platform in 6-8 weeks. Auto-generates content. Personalizes for each learner. Scales infinitely. One instructor can serve 100K students.', stat: '$35K', statLabel: 'AI platform cost' }
      },
      {
        type: 'cta',
        title: 'Ready to Reinvent Learning?',
        text: 'Duolingo and Khan Academy proved AI transforms education. Whether you\'re building a corporate training platform or the next EdTech unicorn — I\'ll build the AI that makes learning personal, engaging, and effective.',
      }
    ]
  },
  realestate: {
    title: 'Real Estate & PropTech',
    icon: 'building-2',
    iconBg: 'rgba(249, 115, 22, 0.1)',
    iconColor: '#fb923c',
    slides: [
      {
        title: 'Real Estate\'s Digital Lag',
        subtitle: 'A trillion-dollar industry running on spreadsheets',
        old: { label: 'The Old Reality', title: 'Manual listings, phone-based selling', text: 'Agents spend 80% of time on admin, not selling. Listings updated manually across 10+ portals. Property valuations based on "comparable sales" and gut feel.', stat: '80%', statLabel: 'Time on admin tasks' },
        new: { label: 'The AI-First Reality', title: 'AI-automated real estate operations', text: 'AI handles listings, lead scoring, valuations, and scheduling. Agents focus 100% on client relationships. Virtual tours replace 80% of physical showings.', stat: '20%', statLabel: 'Time on admin with AI' }
      },
      {
        title: 'Property Valuation',
        subtitle: 'From guesswork to precision',
        old: { label: 'Legacy Approach', title: 'Manual CMAs, appraiser visits', text: 'Agents pull 3-5 comparable sales, adjust mentally. Appraisers charge $500 per visit. Valuations vary 15-20% between professionals. Takes 1-2 weeks.', stat: '±20%', statLabel: 'Valuation accuracy range' },
        new: { label: 'AI-Powered', title: 'AI property valuation engine', text: 'AI analyzes 500+ data points: recent sales, market trends, neighborhood metrics, school ratings, crime data, renovation potential. Instant, consistent results.', stat: '±3%', statLabel: 'AI valuation accuracy' }
      },
      {
        title: 'Lead Generation & Nurturing',
        subtitle: 'Turning browsers into buyers',
        old: { label: 'Legacy Approach', title: 'Cold calls and bought lead lists', text: 'Agents buy leads at $20-50 each with 2% conversion. Manual follow-up via spreadsheet. Most leads go cold within 48 hours of first contact.', stat: '2%', statLabel: 'Lead conversion rate' },
        new: { label: 'AI-Powered', title: 'AI lead scoring & nurturing', text: 'AI scores leads by intent signals (search behavior, property views, financial readiness). Automated personalized follow-ups. Predicts when buyers are ready to move.', stat: '12%', statLabel: 'AI-qualified conversion' }
      },
      {
        title: 'Virtual Tours & Visualization',
        subtitle: 'Selling homes without stepping inside',
        old: { label: 'Legacy Approach', title: 'In-person showings only', text: 'Agents drive buyers to 10+ properties over weekends. Empty homes hard to envision furnished. Out-of-town buyers can\'t participate. Each showing costs time and gas.', stat: '10+', statLabel: 'Showings before offer' },
        new: { label: 'AI-Powered', title: 'AI virtual staging & 3D tours', text: 'AI generates furnished views of empty rooms in any style. 3D walkthrough tours from photos. Virtual renovations showing potential. Narrow to 2-3 must-see properties.', stat: '3', statLabel: 'In-person showings needed' }
      },
      {
        title: 'Document & Transaction Management',
        subtitle: 'Drowning in paperwork',
        old: { label: 'Legacy Approach', title: 'Paper contracts, fax machines still exist', text: 'Purchase agreements, disclosures, inspection reports — 50+ documents per transaction. Manual data entry. Signatures via DocuSign at best. Errors delay closings.', stat: '50+', statLabel: 'Documents per deal' },
        new: { label: 'AI-Powered', title: 'AI transaction coordinator', text: 'AI auto-fills documents from deal data, tracks deadlines, flags missing items, coordinates between all parties, and predicts potential delays before they happen.', stat: '90%', statLabel: 'Auto-completed by AI' }
      },
      {
        title: 'Market Analytics',
        subtitle: 'See the future of neighborhoods',
        old: { label: 'Legacy Approach', title: 'Monthly MLS reports, lagging data', text: 'Market data is 30-60 days old. Neighborhood trends based on anecdotes. No way to predict emerging hot markets. Investors make decisions on stale information.', stat: '60 days', statLabel: 'Data lag' },
        new: { label: 'AI-Powered', title: 'Predictive market intelligence', text: 'AI analyzes real-time data: permit filings, business openings, demographic shifts, infrastructure plans. Predicts neighborhood appreciation 2-3 years ahead.', stat: 'Real-time', statLabel: 'AI market intelligence' }
      },
      {
        title: 'Property Management',
        subtitle: 'From reactive to proactive',
        old: { label: 'Legacy Approach', title: 'Tenant calls and emergency repairs', text: 'Property managers react to complaints. Maintenance scheduled after failures. Tenant screening based on credit checks alone. Vacancy costs $2,000+/month.', stat: '8%', statLabel: 'Average vacancy rate' },
        new: { label: 'AI-Powered', title: 'AI property management', text: 'AI predicts maintenance needs before failures. Screens tenants with behavioral analysis. Dynamic rent pricing. Automated lease renewals and communication.', stat: '3%', statLabel: 'AI-optimized vacancy' }
      },
      {
        title: 'The ROI Comparison',
        subtitle: 'Traditional brokerage vs AI-powered operation',
        old: { label: 'Traditional Brokerage', title: 'Manual operations at scale', text: 'Agent handles 8-12 deals/year. $15K marketing budget per listing. 70% of time on non-selling activities. Revenue capped by agent hours.', stat: '10', statLabel: 'Deals per agent/year' },
        new: { label: 'AI-First Brokerage', title: 'Built with Arjun', text: 'AI multiplies each agent to handle 25+ deals. Marketing automated and personalized. Admin eliminated. Revenue per agent triples.', stat: '25+', statLabel: 'Deals per AI-augmented agent' }
      },
      {
        type: 'cta',
        title: 'Ready to Transform Real Estate?',
        text: 'Zillow, Redfin, and Compass are AI companies that happen to sell houses. Your brokerage needs the same intelligence. Let me build your AI-powered real estate platform that sells faster, smarter, and cheaper.',
      }
    ]
  }
};

let modalAnimationFrame = null;

function openUseCaseModal(sector) {
  const data = useCaseData[sector];
  if (!data) return;

  currentSectorKey = sector;
  currentSlides = data.slides;
  currentSlideIndex = 0;

  // Set modal header
  document.getElementById('modal-title').textContent = data.title;
  const iconEl = document.getElementById('modal-icon');
  iconEl.style.background = data.iconBg;
  iconEl.innerHTML = `<i data-lucide="${data.icon}" class="w-5 h-5" style="color:${data.iconColor}"></i>`;

  // Build dots
  const dotsEl = document.getElementById('slide-dots');
  dotsEl.innerHTML = currentSlides.map((_, i) =>
    `<div class="slide-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></div>`
  ).join('');

  // Show modal
  const modal = document.getElementById('usecase-modal');
  modal.classList.remove('hidden');
  // Force reflow for animation
  modal.offsetHeight;
  modal.classList.add('active');

  document.body.style.overflow = 'hidden';

  renderSlide(0);
  lucide.createIcons();

  // Keyboard listener
  document.addEventListener('keydown', handleModalKeys);
}

function closeUseCaseModal() {
  const modal = document.getElementById('usecase-modal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 300);
  document.removeEventListener('keydown', handleModalKeys);
}

function handleModalKeys(e) {
  if (e.key === 'Escape') closeUseCaseModal();
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
}

function renderSlide(index) {
  const slide = currentSlides[index];
  const container = document.getElementById('slide-content');
  const counter = document.getElementById('slide-counter');
  const progress = document.getElementById('slide-progress');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  counter.textContent = `${index + 1} / ${currentSlides.length}`;
  progress.style.width = `${((index + 1) / currentSlides.length) * 100}%`;

  prevBtn.disabled = index === 0;
  prevBtn.style.opacity = index === 0 ? '0.3' : '1';

  // Update next button for last slide
  if (index === currentSlides.length - 1) {
    nextBtn.innerHTML = `<i data-lucide="message-circle" class="w-4 h-4"></i> Let's Talk`;
    nextBtn.onclick = () => { closeUseCaseModal(); window.open('https://wa.me/919999999999?text=Hi%20Arjun%2C%20I%20want%20to%20discuss%20AI%20transformation%20for%20my%20business', '_blank'); };
  } else {
    nextBtn.innerHTML = `Next <i data-lucide="chevron-right" class="w-4 h-4"></i>`;
    nextBtn.onclick = nextSlide;
  }

  // Update dots
  document.querySelectorAll('.slide-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  // Render slide content with animation
  container.classList.add('slide-fade-enter');
  container.classList.remove('slide-fade-active');

  let html = '';

  if (slide.type === 'cta') {
    html = `
      <div class="slide-cta">
        <div style="margin-bottom:1.5rem">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium">
            <i data-lucide="rocket" class="w-4 h-4"></i>
            Ready for Transformation?
          </div>
        </div>
        <h3 class="text-gradient">${slide.title}</h3>
        <p>${slide.text}</p>
        <a href="https://wa.me/919999999999?text=Hi%20Arjun%2C%20I%20want%20to%20discuss%20AI%20transformation%20for%20my%20${encodeURIComponent(useCaseData[currentSectorKey].title)}%20business" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-2xl font-bold transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-1" style="position:relative">
          <i data-lucide="message-circle" class="w-5 h-5"></i>
          Start Your Transformation
        </a>
      </div>`;
  } else {
    html = `
      <div class="slide-title">${slide.title}</div>
      <div class="slide-subtitle">${slide.subtitle}</div>

      <div class="vs-divider">
        <div class="vs-line vs-line-red"></div>
        <div class="vs-badge">VS</div>
        <div class="vs-line vs-line-green"></div>
      </div>

      <div class="comparison-grid">
        <div class="old-way">
          <div class="old-way-label">
            <i data-lucide="x-circle" class="w-3 h-3"></i>
            ${slide.old.label}
          </div>
          <div class="panel-title">${slide.old.title}</div>
          <div class="panel-text">${slide.old.text}</div>
          <div class="panel-stat">
            <div class="panel-stat-value stat-glow-red" style="color:#f87171">${slide.old.stat}</div>
            <div class="panel-stat-label">${slide.old.statLabel}</div>
          </div>
        </div>
        <div class="new-way">
          <div class="new-way-label">
            <i data-lucide="sparkles" class="w-3 h-3"></i>
            ${slide.new.label}
          </div>
          <div class="panel-title">${slide.new.title}</div>
          <div class="panel-text">${slide.new.text}</div>
          <div class="panel-stat">
            <div class="panel-stat-value stat-glow-green" style="color:#4ade80">${slide.new.stat}</div>
            <div class="panel-stat-label">${slide.new.statLabel}</div>
          </div>
        </div>
      </div>`;
  }

  container.innerHTML = html;

  // Trigger animation
  if (modalAnimationFrame) cancelAnimationFrame(modalAnimationFrame);
  modalAnimationFrame = requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.classList.remove('slide-fade-enter');
      container.classList.add('slide-fade-active');
      lucide.createIcons();
    });
  });
}

function nextSlide() {
  if (currentSlideIndex < currentSlides.length - 1) {
    currentSlideIndex++;
    renderSlide(currentSlideIndex);
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    renderSlide(currentSlideIndex);
  }
}

function goToSlide(index) {
  currentSlideIndex = index;
  renderSlide(currentSlideIndex);
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('usecase-modal');
  if (e.target === modal) closeUseCaseModal();
});

// ═══════════════ SMOOTH SCROLL ═══════════════
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

// ═══════════════ HERO TERMINAL ANIMATION ═══════════════
const terminalScenes = [
  {
    tab: 'ai-agent.ts',
    agent: 'Customer Support Agent',
    speed: '42ms',
    lines: [
      { d: 0,    html: '<span class="t-comment">// Customer query received via WhatsApp</span>' },
      { d: 400,  html: '<span class="t-keyword">const</span> <span class="t-fn">query</span> <span class="t-operator">=</span> <span class="t-string">"I need a refund for order #4821"</span>' },
      { d: 800,  html: '' },
      { d: 1000, html: '<span class="t-comment">// AI Agent processing...</span>' },
      { d: 1400, html: '<span class="t-keyword">await</span> <span class="t-fn">agent</span>.<span class="t-fn">analyze</span>(query)' },
      { d: 1800, html: '<span class="t-dim">├─</span> <span class="t-badge t-badge-blue">INTENT</span> <span class="t-output">refund_request</span> <span class="t-dim">(confidence: 0.97)</span>' },
      { d: 2200, html: '<span class="t-dim">├─</span> <span class="t-badge t-badge-purple">ORDER</span> <span class="t-output">#4821</span> <span class="t-dim">found → $89.99 delivered 3d ago</span>' },
      { d: 2600, html: '<span class="t-dim">├─</span> <span class="t-badge t-badge-green">POLICY</span> <span class="t-success">eligible for refund ✓</span>' },
      { d: 3000, html: '<span class="t-dim">└─</span> <span class="t-badge t-badge-orange">ACTION</span> <span class="t-highlight">auto-processing refund...</span>' },
      { d: 3400, html: '' },
      { d: 3600, html: '<div class="t-progress-bar"><div class="t-progress-fill" style="width:100%"></div></div>' },
      { d: 4000, html: '<span class="t-success">✓ Refund of $89.99 processed</span>' },
      { d: 4300, html: '<span class="t-success">✓ Customer notified via WhatsApp</span>' },
      { d: 4600, html: '<span class="t-dim">  Total time: </span><span class="t-number">3.2s</span> <span class="t-dim">(vs 24hrs manual)</span>' },
    ]
  },
  {
    tab: 'legacy-transform.sh',
    agent: 'Migration Engine',
    speed: '128ms',
    lines: [
      { d: 0,    html: '<span class="t-prompt">$</span> <span class="t-fn">arjun</span> transform <span class="t-string">--from</span> legacy-crm <span class="t-string">--to</span> ai-platform' },
      { d: 600,  html: '' },
      { d: 800,  html: '<span class="t-output">⚡ Scanning legacy codebase...</span>' },
      { d: 1200, html: '<span class="t-dim">   Found:</span> <span class="t-number">247</span> <span class="t-dim">endpoints,</span> <span class="t-number">89</span> <span class="t-dim">tables,</span> <span class="t-number">12</span> <span class="t-dim">services</span>' },
      { d: 1600, html: '<span class="t-error">   ⚠ 34 deprecated APIs detected</span>' },
      { d: 2000, html: '<span class="t-error">   ⚠ 0% test coverage</span>' },
      { d: 2400, html: '' },
      { d: 2600, html: '<span class="t-output">🔄 Generating AI-powered replacement...</span>' },
      { d: 3000, html: '<span class="t-dim">├─</span> <span class="t-success">✓</span> REST → GraphQL + AI routing' },
      { d: 3400, html: '<span class="t-dim">├─</span> <span class="t-success">✓</span> Manual workflows → AI automation' },
      { d: 3800, html: '<span class="t-dim">├─</span> <span class="t-success">✓</span> Static reports → Real-time AI insights' },
      { d: 4200, html: '<span class="t-dim">└─</span> <span class="t-success">✓</span> Test suite auto-generated (94% coverage)' },
      { d: 4600, html: '' },
      { d: 4800, html: '<span class="t-success">✅ Migration complete!</span> <span class="t-dim">Cost reduced by</span> <span class="t-number">70%</span>' },
    ]
  },
  {
    tab: 'deploy-agent.yml',
    agent: 'CI/CD Pipeline',
    speed: '67ms',
    lines: [
      { d: 0,    html: '<span class="t-comment"># AI-powered deployment pipeline</span>' },
      { d: 400,  html: '<span class="t-keyword">deploy</span><span class="t-operator">:</span>' },
      { d: 600,  html: '  <span class="t-keyword">ai_review</span><span class="t-operator">:</span> <span class="t-string">true</span>  <span class="t-comment"># AI reviews code before deploy</span>' },
      { d: 1000, html: '' },
      { d: 1200, html: '<span class="t-output">▶ Pipeline triggered...</span>' },
      { d: 1600, html: '<span class="t-dim">├─</span> <span class="t-badge t-badge-blue">BUILD</span> <span class="t-success">compiled in 12s ✓</span>' },
      { d: 2000, html: '<span class="t-dim">├─</span> <span class="t-badge t-badge-purple">AI REVIEW</span> <span class="t-output">scanning for vulnerabilities...</span>' },
      { d: 2400, html: '<span class="t-dim">│  </span><span class="t-success">  0 critical, 0 high, 2 info</span>' },
      { d: 2800, html: '<span class="t-dim">├─</span> <span class="t-badge t-badge-green">TESTS</span> <span class="t-success">247/247 passed ✓</span>' },
      { d: 3200, html: '<span class="t-dim">├─</span> <span class="t-badge t-badge-orange">PERF</span> <span class="t-output">Lighthouse: </span><span class="t-number">98</span><span class="t-dim">/100</span>' },
      { d: 3600, html: '<span class="t-dim">└─</span> <span class="t-badge t-badge-green">DEPLOY</span> <span class="t-success">production live ✓</span>' },
      { d: 4000, html: '' },
      { d: 4200, html: '<span class="t-success">🚀 Deployed to</span> <span class="t-output">app.client.com</span>' },
      { d: 4500, html: '<span class="t-dim">   Zero downtime. AI-monitored. Auto-scaling.</span>' },
    ]
  },
  {
    tab: 'integrate.ts',
    agent: 'Integration Hub',
    speed: '38ms',
    lines: [
      { d: 0,    html: '<span class="t-comment">// Connecting 5 systems in one API call</span>' },
      { d: 500,  html: '<span class="t-keyword">const</span> <span class="t-fn">hub</span> <span class="t-operator">=</span> <span class="t-keyword">new</span> <span class="t-fn">AIIntegrationHub</span>()' },
      { d: 900,  html: '' },
      { d: 1100, html: '<span class="t-keyword">await</span> <span class="t-fn">hub</span>.<span class="t-fn">connect</span>([' },
      { d: 1400, html: '  <span class="t-string">"Salesforce CRM"</span>,     <span class="t-comment">// Customer data</span>' },
      { d: 1700, html: '  <span class="t-string">"Stripe Billing"</span>,     <span class="t-comment">// Payments</span>' },
      { d: 2000, html: '  <span class="t-string">"Twilio SMS"</span>,         <span class="t-comment">// Notifications</span>' },
      { d: 2300, html: '  <span class="t-string">"OpenAI GPT-4"</span>,       <span class="t-comment">// AI brain</span>' },
      { d: 2600, html: '  <span class="t-string">"AWS S3"</span>              <span class="t-comment">// Storage</span>' },
      { d: 2900, html: '])' },
      { d: 3200, html: '' },
      { d: 3400, html: '<span class="t-output">✓ All systems connected</span> <span class="t-dim">in</span> <span class="t-number">1.4s</span>' },
      { d: 3700, html: '<span class="t-output">✓ AI orchestration active</span> <span class="t-dim">— smart routing enabled</span>' },
      { d: 4000, html: '<span class="t-success">✓ Zero-code integration dashboard ready</span>' },
    ]
  },
  {
    tab: 'savings.log',
    agent: 'Cost Analyzer',
    speed: '15ms',
    lines: [
      { d: 0,    html: '<span class="t-comment">// Project cost comparison report</span>' },
      { d: 500,  html: '<span class="t-output">━━━ BEFORE (Legacy Approach) ━━━</span>' },
      { d: 800,  html: '<span class="t-dim">  Team size:</span>      <span class="t-error">15 developers</span>' },
      { d: 1100, html: '<span class="t-dim">  Timeline:</span>       <span class="t-error">12 months</span>' },
      { d: 1400, html: '<span class="t-dim">  Total cost:</span>     <span class="t-error">$480,000</span>' },
      { d: 1700, html: '<span class="t-dim">  Maintenance:</span>    <span class="t-error">$15K/month</span>' },
      { d: 2100, html: '' },
      { d: 2300, html: '<span class="t-output">━━━ AFTER (AI-First with Arjun) ━━━</span>' },
      { d: 2600, html: '<span class="t-dim">  Team size:</span>      <span class="t-success">3 developers + AI</span>' },
      { d: 2900, html: '<span class="t-dim">  Timeline:</span>       <span class="t-success">8 weeks</span>' },
      { d: 3200, html: '<span class="t-dim">  Total cost:</span>     <span class="t-success">$35,000</span>' },
      { d: 3500, html: '<span class="t-dim">  Maintenance:</span>    <span class="t-success">$2K/month (AI-managed)</span>' },
      { d: 3900, html: '' },
      { d: 4100, html: '<span class="t-highlight">💰 You save: $445,000 + 10 months</span>' },
      { d: 4400, html: '<span class="t-success">   That\'s a 93% cost reduction.</span>' },
    ]
  }
];

let currentScene = 0;
let sceneTimeouts = [];
let sceneInterval = null;

function initHeroTerminal() {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  playScene(0);

  // Auto-cycle scenes every 8 seconds
  sceneInterval = setInterval(() => {
    currentScene = (currentScene + 1) % terminalScenes.length;
    playScene(currentScene);
  }, 8000);

  // Click on scene dots
  document.querySelectorAll('.terminal-scene-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.scene);
      currentScene = idx;
      playScene(idx);
      clearInterval(sceneInterval);
      sceneInterval = setInterval(() => {
        currentScene = (currentScene + 1) % terminalScenes.length;
        playScene(currentScene);
      }, 8000);
    });
  });
}

function playScene(index) {
  const scene = terminalScenes[index];
  const body = document.getElementById('terminal-body');
  const tabLabel = document.getElementById('terminal-tab-label');
  const agentLabel = document.getElementById('terminal-agent-label');
  const speedLabel = document.getElementById('terminal-speed');

  // Clear previous
  sceneTimeouts.forEach(t => clearTimeout(t));
  sceneTimeouts = [];
  body.innerHTML = '';

  // Update header/footer
  if (tabLabel) tabLabel.querySelector('span').textContent = scene.tab;
  if (agentLabel) agentLabel.textContent = scene.agent;
  if (speedLabel) speedLabel.textContent = scene.speed;

  // Update dots
  document.querySelectorAll('.terminal-scene-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  // Render lines with delays
  scene.lines.forEach((line, i) => {
    const t = setTimeout(() => {
      const div = document.createElement('div');
      div.className = 't-line';
      div.style.animationDelay = '0s';
      div.innerHTML = line.html || '&nbsp;';
      body.appendChild(div);
      // Auto-scroll to bottom
      body.scrollTop = body.scrollHeight;
    }, line.d);
    sceneTimeouts.push(t);
  });
}
