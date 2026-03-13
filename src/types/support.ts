export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: 'general' | 'deposit' | 'withdrawal' | 'investment' | 'technical' | 'account' | 'kyc';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  attachments?: string[];
}

export interface TicketReply {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: 'user' | 'admin' | 'support';
  message: string;
  createdAt: string;
  attachments?: string[];
  isInternal?: boolean;
}

export interface LiveChatMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: 'user' | 'admin' | 'support' | 'bot';
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface LiveChatSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'active' | 'waiting' | 'closed';
  startedAt: string;
  endedAt?: string;
  assignedAgent?: string;
  messages: LiveChatMessage[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'account' | 'support' | 'system' | 'security';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export const TICKET_CATEGORIES = [
  { value: 'general', label: 'General Inquiry', icon: 'HelpCircle' },
  { value: 'deposit', label: 'Deposit Issue', icon: 'Wallet' },
  { value: 'withdrawal', label: 'Withdrawal Issue', icon: 'DollarSign' },
  { value: 'investment', label: 'Investment Question', icon: 'TrendingUp' },
  { value: 'technical', label: 'Technical Support', icon: 'Settings' },
  { value: 'account', label: 'Account Issue', icon: 'User' },
  { value: 'kyc', label: 'KYC/Verification', icon: 'Shield' },
] as const;

export const TICKET_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-gray-500' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
] as const;

export const TICKET_STATUSES = [
  { value: 'open', label: 'Open', color: 'bg-yellow-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-500' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-500' },
] as const;
