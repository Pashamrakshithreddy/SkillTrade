import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  X,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  Search,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file";
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage?: Message;
  unreadCount: number;
  online: boolean;
}

interface MessagingInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  initialConversationId?: string;
  currentUserId: string;
}

const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participantId: "user1",
    participantName: "Alex Chen",
    participantAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    lastMessage: {
      id: "msg1",
      senderId: "user1",
      content:
        "Hi! I'd love to discuss the React development trade opportunity.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "text",
      read: false,
    },
    unreadCount: 2,
    online: true,
  },
  {
    id: "conv2",
    participantId: "user2",
    participantName: "Sarah Martinez",
    participantAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    lastMessage: {
      id: "msg2",
      senderId: "currentUser",
      content:
        "Thanks for the design feedback! When can we start the skill exchange?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text",
      read: true,
    },
    unreadCount: 0,
    online: false,
  },
  {
    id: "conv3",
    participantId: "user3",
    participantName: "Mike Johnson",
    participantAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    lastMessage: {
      id: "msg3",
      senderId: "user3",
      content:
        "The project collaboration sounds amazing! Let's set up a time to chat.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      type: "text",
      read: false,
    },
    unreadCount: 1,
    online: true,
  },
];

const mockMessages: { [key: string]: Message[] } = {
  conv1: [
    {
      id: "msg1_1",
      senderId: "user1",
      content: "Hi there! I saw your post about React development skills.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      type: "text",
      read: true,
    },
    {
      id: "msg1_2",
      senderId: "currentUser",
      content:
        "Hello! Yes, I'd be happy to help with React development. What kind of UI/UX design skills are you offering?",
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      type: "text",
      read: true,
    },
    {
      id: "msg1_3",
      senderId: "user1",
      content:
        "I have 5+ years of experience in Figma, Adobe Creative Suite, and user research. I can help you design better interfaces for your projects.",
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
      type: "text",
      read: true,
    },
    {
      id: "msg1_4",
      senderId: "user1",
      content:
        "Hi! I'd love to discuss the React development trade opportunity.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "text",
      read: false,
    },
  ],
  conv2: [
    {
      id: "msg2_1",
      senderId: "user2",
      content:
        "Your portfolio looks amazing! I love the attention to detail in your React components.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      type: "text",
      read: true,
    },
    {
      id: "msg2_2",
      senderId: "currentUser",
      content:
        "Thanks for the design feedback! When can we start the skill exchange?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text",
      read: true,
    },
  ],
  conv3: [
    {
      id: "msg3_1",
      senderId: "user3",
      content:
        "The project collaboration sounds amazing! Let's set up a time to chat.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      type: "text",
      read: false,
    },
  ],
};

export const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  isOpen,
  onClose,
  initialConversationId,
  currentUserId,
}) => {
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(initialConversationId || conversations[0]?.id || null);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>(
    mockMessages,
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "text",
      read: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), message],
    }));

    // Update conversation's last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? { ...conv, lastMessage: message }
          : conv,
      ),
    );

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const currentConversation = conversations.find(
    (conv) => conv.id === selectedConversation,
  );
  const currentMessages = selectedConversation
    ? messages[selectedConversation] || []
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex overflow-hidden border border-gray-200">
        {/* Sidebar - Conversations List */}
        <div
          className={cn(
            "w-80 border-r border-gray-200 flex flex-col bg-gray-50",
            "lg:flex",
            selectedConversation ? "hidden lg:flex" : "flex",
          )}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                  title="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  Messages
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={cn(
                  "w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors border-b border-gray-100",
                  selectedConversation === conversation.id &&
                    "bg-primary/5 border-r-2 border-r-primary",
                )}
              >
                <div className="relative">
                  <img
                    src={conversation.participantAvatar}
                    alt={conversation.participantName}
                    className="w-12 h-12 rounded-full"
                  />
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.participantName}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div
          className={cn(
            "flex-1 flex flex-col",
            !selectedConversation && "hidden lg:flex",
          )}
        >
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                    title="Back to conversations"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <img
                      src={currentConversation.participantAvatar}
                      alt={currentConversation.participantName}
                      className="w-10 h-10 rounded-full"
                    />
                    {currentConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {currentConversation.participantName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currentConversation.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.senderId === currentUserId
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm",
                        message.senderId === currentUserId
                          ? "bg-primary text-white ml-4"
                          : "bg-white text-gray-900 border border-gray-200 mr-4",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.senderId === currentUserId
                            ? "text-primary-foreground/70"
                            : "text-gray-500",
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:bg-white"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="rounded-full p-2 h-auto"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
