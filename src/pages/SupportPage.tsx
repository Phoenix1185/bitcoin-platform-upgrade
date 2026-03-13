import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  Send,
  Headphones,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { getTickets, createTicket, getReplies, addReply } from '@/lib/supportService';
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES } from '@/types/support';
import type { SupportTicket, TicketReply } from '@/types/support';

export default function SupportPage() {
  const { state } = useStore();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    category: 'general' as const,
    priority: 'medium' as const,
  });

  useEffect(() => {
    loadTickets();
  }, [state.user?.id]);

  const loadTickets = async () => {
    if (!state.user) return;
    setLoading(true);
    const data = await getTickets(state.user.id);
    setTickets(data);
    setLoading(false);
  };

  const handleCreateTicket = async () => {
    if (!state.user) {
      toast.error('Please log in to create a ticket');
      return;
    }

    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    await createTicket({
      userId: state.user.id,
      userName: state.user.name,
      userEmail: state.user.email,
      subject: newTicket.subject,
      message: newTicket.message,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
    });

    toast.success('Ticket created successfully');
    setIsCreateDialogOpen(false);
    setNewTicket({ subject: '', message: '', category: 'general', priority: 'medium' });
    loadTickets();
  };

  const openTicketDetail = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    const ticketReplies = await getReplies(ticket.id);
    setReplies(ticketReplies);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket || !state.user) return;

    await addReply({
      ticketId: selectedTicket.id,
      userId: state.user.id,
      userName: state.user.name,
      userRole: 'user',
      message: replyMessage,
    });

    const updatedReplies = await getReplies(selectedTicket.id);
    setReplies(updatedReplies);
    setReplyMessage('');
    toast.success('Reply sent');
  };

  const getStatusColor = (status: string) => {
    const statusConfig = TICKET_STATUSES.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const priorityConfig = TICKET_PRIORITIES.find(p => p.value === priority);
    return priorityConfig?.color || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              How Can We <span className="text-gradient">Help You?</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you with any questions or issues.
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-crypto-card border-crypto-border">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-crypto-yellow/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-crypto-yellow" />
                </div>
                <h3 className="text-white font-semibold mb-2">Email Support</h3>
                <p className="text-gray-400 text-sm mb-3">Get a response within 24 hours</p>
                <a 
                  href="mailto:support@bitwealth.com" 
                  className="text-crypto-yellow hover:underline text-sm"
                >
                  support@bitwealth.com
                </a>
              </CardContent>
            </Card>

            <Card className="bg-crypto-card border-crypto-border">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-crypto-yellow/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-crypto-yellow" />
                </div>
                <h3 className="text-white font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-400 text-sm mb-3">Available 24/7 for urgent issues</p>
                <a 
                  href="tel:+15551234567" 
                  className="text-crypto-yellow hover:underline text-sm"
                >
                  +1 (555) 123-4567
                </a>
              </CardContent>
            </Card>

            <Card className="bg-crypto-card border-crypto-border">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-crypto-yellow/10 flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-7 h-7 text-crypto-yellow" />
                </div>
                <h3 className="text-white font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-400 text-sm mb-3">Instant support via chat</p>
                <p className="text-crypto-yellow text-sm">Available 24/7</p>
              </CardContent>
            </Card>
          </div>

          {/* Tickets Section */}
          <Tabs defaultValue="tickets" className="space-y-6">
            <TabsList className="bg-crypto-card border border-crypto-border">
              <TabsTrigger 
                value="tickets"
                className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                My Tickets
              </TabsTrigger>
              <TabsTrigger 
                value="faq"
                className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tickets">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Support Tickets</CardTitle>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Ticket
                  </Button>
                </CardHeader>
                <CardContent>
                  {!state.user ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400">Please log in to view your tickets</p>
                    </div>
                  ) : loading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-crypto-dark rounded-lg" />
                      ))}
                    </div>
                  ) : tickets.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">No tickets yet</p>
                      <p className="text-gray-500 text-sm">Create a ticket to get support</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          onClick={() => openTicketDetail(ticket)}
                          className="p-4 bg-crypto-dark rounded-lg border border-crypto-border hover:border-crypto-yellow/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium">{ticket.subject}</h4>
                                <Badge className={`${getStatusColor(ticket.status)} text-white text-xs`}>
                                  {TICKET_STATUSES.find(s => s.value === ticket.status)?.label}
                                </Badge>
                                <Badge className={`${getPriorityColor(ticket.priority)} text-white text-xs`}>
                                  {TICKET_PRIORITIES.find(p => p.value === ticket.priority)?.label}
                                </Badge>
                              </div>
                              <p className="text-gray-400 text-sm line-clamp-1">{ticket.message}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                                <span>#{ticket.id}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      q: 'How do I make a deposit?',
                      a: 'Go to your Dashboard, click "Deposit", select your preferred cryptocurrency, and send funds to the provided address. Your deposit will be credited after network confirmation.',
                    },
                    {
                      q: 'What is the minimum withdrawal amount?',
                      a: 'The minimum withdrawal amount is $50 for all payment methods.',
                    },
                    {
                      q: 'How long do withdrawals take?',
                      a: 'Withdrawals are processed within 24-48 hours after approval.',
                    },
                    {
                      q: 'Is KYC verification required?',
                      a: 'KYC is required for withdrawals over $1,000. Verification typically takes 1-2 business days.',
                    },
                    {
                      q: 'How are daily returns calculated?',
                      a: 'Daily returns are calculated as a percentage of your investment amount. For example, a $1,000 investment in a 10% daily return plan earns $100 per day.',
                    },
                  ].map((faq, index) => (
                    <div key={index} className="p-4 bg-crypto-dark rounded-lg">
                      <h4 className="text-white font-medium mb-2">{faq.q}</h4>
                      <p className="text-gray-400 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Create Support Ticket</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className="bg-crypto-dark border-crypto-border text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value as any })}
                  className="w-full bg-crypto-dark border border-crypto-border text-white rounded-md px-3 py-2"
                >
                  {TICKET_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                  className="w-full bg-crypto-dark border border-crypto-border text-white rounded-md px-3 py-2"
                >
                  {TICKET_PRIORITIES.map((pri) => (
                    <option key={pri.value} value={pri.value}>{pri.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={5}
                className="bg-crypto-dark border-crypto-border text-white resize-none"
              />
            </div>

            <Button
              onClick={handleCreateTicket}
              className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Ticket
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="bg-crypto-card border-crypto-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${getStatusColor(selectedTicket.status)} text-white`}>
                    {TICKET_STATUSES.find(s => s.value === selectedTicket.status)?.label}
                  </Badge>
                  <span className="text-gray-500 text-sm">#{selectedTicket.id}</span>
                </div>
                <DialogTitle className="text-xl font-display">{selectedTicket.subject}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Original Message */}
                <div className="p-4 bg-crypto-dark rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-crypto-yellow/20 flex items-center justify-center">
                      <span className="text-crypto-yellow text-sm font-bold">
                        {selectedTicket.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{selectedTicket.userName}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(selectedTicket.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-line">{selectedTicket.message}</p>
                </div>

                {/* Replies */}
                {replies.map((reply) => (
                  <div 
                    key={reply.id} 
                    className={`p-4 rounded-lg ${
                      reply.userRole === 'user' ? 'bg-crypto-dark' : 'bg-blue-500/10 border border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        reply.userRole === 'user' 
                          ? 'bg-crypto-yellow/20' 
                          : 'bg-blue-500/20'
                      }`}>
                        <span className={`text-sm font-bold ${
                          reply.userRole === 'user' ? 'text-crypto-yellow' : 'text-blue-400'
                        }`}>
                          {reply.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{reply.userName}</p>
                        <p className="text-gray-500 text-xs">
                          {reply.userRole === 'support' && 'Support Agent • '}
                          {new Date(reply.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-line">{reply.message}</p>
                  </div>
                ))}

                {/* Reply Input */}
                {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                  <div className="space-y-3 pt-4 border-t border-crypto-border">
                    <Label>Reply</Label>
                    <Textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      rows={3}
                      className="bg-crypto-dark border-crypto-border text-white resize-none"
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                      className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
