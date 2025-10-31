import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import TagInput from './TagInput';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTechnologies: string[];
  onTechnologiesChange: (techs: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTechnologies,
  onTechnologiesChange,
  sortBy,
  onSortChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,
}) => {
  return (
    <div className="w-full space-y-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      {/* Barre de recherche principale */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un projet..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <button
          onClick={onToggleAdvancedFilters}
          className={`flex items-center px-4 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            showAdvancedFilters ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          <span>Filtres</span>
        </button>
      </div>

      {/* Filtres avancés */}
      {showAdvancedFilters && (
        <div className="space-y-4 pt-4 border-t dark:border-gray-600">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Technologies
            </label>
            <TagInput
              tags={selectedTechnologies}
              onChange={onTechnologiesChange}
              placeholder="Ajouter une technologie..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trier par
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 dark:text-white"
            >
              <option value="recent">Plus récents</option>
              <option value="stars">Plus d'étoiles</option>
              <option value="forks">Plus de forks</option>
              <option value="name">Nom (A-Z)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;