import { Citation } from '../types';

// The ID provided by the user
const SHEET_ID = '1yg9RiDQb1FD3THr7DV9loI-5i5S4XibybvAz8hu_3tQ';
const SHEET_NAME = 'citas';

// Google Visualization API CSV endpoint
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

// Helper to parse CSV line correctly handling quotes
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let start = 0;
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    } else if (line[i] === ',' && !inQuotes) {
      let field = line.substring(start, i);
      // Remove surrounding quotes if they exist
      if (field.startsWith('"') && field.endsWith('"')) {
        field = field.slice(1, -1).replace(/""/g, '"');
      }
      result.push(field.trim());
      start = i + 1;
    }
  }
  // Push the last field
  let lastField = line.substring(start);
  if (lastField.startsWith('"') && lastField.endsWith('"')) {
    lastField = lastField.slice(1, -1).replace(/""/g, '"');
  }
  result.push(lastField.trim());
  return result;
};

export const fetchCitationData = async (): Promise<Citation[]> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) return [];

    // Header mapping logic to be robust against slight naming changes
    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
    
    // We map the requested columns to the likely CSV headers based on keywords
    const getIndex = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)));

    const colMap = {
      year: getIndex(['año', 'year']),
      citedArticle: getIndex(['título del artículo', 'artículo citado', 'titulo']), 
      // Removed 'link' from articleUrl to prevent it from grabbing "Link citas Google scholar"
      articleUrl: getIndex(['url', 'doi']),
      citedArticleIndex: getIndex(['índice del artículo', 'indice del', 'index']),
      citingArticle: getIndex(['artículo que cita', 'cita el', 'citing']),
      // Using stricter keywords for max index to avoid confusion
      maxJournalIndex: getIndex(['indización máx', 'indizacion max', 'max index']),
      // Strict check for "Evidencia de indización" to avoid matching "Evidencia cita (pdf)"
      evidenceUrl: getIndex(['evidencia de ind', 'evidence of ind']),
      // Explicitly looking for PDF-related keywords
      pdfUrl: getIndex(['pdf', 'evidencia cita', 'archivo']),
      // New field for Google Scholar Link
      scholarUrl: getIndex(['scholar', 'link citas google']),
    };

    const data: Citation[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      // Basic validation: ensure we have data
      if (row.length < 3) continue;

      data.push({
        year: row[colMap.year] || '',
        citedArticle: row[colMap.citedArticle] || 'Sin título',
        articleUrl: row[colMap.articleUrl] || '',
        citedArticleIndex: row[colMap.citedArticleIndex] || '',
        citingArticle: row[colMap.citingArticle] || '',
        maxJournalIndex: row[colMap.maxJournalIndex] || '',
        evidenceUrl: row[colMap.evidenceUrl] || '',
        pdfUrl: row[colMap.pdfUrl] || '',
        scholarUrl: row[colMap.scholarUrl] || '',
      });
    }

    return data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
};