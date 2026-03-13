import type { SupportTicket, TicketReply, LiveChatMessage, LiveChatSession, Notification } from '@/types/support';

// Mock data for tickets
let mockTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    subject: 'Deposit not showing in account',
    message: 'I made a deposit of $500 via Bitcoin 2 hours ago but it is not showing in my account. Transaction ID: 0x123...abc',
    category: 'deposit',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'TKT-002',
    userId: 'user-2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    subject: 'Question about Gold Plan',
    message: 'What is the minimum withdrawal amount for the Gold Plan?',
    category: 'investment',
    priority: 'low',
    status: 'resolved',
    createdAt: '2024-01-14T14:00:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
    resolvedAt: '2024-01-14T16:30:00Z',
  },
];

let mockReplies: Record<string, TicketReply[]> = {
  'TKT-002': [
    {
      id: 'REP-001',
      ticketId: 'TKT-002',
      userId: 'admin-1',
      userName: 'Support Team',
      userRole: 'support',
      message: 'Hi Jane, the minimum withdrawal amount for the Gold Plan is $100. You can withdraw anytime after your investment period starts.',
      createdAt: '2024-01-14T16:30:00Z',
    },
  ],
};

let mockNotifications: Notification[] = [];

// Ticket functions
export async function createTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket> {
  const newTicket: SupportTicket = {
    ...ticket,
    id: `TKT-${String(mockTickets.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTickets.push(newTicket);
  return newTicket;
}

export async function getTickets(userId?: string): Promise<SupportTicket[]> {
  if (userId) {
    return mockTickets.filter(t => t.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return mockTickets.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getTicketById(ticketId: string): Promise<SupportTicket | null> {
  return mockTickets.find(t => t.id === ticketId) || null;
}

export async function updateTicket(ticketId: string, updates: Partial<SupportTicket>): Promise<SupportTicket | null> {
  const index = mockTickets.findIndex(t => t.id === ticketId);
  if (index === -1) return null;
  
  mockTickets[index] = {
    ...mockTickets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockTickets[index];
}

export async function addReply(reply: Omit<TicketReply, 'id' | 'createdAt'>): Promise<TicketReply> {
  const newReply: TicketReply = {
    ...reply,
    id: `REP-${String(Object.values(mockReplies).flat().length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
  };
  
  if (!mockReplies[reply.ticketId]) {
    mockReplies[reply.ticketId] = [];
  }
  mockReplies[reply.ticketId].push(newReply);
  
  // Update ticket status if reply is from support
  if (reply.userRole === 'support' || reply.userRole === 'admin') {
    const ticket = mockTickets.find(t => t.id === reply.ticketId);
    if (ticket && ticket.status === 'open') {
      await updateTicket(reply.ticketId, { status: 'in_progress' });
    }
  }
  
  return newReply;
}

export async function getReplies(ticketId: string): Promise<TicketReply[]> {
  return mockReplies[ticketId] || [];
}

// Notification functions
export async function createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<Notification> {
  const newNotification: Notification = {
    ...notification,
    id: `NOT-${String(mockNotifications.length + 1).padStart(3, '0')}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  mockNotifications.push(newNotification);
  return newNotification;
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  return mockNotifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  mockNotifications.forEach(n => {
    if (n.userId === userId) {
      n.isRead = true;
    }
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  return mockNotifications.filter(n => n.userId === userId && !n.isRead).length;
}

// Email notification templates
export const emailTemplates = {
  accountFrozen: (userName: string) => ({
    subject: 'Your BitWealth Account Has Been Frozen',
    body: `Dear ${userName},

Your account has been frozen due to suspicious activity. Please contact our support team to resolve this issue.

Support: support@bitwealth.com

Best regards,
BitWealth Team`,
  }),
  
  withdrawalApproved: (userName: string, amount: string, method: string) => ({
    subject: 'Your Withdrawal Has Been Approved',
    body: `Dear ${userName},

Your withdrawal of ${amount} via ${method} has been approved and is being processed.

You will receive your funds within 24-48 hours.

Best regards,
BitWealth Team`,
  }),
  
  withdrawalDeclined: (userName: string, amount: string, reason: string) => ({
    subject: 'Your Withdrawal Request Has Been Declined',
    body: `Dear ${userName},

Your withdrawal request of ${amount} has been declined.

Reason: ${reason}

If you have any questions, please contact our support team.

Best regards,
BitWealth Team`,
  }),
  
  depositConfirmed: (userName: string, amount: string, method: string) => ({
    subject: 'Your Deposit Has Been Confirmed',
    body: `Dear ${userName},

Your deposit of ${amount} via ${method} has been confirmed and added to your account balance.

You can now start investing!

Best regards,
BitWealth Team`,
  }),
  
  investmentStarted: (userName: string, planName: string, amount: string) => ({
    subject: 'Your Investment Has Started',
    body: `Dear ${userName},

Your investment of ${amount} in the ${planName} has been activated.

You will start receiving daily returns from tomorrow.

Best regards,
BitWealth Team`,
  }),
  
  ticketReply: (userName: string, ticketId: string) => ({
    subject: `New Reply to Your Support Ticket #${ticketId}`,
    body: `Dear ${userName},

You have received a new reply to your support ticket #${ticketId}.

Please log in to your account to view the reply.

Best regards,
BitWealth Support Team`,
  }),
};

// Live chat functions
let activeChatSessions: LiveChatSession[] = [];

export async function startLiveChat(userId: string, userName: string, userEmail: string): Promise<LiveChatSession> {
  const session: LiveChatSession = {
    id: `CHAT-${Date.now()}`,
    userId,
    userName,
    userEmail,
    status: 'waiting',
    startedAt: new Date().toISOString(),
    messages: [
      {
        id: `MSG-${Date.now()}`,
        userId: 'bot',
        userName: 'BitWealth Bot',
        userRole: 'bot',
        message: 'Hello! Welcome to BitWealth support. An agent will be with you shortly. How can I help you today?',
        createdAt: new Date().toISOString(),
        isRead: true,
      },
    ],
  };
  activeChatSessions.push(session);
  return session;
}

export async function sendChatMessage(sessionId: string, message: Omit<LiveChatMessage, 'id' | 'createdAt'>): Promise<LiveChatMessage> {
  const session = activeChatSessions.find(s => s.id === sessionId);
  if (!session) throw new Error('Chat session not found');
  
  const newMessage: LiveChatMessage = {
    ...message,
    id: `MSG-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  session.messages.push(newMessage);
  return newMessage;
}

export async function getChatSession(sessionId: string): Promise<LiveChatSession | null> {
  return activeChatSessions.find(s => s.id === sessionId) || null;
}

export async function closeChatSession(sessionId: string): Promise<void> {
  const session = activeChatSessions.find(s => s.id === sessionId);
  if (session) {
    session.status = 'closed';
    session.endedAt = new Date().toISOString();
  }
}
