import React, { KeyboardEvent, useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Ajouter une compétence...',
  suggestions = []
}) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onChange([...tags, input.trim()]);
      }
      setInput('');
      setShowSuggestions(false);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim()) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const addSuggestion = (suggestion: string) => {
    if (!tags.includes(suggestion)) {
      onChange([...tags, suggestion]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="focus:outline-none hover:text-primary-800 dark:hover:text-primary-100"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 min-w-[120px] outline-none bg-transparent dark:text-white"
        />
      </div>
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => addSuggestion(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;