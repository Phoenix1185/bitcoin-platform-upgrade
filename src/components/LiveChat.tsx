import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Headphones,
  Bot,
  User as UserIcon
} from 'lucide-react';
import { toast } from 'sonner';
import type { LiveChatMessage, LiveChatSession } from '@/types/support';

export default function LiveChat() {
  const { state } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [session, setSession] = useState<LiveChatSession | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  const startChat = async () => {
    if (!state.user) {
      toast.error('Please log in to use live chat');
      return;
    }

    // Simulate starting a chat session
    const newSession: LiveChatSession = {
      id: `CHAT-${Date.now()}`,
      userId: state.user.id,
      userName: state.user.name,
      userEmail: state.user.email,
      status: 'waiting',
      startedAt: new Date().toISOString(),
      messages: [
        {
          id: `MSG-${Date.now()}`,
          userId: 'bot',
          userName: 'BitWealth Bot',
          userRole: 'bot',
          message: '👋 Hello! Welcome to BitWealth support.\n\nI\'m here to help you with:\n• Account questions\n• Deposit/Withdrawal issues\n• Investment plans\n• Technical support\n\nWhat can I help you with today?',
          createdAt: new Date().toISOString(),
          isRead: true,
        },
      ],
    };
    setSession(newSession);
    setIsOpen(true);
  };

  const sendMessage = async () => {
    if (!message.trim() || !session) return;

    const userMessage: LiveChatMessage = {
      id: `MSG-${Date.now()}`,
      userId: state.user?.id || 'guest',
      userName: state.user?.name || 'Guest',
      userRole: 'user',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      isRead: true,
    };

    setSession({
      ...session,
      messages: [...session.messages, userMessage],
    });
    setMessage('');

    // Simulate bot response
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = getBotResponse(message.trim());
      const botMessage: LiveChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        userId: 'bot',
        userName: 'BitWealth Bot',
        userRole: 'bot',
        message: botResponse,
        createdAt: new Date().toISOString(),
        isRead: true,
      };
      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, botMessage],
      } : null);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('deposit') || lowerMsg.includes('add money')) {
      return 'To make a deposit:\n1. Go to your Dashboard\n2. Click "Deposit"\n3. Choose your preferred cryptocurrency\n4. Send funds to the provided address\n5. Your deposit will be credited after confirmation\n\nNeed help with a specific deposit issue?';
    }
    
    if (lowerMsg.includes('withdraw') || lowerMsg.includes('withdrawal')) {
      return 'To withdraw funds:\n1. Go to your Dashboard\n2. Click "Withdraw"\n3. Enter the amount and your wallet address\n4. Submit your request\n5. Withdrawals are processed within 24-48 hours\n\nMinimum withdrawal: $50';
    }
    
    if (lowerMsg.includes('invest') || lowerMsg.includes('plan')) {
      return 'We offer 5 investment plans:\n• Basic: $100-$999 (5% daily)\n• Standard: $1,000-$4,999 (8% daily)\n• Gold: $5,000-$24,999 (12% daily)\n• Platinum: $25,000-$49,999 (15% daily)\n• Diamond: $50,000+ (20% daily)\n\nVisit the Investment Plans page for more details!';
    }
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return 'Hello! 👋 How can I assist you today?';
    }
    
    if (lowerMsg.includes('contact') || lowerMsg.includes('support') || lowerMsg.includes('agent')) {
      return 'You can reach our support team:\n\n📧 Email: support@bitwealth.com\n📞 Phone: +1 (555) 123-4567\n🎫 Tickets: Submit a ticket from your dashboard\n\nOur support hours: 24/7';
    }
    
    if (lowerMsg.includes('kyc') || lowerMsg.includes('verify') || lowerMsg.includes('verification')) {
      return 'KYC verification is required for withdrawals over $1,000.\n\nTo verify your account:\n1. Go to Profile → KYC Verification\n2. Upload a valid ID (Passport/Driver\'s License)\n3. Upload a proof of address\n4. Submit for review\n\nVerification takes 1-2 business days.';
    }
    
    return 'I understand. For more specific assistance, I can connect you with a human support agent or you can:\n\n• Create a support ticket for complex issues\n• Check our FAQ page for common questions\n• Email us at support@bitwealth.com\n\nIs there anything else I can help with?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={startChat}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-crypto-yellow text-crypto-dark px-4 py-3 rounded-full shadow-lg hover:bg-crypto-yellow-light transition-all duration-300 hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium text-sm">Live Chat</span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed right-6 z-50 bg-crypto-card border border-crypto-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isMinimized 
          ? 'bottom-6 w-72 h-14' 
          : 'bottom-6 w-80 md:w-96 h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-crypto-yellow to-crypto-yellow-dark p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-crypto-dark rounded-full flex items-center justify-center">
            <Headphones className="w-4 h-4 text-crypto-yellow" />
          </div>
          <div>
            <p className="font-medium text-crypto-dark text-sm">BitWealth Support</p>
            <p className="text-xs text-crypto-dark/70">
              {session?.status === 'waiting' ? 'Waiting for agent...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-crypto-dark/20 rounded transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-crypto-dark" />
            ) : (
              <Minimize2 className="w-4 h-4 text-crypto-dark" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-crypto-dark/20 rounded transition-colors"
          >
            <X className="w-4 h-4 text-crypto-dark" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 h-[380px] overflow-y-auto p-4 space-y-3 bg-crypto-dark/50">
            {session?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.userRole === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.userRole === 'bot' 
                    ? 'bg-purple-500/20' 
                    : msg.userRole === 'user'
                    ? 'bg-crypto-yellow/20'
                    : 'bg-blue-500/20'
                }`}>
                  {msg.userRole === 'bot' ? (
                    <Bot className="w-4 h-4 text-purple-400" />
                  ) : msg.userRole === 'user' ? (
                    <UserIcon className="w-4 h-4 text-crypto-yellow" />
                  ) : (
                    <Headphones className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                    msg.userRole === 'user'
                      ? 'bg-crypto-yellow text-crypto-dark rounded-br-none'
                      : 'bg-crypto-card text-white rounded-bl-none'
                  }`}
                >
                  <p className="font-medium text-xs mb-1 opacity-70">
                    {msg.userName}
                  </p>
                  <p className="whitespace-pre-line">{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${
                    msg.userRole === 'user' ? 'text-crypto-dark/60' : 'text-gray-500'
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-purple-400" />
                </div>
                <div className="bg-crypto-card p-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-crypto-card border-t border-crypto-border">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-crypto-dark border-crypto-border text-white text-sm h-10"
              />
              <Button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light h-10 px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 text-center">
              Press Enter to send • Support available 24/7
            </p>
          </div>
        </>
      )}
    </div>
  );
}
