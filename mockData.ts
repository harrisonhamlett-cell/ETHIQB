/**
 * EthIQ Data Models with Company Relationship Access Control
 * 
 * ACCESS CONTROL RULES:
 * 1. Directory: Shows advisors who DON'T have the company in company_relationships (available for initial contact)
 * 2. Contacts: Stored with company_relationship field to track which company sent the contact
 * 3. Handshakes: Can only be proposed to advisors who have the company in company_relationships AND have accepted contact
 * 4. Nudges: Can only be sent to advisors with an Active handshake matching company_relationship
 * 5. Multi-tenant: Advisors can have multiple companies in company_relationships array
 */

export interface Advisor {
  id: string;
  name: string;
  email: string;
  role: string;
  executive_type: 
    | 'Current Executive - Public Company'
    | 'Former Executive - Public Company'
    | 'Current Executive - Private Company'
    | 'Former Executive - Private Company'
    | 'Founder or CEO'
    | 'Consultant'
    | 'Venture Capitalist';
  years_experience: number;
  interests: string[];
  special_domains: string[];
  bio?: string;
  open_to_new_advisory_boards: boolean;
  profile_photo_url?: string;
  company_relationships?: string[]; // NEW: Array of company names this advisor is connected to
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  stage: string;
  description: string;
  tagline: string;
  logo_url?: string;
  advisor_count: number;
  total_nudges_sent: number;
  total_nudges_answered: number;
  typical_nudge_types: string[];
}

export interface Relationship {
  id: string;
  company_id: string;
  advisor_id: string;
  status: 'connected' | 'not_connected';
  created_at: string;
  interaction_count: number;
}

export interface Contact {
  id: string;
  company_id: string;
  advisor_id: string;
  company_relationship: string; // NEW: Company name that sent this contact
  message: string;
  status: 'Sent' | 'Accepted' | 'Declined' | 'Expired' | 'Withdrawn';
  created_at: string;
  responded_at?: string;
  cadence?: string;
  compensation?: string;
  support_type?: string[];
}

export interface Handshake {
  id: string;
  company_id: string;
  advisor_id: string;
  company_relationship: string; // NEW: Company name for this handshake
  title?: string;
  engagement_style: 'Ad hoc' | 'Weekly' | 'Biweekly' | 'Monthly';
  channels: ('Email' | 'Calendar' | 'Slack' | 'Phone')[];
  response_expectation: '24h' | '48h' | '72h' | '1 week';
  capacity_hours_per_month: number;
  focus_areas: string[];
  start_date?: string;
  review_date?: string;
  status: 'Proposed' | 'Active' | 'Dismissed' | 'Paused' | 'Ended';
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface Nudge {
  id: string;
  company_id: string;
  advisor_id: string;
  company_relationship: string; // NEW: Company name for this nudge
  details: string;
  nudge_tag: string;
  max_time_requested: string;
  status: 'Sent' | 'Accepted' | 'Declined' | 'Completed';
  advisor_completed: boolean;
  company_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdvisorApplication {
  id: string;
  name: string;
  email: string;
  role: string;
  executive_type: 
    | 'Current Executive - Public Company'
    | 'Former Executive - Public Company'
    | 'Current Executive - Private Company'
    | 'Former Executive - Private Company'
    | 'Founder or CEO'
    | 'Consultant'
    | 'Venture Capitalist';
  years_experience: number;
  interests: string[];
  special_domains: string[];
  bio: string;
  linkedin_url?: string;
  profile_visibility: boolean; // Whether to appear in directory before approval
  status: 'Pending' | 'Approved' | 'Denied';
  created_at: string;
  updated_at: string;
  reviewed_by?: string; // Admin user ID who reviewed
  reviewed_at?: string;
}

export const fixedInterests = [
  'Thought Leadership (Speaking, Writing, Etc)',
  'Networking & Peer Connections',
  'Volunteer & Non-Profit',
  'Fundraising',
  'Business Planning & Strategy',
];

export const specialDomainsOptions = [
  'Human Resources',
  'Health',
  'Finance',
  'Founding Team',
  'VC / PE',
  'Talent',
  'Climate',
  'Author, Columnist, Writer',
  'Tech, Product',
  'M&A',
  'Non-Profit',
  'Marketing',
];

export const backgroundOptions = [
  'Human Resources',
  'Health',
  'Finance',
  'Founding Team',
  'VC / PE',
  'Talent',
  'Climate',
  'Author, Columnist, Writer',
  'Tech, Product',
  'M&A',
  'Non-Profit',
  'Marketing',
];

export const advisorRoles = [
  'Current Executive – Public Company',
  'Former Executive – Public Company',
  'Current Executive – Private Company',
  'Former Executive – Private Company',
  'Founder or CEO',
  'Consultant',
  'Venture Capitalist',
] as const;

export const nudgeTags = [
  'Feedback Request',
  'Brainstorm',
  'Meeting',
  'Introduction',
  'Review',
  'Advice',
  'Other',
];

export const maxTimeOptions = [
  '15 minutes',
  '30 minutes',
  '45 minutes',
  '1 hour',
  '2 hours',
];

export const expertiseTags = [
  'Finance',
  'Sales',
  'Marketing',
  'Product',
  'Engineering',
  'HR',
  'Legal',
  'Design',
  'Growth Strategy',
  'Operations',
];

export const mockAdvisors: Advisor[] = [
  {
    id: 'adv1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'Former Executive – Public Company',
    executive_type: 'Former Executive - Public Company',
    years_experience: 15,
    interests: ['Business Planning & Strategy', 'Thought Leadership (Speaking, Writing, Etc)'],
    special_domains: ['Finance', 'Founding Team', 'Tech, Product'],
    bio: 'Former CFO at two unicorn startups. Specializes in financial modeling and fundraising strategy.',
    open_to_new_advisory_boards: true,
    profile_photo_url: 'https://example.com/sarah_chen.jpg',
    company_relationships: ['Tech Innovators Inc.'],
  },
  {
    id: 'adv2',
    name: 'Marcus Johnson',
    email: 'marcus.j@example.com',
    role: 'Current Executive – Private Company',
    executive_type: 'Current Executive - Private Company',
    years_experience: 20,
    interests: ['Business Planning & Strategy', 'Networking & Peer Connections'],
    special_domains: ['Marketing', 'Tech, Product'],
    bio: 'Built and scaled GTM teams at Salesforce and Stripe. Expert in enterprise sales motions.',
    open_to_new_advisory_boards: true,
    profile_photo_url: 'https://example.com/marcus_johnson.jpg',
    company_relationships: ['Tech Innovators Inc.'],
  },
  {
    id: 'adv3',
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    role: 'Founder or CEO',
    executive_type: 'Founder or CEO',
    years_experience: 12,
    interests: ['Business Planning & Strategy', 'Thought Leadership (Speaking, Writing, Etc)'],
    special_domains: ['Tech, Product', 'Founding Team'],
    bio: 'Led product at Figma and Linear. Passionate about building intuitive, user-centered products.',
    open_to_new_advisory_boards: true,
    profile_photo_url: 'https://example.com/emily_rodriguez.jpg',
  },
  {
    id: 'adv4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Former Executive – Public Company',
    executive_type: 'Current Executive - Public Company',
    years_experience: 18,
    interests: ['Business Planning & Strategy', 'Networking & Peer Connections'],
    special_domains: ['Tech, Product', 'Founding Team'],
    bio: 'VP Engineering with 15+ years building scalable systems. Former Google and Uber.',
    open_to_new_advisory_boards: true,
    profile_photo_url: 'https://example.com/david_kim.jpg',
  },
  {
    id: 'adv5',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    role: 'Consultant',
    executive_type: 'Consultant',
    years_experience: 10,
    interests: ['Business Planning & Strategy', 'Volunteer & Non-Profit'],
    special_domains: ['Human Resources', 'Talent'],
    bio: 'Built people operations from scratch at fast-growing startups. Expert in scaling teams.',
    open_to_new_advisory_boards: true,
    profile_photo_url: 'https://example.com/priya_sharma.jpg',
    company_relationships: ['Tech Innovators Inc.'], // Has relationship with Tech Innovators Inc.
  },
  {
    id: 'adv6',
    name: 'Alex Martinez',
    email: 'alex.m@example.com',
    role: 'Venture Capitalist',
    executive_type: 'Venture Capitalist',
    years_experience: 8,
    interests: ['Fundraising', 'Networking & Peer Connections'],
    special_domains: ['VC / PE', 'Finance'],
    bio: 'Former General Counsel at B2B tech companies. Specializes in SaaS contracts and compliance.',
    open_to_new_advisory_boards: true,
    profile_photo_url: 'https://example.com/alex_martinez.jpg',
    company_relationships: ['Tech Innovators Inc.'],
  },
  {
    id: 'adv7',
    name: 'Jennifer Wu',
    email: 'jennifer.wu@example.com',
    role: 'Former Executive – Public Company',
    executive_type: 'Former Executive - Public Company',
    years_experience: 14,
    interests: ['Business Planning & Strategy', 'Fundraising'],
    special_domains: ['Marketing', 'Growth Strategy'],
    bio: 'Former CMO at high-growth SaaS companies. Expert in B2B marketing and demand generation.',
    open_to_new_advisory_boards: true,
    profile_photo_url: 'https://example.com/jennifer_wu.jpg',
    // NO company_relationships - available in Directory for Tech Innovators Inc.
  },
];

export const mockCompanies: Company[] = [
  {
    id: 'comp1',
    name: 'Tech Innovators Inc.',
    industry: 'Technology',
    stage: 'Series A',
    description: 'Tech Innovators Inc. is a leading technology company focused on developing innovative software solutions for businesses.',
    tagline: 'Innovate with us!',
    logo_url: 'https://example.com/tech_innovators_logo.png',
    advisor_count: 5,
    total_nudges_sent: 5,
    total_nudges_answered: 3,
    typical_nudge_types: ['Feedback Request', 'Brainstorm', 'Review'],
  },
  {
    id: 'comp2',
    name: 'Healthcare Solutions Ltd.',
    industry: 'Healthcare',
    stage: 'Seed',
    description: 'Healthcare Solutions Ltd. is a healthcare startup dedicated to improving patient outcomes through advanced medical technologies.',
    tagline: 'Healthcare for the future!',
    logo_url: 'https://example.com/healthcare_solutions_logo.png',
    advisor_count: 3,
    total_nudges_sent: 2,
    total_nudges_answered: 1,
    typical_nudge_types: ['Feedback Request', 'Brainstorm'],
  },
  {
    id: 'comp3',
    name: 'Green Energy Corp.',
    industry: 'Energy',
    stage: 'Series B',
    description: 'Green Energy Corp. is a renewable energy company committed to sustainable solutions for a greener future.',
    tagline: 'Powering the future!',
    logo_url: 'https://example.com/green_energy_logo.png',
    advisor_count: 4,
    total_nudges_sent: 4,
    total_nudges_answered: 2,
    typical_nudge_types: ['Feedback Request', 'Review'],
  },
];

export const mockRelationships: Relationship[] = [
  {
    id: 'rel1',
    company_id: 'comp1',
    advisor_id: 'adv1',
    status: 'connected',
    created_at: '2024-06-15T10:00:00Z',
    interaction_count: 3,
  },
  {
    id: 'rel2',
    company_id: 'comp1',
    advisor_id: 'adv2',
    status: 'connected',
    created_at: '2024-08-20T14:30:00Z',
    interaction_count: 2,
  },
  {
    id: 'rel3',
    company_id: 'comp1',
    advisor_id: 'adv4',
    status: 'connected',
    created_at: '2024-05-01T09:00:00Z',
    interaction_count: 1,
  },
  {
    id: 'rel4',
    company_id: 'comp1',
    advisor_id: 'adv5',
    status: 'connected',
    created_at: '2024-09-10T13:00:00Z',
    interaction_count: 1,
  },
  {
    id: 'rel5',
    company_id: 'comp1',
    advisor_id: 'adv3',
    status: 'not_connected',
    created_at: '2025-12-20T11:00:00Z',
    interaction_count: 0,
  },
];

export const mockContacts: Contact[] = [
  {
    id: 'kn1',
    company_id: 'comp1',
    advisor_id: 'adv3',
    company_relationship: 'Tech Innovators Inc.', // NEW: Company name that sent this contact
    message: 'We are building a new product feature and would love to get your perspective on the user experience and product strategy. Your background at Figma and Linear would be incredibly valuable.',
    status: 'Sent',
    created_at: '2025-12-20T10:00:00Z',
    compensation: 'Equity + Cash',
    support_type: ['Business Planning & Strategy', 'Thought Leadership (Speaking, Writing, Etc)'],
  },
  {
    id: 'kn2',
    company_id: 'comp1',
    advisor_id: 'adv6',
    company_relationship: 'Tech Innovators Inc.', // NEW: Company name that sent this contact
    message: 'We are exploring our Series A fundraising strategy and would appreciate your insights on current market conditions, valuation expectations, and investor intros.',
    status: 'Accepted',
    created_at: '2025-12-15T14:30:00Z',
    responded_at: '2025-12-24T16:20:00Z',
    compensation: 'Cash',
    support_type: ['Fundraising', 'Networking & Peer Connections'],
  },
];

export const mockHandshakes: Handshake[] = [
  {
    id: 'hs1',
    company_id: 'comp1',
    advisor_id: 'adv1',
    company_relationship: 'Tech Innovators Inc.', // NEW: Company name for this handshake
    title: 'Financial Strategy Advisory',
    engagement_style: 'Ad hoc',
    channels: ['Email', 'Calendar'],
    response_expectation: '48h',
    capacity_hours_per_month: 5,
    focus_areas: ['Financial Modeling', 'Fundraising Strategy'],
    start_date: '2024-06-20T10:00:00Z',
    status: 'Active',
    created_at: '2024-06-15T10:00:00Z',
    updated_at: '2024-06-15T10:00:00Z',
    notes: 'Focus on Q4 planning and Series A prep',
  },
  {
    id: 'hs2',
    company_id: 'comp1',
    advisor_id: 'adv2',
    company_relationship: 'Tech Innovators Inc.', // NEW: Company name for this handshake
    title: 'Sales & GTM Advisory',
    engagement_style: 'Biweekly',
    channels: ['Email', 'Slack'],
    response_expectation: '24h',
    capacity_hours_per_month: 8,
    focus_areas: ['Sales Process', 'Enterprise GTM'],
    start_date: '2024-08-25T14:30:00Z',
    status: 'Active',
    created_at: '2024-08-20T14:30:00Z',
    updated_at: '2024-08-20T14:30:00Z',
    notes: 'Bi-weekly sales process reviews',
  },
  {
    id: 'hs3',
    company_id: 'comp1',
    advisor_id: 'adv6',
    company_relationship: 'Tech Innovators Inc.', // NEW: Company name for this handshake
    title: 'Fundraising Advisory',
    engagement_style: 'Ad hoc',
    channels: ['Email', 'Phone'],
    response_expectation: '48h',
    capacity_hours_per_month: 4,
    focus_areas: ['Series A Prep', 'Investor Intros'],
    status: 'Proposed',
    created_at: '2025-12-24T16:20:00Z',
    updated_at: '2025-12-24T16:20:00Z',
    notes: 'Post-contact acceptance handshake proposal',
  },
];

export const mockNudges: Nudge[] = [
  {
    id: 'n1',
    company_id: 'comp1',
    advisor_id: 'adv1',
    company_relationship: 'Tech Innovators Inc.', // NEW: Company name for this nudge
    details: 'We are preparing our Q4 financial forecast and would love your input on our revenue projections and burn rate assumptions. Specifically interested in benchmarking against similar-stage companies.',
    nudge_tag: 'Feedback Request',
    max_time_requested: '1 hour',
    status: 'Sent',
    advisor_completed: false,
    company_confirmed: false,
    created_at: '2025-12-20T10:00:00Z',
    updated_at: '2025-12-20T10:00:00Z',
  },
  {
    id: 'n2',
    company_id: 'comp1',
    advisor_id: 'adv2',
    company_relationship: 'Tech Innovators Inc.', // NEW: Company name for this nudge
    details: 'We just closed our first enterprise deal and want to document best practices. Can you review our sales process and suggest improvements for future deals?',
    nudge_tag: 'Review',
    max_time_requested: '30 minutes',
    status: 'Accepted',
    advisor_completed: true,
    company_confirmed: false,
    created_at: '2025-12-15T14:30:00Z',
    updated_at: '2025-12-24T16:20:00Z',
  },
  {
    id: 'n3',
    company_id: 'comp1',
    advisor_id: 'adv4',
    company_relationship: 'Tech Innovators Inc.', // NEW: Company name for this nudge
    details: 'Our platform is experiencing 3x growth in traffic. Need advice on infrastructure scaling, database optimization, and team structure to support this growth.',
    nudge_tag: 'Brainstorm',
    max_time_requested: '1 hour',
    status: 'Completed',
    advisor_completed: true,
    company_confirmed: true,
    created_at: '2025-12-01T09:00:00Z',
    updated_at: '2025-12-18T11:45:00Z',
  },
  {
    id: 'n4',
    company_id: 'comp1',
    advisor_id: 'adv5',
    company_relationship: 'Tech Innovators Inc.', // NEW: Company name for this nudge
    details: 'Planning to grow from 15 to 30 people in 2026. Would love guidance on org structure, role prioritization, and compensation benchmarks.',
    nudge_tag: 'Advice',
    max_time_requested: '45 minutes',
    status: 'Declined',
    advisor_completed: false,
    company_confirmed: false,
    created_at: '2025-12-10T13:00:00Z',
    updated_at: '2025-12-11T10:15:00Z',
  },
  {
    id: 'n5',
    company_id: 'comp1',
    advisor_id: 'adv1',
    company_relationship: 'Tech Innovators Inc.', // NEW: Company name for this nudge
    details: 'Starting to think about Series A timing. Current runway is 18 months. Would appreciate your thoughts on when to start the process and key metrics to hit.',
    nudge_tag: 'Brainstorm',
    max_time_requested: '30 minutes',
    status: 'Accepted',
    advisor_completed: false,
    company_confirmed: false,
    created_at: '2025-12-18T11:00:00Z',
    updated_at: '2025-12-19T09:30:00Z',
  },
];