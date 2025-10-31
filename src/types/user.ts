export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  skills: string[];
  location?: string;
  company?: string;
  projects: string[];  // IDs des projets de l'utilisateur
  joinedDate: string;
  lastActive: string;
}

export interface UserProfileUpdate extends Partial<Omit<UserProfile, 'uid' | 'email' | 'joinedDate'>> {}