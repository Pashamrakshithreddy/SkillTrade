import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type UserProfile = {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  profilePicture?: string;
  skillsIHave?: string[];
  skillsIWant?: string[];
  topSkills?: string[];
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  availability?: 'full_time' | 'part_time' | 'project_based';
  preferredWork?: 'online' | 'offline' | 'both';
  created_at?: string;
  updated_at?: string;
} | null;

type ProfileContextType = {
  profile: UserProfile;
  loading: boolean;
  createProfile: (profileData: Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ error?: string }>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ error?: string }>;
  uploadProfilePicture: (file: File) => Promise<{ url?: string; error?: string }>;
  hasProfile: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(null);
  const [loading, setLoading] = useState(true);

  const createProfile = async (profileData: Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user) {
        return { error: 'User not authenticated' };
      }

      // TODO: Replace with Supabase profile creation
      console.log('TODO: Create profile in Supabase', { profileData, userId: user.id });
      
      // For now, simulate successful profile creation
      const newProfile: UserProfile = {
        id: 'temp-profile-id',
        user_id: user.id,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setProfile(newProfile);
      return {};
    } catch (error) {
      console.error('Create profile error:', error);
      return { error: 'Failed to create profile' };
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      if (!user || !profile) {
        return { error: 'User not authenticated or no profile exists' };
      }

      // TODO: Replace with Supabase profile update
      console.log('TODO: Update profile in Supabase', { profileData, userId: user.id });
      
      // For now, simulate successful profile update
      const updatedProfile: UserProfile = {
        ...profile,
        ...profileData,
        updated_at: new Date().toISOString(),
      };
      
      setProfile(updatedProfile);
      return {};
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: 'Failed to update profile' };
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      if (!user) {
        return { error: 'User not authenticated' };
      }

      // TODO: Replace with Supabase Storage upload
      console.log('TODO: Upload to Supabase Storage', { fileName: file.name, fileSize: file.size });
      
      // For now, create a temporary object URL (this will be replaced with Supabase Storage URL)
      const tempUrl = URL.createObjectURL(file);
      return { url: tempUrl };
    } catch (error) {
      console.error('Upload error:', error);
      return { error: 'Failed to upload image' };
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated || !user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        // TODO: Replace with Supabase profile fetch
        console.log('TODO: Fetch profile from Supabase', { userId: user.id });
        
        // For now, simulate no existing profile
        setProfile(null);
      } catch (error) {
        console.error('Load profile error:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, isAuthenticated]);

  const value = {
    profile,
    loading,
    createProfile,
    updateProfile,
    uploadProfilePicture,
    hasProfile: !!profile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
