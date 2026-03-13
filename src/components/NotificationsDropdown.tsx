import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, TrendingUp, TrendingDown, Wallet, Shield, Info, Megaphone } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

type NotificationCategory = 'all' | 'deposit' | 'investment' | 'withdrawal' | 'announcement';

export default function NotificationsDropdown() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  // Filter notifications by category
  const filteredNotifications = state.notifications.filter(notification => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'announcement') return notification.type === 'system' || notification.type === 'announcement';
    return notification.type === activeCategory;
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'investment':
        return <Wallet className="w-4 h-4 text-crypto-yellow" />;
      case 'return':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'kyc':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'account':
        return <Info className="w-4 h-4 text-gray-400" />;
      case 'system':
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const categoryTabs: { id: NotificationCategory; label: string; count?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'deposit', label: 'Deposit', count: state.notifications.filter(n => n.type === 'deposit' && !n.isRead).length },
    { id: 'investment', label: 'Investment', count: state.notifications.filter(n => n.type === 'investment' && !n.isRead).length },
    { id: 'withdrawal', label: 'Withdrawal', count: state.notifications.filter(n => n.type === 'withdrawal' && !n.isRead).length },
    { id: 'announcement', label: 'Announcements', count: state.notifications.filter(n => (n.type === 'system' || n.type === 'announcement') && !n.isRead).length },
  ];

  const handleMarkAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      dispatch({ type: 'MARK_NOTIFICATION_READ', id });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', state.user?.id)
        .eq('is_read', false);
      
      dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      dispatch({ type: 'DELETE_NOTIFICATION', id });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification: typeof state.notifications[0]) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-crypto-card"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-[420px] bg-[#1a1d24] border border-crypto-border rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-crypto-border bg-crypto-dark/50">
              <div>
                <h3 className="text-white font-semibold">Notifications</h3>
                <p className="text-xs text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'No new notifications'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="p-1.5 text-gray-400 hover:text-crypto-yellow hover:bg-crypto-card rounded-lg transition-colors"
                    title="Mark all as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => navigate('/profile?tab=notifications')}
                  className="text-xs text-crypto-yellow hover:underline"
                >
                  View All
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1 px-2 py-2 border-b border-crypto-border bg-crypto-dark/30 overflow-x-auto">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === tab.id
                      ? 'bg-crypto-yellow text-crypto-dark'
                      : 'text-gray-400 hover:text-white hover:bg-crypto-card'
                  }`}
                >
                  {tab.label}
                  {tab.count && tab.count > 0 && (
                    <span className={`min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full ${
                      activeCategory === tab.id ? 'bg-crypto-dark text-crypto-yellow' : 'bg-red-500 text-white'
                    }`}>
                      {tab.count > 99 ? '99+' : tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="max-h-[360px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 rounded-full bg-crypto-card flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-center">
                    {state.notifications.length === 0 
                      ? 'No notifications yet' 
                      : `No ${activeCategory === 'announcement' ? 'announcements' : activeCategory} notifications`}
                  </p>
                  <p className="text-gray-500 text-sm text-center mt-1">
                    {state.notifications.length === 0 
                      ? "We'll notify you when something important happens" 
                      : 'Check other categories for more notifications'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-crypto-border/50">
                  {filteredNotifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`group relative p-4 hover:bg-crypto-card/50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-crypto-yellow/5' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          !notification.isRead ? 'bg-crypto-yellow/20' : 'bg-crypto-card'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium ${
                              !notification.isRead ? 'text-white' : 'text-gray-300'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-crypto-yellow rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDistanceToNow(new Date(notification.createdAt))}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-crypto-yellow hover:bg-crypto-card rounded"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="px-4 py-3 border-t border-crypto-border bg-crypto-dark/50">
                <button
                  onClick={() => {
                    navigate('/profile?tab=notifications');
                    setIsOpen(false);
                  }}
                  className="w-full py-2 text-sm text-crypto-yellow hover:text-crypto-yellow-light font-medium transition-colors"
                >
                  See All {activeCategory !== 'all' && activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
