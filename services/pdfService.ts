import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Citation } from '../types';

export const generatePDF = (citations: Citation[], articleTitle: string, scholarUrl?: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  // --- Header ---
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Repositorio de Citas del Dr. Oscar De la Torre', 14, 20);

  // --- Sub-header (Article Title) ---
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  
  // Handle long titles by splitting text
  const splitTitle = doc.splitTextToSize(`Artículo Citado: ${articleTitle}`, 180);
  doc.text(splitTitle, 14, 30);

  let nextY = 30 + (splitTitle.length * 5) + 5;

  // --- Scholar Link ---
  if (scholarUrl) {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 255); // Blue
    doc.textWithLink('Ver en Google Scholar', 14, nextY, { url: scholarUrl });
    // Also print the full URL in small text for printed copies
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const linkText = doc.splitTextToSize(scholarUrl, 180);
    doc.text(linkText, 14, nextY + 5);
    nextY += 5 + (linkText.length * 4) + 5;
  } else {
    nextY += 5;
  }

  // --- Table ---
  // Updated columns as requested
  const tableColumn = [
    "Año", 
    "Artículo que cita", 
    "Indización Máx.", 
    "Evidencia de índice de revista que cita", // Link to evidenceUrl
    "URL o DOI de artículo que cita" // Link to articleUrl
  ];

  const tableRows: any[] = [];

  citations.forEach(cit => {
    const citationData = [
      cit.year,
      cit.citingArticle,
      cit.maxJournalIndex,
      "evidencia de índice de revista que cita", // Placeholder text, link added via hook
      cit.articleUrl || '-' // Display URL text, link added via hook
    ];
    tableRows.push(citationData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: nextY,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }, // Blue-500
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 15 }, // Año
      1: { cellWidth: 'auto' }, // Citing Article
      2: { cellWidth: 25 }, // Indización
      3: { cellWidth: 35 }, // Evidencia (Link)
      4: { cellWidth: 35 }, // URL/DOI (Link)
    },
    didDrawCell: (data) => {
      // Add links to specific columns
      // data.section === 'body' ensures we are in the table body
      // data.row.index matches the index in the 'citations' array we iterated over above
      if (data.section === 'body') {
        // Safety check: ensure the row index is within bounds of our source array
        const citation = citations[data.row.index];
        if (!citation) return;
        
        // Column index 3 is "Evidencia de índice..."
        if (data.column.index === 3 && citation.evidenceUrl) {
          doc.link(
            data.cell.x, 
            data.cell.y, 
            data.cell.width, 
            data.cell.height, 
            { url: citation.evidenceUrl }
          );
        }

        // Column index 4 is "URL o DOI..."
        if (data.column.index === 4 && citation.articleUrl) {
          doc.link(
            data.cell.x, 
            data.cell.y, 
            data.cell.width, 
            data.cell.height, 
            { url: citation.articleUrl }
          );
        }
      }
    },
    didDrawPage: (data) => {
      // Footer
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        'Página ' + pageCount,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  });

  doc.save(`reporte_citas_${new Date().toISOString().split('T')[0]}.pdf`);
};