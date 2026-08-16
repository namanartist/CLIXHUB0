export const INITIAL_SEEDS = {
  users: [
    {
      id: 'usr_admin_1',
      name: 'Dr. Rajeev Sharma',
      email: 'admin@mitsgwl.ac.in',
      globalRole: 'Super Admin',
      designation: 'Director & Chief Institutional Administrator',
      department: 'Directorate',
      clubMemberships: [],
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      skills: ['Institutional Governance', 'Accreditation', 'Strategic Policy']
    },
    {
      id: 'usr_dean_1',
      name: 'Prof. Alok Bansal',
      email: 'dean.sw@mitsgwl.ac.in',
      globalRole: 'Dean',
      designation: 'Dean of Student Welfare & Campus Activities',
      department: 'Student Affairs',
      clubMemberships: [],
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      skills: ['Student Mentorship', 'Council Approvals', 'Budget Governance']
    },
    {
      id: 'usr_faculty_1',
      name: 'Dr. Priya Verma',
      email: 'priya.verma@mitsgwl.ac.in',
      globalRole: 'Faculty',
      designation: 'Associate Professor & Central Club Coordinator',
      department: 'Computer Science & Engineering',
      clubMemberships: [],
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      skills: ['Event Oversight', 'Curriculum Design', 'AI Research']
    },
    {
      id: 'usr_student_1',
      name: 'Naman Lahariya',
      email: 'naman@mitsgwl.ac.in',
      globalRole: 'Student',
      enrollmentNumber: '0901CS211075',
      rollNumber: '0901CS211075',
      branch: 'Computer Science & Engineering',
      department: 'CSE',
      clubMemberships: [
        { clubId: 'club-acm', role: 'President', joinedAt: '2023-08-01T00:00:00.000Z' },
        { clubId: 'club-webdev', role: 'Tech Head', joinedAt: '2023-09-15T00:00:00.000Z' }
      ],
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      skills: ['Full-Stack Systems', 'Cloud Architecture', 'React', 'Node.js']
    }
  ],
  clubs: [
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
        { id: 'ach-1', title: 'Best Technical Chapter 2025', description: 'Awarded Regional Best ACM Chapter across Madhya Pradesh.', date: '2025-03-15' }
      ],
      projects: [
        { id: 'proj-1', title: 'CLIX Hub University OS', description: 'Enterprise campus management and club lifecycle OS.', status: 'Active', demoUrl: 'https://mitsgwl.ac.in', techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'] }
      ],
      teamMembers: [
        { id: 'mem-1', name: 'Naman Lahariya', role: 'President', tier: 'Core', photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80', domain: 'Executive' }
      ],
      announcements: [
        { id: 'ann-1', title: 'HackMITS 2026 Registrations Open', content: 'Registrations are now open for our annual flagship 36-hour hackathon. Top cash prize of INR 1,00,000.', tag: 'Flagship Event', date: '2026-08-10' }
      ],
      gallery: []
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
      achievements: [],
      projects: [],
      teamMembers: [],
      announcements: [],
      gallery: []
    }
  ],
  events: [
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
    }
  ],
  venues: [
    {
      id: 'ven-1',
      name: 'Main Institutional Auditorium',
      capacity: 800,
      location: 'Central Administrative Complex, Ground Floor',
      isAvailable: true,
      facilities: ['Dolby 7.1 Acoustic System', '4K Laser Projector', 'Central HVAC']
    }
  ],
  proposals: [
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
      timestamp: new Date().toISOString()
    }
  ],
  batches: [],
  registrations: [],
  applicants: [],
  logs: [
    {
      id: 'log-001',
      timestamp: new Date().toLocaleString('en-IN'),
      user: 'System',
      action: 'Initialized MITS CLIX Institutional Hub Data Fabric',
      clubId: 'institutional'
    }
  ],
  activities: [],
  messages: [],
  notifications: [],
  developers: [],
  mentors: [],
  inquiries: [],
  qr_links: [],
  institutional_kpis: [],
  approval_requests: []
};
