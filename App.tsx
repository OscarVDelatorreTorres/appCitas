import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchCitationData } from './services/sheetService';
import { generatePDF } from './services/pdfService';
import { Citation, GroupedCitation } from './types';
import ArticleSelector from './components/ArticleSelector';
import YearSelector from './components/YearSelector';
import CitationTable from './components/CitationTable';
import { RefreshCw, Download, AlertTriangle, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load data from the sheet
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCitationData();
      setCitations(data);
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

  // Reset year when article changes
  useEffect(() => {
    setSelectedYear('');
  }, [selectedArticle]);

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

  // Filter citations based on selection (Article AND Year)
  const filteredCitations = useMemo(() => {
    if (!selectedArticle) return [];
    
    return citations.filter(c => {
      const matchesArticle = c.citedArticle?.trim() === selectedArticle;
      const matchesYear = selectedYear ? c.year === selectedYear : true;
      return matchesArticle && matchesYear;
    });
  }, [citations, selectedArticle, selectedYear]);

  // Get available years for the selected article
  const availableYears = useMemo(() => {
    if (!selectedArticle) return [];
    // Get citations for this article only, ignoring the current year filter to show all options
    const articleCitations = citations.filter(c => c.citedArticle?.trim() === selectedArticle);
    const years = new Set(articleCitations.map(c => c.year).filter(y => y));
    // Sort descending
    return Array.from(years).sort().reverse();
  }, [citations, selectedArticle]);

  // Handle PDF Download
  const handleDownloadPDF = () => {
    if (!selectedArticle || filteredCitations.length === 0) return;
    
    // Find the Scholar URL from the data (assuming it's consistent for the selected article)
    const scholarUrl = filteredCitations.find(c => c.scholarUrl)?.scholarUrl || '';
    
    generatePDF(filteredCitations, selectedArticle, scholarUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <BookOpen className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">
                Repositorio de Citas del Dr. Oscar De la Torre
              </h1>
              {/* Mobile simplified title */}
              <h1 className="text-lg font-bold text-gray-900 tracking-tight block sm:hidden">
                Repositorio de Citas
              </h1>
            </div>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar Datos</span>
            <span className="sm:hidden">Actualizar</span>
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
          <div className="flex flex-col gap-6">
            <div className="w-full">
               <ArticleSelector 
                groupedCitations={groupedArticles}
                selectedArticle={selectedArticle}
                onSelect={setSelectedArticle}
                disabled={loading || citations.length === 0}
              />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
              {/* Year Selector appears only when an article is selected */}
              <div className="w-full md:w-auto">
                 {selectedArticle && (
                  <YearSelector 
                    years={availableYears}
                    selectedYear={selectedYear}
                    onSelect={setSelectedYear}
                    disabled={loading}
                  />
                )}
              </div>

              {selectedArticle && (
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent shadow-md transition-all hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Descargar Reporte PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Selected Info Summary */}
        {selectedArticle && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
               <p className="text-xs text-gray-500 uppercase font-semibold">
                 {selectedYear ? `Citas en ${selectedYear}` : 'Total Citas'}
               </p>
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