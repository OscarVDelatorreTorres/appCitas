import React from 'react';
import { Calendar } from 'lucide-react';

interface YearSelectorProps {
  years: string[];
  selectedYear: string;
  onSelect: (year: string) => void;
  disabled?: boolean;
}

const YearSelector: React.FC<YearSelectorProps> = ({ 
  years, 
  selectedYear, 
  onSelect,
  disabled 
}) => {
  return (
    <div className="relative w-full max-w-xs mt-4 md:mt-0">
      <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar por Año
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => onSelect(e.target.value)}
          disabled={disabled}
          className="block w-full pl-10 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-lg shadow-sm border bg-white appearance-none transition duration-150 ease-in-out"
        >
          <option value="">Todos los años</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default YearSelector;