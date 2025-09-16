import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessagingInterface } from "@/components/messaging/MessagingInterface";
import { MessageButton } from "@/components/messaging/MessageButton";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "about" | "skills">(
    "posts",
  );
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userProfile");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (!isAuth || !userData) {
      navigate("/create-profile");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Load user's posts
    const posts = JSON.parse(localStorage.getItem("userPosts") || "[]");
    setUserPosts(posts);
  }, [navigate]);

  const handleMessageUser = (userId: string, userName?: string) => {
    setIsMessagingOpen(true);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/feed")}
                className="text-muted-foreground hover:text-foreground transition-colors"
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
              <h1 className="text-xl font-semibold text-foreground">Profile</h1>
            </div>
            <Button onClick={() => navigate("/create-post")}>New Post</Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Professional Profile Layout */}
        <div className="bg-white border border-border mb-8">
          {/* Banner */}
          <div className="bg-primary h-32"></div>

          {/* Profile Content */}
          <div className="px-6 py-6">
            <div className="flex items-start space-x-6 -mt-16">
              {/* Profile Picture */}
              <img
                src={
                  user.profilePicture ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                }
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg flex-shrink-0"
              />

              {/* Profile Info */}
              <div className="flex-1 mt-16">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {user.name}
                  </h1>
                  <div className="flex items-center space-x-3">
                    <MessageButton
                      userId={user.id || "current-user"}
                      userName={user.name}
                      onClick={handleMessageUser}
                      variant="default"
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      💬 Message
                    </MessageButton>
                    <Button
                      onClick={() => navigate("/edit-profile")}
                      variant="outline"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                  <span>{user.location || "Location not set"}</span>
                  <span>•</span>
                  <span>Joined {new Date().getFullYear() - 1}</span>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-primary font-medium">
                    Available for skill trades
                  </span>
                </div>

                {/* Skills */}
                {user.skillsIHave && user.skillsIHave.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-foreground mb-2">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsIHave.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-border pt-6 mt-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {userPosts.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">4.9</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">23</div>
                  <div className="text-sm text-muted-foreground">Trades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {user.skillsIHave?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Skills</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: "posts", label: "Posts", count: userPosts.length },
                { id: "about", label: "About" },
                {
                  id: "skills",
                  label: "Skills",
                  count: user.skillsIHave?.length || 0,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "py-4 px-2 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700",
                  )}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 text-xs text-gray-400">
                      ({tab.count})
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "posts" && (
              <div className="space-y-6">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={post.user.avatar}
                          alt={post.user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold">
                              {post.user.username}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {post.timestamp}
                            </span>
                          </div>
                          <p className="text-gray-800 mb-3">{post.content}</p>

                          {post.image && (
                            <img
                              src={post.image}
                              alt="Post content"
                              className="w-full max-w-md rounded-lg border border-gray-200 mb-3"
                            />
                          )}

                          {(post.skillsOffered || post.skillsNeeded) && (
                            <div className="space-y-2">
                              {post.skillsOffered && (
                                <div className="flex flex-wrap gap-1">
                                  <span className="text-xs text-green-600 font-medium">
                                    Offering:
                                  </span>
                                  {post.skillsOffered.map(
                                    (skill: string, index: number) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
                                      >
                                        {skill}
                                      </span>
                                    ),
                                  )}
                                </div>
                              )}
                              {post.skillsNeeded && (
                                <div className="flex flex-wrap gap-1">
                                  <span className="text-xs text-blue-600 font-medium">
                                    Seeking:
                                  </span>
                                  {post.skillsNeeded.map(
                                    (skill: string, index: number) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                                      >
                                        {skill}
                                      </span>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">
                              {post.likes} likes
                            </span>
                            <span className="text-sm text-gray-500">
                              {post.comments} comments
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No posts yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Share your first post to get started with skill trading
                    </p>
                    <Button
                      onClick={() => navigate("/create-post")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Create Your First Post
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-8">
                {/* Bio Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {user.bio || user.whatImGoodAt || "No bio provided yet."}
                  </p>
                </div>

                {/* Professional Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 text-green-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Location
                    </h4>
                    <p className="text-gray-700">
                      {user.location || "Location not specified"}
                    </p>
                  </div>

                  {/* Experience Level */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 text-green-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Experience Level
                    </h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                      {user.experienceLevel || "Intermediate"}
                    </span>
                  </div>
                </div>

                {/* Skills Offered */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-4 h-4 text-green-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Skills I Offer
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {user.skillsIHave?.length || 0} skills
                    </span>
                  </h4>
                  {user.skillsIHave && user.skillsIHave.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {user.skillsIHave.map((skill: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <span className="text-green-800 font-medium">
                            {skill}
                          </span>
                          <div className="flex items-center space-x-1">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < (index % 3) + 3
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-green-600 font-medium">
                              {(index % 3) + 3}/5
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
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
                      <p className="text-gray-500 italic mb-3">
                        No skills listed yet
                      </p>
                      <Button
                        onClick={() => navigate("/edit-profile")}
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        Add Skills
                      </Button>
                    </div>
                  )}
                </div>

                {/* Top Skills */}
                {user.topSkills && user.topSkills.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      Top Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.topSkills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold border border-blue-200"
                        >
                          ⭐ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Preferences */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-4 h-4 text-purple-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                    Work Preferences
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Availability:
                      </span>
                      <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
                        {user.preferredWork || "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Seeking:
                      </span>
                      <div className="mt-1 text-gray-600">
                        {user.workWanted ||
                          "Open to various skill trading opportunities"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trading Statistics */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-4 h-4 text-green-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-12V9a2 2 0 00-2-2M5 3v4a2 2 0 002 2h10a2 2 0 002-2V3a2 2 0 00-2-2H7a2 2 0 00-2 2z"
                      />
                    </svg>
                    Trading Performance
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-green-600">
                        23
                      </div>
                      <div className="text-sm text-gray-600">
                        Trades Completed
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        +3 this month
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600">
                        4.9
                      </div>
                      <div className="text-sm text-gray-600">
                        Average Rating
                      </div>
                      <div className="flex justify-center mt-1">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${
                                i < 5 ? "text-yellow-400" : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-purple-600">
                        87%
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                      <div className="text-xs text-purple-600 mt-1">
                        Above average
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-orange-600">
                        15
                      </div>
                      <div className="text-sm text-gray-600">
                        Active Projects
                      </div>
                      <div className="text-xs text-orange-600 mt-1">
                        5 pending
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-3">
                      Recent Activity
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">
                          Completed React mentorship with Sarah Martinez
                        </span>
                        <span className="text-xs text-gray-400">
                          2 days ago
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">
                          Started new UI/UX collaboration
                        </span>
                        <span className="text-xs text-gray-400">
                          1 week ago
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-600">
                          Received 5-star rating from Alex Chen
                        </span>
                        <span className="text-xs text-gray-400">
                          2 weeks ago
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Social Links */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    Connect & Collaborate
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Email
                          </div>
                          <div className="text-sm text-gray-600">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.568 8.16c-.169 1.858-.896 3.391-2.125 4.619-1.228 1.228-2.76 1.956-4.619 2.125-.372.034-.69-.264-.69-.642V9.737c0-.378.318-.676.69-.642 1.858.169 3.391.896 4.619 2.125s1.956 2.76 2.125 4.619c.034.372-.264.69-.642.69h-4.525z" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Response Time
                          </div>
                          <div className="text-sm text-green-600">
                            Usually within 2 hours
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <MessageButton
                        userId={user.id || "current-user"}
                        userName={user.name}
                        onClick={handleMessageUser}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        💬 Start Conversation
                      </MessageButton>
                      <Button
                        variant="outline"
                        className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        🤝 Propose Skill Trade
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                      >
                        ⭐ Leave Review
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-6">
                {/* Top Skills Showcase */}
                {user.topSkills && user.topSkills.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Top Expertise
                      <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {user.topSkills.map((skill: string, index: number) => (
                        <div
                          key={index}
                          className="bg-white border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-green-800">
                              {skill}
                            </h4>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (index % 2) + 4
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Experience:</span>
                              <span className="font-medium">
                                {index + 2}+ years
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Projects:</span>
                              <span className="font-medium">
                                {(index + 1) * 5}+ completed
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Availability:</span>
                              <span className="text-green-600 font-medium">
                                Available
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Skills with Categories */}
                {user.skillsIHave && user.skillsIHave.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                      Complete Skill Portfolio
                      <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {user.skillsIHave.length} skills
                      </span>
                    </h3>

                    {/* Skill Categories */}
                    <div className="space-y-4">
                      {/* Technical Skills */}
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          Technical Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {user.skillsIHave
                            .filter((skill: string) =>
                              [
                                "React",
                                "JavaScript",
                                "TypeScript",
                                "Node.js",
                                "Python",
                                "HTML",
                                "CSS",
                                "coding",
                                "programming",
                              ].some((tech) =>
                                skill
                                  .toLowerCase()
                                  .includes(tech.toLowerCase()),
                              ),
                            )
                            .map((skill: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Creative Skills */}
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                          Creative Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {user.skillsIHave
                            .filter((skill: string) =>
                              [
                                "Design",
                                "UI",
                                "UX",
                                "Figma",
                                "Photoshop",
                                "Creative",
                                "Art",
                                "Video",
                              ].some((creative) =>
                                skill
                                  .toLowerCase()
                                  .includes(creative.toLowerCase()),
                              ),
                            )
                            .map((skill: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium border border-purple-200 hover:bg-purple-200 transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Other Skills */}
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-2 flex items-center">
                          <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                          Other Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {user.skillsIHave
                            .filter(
                              (skill: string) =>
                                ![
                                  "React",
                                  "JavaScript",
                                  "TypeScript",
                                  "Node.js",
                                  "Python",
                                  "HTML",
                                  "CSS",
                                  "coding",
                                  "programming",
                                  "Design",
                                  "UI",
                                  "UX",
                                  "Figma",
                                  "Photoshop",
                                  "Creative",
                                  "Art",
                                  "Video",
                                ].some((tech) =>
                                  skill
                                    .toLowerCase()
                                    .includes(tech.toLowerCase()),
                                ),
                            )
                            .map((skill: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Skill Development Progress */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-md font-medium text-gray-800 mb-3">
                        Skill Development Journey
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Skills Mastered
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            {user.skillsIHave.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Hours Teaching
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            120+ hours
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Skills Learned
                          </span>
                          <span className="text-sm font-medium text-purple-600">
                            8 new skills
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(!user.skillsIHave || user.skillsIHave.length === 0) && (
                  <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-10 h-10 text-green-600"
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Build Your Skill Portfolio
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Showcase your expertise and attract the right skill
                      trading opportunities. Start by adding your skills to help
                      others discover what you can offer.
                    </p>
                    <div className="space-y-3">
                      <Button
                        onClick={() => navigate("/edit-profile")}
                        className="bg-green-600 hover:bg-green-700 px-6"
                      >
                        Add Your First Skill
                      </Button>
                      <p className="text-sm text-gray-500">
                        💡 Tip: Add at least 3-5 skills to get better trading
                        matches
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messaging Interface */}
      <MessagingInterface
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        currentUserId="currentUser"
      />
    </div>
  );
};

export default Profile;
