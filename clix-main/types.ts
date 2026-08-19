
export enum Role {
  STUDENT = 'Student',
  FACULTY = 'Faculty',
  DEAN = 'Dean',
  SUPER_ADMIN = 'Super Admin'
}

export enum ClubRole {
  PRESIDENT = 'President',
  VICE_PRESIDENT = 'Vice President',
  SECRETARY = 'Secretary',
  JOINT_SECRETARY = 'Joint Secretary',
  TREASURER = 'Treasurer',
  TECH_HEAD = 'Tech Head',
  CONTENT_HEAD = 'Content Head',
  MANAGEMENT_HEAD = 'Management Head',
  SOCIAL_MEDIA_HEAD = 'Social Media Head',
  DOMAIN_HEAD = 'Domain Head',
  MEMBER = 'Member'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  globalRole: Role;
  clubMemberships: ClubMembership[];
  photoUrl?: string;
  signatureUrl?: string;
  linkedin?: string;
  github?: string;
  phoneNumber?: string;
  phone?: string;
  enrollmentNumber?: string;
  enrollmentNo?: string;
  rollNumber?: string;
  rollNo?: string;
  roll?: string;
  address?: string;
  branch?: string;
  department?: string;  // New: For students and faculty
  designation?: string; // New: For faculty (e.g., Assistant Professor, Associate Professor)
  fatherName?: string;
  motherName?: string;
  profileLocked?: boolean;
  skills?: string[];
  lastSeen?: string; // ISO String
  isOnline?: boolean;
}

export interface ClubMembership {
  clubId: string;
  role: ClubRole;
  domain?: string;
  joinedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  link?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  iconName?: string;
}

export interface Quotation {
  id: string;
  title: string;
  vendorName: string;
  amount: number;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  fileUrl?: string;
}

export interface PaymentGatewayConfig {
  provider: 'ManualUPI' | 'Razorpay' | 'Stripe' | 'PhonePe';
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
  isActive: boolean;
}

export type CertificateTemplate = 'classic' | 'modern' | 'tech' | 'minimal' | 'elegant';

export interface CertificateConfig {
  templateId: CertificateTemplate;
  customBackgroundUrl?: string;
  showMITSLogo: boolean;
  showClubLogo: boolean;
  signatureTextFaculty: string;
  signatureTextDean?: string;
  signatureTextPresident?: string;
}

export interface ApprovalStep {
  role: Role;
  approverName: string;
  approvedAt?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  comment?: string;
}

export interface IssuedCertificate {
  id?: string;
  serialNumber: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  email?: string;
  eventName: string;
  clubId: string;
  clubName?: string;
  date?: string;
  issueDate?: string;
  signatories?: any;
  hash: string;
  batchId?: string;
}

export interface CertificateBatch {
  id: string;
  clubId: string;
  eventId: string;
  eventName?: string;
  title?: string;
  templateId?: CertificateTemplate;
  status: 'Draft' | 'PendingFaculty' | 'PendingDean' | 'Approved' | 'Rejected';
  createdBy: string;
  createdAt: string;
  certificates: IssuedCertificate[];
  approvalChain: ApprovalStep[];
}

export interface QrHistoryItem {
  id: string;
  qrUrl: string;
  upiId?: string;
  label: string;
  createdAt: string;
  isActive: boolean;
}

export interface ClubProject {
  id: string;
  title: string;
  description: string;
  team?: string;
  techStack?: string[];
  status?: 'Active' | 'In Development' | 'Completed' | 'Research';
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
}

export interface ClubTeamMember {
  id: string;
  name: string;
  role: string;
  tier: 'Faculty' | 'Executive' | 'Lead' | 'Core' | 'Member';
  domain?: string;
  batch?: string;
  photoUrl?: string;
  linkedin?: string;
  github?: string;
}

export interface ClubGalleryItem {
  id: string;
  title: string;
  category: 'Events' | 'Workshops' | 'Competitions' | 'Team' | 'Hackathons' | string;
  mediaUrl: string;
  date?: string;
}

export interface ClubAnnouncement {
  id: string;
  title: string;
  content: string;
  tag: 'Recruitment' | 'Event' | 'Results' | 'Notice' | 'Flagship Event' | 'Workshop' | string;
  date: string;
  link?: string;
}

export interface ClubSocialLinks {
  website?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  youtube?: string;
  discord?: string;
}

export interface Club {
  id: string;
  name: string;
  category: 'Technical' | 'Cultural' | 'Social' | 'Sports' | 'Literary' | 'Academic' | 'General';
  themeColor: string;
  subdomain: string;
  logoUrl?: string;
  facultyCoordinatorId?: string;
  facultyCoordinatorNames?: string[];
  leadership: Record<string, string>;
  isFrozen?: boolean;
  recruitmentActive?: boolean;
  membersCount?: number;
  budget?: number;
  spent?: number;
  tagline?: string;
  bannerUrl?: string;
  description?: string;
  achievements?: Achievement[];
  customSections?: CustomSection[];
  defaultUpiQrUrl?: string;
  qrHistory?: QrHistoryItem[];
  quotations?: Quotation[];
  paymentGatewayConfig?: PaymentGatewayConfig;
  certificateConfig?: CertificateConfig;
  projects?: ClubProject[];
  teamMembers?: ClubTeamMember[];
  gallery?: ClubGalleryItem[];
  announcements?: ClubAnnouncement[];
  socialLinks?: ClubSocialLinks;
  siteTheme?: string;
  colorMode?: 'dark' | 'light';
}

export interface Venue {
  id: string;
  name: string;
  location?: string;
  capacity?: number;
  amenities?: string[];
  facilities?: string[];
  status?: 'Available' | 'Booked' | 'Maintenance' | 'Reserved';
  isAvailable?: boolean;
  description?: string;
}

export interface Applicant {
  id: string;
  name: string;
  rollNumber: string;
  branch: string;
  domain: string;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Selected' | 'Rejected';
  whyJoin: string;
  resumeUrl?: string;
  notes?: string;
  recruitmentCycle?: string;
  clubId?: string;
  email?: string;
}

export interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  studentBranch?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  paymentType: 'Free' | 'UPI' | 'Gateway';
  paymentGatewayProvider?: PaymentGatewayConfig['provider'];
  paymentProofUrl?: string;
  paymentDetails?: any;
  transactionId?: string;
  ticketId?: string;
  attendanceMarked?: boolean;
  certificateId?: string;
}

export interface Event {
  id: string;
  clubId: string;
  title: string;
  description: string;
  type: 'Free' | 'Paid';
  fee?: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  time?: string;
  startDateTime?: string;
  endDateTime?: string;
  location?: string;
  venueId?: string;
  venue?: string;
  maxRegistrations?: number;
  maxParticipants?: number;
  tags?: string[];
  perks?: string;
  venueDetails?: string;
  venueAllocationRequestedTo?: 'Dean' | 'Faculty' | 'None';
  eventCoordinatorId?: string;
  eventCoordinatorName?: string;
  facultyCoordinatorId?: string;
  facultyCoordinatorName?: string;
  upiQrUrl?: string;
  bannerUrl?: string;
  posterUrl?: string;
  isFinalized?: boolean;
  createdBy?: string;
}

export interface SavedEvent {
  userId: string;
  eventId: string;
}

export type ActivityCategory = 'Workshop' | 'Seminar' | 'Competition' | 'Webinar' | 'Meetup' | 'Project' | 'Other';

export interface Activity {
  id: string;
  clubId: string;
  title: string;
  description: string;
  category: ActivityCategory;
  date: string;
  location?: string;
  outcome?: string;
  mediaUrls?: string[];
  participantsCount?: number;
  isPublic?: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  clubId?: string;
}

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  message: string;
  clubId?: string;
  createdAt?: string;
  status?: 'Pending' | 'In Progress' | 'Resolved';
}

export interface ContextState {
  user: User | null;
  activeContext: 'Global' | string;
}

// --- UPDATED CHAT TYPES ---

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // array of userIds
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content?: string; // Optional if only media/poll
  timestamp: string;
  clubId?: string;
  channelScope?: 'member' | 'broadcast';
  recipientId?: string;

  // New Features
  type: 'text' | 'image' | 'video' | 'audio' | 'location' | 'poll' | 'system';
  status: 'sent' | 'delivered' | 'read';

  // Media Fields
  mediaUrl?: string;

  // Location Fields
  latitude?: number;
  longitude?: number;

  // Poll Fields
  pollQuestion?: string;
  pollOptions?: PollOption[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  senderName?: string;
  userId?: string;
  createdAt?: string;
  link?: string;
}

export interface SessionArchive {
  id: string;
  sessionName: string;
  archivedAt: string;
  archivedBy: string;
  data: {
    events: Event[];
    registrations: Registration[];
    applicants: Applicant[];
    logs: AuditLog[];
    messages: Message[];
    notifications: Notification[];
  };
}

// --- DEVELOPER / TEAM TYPES ---

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  desc?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  email?: string;
  image?: string;
  linkedin?: string;
  github?: string;
  isLead: boolean;
  education: Education[];
  experience: Experience[];
  achievements: Achievement[];
}

export interface Mentor {
  id: string;
  name: string;
  designation: string;
  image?: string;
  link?: string;
}

export interface DevConfig {
  developedUnderName: string;
  developedUnderUrl: string;
  developedUnderLogo?: string;
  authorizedEmails: string[];
}
export interface Proposal {
  id: string;
  type: 'Club' | 'Team' | 'Event';
  title: string;
  category: string;
  proposerName: string;
  proposerRoll: string;
  proposerEmail: string;
  missionStatement: string;
  estimatedMembers: number;
  status: 'PendingDean' | 'PendingSystemAdmin' | 'Approved' | 'Rejected';
  timestamp: string;
  deanResponse?: string;
}
