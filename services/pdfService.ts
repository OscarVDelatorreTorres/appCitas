import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Citation } from '../types';

export const generatePDF = (citations: Citation[], articleTitle: string, scholarUrl?: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  let nextY = 20;

  // --- Main Header ---
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Repositorio de Citas del Dr. Oscar De la Torre', 14, 20);
  nextY = 30;

  // --- Sub-header (Article Title) ---
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  
  // Handle long titles by splitting text
  const splitTitle = doc.splitTextToSize(`Artículo Citado: ${articleTitle}`, 180);
  doc.text(splitTitle, 14, nextY);

  nextY += (splitTitle.length * 5) + 5;

  // --- Citation Count ---
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(`Total de citas en este reporte: ${citations.length}`, 14, nextY);
  nextY += 7;

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
  const tableColumn = [
    "Año", 
    "Artículo que cita", 
    "Indización Máx.", 
    "Liga de pdf artículo que cita",
    "URL o DOI de artículo que cita",
    "Evidencia de índice revista"
  ];

  const tableRows: any[] = [];

  citations.forEach(cit => {
    // Ensure all fields have fallback strings
    const citationData = [
      cit.year || '',
      cit.citingArticle || '',
      cit.maxJournalIndex || '',
      cit.pdfUrl ? "Ver PDF" : "-",
      cit.articleUrl || '-',
      cit.evidenceUrl ? "Ver Evidencia" : "-"
    ];
    tableRows.push(citationData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: nextY,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }, // Blue-500
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 12 }, // Año
      1: { cellWidth: 'auto' }, // Citing Article
      2: { cellWidth: 20 }, // Indización
      3: { cellWidth: 22 }, // PDF (Link)
      4: { cellWidth: 35 }, // URL/DOI (Link)
      5: { cellWidth: 25 }, // Evidence (Link)
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.row && typeof data.row.index === 'number') {
        const citation = citations[data.row.index];
        if (!citation) return;

        // PDF URL
        if (data.column.index === 3 && citation.pdfUrl) {
          doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: citation.pdfUrl });
        }
        // Article URL / DOI
        if (data.column.index === 4 && citation.articleUrl) {
          doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: citation.articleUrl });
        }
        // Evidence URL
        if (data.column.index === 5 && citation.evidenceUrl) {
          doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: citation.evidenceUrl });
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