import React from 'react';
import { GroupedCitation } from '../types';
import { ChevronDown, FileText } from 'lucide-react';

interface ArticleSelectorProps {
  groupedCitations: GroupedCitation[];
  selectedArticle: string;
  onSelect: (article: string) => void;
  disabled?: boolean;
}

const ArticleSelector: React.FC<ArticleSelectorProps> = ({ 
  groupedCitations, 
  selectedArticle, 
  onSelect,
  disabled 
}) => {
  return (
    <div className="relative w-full max-w-3xl">
      <label htmlFor="article-select" className="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar Artículo Citado (Ordenado por # de citas)
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FileText className="h-5 w-5 text-gray-400" />
        </div>
        <select
          id="article-select"
          value={selectedArticle}
          onChange={(e) => onSelect(e.target.value)}
          disabled={disabled}
          className="block w-full pl-10 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-lg shadow-sm border bg-white appearance-none transition duration-150 ease-in-out"
        >
          <option value="" disabled>-- Seleccione un artículo --</option>
          {groupedCitations.map((group, idx) => (
            <option key={`${idx}-${group.articleTitle.substring(0, 10)}`} value={group.articleTitle}>
              ({group.count}) {group.articleTitle}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default ArticleSelector;
