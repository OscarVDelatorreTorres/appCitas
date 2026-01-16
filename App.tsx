import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchCitationData } from './services/sheetService';
import { generatePDF } from './services/pdfService';
import { Citation, GroupedCitation } from './types';
import ArticleSelector from './components/ArticleSelector';
import CitationTable from './components/CitationTable';
import { RefreshCw, Download, Book, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load data from the sheet
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCitationData();
      setCitations(data);
      // If we have data and nothing selected, we could optionally select the first one, 
      // but usually better to let user choose.
    } catch (err) {
      setError('Error al conectar con Google Sheets. Verifique su conexión o la URL del archivo.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derive grouped articles and sort by count DESC
  const groupedArticles = useMemo<GroupedCitation[]>(() => {
    const map = new Map<string, number>();
    
    citations.forEach(cit => {
      const title = cit.citedArticle?.trim();
      if (title) {
        map.set(title, (map.get(title) || 0) + 1);
      }
    });

    const groups: GroupedCitation[] = Array.from(map.entries()).map(([articleTitle, count]) => ({
      articleTitle,
      count
    }));

    // Sort by count descending
    return groups.sort((a, b) => b.count - a.count);
  }, [citations]);

  // Filter citations based on selection
  const filteredCitations = useMemo(() => {
    if (!selectedArticle) return [];
    return citations.filter(c => c.citedArticle?.trim() === selectedArticle);
  }, [citations, selectedArticle]);

  // Handle PDF Download
  const handleDownloadPDF = () => {
    if (!selectedArticle || filteredCitations.length === 0) return;
    
    // Attempt to find a google scholar URL from the filtered data, or use the article URL
    // In the prompt, the user asks to "visualize the URL of the Google Scholar link".
    // We'll prioritize looking for a specific scholar URL if matched in future column mapping, 
    // but currently we use the 'articleUrl' or a generic fallback for display.
    const urlToDisplay = filteredCitations[0].articleUrl || '';
    
    generatePDF(filteredCitations, selectedArticle, urlToDisplay);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Book className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Repositorio de Citas del Dr. Oscar De la Torre
            </h1>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar Datos
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error de carga</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <ArticleSelector 
              groupedCitations={groupedArticles}
              selectedArticle={selectedArticle}
              onSelect={setSelectedArticle}
              disabled={loading || citations.length === 0}
            />

            {selectedArticle && (
               <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent shadow-md transition-all hover:-translate-y-0.5"
              >
                <Download className="mr-2 h-5 w-5" />
                Descargar Reporte PDF
              </button>
            )}
          </div>
        </div>

        {/* Selected Info Summary (Optional visual enhancement) */}
        {selectedArticle && filteredCitations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
               <p className="text-xs text-gray-500 uppercase font-semibold">Total Citas</p>
               <p className="text-2xl font-bold text-gray-900">{filteredCitations.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 col-span-2">
               <p className="text-xs text-gray-500 uppercase font-semibold">Artículo Seleccionado</p>
               <p className="text-lg font-medium text-gray-900 truncate" title={selectedArticle}>{selectedArticle}</p>
            </div>
          </div>
        )}

        {/* Table Section */}
        <CitationTable citations={filteredCitations} />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Repositorio de Citas del Dr. Oscar De la Torre. Datos sincronizados con Google Drive.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;