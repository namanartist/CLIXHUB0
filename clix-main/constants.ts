import { User, Club, Event, Registration, Applicant, AuditLog, CertificateBatch, Proposal, Venue, Role, ClubRole } from './types';

export const DEMO_USERS: User[] = [
  {
    id: 'usr_admin_1',
    name: 'Dr. Rajeev Sharma',
    email: 'admin@mitsgwl.ac.in',
    globalRole: Role.SUPER_ADMIN,
    designation: 'Director & Chief Institutional Administrator',
    department: 'Directorate',
    clubMemberships: [],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    skills: ['Institutional Governance', 'Accreditation', 'Strategic Policy', 'Budget Allocation']
  },
  {
    id: 'usr_dean_1',
    name: 'Prof. Alok Bansal',
    email: 'dean.sw@mitsgwl.ac.in',
    globalRole: Role.DEAN,
    designation: 'Dean of Student Welfare & Campus Activities',
    department: 'Student Affairs',
    clubMemberships: [],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    skills: ['Student Mentorship', 'Council Approvals', 'Budget Governance', 'Disciplinary Oversight']
  },
  {
    id: 'usr_faculty_1',
    name: 'Dr. Priya Verma',
    email: 'priya.verma@mitsgwl.ac.in',
    globalRole: Role.FACULTY,
    designation: 'Associate Professor & Central Club Coordinator',
    department: 'Computer Science & Engineering',
    clubMemberships: [],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    skills: ['Event Oversight', 'Curriculum Design', 'AI Research', 'Faculty Approvals']
  },
  {
    id: 'usr_faculty_demo',
    name: 'Demo Faculty Coordinator',
    email: 'faculty@mitsgwl.ac.in',
    globalRole: Role.FACULTY,
    designation: 'Professor & Institutional Coordinator',
    department: 'Computer Science & Engineering',
    clubMemberships: [],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    skills: ['Event Oversight', 'Faculty Approvals', 'Budget Signoff', 'Mentorship']
  },
  {
    id: 'usr_student_1',
    name: 'Naman Lahariya',
    email: 'naman@mitsgwl.ac.in',
    globalRole: Role.STUDENT,
    enrollmentNumber: '0901CS211075',
    rollNumber: '0901CS211075',
    branch: 'Computer Science & Engineering',
    department: 'CSE',
    clubMemberships: [
      { clubId: 'club-acm', role: ClubRole.PRESIDENT, joinedAt: '2023-08-01T00:00:00.000Z' },
      { clubId: 'club-webdev', role: ClubRole.TECH_HEAD, joinedAt: '2023-09-15T00:00:00.000Z' },
      { clubId: 'club-robotics', role: ClubRole.MEMBER, joinedAt: '2023-10-01T00:00:00.000Z' },
      { clubId: 'club-ai', role: ClubRole.VICE_PRESIDENT, joinedAt: '2023-10-10T00:00:00.000Z' },
      { clubId: 'club-design', role: ClubRole.MEMBER, joinedAt: '2023-11-01T00:00:00.000Z' }
    ],
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    skills: ['Full-Stack Systems', 'Cloud Architecture', 'React', 'Node.js', 'PostgreSQL', 'TypeScript']
  },
  {
    id: 'usr_student_demo',
    name: 'Demo Student Leader',
    email: 'student@mitsgwl.ac.in',
    globalRole: Role.STUDENT,
    enrollmentNumber: '0901CS221001',
    rollNumber: '0901CS221001',
    branch: 'Computer Science & Engineering',
    department: 'CSE',
    clubMemberships: [
      { clubId: 'club-acm', role: ClubRole.PRESIDENT, joinedAt: '2023-08-01T00:00:00.000Z' },
      { clubId: 'club-webdev', role: ClubRole.TECH_HEAD, joinedAt: '2023-09-15T00:00:00.000Z' },
      { clubId: 'club-robotics', role: ClubRole.MEMBER, joinedAt: '2023-10-01T00:00:00.000Z' },
      { clubId: 'club-ai', role: ClubRole.VICE_PRESIDENT, joinedAt: '2023-10-10T00:00:00.000Z' },
      { clubId: 'club-design', role: ClubRole.MEMBER, joinedAt: '2023-11-01T00:00:00.000Z' }
    ],
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    skills: ['Full-Stack Systems', 'Cloud Architecture', 'React', 'Node.js', 'Certifications', 'Event Operations']
  },
  {
    id: 'usr_student_2',
    name: 'Aryan Gupta',
    email: 'aryan@mitsgwl.ac.in',
    globalRole: Role.STUDENT,
    enrollmentNumber: '0901IT211032',
    rollNumber: '0901IT211032',
    branch: 'Information Technology',
    department: 'IT',
    clubMemberships: [
      { clubId: 'club-robotics', role: ClubRole.PRESIDENT, joinedAt: '2023-08-10T00:00:00.000Z' },
      { clubId: 'club-acm', role: ClubRole.MEMBER, joinedAt: '2023-09-01T00:00:00.000Z' }
    ],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    skills: ['Embedded Systems', 'ROS', 'Microcontrollers', '3D CAD', 'Autonomous Drones']
  },
  {
    id: 'usr_student_3',
    name: 'Riya Sharma',
    email: 'riya@mitsgwl.ac.in',
    globalRole: Role.STUDENT,
    enrollmentNumber: '0901EC221045',
    rollNumber: '0901EC221045',
    branch: 'Electronics & Communication',
    department: 'ECE',
    clubMemberships: [
      { clubId: 'club-design', role: ClubRole.PRESIDENT, joinedAt: '2023-09-01T00:00:00.000Z' },
      { clubId: 'club-webdev', role: ClubRole.CONTENT_HEAD, joinedAt: '2023-09-20T00:00:00.000Z' }
    ],
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    skills: ['UI/UX Design', 'Figma', 'Brand Identity', 'Motion Graphics', 'Design Systems']
  },
  {
    id: 'usr_student_4',
    name: 'Sneha Patel',
    email: 'sneha@mitsgwl.ac.in',
    globalRole: Role.STUDENT,
    enrollmentNumber: '0901AI221054',
    rollNumber: '0901AI221054',
    branch: 'Artificial Intelligence & Data Science',
    department: 'AIDS',
    clubMemberships: [
      { clubId: 'club-ai', role: ClubRole.PRESIDENT, joinedAt: '2023-09-10T00:00:00.000Z' },
      { clubId: 'club-acm', role: ClubRole.TECH_HEAD, joinedAt: '2023-09-15T00:00:00.000Z' }
    ],
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    skills: ['PyTorch', 'Computer Vision', 'LLMs', 'Data Pipelines', 'Deep Learning']
  }
];

export const DEMO_CLUBS: Club[] = [
  {
    id: 'club-acm',
    name: 'ACM Student Chapter',
    category: 'Technical',
    themeColor: '#2563eb',
    siteTheme: 'obsidian-pro',
    subdomain: 'acm',
    leadership: {
      President: 'Naman Lahariya',
      presidentId: 'usr_student_1',
      'Faculty Advisor': 'Dr. Priya Verma'
    },
    facultyCoordinatorId: 'usr_faculty_1',
    facultyCoordinatorNames: ['Dr. Priya Verma'],
    tagline: 'Empowering Computing Innovators & Researchers at MITS Gwalior',
    description: 'The official ACM Student Chapter at Madhav Institute of Technology & Science fosters technological rigor, competitive coding, open source contribution, and cutting-edge software engineering.',
    recruitmentActive: true,
    membersCount: 140,
    budget: 45000,
    spent: 18200,
    defaultUpiQrUrl: 'mits.acm@okicici',
    achievements: [
      { id: 'ach-1', title: 'Best Technical Chapter 2025', description: 'Awarded Regional Best ACM Chapter across Madhya Pradesh.', date: '2025-03-15' },
      { id: 'ach-2', title: 'National Hackathon Winners', description: 'Team ACM secured 1st prize at Smart India Hackathon 2024.', date: '2024-12-20' }
    ],
    projects: [
      { id: 'proj-1', title: 'CLIX Hub University OS', description: 'Enterprise campus management and club lifecycle OS.', status: 'Active', demoUrl: 'https://mitsgwl.ac.in', techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'] },
      { id: 'proj-2', title: 'Alumni Mentorship Engine', description: 'Peer-to-alumni matching platform for mock interviews and referral trees.', status: 'Completed', githubUrl: 'https://github.com/mits-acm/mentorship', techStack: ['Next.js', 'TailwindCSS', 'Supabase'] }
    ],
    teamMembers: [
      { id: 'mem-1', name: 'Naman Lahariya', role: 'President', tier: 'Core', photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80', domain: 'Executive' },
      { id: 'mem-2', name: 'Rohan Deshmukh', role: 'Vice President', tier: 'Core', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', domain: 'Operations' },
      { id: 'mem-3', name: 'Tanvi Saxena', role: 'Tech Lead', tier: 'Lead', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', domain: 'Technical' }
    ],
    announcements: [
      { id: 'ann-1', title: 'HackMITS 2026 Registrations Open', content: 'Registrations are now open for our annual flagship 36-hour hackathon. Top cash prize of INR 1,00,000.', tag: 'Flagship Event', date: '2026-08-10' }
    ],
    gallery: [
      { id: 'g-1', title: 'Annual Coding Gala', category: 'Hackathons', mediaUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80', date: '2025' }
    ]
  },
  {
    id: 'club-robotics',
    name: 'Robotics & Automation Club',
    category: 'Technical',
    themeColor: '#059669',
    siteTheme: 'emerald-glass',
    subdomain: 'robotics',
    leadership: {
      President: 'Aryan Gupta',
      presidentId: 'usr_student_2',
      'Faculty Advisor': 'Dr. K. S. Sharma'
    },
    facultyCoordinatorNames: ['Dr. K. S. Sharma'],
    tagline: 'Designing Autonomous Systems, Drones, and Intelligent Machines',
    description: 'Premier robotics society researching autonomous navigation, battle robots, industrial automation, and aerial surveillance.',
    recruitmentActive: true,
    membersCount: 95,
    budget: 60000,
    spent: 24000,
    defaultUpiQrUrl: 'mits.robotics@okicici',
    achievements: [
      { id: 'ach-rob-1', title: 'IIT Bombay Techfest Finalists', description: 'Secured Top 5 in National RoboWars Championship.', date: '2025-01-12' }
    ],
    projects: [
      { id: 'proj-rob-1', title: 'Autonomous Campus Rover', description: 'GPS and LiDAR guided campus utility delivery rover.', status: 'Active', techStack: ['ROS2', 'Python', 'C++', 'LiDAR'] }
    ],
    teamMembers: [
      { id: 'mem-rob-1', name: 'Aryan Gupta', role: 'President', tier: 'Core', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', domain: 'Hardware' }
    ],
    announcements: [
      { id: 'ann-rob-1', title: 'Drone Racing League Trials', content: 'Hands-on training session this Saturday at OAT.', tag: 'Workshop', date: '2026-08-12' }
    ],
    gallery: []
  },
  {
    id: 'club-ai',
    name: 'AI & Data Science Society',
    category: 'Technical',
    themeColor: '#7c3aed',
    siteTheme: 'amethyst-flow',
    subdomain: 'ai-society',
    leadership: {
      President: 'Sneha Patel',
      presidentId: 'usr_student_4',
      'Faculty Advisor': 'Dr. Priya Verma'
    },
    facultyCoordinatorId: 'usr_faculty_1',
    facultyCoordinatorNames: ['Dr. Priya Verma'],
    tagline: 'Pushing the Boundaries of Neural Computing & Machine Intelligence',
    description: 'Pioneering student research group focusing on generative AI, deep learning models, natural language processing, and predictive analytics.',
    recruitmentActive: true,
    membersCount: 110,
    budget: 35000,
    spent: 12000,
    defaultUpiQrUrl: 'mits.ai@okicici',
    achievements: [],
    projects: [],
    teamMembers: [
      { id: 'mem-ai-1', name: 'Sneha Patel', role: 'President', tier: 'Core', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', domain: 'Machine Learning' }
    ],
    announcements: [],
    gallery: []
  },
  {
    id: 'club-design',
    name: 'Creative Design & Media Cell',
    category: 'Cultural',
    themeColor: '#e11d48',
    siteTheme: 'rose-gold-elegance',
    subdomain: 'design-cell',
    leadership: {
      President: 'Riya Sharma',
      presidentId: 'usr_student_3',
      'Faculty Advisor': 'Prof. Alok Bansal'
    },
    facultyCoordinatorNames: ['Prof. Alok Bansal'],
    tagline: 'Crafting Visual Identities, Human Experiences, and Media Artistry',
    description: 'The creative backbone of MITS Gwalior handling UI/UX prototyping, visual branding, filmmaking, and multimedia productions.',
    recruitmentActive: true,
    membersCount: 85,
    budget: 30000,
    spent: 14500,
    defaultUpiQrUrl: 'mits.design@okicici',
    achievements: [],
    projects: [],
    teamMembers: [
      { id: 'mem-des-1', name: 'Riya Sharma', role: 'President', tier: 'Core', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80', domain: 'UI/UX' }
    ],
    announcements: [],
    gallery: []
  }
];

export const DEMO_VENUES: Venue[] = [
  {
    id: 'ven-1',
    name: 'Main Institutional Auditorium',
    capacity: 800,
    location: 'Central Administrative Complex, Ground Floor',
    isAvailable: true,
    facilities: ['Dolby 7.1 Acoustic System', '4K Laser Projector', 'Central HVAC', 'Stage Lighting Rig']
  },
  {
    id: 'ven-2',
    name: 'Seminar Hall 1 - IT Block',
    capacity: 200,
    location: 'Department of IT, 2nd Floor',
    isAvailable: true,
    facilities: ['Dual Display Monitors', 'Podium Mic', 'High-Speed Wi-Fi', 'AC']
  },
  {
    id: 'ven-3',
    name: 'Advanced Computing Lab 4',
    capacity: 120,
    location: 'CSE Department, 1st Floor',
    isAvailable: true,
    facilities: ['120 Workstations (i7/32GB)', 'Gigabit LAN', 'Interactive Whiteboard']
  },
  {
    id: 'ven-4',
    name: 'Open Air Theatre (OAT)',
    capacity: 1500,
    location: 'Campus South Grounds',
    isAvailable: true,
    facilities: ['Open Stage', 'High Capacity Power Feed', 'Floodlighting Rig']
  }
];

export const DEMO_EVENTS: Event[] = [
  {
    id: 'evt-innovation-war',
    title: 'Innovation War: Pitching & Prototyping Battleground',
    clubId: 'club-acm',
    description: 'The flagship national innovation pitching and hardware prototyping battleground at MITS. Pitch transformative technological innovations before leading venture capitalists, startup incubators, and industry veterans. Complete with jury evaluations, seed grant awards, incubation access, and verified certificates.',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '10:00 AM',
    venue: 'Main Institutional Auditorium & SAC Arena',
    type: 'Free',
    fee: 0,
    status: 'Approved',
    maxParticipants: 250,
    bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    tags: ['Innovation War', 'Startups', 'Pitching', 'Prototyping', 'Hackathon'],
    createdBy: 'Naman Lahariya'
  },
  {
    id: 'evt-test-free',
    title: 'Test: Campus Tech Trial & Diagnostic Round',
    clubId: 'club-acm',
    description: 'Standard technical trial and diagnostic event for validating student ticket generation, gate barcode verification, badge credentials, and automated attendance logging.',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    time: '03:00 PM',
    venue: 'Seminar Hall 1 - IT Block',
    type: 'Free',
    fee: 0,
    status: 'Approved',
    maxParticipants: 100,
    bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    tags: ['Test', 'Trial', 'Diagnostic', 'Badge Verification'],
    createdBy: 'Naman Lahariya'
  },
  {
    id: 'evt-paid-test',
    title: 'Paid Test: Advanced Systems & Embedded Masterclass',
    clubId: 'club-robotics',
    description: 'Specialized paid technical workshop and testing session covering microcontroller programming, sensor interfacing, and cloud telemetry with exclusive developer kit inclusion and verified credentialing.',
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    time: '04:30 PM',
    venue: 'Advanced Computing Lab 4',
    type: 'Paid',
    fee: 99,
    status: 'Approved',
    maxParticipants: 80,
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    tags: ['Paid Test', 'Hardware Kit', 'IoT', 'Embedded Systems'],
    createdBy: 'Naman Lahariya'
  },
  {
    id: 'evt-hackmits-2026',
    title: 'HackMITS 2026: National 36h Hackathon',
    clubId: 'club-acm',
    description: 'The premier national hackathon of central India. 36 hours of relentless innovation, mentorship from top tier tech giants, and prizes worth 1 Lakh+.',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    time: '09:00 AM',
    venue: 'Main Institutional Auditorium',
    type: 'Paid',
    fee: 150,
    status: 'Approved',
    maxParticipants: 300,
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    tags: ['Hackathon', 'Coding', 'Innovation', 'AI'],
    createdBy: 'Naman Lahariya'
  },
  {
    id: 'evt-robowars-2026',
    title: 'RoboWars & Aerial Drone Racing Grand Prix',
    clubId: 'club-robotics',
    description: 'High-octane robotic combat and FPV drone racing championship across custom obstacle arenas.',
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    time: '11:00 AM',
    venue: 'Open Air Theatre (OAT)',
    type: 'Free',
    fee: 0,
    status: 'Approved',
    maxParticipants: 180,
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    tags: ['Robotics', 'Combat', 'Drones'],
    createdBy: 'Aryan Gupta'
  },
  {
    id: 'evt-ai-bootcamp-2026',
    title: 'Generative AI & LLM Systems Masterclass',
    clubId: 'club-ai',
    description: 'Hands-on masterclass building RAG applications, fine-tuning open source models, and deploying production AI agents.',
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    time: '02:00 PM',
    venue: 'Advanced Computing Lab 4',
    type: 'Free',
    fee: 0,
    status: 'Approved',
    maxParticipants: 120,
    bannerUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    tags: ['Artificial Intelligence', 'LLM', 'Python'],
    createdBy: 'Sneha Patel'
  }
];

export const DEMO_PROPOSALS: Proposal[] = [
  {
    id: 'prop-blockchain-01',
    type: 'Club',
    title: 'Blockchain & Web3 Research Cell',
    category: 'Technical',
    proposerName: 'Aditya Srivastava',
    proposerRoll: '0901CS221012',
    proposerEmail: 'aditya.s@mitsgwl.ac.in',
    missionStatement: 'To pioneer decentralized application development, smart contract auditing, and zero-knowledge cryptography research among students.',
    estimatedMembers: 45,
    status: 'PendingDean',
    deanResponse: '',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prop-aerospace-02',
    type: 'Club',
    title: 'Aeromodelling & Rocketry Society',
    category: 'Technical',
    proposerName: 'Kunal Rathore',
    proposerRoll: '0901ME221038',
    proposerEmail: 'kunal.r@mitsgwl.ac.in',
    missionStatement: 'Designing high-altitude sounding rockets, UAV flight controllers, and participating in national aerospace challenges.',
    estimatedMembers: 60,
    status: 'PendingDean',
    deanResponse: '',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prop-cybersec-03',
    type: 'Club',
    title: 'Cyber Security & Ethical Hacking Guild',
    category: 'Technical',
    proposerName: 'Vikram Rajput',
    proposerRoll: '0901IT221088',
    proposerEmail: 'vikram.r@mitsgwl.ac.in',
    missionStatement: 'Cultivating defensive and offensive cybersecurity skills, CTF competitions, and bug bounty workshops.',
    estimatedMembers: 75,
    status: 'PendingSystemAdmin',
    deanResponse: 'Strongly endorsed. Recommended to integrate under Department of Information Technology.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const DEMO_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-001',
    eventId: 'evt-hackmits-2026',
    studentId: 'usr_student_1',
    studentName: 'Naman Lahariya',
    studentRoll: '0901CS211075',
    studentBranch: 'Computer Science & Engineering',
    status: 'Approved',
    paymentType: 'Gateway',
    ticketId: 'TKT-HACKMITS-902184',
    attendanceMarked: true
  },
  {
    id: 'reg-002',
    eventId: 'evt-robowars-2026',
    studentId: 'usr_student_1',
    studentName: 'Naman Lahariya',
    studentRoll: '0901CS211075',
    studentBranch: 'Computer Science & Engineering',
    status: 'Approved',
    paymentType: 'Free',
    ticketId: 'TKT-ROBOWARS-418293',
    attendanceMarked: false
  }
];

export const DEMO_APPLICANTS: Applicant[] = [
  {
    id: 'app-001',
    name: 'Devansh Pandey',
    rollNumber: '0901CS231045',
    branch: 'CSE',
    email: 'devansh@mitsgwl.ac.in',
    domain: 'Technical Wing',
    whyJoin: 'Passionate about distributed backend architectures and open-source tooling.',
    stage: 'Interview',
    clubId: 'club-acm',
    recruitmentCycle: '2026'
  },
  {
    id: 'app-002',
    name: 'Megha Sen',
    rollNumber: '0901EC231089',
    branch: 'ECE',
    email: 'megha@mitsgwl.ac.in',
    domain: 'Creative & Design',
    whyJoin: 'Experienced in Figma design systems and interactive UI prototyping.',
    stage: 'Screening',
    clubId: 'club-acm',
    recruitmentCycle: '2026'
  }
];

export const DEMO_BATCHES: CertificateBatch[] = [
  {
    id: 'batch-hackmits-2025',
    title: 'HackMITS 2025 Merit & Participation Batch',
    eventId: 'evt-hackmits-2025',
    eventName: 'HackMITS 2025',
    clubId: 'club-acm',
    status: 'Approved',
    createdAt: '2025-04-20T00:00:00.000Z',
    createdBy: 'Naman Lahariya',
    approvalChain: [
      { role: Role.FACULTY, status: 'Approved', approvedAt: '2025-04-21T00:00:00.000Z', approverName: 'Dr. Priya Verma' },
      { role: Role.DEAN, status: 'Approved', approvedAt: '2025-04-22T00:00:00.000Z', approverName: 'Prof. Alok Bansal' }
    ],
    certificates: [
      {
        serialNumber: 'MITS-ACM-2025-00001',
        studentId: 'usr_student_1',
        studentName: 'Naman Lahariya',
        enrollmentNumber: '0901CS211075',
        eventName: 'HackMITS 2025',
        clubId: 'club-acm',
        issueDate: '2025-04-22T00:00:00.000Z',
        signatories: ['Dr. Priya Verma', 'Prof. Alok Bansal'],
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }
    ]
  }
];

export const DEMO_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: new Date().toLocaleString('en-IN'),
    user: 'System',
    action: 'Initialized MITS CLIX Institutional Hub Data Fabric',
    clubId: 'institutional'
  }
];
