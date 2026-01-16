import React from 'react';
import { Citation } from '../types';
import { ExternalLink, BookOpen, Link as LinkIcon } from 'lucide-react';

interface CitationTableProps {
  citations: Citation[];
}

const CitationTable: React.FC<CitationTableProps> = ({ citations }) => {
  if (citations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow border border-dashed border-gray-300">
        <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay citas</h3>
        <p className="mt-1 text-sm text-gray-500">Selecciona un artículo arriba para ver los detalles.</p>
      </div>
    );
  }

  // Sort by year descending locally for the table
  const sortedCitations = [...citations].sort((a, b) => {
    return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
  });

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                Año
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artículo que cita
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                URL / DOI
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Evidencia de índice de revista que cita
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Indización Revista
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCitations.map((citation, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {citation.year}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="line-clamp-2" title={citation.citingArticle}>
                    {citation.citingArticle}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-accent">
                  {citation.articleUrl ? (
                    <a 
                      href={citation.articleUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Enlace
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs">No disponible</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-accent">
                   {citation.evidenceUrl ? (
                    <a 
                      href={citation.evidenceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:underline"
                      title="Ver evidencia"
                    >
                      <LinkIcon className="w-4 h-4 mr-1" />
                      Ver Evidencia
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs">Sin evidencia</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {citation.maxJournalIndex || '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        Mostrando {sortedCitations.length} citas
      </div>
    </div>
  );
};

export default CitationTable;