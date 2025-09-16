import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";
import { MessageButton } from "@/components/messaging/MessageButton";
import { FloatingMessageButton } from "@/components/FloatingMessageButton";

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
    username: string;
    verified?: boolean;
  };
  content: string;
  type: "skill_offer" | "skill_request" | "project" | "general";
  timestamp: string;
  likes: number;
  comments: number;
  skillsOffered?: string[];
  skillsNeeded?: string[];
  image?: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    user: {
      name: "Alex Chen",
      username: "alexchen_dev",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      verified: true,
    },
    content:
      "Looking to trade my React development skills for UI/UX design mentorship. I have 3 years of experience building modern web apps and would love to learn design fundamentals from an expert.",
    type: "skill_request",
    timestamp: "2h",
    likes: 124,
    comments: 18,
    skillsOffered: ["React", "JavaScript", "Node.js"],
    skillsNeeded: ["UI/UX Design", "Figma"],
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=entropy",
  },
  {
    id: 2,
    user: {
      name: "Sarah Martinez",
      username: "sarah_designs",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    },
    content:
      "Just completed an amazing skill trade! Taught digital marketing strategy in exchange for Python programming lessons. Here's my workspace setup that helped me stay productive during our sessions. This platform is incredible for professional growth! 🚀",
    type: "general",
    timestamp: "4h",
    likes: 89,
    comments: 12,
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop&crop=entropy",
  },
  {
    id: 3,
    user: {
      name: "Mike Johnson",
      username: "mike_creates",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      verified: true,
    },
    content:
      "Building a skill-sharing mobile app. Need developers, designers, and marketing experts. Let's collaborate and create something amazing together! Here's our initial concept and wireframes.",
    type: "project",
    timestamp: "6h",
    likes: 203,
    comments: 41,
    skillsNeeded: ["Mobile Development", "UI Design", "Marketing"],
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&crop=entropy",
  },
  {
    id: 4,
    user: {
      name: "Emily Rodriguez",
      username: "emily_writes",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    content:
      "Quick question for the community: Has anyone successfully traded copywriting skills for web development lessons? I'm looking to transition into tech and would love to hear about your experiences. What platforms or approaches worked best for you?",
    type: "general",
    timestamp: "8h",
    likes: 67,
    comments: 29,
  },
  {
    id: 5,
    user: {
      name: "David Kim",
      username: "david_analytics",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      verified: true,
    },
    content:
      "Offering free data analysis consultation this week! I'll help you interpret your business metrics in exchange for feedback on my new dashboard tool. Perfect opportunity for small business owners who want insights but can't afford expensive analytics services.",
    type: "skill_offer",
    timestamp: "12h",
    likes: 156,
    comments: 34,
    skillsOffered: [
      "Data Analysis",
      "Business Intelligence",
      "Excel",
      "Python",
    ],
  },
  {
    id: 6,
    user: {
      name: "Jessica Park",
      username: "jess_learns",
      avatar:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    },
    content:
      "Update: The skill trading session I mentioned last week was incredible! Learned so much about graphic design fundamentals. My partner was patient and really knew how to break down complex concepts. Already seeing improvements in my work. This community is amazing! 💪",
    type: "general",
    timestamp: "1d",
    likes: 92,
    comments: 15,
  },
  {
    id: 7,
    user: {
      name: "Carlos Martinez",
      username: "carlos_code",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      verified: true,
    },
    content:
      "Looking for someone experienced in SEO to help optimize my portfolio website. In return, I can teach you advanced JavaScript concepts, React hooks, or help with any coding challenges you're facing. I have 5+ years of experience as a frontend developer.",
    type: "skill_request",
    timestamp: "1d",
    likes: 134,
    comments: 42,
    skillsOffered: [
      "JavaScript",
      "React",
      "Frontend Development",
      "TypeScript",
    ],
    skillsNeeded: ["SEO", "Digital Marketing", "Content Strategy"],
  },
];

const SocialFeed: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const userData = localStorage.getItem("userProfile");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (!isAuth || !userData) {
      navigate("/create-profile");
      return;
    }

    setUser(JSON.parse(userData));

    // Load user posts from localStorage and combine with mock posts
    const userPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");
    setPosts([...userPosts, ...mockPosts]);
  }, [navigate]);

  const handleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes - 1 } : post,
          ),
        );
      } else {
        newLiked.add(postId);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post,
          ),
        );
      }
      return newLiked;
    });
  };

  const handleMessageUser = (userId: string, userName?: string) => {
    // Create or find conversation with this user
    const conversationId = `conv_${userId}`;
    setSelectedConversationId(conversationId);
    setIsMessagingOpen(true);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* First Row - Logo, Nav, Actions */}
          <div className="flex items-center justify-between">
            {/* Logo & Back Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-green-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                title="Back to home"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ST</span>
                </div>
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">
                  SkillTrade
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <button className="text-green-600 font-semibold border-b-2 border-green-600 pb-1">
                Feed
              </button>
              <button className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                My Trades
              </button>
              <button
                onClick={() => navigate("/messages")}
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                Messages
              </button>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* New Post Button */}
              <button
                onClick={() => navigate("/create-post")}
                className="px-3 py-2 lg:px-4 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <span className="hidden sm:inline">New Post</span>
                <span className="sm:hidden">+</span>
              </button>

              {/* User Profile */}
              <button
                onClick={() => navigate("/profile")}
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src={
                    user.profilePicture ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  }
                  alt={user.name}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-gray-200"
                />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Second Row - Search Bar (Always Visible) */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search skills, people, or projects..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <nav className="px-4 py-4 space-y-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-3 text-green-600 font-semibold bg-green-50 rounded-lg"
              >
                📱 Feed
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-3 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                🤝 My Trades
              </button>
              <button
                onClick={() => {
                  navigate("/messages");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                💬 Messages
              </button>

              {/* Mobile User Info */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                >
                  <img
                    src={
                      user.profilePicture ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    }
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-green-200"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.location || "Skill Trader"}
                    </div>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Professional Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Offer Skills
                    </h3>
                    <p className="text-sm text-gray-600">
                      Share your expertise
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Find Skills</h3>
                    <p className="text-sm text-gray-600">
                      Discover new talents
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Start Project
                    </h3>
                    <p className="text-sm text-gray-600">
                      Launch collaboration
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-lg"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4 pb-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => navigate("/profile")}
                        className="hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={post.user.avatar}
                          alt={post.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </button>
                      <div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => navigate("/profile")}
                            className="font-semibold text-sm hover:text-green-600 transition-colors"
                          >
                            {post.user.username}
                          </button>
                          {post.user.verified && (
                            <svg
                              className="w-4 h-4 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {post.timestamp}
                        </span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-sm leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="px-4 pb-3">
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full rounded-lg border border-gray-200"
                      />
                    </div>
                  )}

                  {/* Skills Tags */}
                  <div className="px-4 pb-3">
                    {(post.skillsOffered || post.skillsNeeded) && (
                      <div className="space-y-2">
                        {post.skillsOffered && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-green-600 font-medium">
                              Offering:
                            </span>
                            {post.skillsOffered.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        {post.skillsNeeded && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-blue-600 font-medium">
                              Seeking:
                            </span>
                            {post.skillsNeeded.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={cn(
                            "flex items-center space-x-1",
                            likedPosts.has(post.id)
                              ? "text-red-500"
                              : "text-gray-700 hover:text-gray-900",
                          )}
                        >
                          <svg
                            className="w-6 h-6"
                            fill={
                              likedPosts.has(post.id) ? "currentColor" : "none"
                            }
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                        <button className="text-gray-700 hover:text-gray-900">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </button>
                        <MessageButton
                          userId={post.user.username}
                          userName={post.user.name}
                          onClick={handleMessageUser}
                          variant="ghost"
                          size="sm"
                          className="text-gray-700 hover:text-primary hover:bg-primary/10 px-3 py-1 text-sm"
                        >
                          Message
                        </MessageButton>
                      </div>
                      <button className="text-gray-700 hover:text-gray-900">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-sm">
                          {post.likes} likes
                        </span>
                        {post.comments > 0 && (
                          <p className="text-gray-500 text-sm mt-1">
                            View all {post.comments} comments
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageButton
                          userId={post.user.username}
                          userName={post.user.name}
                          onClick={handleMessageUser}
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          💬 Message
                        </MessageButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="space-y-6">
              {/* Your Profile */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <button
                    onClick={() => navigate("/profile")}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={
                        user.profilePicture ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                      }
                      alt={user.name}
                      className="w-16 h-16 rounded-full border-2 border-green-200"
                    />
                  </button>
                  <div>
                    <h3 className="font-bold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {user.location || "Location not set"}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {user.topSkills && user.topSkills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      My Top Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {user.topSkills
                        .slice(0, 3)
                        .map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                  <div>
                    <div className="font-bold text-lg text-gray-900">23</div>
                    <div className="text-gray-600 text-xs">Trades</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-green-600">4.9</div>
                    <div className="text-gray-600 text-xs">Rating</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-blue-600">156</div>
                    <div className="text-gray-600 text-xs">Points</div>
                  </div>
                </div>
              </div>

              {/* Skill Market */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  🔥 Hot Skills Market
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      skill: "React Development",
                      demand: "High",
                      change: "+12%",
                    },
                    { skill: "UI/UX Design", demand: "High", change: "+8%" },
                    {
                      skill: "Digital Marketing",
                      demand: "Medium",
                      change: "+5%",
                    },
                    { skill: "Data Analysis", demand: "High", change: "+15%" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          {item.skill}
                        </div>
                        <div className="text-xs text-gray-600">
                          Demand: {item.demand}
                        </div>
                      </div>
                      <div className="text-green-600 text-sm font-semibold">
                        {item.change}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 px-4 py-2 text-green-600 border border-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                  View All Skills
                </button>
              </div>

              {/* Quick Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  📊 Community Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">
                      Active Traders
                    </span>
                    <span className="font-semibold text-gray-900">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">
                      Skills Traded Today
                    </span>
                    <span className="font-semibold text-green-600">143</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">
                      Projects Started
                    </span>
                    <span className="font-semibold text-blue-600">27</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messaging Interface */}
      <MessagingInterface
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        initialConversationId={selectedConversationId || undefined}
        currentUserId="currentUser"
      />

      {/* Floating Message Button */}
      <FloatingMessageButton />
    </div>
  );
};

export default SocialFeed;
