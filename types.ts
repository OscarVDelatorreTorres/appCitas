export interface Citation {
  year: string;
  citedArticle: string;
  articleUrl: string; // URL o DOI del artículo citado
  citedArticleIndex: string; // índice del artículo citado
  citingArticle: string; // Artículo que cita
  maxJournalIndex: string; // Indización máxima de la revista
  evidenceUrl: string; // Evidencia de indización
  pdfUrl: string; // URL del PDF del artículo que cita
  scholarUrl: string; // Link citas Google scholar del artículo citado
  // Additional fields that might exist in the raw data but aren't primary
  [key: string]: string;
}

export interface GroupedCitation {
  articleTitle: string;
  count: number;
}