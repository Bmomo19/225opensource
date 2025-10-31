import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, ArrowUpDown, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProjectGrid from '../components/ProjectGrid';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { Project } from '../types';
import { getAllProjects } from '../services/projectService';

const AllProjects = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const firebaseProjects = await getAllProjects();
        setProjects(firebaseProjects);
        setLoading(false);
        setShowLoader(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setLoading(false);
        setShowLoader(false);
      }
    };

    fetchProjects();
  }, []);

  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project: Project) => {
      project.techStack.forEach((tech: string) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter((project: Project) => {
      const matchesSearch = searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTech = selectedTechnologies.length === 0 ||
        selectedTechnologies.every(tech => project.techStack.includes(tech));

      return matchesSearch && matchesTech;
    });

    switch (sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => {
          const scoreA = (a.stars || 0) + (a.forks || 0);
          const scoreB = (b.stars || 0) + (b.forks || 0);
          return scoreB - scoreA;
        });
        break;
      case 'alphabetical':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        break;
      default: // 'recent'
        filtered = [...filtered].sort((a, b) =>
          new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
        );
    }
    return filtered;
  }, [projects, searchQuery, selectedTechnologies, sortBy]);

  if (showLoader) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <Loader onLoadingComplete={() => setShowLoader(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 animate-fade-in pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center space-y-6 sm:space-y-8 mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-gray-900 dark:text-white leading-tight">
            Tous les projets
            <span className="block text-primary-400 mt-2">Open Source</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez l'ensemble des projets open source de 225 Open Source
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors group-focus-within:text-primary-400" />
            <input
              type="text"
              placeholder="Rechercher un projet, un auteur, une technologie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-base bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-primary-400 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-400 dark:focus:ring-primary-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Filtres et tri */}
        <div className="mt-8">
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-6">
              {/* Tri */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <ArrowUpDown className="w-4 h-4 text-primary-400" />
                  <span>Trier par:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                      sortBy === 'recent'
                        ? 'bg-primary-400 text-white shadow-lg shadow-primary-400/50'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Récent
                  </button>
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                      sortBy === 'popular'
                        ? 'bg-primary-400 text-white shadow-lg shadow-primary-400/50'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Populaire
                  </button>
                  <button
                    onClick={() => setSortBy('alphabetical')}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                      sortBy === 'alphabetical'
                        ? 'bg-primary-400 text-white shadow-lg shadow-primary-400/50'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    A à Z
                  </button>
                </div>
              </div>

              {/* Technologies */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4 text-primary-400" />
                  <span>Technologies:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTechnologies([])}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                      selectedTechnologies.length === 0
                        ? 'bg-primary-400 text-white shadow-lg shadow-primary-400/50'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Toutes
                  </button>
                  {allTechnologies.map((tech: string) => (
                    <button
                      key={tech}
                      onClick={() => {
                        const index = selectedTechnologies.indexOf(tech);
                        if (index === -1) {
                          setSelectedTechnologies([...selectedTechnologies, tech]);
                        } else {
                          setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
                        }
                      }}
                      className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                        selectedTechnologies.includes(tech)
                          ? 'bg-primary-400 text-white shadow-lg shadow-primary-400/50'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille de projets avec pagination */}
        <div className="mt-8">
          {!loading && filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Aucun projet ne correspond à vos critères de recherche.
              </p>
            </div>
          ) : (
            <ProjectGrid projects={filteredProjects} loading={loading} />
          )}
        </div>
      </div>

      <Footer />

      {/* Bouton Dashboard pour utilisateurs authentifiés */}
      {isAuthenticated && (
        <button
          onClick={() => navigate('/dashboard')}
          className="group fixed bottom-6 right-6 z-50 bg-primary-400 hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out w-12 h-12 hover:w-auto hover:pr-4 flex items-center justify-center overflow-hidden"
          title="Go to Dashboard"
        >
          <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <span className="max-w-0 group-hover:max-w-[200px] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out text-sm font-semibold whitespace-nowrap pr-1">
            Dashboard
          </span>
        </button>
      )}
    </div>
  );
};

export default AllProjects;
