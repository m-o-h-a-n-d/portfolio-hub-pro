import { useState, useEffect } from 'react';
import { apiGet } from '../../api/request';
import { Mail, Clock, Check, Trash2, Eye } from 'lucide-react';

const MessagesInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/messages');
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMarkAsRead = (id) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, read: true } : m
    ));
  };

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const openMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      handleMarkAsRead(message.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="h2 text-white-2">Messages Inbox</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {messages.filter(m => !m.read).length} unread messages
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Messages List */}
        <div 
          className="lg:col-span-2 bg-card border border-border rounded-[20px] overflow-hidden"
          style={{ background: 'var(--bg-gradient-jet)' }}
        >
          <div className="max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => openMessage(message)}
                  className={`p-4 border-b border-border cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id 
                      ? 'bg-primary/10' 
                      : message.read 
                        ? 'hover:bg-onyx/50' 
                        : 'bg-onyx/30 hover:bg-onyx/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Indicator */}
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      message.read ? 'bg-muted' : 'bg-primary'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className={`text-sm truncate ${
                          message.read ? 'text-foreground' : 'text-foreground font-semibold'
                        }`}>
                          {message.name}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(message.date).split(',')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{message.email}</p>
                      <p className="text-sm text-light-gray truncate mt-1">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div 
          className="lg:col-span-3 bg-card border border-border rounded-[20px] p-6"
          style={{ background: 'var(--bg-gradient-jet)' }}
        >
          {selectedMessage ? (
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="h3 text-white-2 mb-1">{selectedMessage.name}</h3>
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="text-primary text-sm hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-lg bg-onyx text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
                <Clock className="w-4 h-4" />
                <span>{formatDate(selectedMessage.date)}</span>
                {selectedMessage.read && (
                  <span className="flex items-center gap-1 text-green-500 ml-4">
                    <Check className="w-4 h-4" />
                    Read
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="bg-onyx/30 rounded-xl p-6">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Reply Button */}
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Contact from Portfolio`}
                className="form-btn mt-6"
              >
                <Mail className="w-5 h-5" />
                <span>Reply via Email</span>
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Eye className="w-12 h-12 mb-4" />
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesInbox;
