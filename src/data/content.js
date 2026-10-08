/* ═══════════════════════════════════════════════════════
   CONTENT DATA — Single source of truth for all copy
   ═══════════════════════════════════════════════════════ */

export const IDENTITY = {
  name: 'Mehdi Ali',
  nameDisplay: ['MEHDI', 'ALI.'],
  tagline: 'B.Tech Student / Developer / Content Creator',
  taglineParts: ['student', 'builder', 'creator'],
  bio: 'I build software, make things for the internet, and document the process without pretending I have it all figured out.',
  bioHighlight: 'without pretending I have it all figured out.',
  presenceStatement: 'A STUDENT\nIN MOTION.',
  presenceCopy: "I'm a B.Tech student standing at the border between engineering and expression.",
  presenceMicro: 'THE POINT IS NOT TO LOOK FINISHED.\n\nIt is to make the work visible while it is still changing.',
  email: 'mehdialiprivate@gmail.com',
  github: '#',       // Replace with real URL
  linkedin: '#',     // Replace with real URL
  youtube: '#',      // Replace with real URL
  instagram: '#',    // Replace with real URL
};

export const PROJECTS = [
  {
    id: '001',
    slug: 'the-ledger',
    name: 'THE LEDGER',
    subtitle: 'Personal finance, made honest.',
    type: 'Web Application',
    year: '2025',
    stack: ['React', 'Vite', 'Tailwind', 'Supabase', 'PostgreSQL', 'Recharts', 'jsPDF'],
    why: 'Most finance apps are built for accountants. This one is built for a student who wants to know where the money went and why.',
    detail: 'Expense tracking with real-time charts, PDF exports, and a Supabase backend. The challenge was making financial data feel human rather than clinical.',
    lesson: 'Data doesn\'t need to be sterile. Design can make the truth easier to face.',
    live: '#',     // Replace with real URL
    github: '#',   // Replace with real URL
    color: '#1947e5',
  },
  {
    id: '002',
    slug: 'estate-pro',
    name: 'ESTATE PRO',
    subtitle: 'Real estate, re-composed.',
    type: 'Interface Experiment',
    year: '2025',
    stack: ['React', 'Tailwind', 'Modern Web UI'],
    why: 'Real estate interfaces are notoriously dense and dated. This is an exploration of how property discovery could actually feel.',
    detail: 'A front-end interface experiment focused on spatial composition, property listing UX, and modern interaction patterns.',
    lesson: 'Sometimes the constraint of no backend is what forces you to focus entirely on the experience.',
    live: '#',    // Replace with real URL
    github: '#',  // Replace with real URL
    color: '#171717',
  },
  {
    id: '003',
    slug: 'experiments',
    name: 'EXPERIMENTS',
    subtitle: 'Learning in public.',
    type: 'Ongoing Series',
    year: '2024–',
    stack: ['Various', 'Learning', 'Building'],
    why: 'Not everything has a brief. Some things exist just to see if they can.',
    detail: 'A rotating series of small builds, interface explorations, and technical experiments. Some ship. Most teach.',
    lesson: 'The experiments that go nowhere are often the most educational.',
    live: null,
    github: '#',
    color: '#6b6a64',
  },
];

export const BROADCAST_ITEMS = [
  {
    id: 'V01',
    type: 'SHORT',
    label: 'SHORT FORM',
    title: 'Building something real, in public',
    caption: 'What it actually looks like to build a project from scratch when you don\'t know all the answers.',
    timestamp: '2026',
    platform: 'REELS / SHORTS',
    link: '#',
  },
  {
    id: 'V02',
    type: 'SHORT',
    label: 'SHORT FORM',
    title: 'The part no one shows you',
    caption: 'The bugs, the dead ends, the moments of realising the plan was wrong.',
    timestamp: '2026',
    platform: 'REELS / SHORTS',
    link: '#',
  },
  {
    id: 'V03',
    type: 'SHORT',
    label: 'SHORT FORM',
    title: 'Student to builder',
    caption: 'The gap between what university teaches and what shipping something actually requires.',
    timestamp: '2026',
    platform: 'REELS / SHORTS',
    link: '#',
  },
  {
    id: 'V04',
    type: 'EDIT',
    label: 'EDIT',
    title: 'A day in the frequency',
    caption: 'An experiment in showing process as content rather than outcome as content.',
    timestamp: '2026',
    platform: 'REELS / SHORTS',
    link: '#',
  },
];

export const TIMELINE = [
  {
    year: '2024',
    label: 'B.TECH',
    note: 'Engineering begins.',
    height: 50,
    position: 8,
  },
  {
    year: '2025',
    label: 'FIRST SHIP',
    note: 'The Ledger goes live.',
    height: 80,
    position: 28,
  },
  {
    year: '2025',
    label: 'EXPERIMENT',
    note: 'EstatePro. Building in public.',
    height: 110,
    position: 50,
  },
  {
    year: '2026',
    label: 'BROADCAST',
    note: 'Content creation starts.',
    height: 75,
    position: 70,
  },
  {
    year: '2026',
    label: 'NOW',
    note: 'Still moving.',
    height: 140,
    position: 88,
    isNow: true,
  },
];

export const STATES = [
  { id: '01', label: 'PRESENCE', key: 'presence' },
  { id: '02', label: 'BUILD',    key: 'build'    },
  { id: '03', label: 'BROADCAST',key: 'broadcast' },
  { id: '04', label: 'EVOLVE',   key: 'evolve'   },
  { id: '05', label: 'REACH',    key: 'reach'    },
];

export const NODES = [
  { signal: '01', label: 'ME',     target: 'presence', pos: { left: '11%', top: '56%' } },
  { signal: '02', label: 'BUILD',  target: 'build',    pos: { left: '17%', top: '34%' } },
  { signal: '03', label: 'MAKE',   target: 'broadcast',pos: { left: '81%', top: '30%' } },
  { signal: '04', label: 'EVOLVE', target: 'evolve',   pos: { left: '78%', top: '72%' } },
  { signal: '05', label: 'REACH',  target: 'reach',    pos: { left: '24%', top: '76%' } },
  { signal: '06', label: 'WORK',   target: 'build',    pos: { left: '90%', top: '53%' } },
];
