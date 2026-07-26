import { useEffect, useState } from 'react';
import {
  Mail,
  MailOpen,
  Search,
  Clock,
  User,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, READ

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/contact');
      setMessages(data.messages);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'ALL' ? true : filter === 'UNREAD' ? !msg.isRead : msg.isRead;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal mb-1">Messages</h1>
          <p className="text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
          />
        </div>
        <div className="flex space-x-2">
          {['ALL', 'UNREAD', 'READ'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
                filter === f
                  ? 'bg-gold text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'UNREAD' ? 'Unread' : 'Read'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-charcoal mb-2">No messages</h3>
            <p className="text-gray-500 text-sm">Contact form submissions will appear here.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => !msg.isRead && markAsRead(msg.id)}
              className={`bg-white rounded-xl border p-6 cursor-pointer transition-all ${
                msg.isRead
                  ? 'border-gray-100'
                  : 'border-gold/30 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    msg.isRead ? 'bg-gray-100' : 'bg-gold/10'
                  }`}>
                    {msg.isRead ? (
                      <MailOpen size={18} className="text-gray-400" />
                    ) : (
                      <Mail size={18} className="text-gold" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">{msg.name}</p>
                    <p className="text-xs text-gray-400">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!msg.isRead && (
                    <span className="w-2 h-2 bg-gold rounded-full" />
                  )}
                  <span className="text-xs text-gray-400 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-medium text-charcoal mb-2">{msg.subject}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{msg.message}</p>

              {msg.phone && (
                <div className="mt-3 flex items-center space-x-2 text-xs text-gray-400">
                  <User size={12} />
                  <span>{msg.phone}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}