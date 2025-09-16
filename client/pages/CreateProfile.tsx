import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useNavigate } from "react-router-dom";

type ProfileFormData = {
  name: string;
  email: string;
  password: string;
  bio: string;
  location: string;
  skillsIHave: string[];
  skillsIWant: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | '';
  availability: 'full_time' | 'part_time' | 'project_based' | '';
  preferredWork: 'online' | 'offline' | 'both' | '';
};

export default function CreateProfile() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { createProfile, uploadProfilePicture } = useProfile();
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: "",
    email: "",
    password: "",
    bio: "",
    location: "",
    skillsIHave: [],
    skillsIWant: [],
    experienceLevel: "",
    availability: "",
    preferredWork: "",
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentWantedSkill, setCurrentWantedSkill] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSkillAdd = (type: 'have' | 'want') => {
    const skill = type === 'have' ? currentSkill : currentWantedSkill;
    if (!skill.trim()) return;

    if (type === 'have') {
      setProfileData(prev => ({
        ...prev,
        skillsIHave: [...prev.skillsIHave, skill.trim()]
      }));
      setCurrentSkill("");
    } else {
      setProfileData(prev => ({
        ...prev,
        skillsIWant: [...prev.skillsIWant, skill.trim()]
      }));
      setCurrentWantedSkill("");
    }
  };

  const handleSkillRemove = (skillToRemove: string, type: 'have' | 'want') => {
    if (type === 'have') {
      setProfileData(prev => ({
        ...prev,
        skillsIHave: prev.skillsIHave.filter(skill => skill !== skillToRemove)
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        skillsIWant: prev.skillsIWant.filter(skill => skill !== skillToRemove)
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (!profileData.name || !profileData.email || !profileData.password) {
        setError("Please fill in all required fields");
        return;
      }

      // Step 1: Sign up with Supabase Auth
      const authResult = await signUp(profileData.email, profileData.password);
      if (authResult.error) {
        setError(authResult.error);
        return;
      }

      // Step 2: Upload profile picture if provided
      let profilePictureUrl = "";
      if (profilePictureFile) {
        const uploadResult = await uploadProfilePicture(profilePictureFile);
        if (uploadResult.error) {
          console.warn("Profile picture upload failed:", uploadResult.error);
          // Continue without profile picture - don't fail the entire signup
        } else {
          profilePictureUrl = uploadResult.url || "";
        }
      }

      // Step 3: Create profile (excluding password - never store passwords client-side)
      const { password, ...profileDataWithoutPassword } = profileData;
      const profileResult = await createProfile({
        ...profileDataWithoutPassword,
        profilePicture: profilePictureUrl,
      });

      if (profileResult.error) {
        setError(profileResult.error);
        return;
      }

      // Success! Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Your SkillTrade Profile</CardTitle>
            <CardDescription>
              Join our community of professionals trading skills and growing together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profilePicturePreview} />
                  <AvatarFallback>
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="profilePicture" className="cursor-pointer">
                    <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Photo</span>
                    </div>
                  </Label>
                  <Input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={profileData.password}
                  onChange={(e) => setProfileData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Create a secure password"
                  required
                  className="mt-1"
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell others about yourself and your professional background..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Skills I Have */}
              <div>
                <Label>Skills I Have</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      placeholder="Add a skill you can offer"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd('have'))}
                    />
                    <Button
                      type="button"
                      onClick={() => handleSkillAdd('have')}
                      disabled={!currentSkill.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skillsIHave.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleSkillRemove(skill, 'have')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills I Want */}
              <div>
                <Label>Skills I Want to Learn</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={currentWantedSkill}
                      onChange={(e) => setCurrentWantedSkill(e.target.value)}
                      placeholder="Add a skill you want to learn"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd('want'))}
                    />
                    <Button
                      type="button"
                      onClick={() => handleSkillAdd('want')}
                      disabled={!currentWantedSkill.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skillsIWant.map((skill, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleSkillRemove(skill, 'want')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select
                    value={profileData.experienceLevel}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced' | 'expert') =>
                      setProfileData(prev => ({ ...prev, experienceLevel: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={profileData.availability}
                    onValueChange={(value: 'full_time' | 'part_time' | 'project_based') =>
                      setProfileData(prev => ({ ...prev, availability: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="project_based">Project Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preferredWork">Preferred Work</Label>
                  <Select
                    value={profileData.preferredWork}
                    onValueChange={(value: 'online' | 'offline' | 'both') =>
                      setProfileData(prev => ({ ...prev, preferredWork: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Profile..." : "Create Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
