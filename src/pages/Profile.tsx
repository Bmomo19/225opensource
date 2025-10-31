import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types/user';
import { getUserProfile, updateUserProfile, createUserProfile } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TagInput from '../components/TagInput';
import { commonSkills } from '../data/commonSkills';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          let userProfile = await getUserProfile(user.uid);
          if (!userProfile) {
            // Créer un profil par défaut si aucun n'existe
            const defaultProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              skills: [],
              projects: [],
              joinedDate: new Date().toISOString(),
              lastActive: new Date().toISOString()
            };
            await createUserProfile(user.uid, defaultProfile);
            userProfile = await getUserProfile(user.uid);
          }
          setProfile(userProfile);
          setFormData(userProfile || {});
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.uid && formData) {
      await updateUserProfile(user.uid, formData);
      const updatedProfile = await getUserProfile(user.uid);
      setProfile(updatedProfile);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Erreur lors du chargement du profil
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 mb-4 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour au tableau de bord</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {!isEditing ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={profile.photoURL || '/default-avatar.png'}
                  alt={profile.displayName}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.displayName}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Modifier le profil
              </button>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bio</h2>
              <p className="text-gray-600 dark:text-gray-300">{profile.bio || 'Aucune bio'}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                )) || 'Aucune compétence ajoutée'}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Liens</h2>
              <div className="space-y-2">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500"
                  >
                    <span>GitHub</span>
                  </a>
                )}
                {profile.twitterUrl && (
                  <a
                    href={profile.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500"
                  >
                    <span>Twitter</span>
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500"
                  >
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom d'affichage
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub URL
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Compétences
              </label>
              <TagInput
                tags={formData.skills || []}
                onChange={(newTags) => setFormData(prev => ({ ...prev, skills: newTags }))}
                suggestions={commonSkills}
                placeholder="Ajouter une compétence..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default Profile;