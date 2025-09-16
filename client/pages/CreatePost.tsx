import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type PostType = 'offer_work' | 'request_work' | null;
type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
type Availability = 'full_time' | 'part_time' | 'project_based';

interface PostData {
  type: PostType;
  title: string;
  description: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  availability?: Availability;
  deadline?: string;
  workOffered?: string;
  workDemanded?: string;
  media?: {
    files: File[];
    previews: string[];
  };
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [currentSkill, setCurrentSkill] = useState('');
  const [postData, setPostData] = useState<PostData>({
    type: null,
    title: '',
    description: '',
    skills: [],
    experienceLevel: 'intermediate',
    availability: 'project_based',
    deadline: '',
    workOffered: '',
    workDemanded: '',
    media: {
      files: [],
      previews: []
    }
  });

  const addSkill = () => {
    if (currentSkill.trim() && !postData.skills.includes(currentSkill.trim())) {
      setPostData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setPostData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews: string[] = [];

    newFiles.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          newPreviews.push(preview);

          if (newPreviews.length === newFiles.length) {
            setPostData(prev => ({
              ...prev,
              media: {
                files: [...(prev.media?.files || []), ...newFiles],
                previews: [...(prev.media?.previews || []), ...newPreviews]
              }
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeMedia = (index: number) => {
    setPostData(prev => ({
      ...prev,
      media: {
        files: prev.media?.files.filter((_, i) => i !== index) || [],
        previews: prev.media?.previews.filter((_, i) => i !== index) || []
      }
    }));
  };

  const handleSubmit = () => {
    // Get current user data
    const userData = JSON.parse(localStorage.getItem('userProfile') || '{}');

    // Create new post object
    const newPost = {
      id: Date.now(),
      user: {
        name: userData.name || 'Anonymous User',
        username: userData.name?.toLowerCase().replace(/\s+/g, '_') || 'anonymous',
        avatar: userData.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        verified: false
      },
      content: `${postData.title}\n\n${postData.description}${postData.workOffered ? `\n\nWhat I can offer: ${postData.workOffered}` : ''}${postData.workDemanded ? `\n\nWhat I'm offering in return: ${postData.workDemanded}` : ''}`,
      type: postData.type === 'offer_work' ? 'skill_offer' : 'skill_request',
      timestamp: 'now',
      likes: 0,
      comments: 0,
      skillsOffered: postData.type === 'request_work' ? postData.skills : undefined,
      skillsNeeded: postData.type === 'offer_work' ? postData.skills : undefined,
      image: postData.media?.previews[0] || undefined
    };

    // Save post to localStorage (in a real app, you'd send to backend)
    const existingPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
    const updatedPosts = [newPost, ...existingPosts];
    localStorage.setItem('userPosts', JSON.stringify(updatedPosts));

    // Navigate back to the feed
    navigate('/feed');
  };

  const canProceed = () => {
    if (step === 1) return postData.type !== null;
    if (step === 2) {
      return postData.title && postData.description && postData.skills.length > 0;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/feed')}
                className="text-gray-600 hover:text-green-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Create Post</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Step {step} of 2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Step 1: Choose Post Type */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">What do you want to do?</h2>
              <p className="text-gray-600 text-lg">Choose the type of post you'd like to create</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Offer Work */}
              <button
                onClick={() => setPostData(prev => ({ ...prev, type: 'offer_work' }))}
                className={cn(
                  "group relative bg-white border-2 rounded-xl p-8 text-left transition-all duration-200 hover:shadow-lg",
                  postData.type === 'offer_work' 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:border-green-300"
                )}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                    postData.type === 'offer_work' ? "bg-green-500" : "bg-green-100 group-hover:bg-green-200"
                  )}>
                    <svg className={cn(
                      "w-6 h-6",
                      postData.type === 'offer_work' ? "text-white" : "text-green-600"
                    )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">I have work to offer</h3>
                    <p className="text-gray-600">Post a project or job opportunity</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>Describe the work you need done</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>Specify required skills and experience</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span>Set deadlines and expectations</span>
                  </li>
                </ul>
              </button>

              {/* Request Work */}
              <button
                onClick={() => setPostData(prev => ({ ...prev, type: 'request_work' }))}
                className={cn(
                  "group relative bg-white border-2 rounded-xl p-8 text-left transition-all duration-200 hover:shadow-lg",
                  postData.type === 'request_work' 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-blue-300"
                )}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                    postData.type === 'request_work' ? "bg-blue-500" : "bg-blue-100 group-hover:bg-blue-200"
                  )}>
                    <svg className={cn(
                      "w-6 h-6",
                      postData.type === 'request_work' ? "text-white" : "text-blue-600"
                    )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">I'm looking for work</h3>
                    <p className="text-gray-600">Showcase your skills and availability</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    <span>Highlight your skills and experience</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    <span>Show your availability and preferences</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    <span>Specify what you can offer in exchange</span>
                  </li>
                </ul>
              </button>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceed()}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Post Details */}
        {step === 2 && postData.type && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {postData.type === 'offer_work' ? 'Describe your project' : 'Tell us about yourself'}
              </h2>
              <p className="text-gray-600 text-lg">
                {postData.type === 'offer_work' 
                  ? 'Provide details about the work you need done'
                  : 'Share your skills and what you can offer'
                }
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  value={postData.title}
                  onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={postData.type === 'offer_work' 
                    ? "e.g., Need React developer for e-commerce website"
                    : "e.g., Experienced UI/UX designer available for projects"
                  }
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={postData.description}
                  onChange={(e) => setPostData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder={postData.type === 'offer_work'
                    ? "Describe the project scope, requirements, and what you're looking for..."
                    : "Describe your background, experience, and what makes you a great collaborator..."
                  }
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {postData.type === 'offer_work' ? 'Skills/Services Needed *' : 'Skills/Services Offered *'}
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Type a skill and press Enter"
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                    className="px-6 border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Add
                  </Button>
                </div>
                {postData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {postData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience Level Required *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['beginner', 'intermediate', 'advanced', 'expert'] as ExperienceLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPostData(prev => ({ ...prev, experienceLevel: level }))}
                      className={cn(
                        "py-3 px-4 text-sm font-medium rounded-lg border transition-colors capitalize",
                        postData.experienceLevel === level
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add Photos, Videos, or Files (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                      <p className="text-gray-600">
                        <span className="text-green-600 font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, MP4, PDF up to 10MB</p>
                    </div>
                  </label>
                </div>

                {/* Media Previews */}
                {postData.media && postData.media.previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {postData.media.previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        {postData.media?.files[index]?.type.startsWith('image/') ? (
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                        ) : postData.media?.files[index]?.type.startsWith('video/') ? (
                          <video
                            src={preview}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            controls={false}
                          />
                        ) : (
                          <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                          </div>
                        )}
                        <button
                          onClick={() => removeMedia(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                          {postData.media?.files[index]?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Conditional Fields */}
              {postData.type === 'request_work' ? (
                <>
                  {/* Availability */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Availability *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(['full_time', 'part_time', 'project_based'] as Availability[]).map((availability) => (
                        <button
                          key={availability}
                          type="button"
                          onClick={() => setPostData(prev => ({ ...prev, availability }))}
                          className={cn(
                            "py-3 px-4 text-sm font-medium rounded-lg border transition-colors",
                            postData.availability === availability
                              ? "bg-green-600 text-white border-green-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          )}
                        >
                          {availability === 'full_time' && 'Full Time'}
                          {availability === 'part_time' && 'Part Time'}
                          {availability === 'project_based' && 'Project Based'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Work Offered in Exchange */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      What can you offer in exchange?
                    </label>
                    <textarea
                      value={postData.workOffered}
                      onChange={(e) => setPostData(prev => ({ ...prev, workOffered: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                      placeholder="Describe what you can offer in return - your skills, services, or expertise..."
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Deadline
                    </label>
                    <input
                      type="date"
                      value={postData.deadline}
                      onChange={(e) => setPostData(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  {/* Work Demanded */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      What are you offering in return? *
                    </label>
                    <textarea
                      value={postData.workDemanded}
                      onChange={(e) => setPostData(prev => ({ ...prev, workDemanded: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                      placeholder="Describe what you can offer in exchange for the work - payment, other services, collaboration opportunities..."
                    />
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="px-6 py-3"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300"
              >
                Publish Post
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
