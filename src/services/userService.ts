import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile, UserProfileUpdate } from '../types/user';

const USERS_COLLECTION = 'users';

export const createUserProfile = async (uid: string, userData: Partial<UserProfile>): Promise<void> => {
  const userProfile: UserProfile = {
    uid,
    email: userData.email || '',
    displayName: userData.displayName || '',
    skills: [],
    projects: [],
    joinedDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    ...userData
  };

  await setDoc(doc(db, USERS_COLLECTION, uid), userProfile);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
  return userDoc.exists() ? userDoc.data() as UserProfile : null;
};

export const updateUserProfile = async (uid: string, updates: UserProfileUpdate): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  updates.lastActive = new Date().toISOString();
  await updateDoc(userRef, updates as Record<string, any>);
};

export const addProjectToUser = async (uid: string, projectId: string): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    const userData = userDoc.data() as UserProfile;
    if (!userData.projects.includes(projectId)) {
      await updateDoc(userRef, {
        projects: [...userData.projects, projectId],
        lastActive: new Date().toISOString()
      });
    }
  }
};