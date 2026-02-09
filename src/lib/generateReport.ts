import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ScanResult } from '@/types/scanner';
import { format } from 'date-fns';

export function generatePdfReport(result: ScanResult) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(22);
  doc.setTextColor(59, 130, 246);
  doc.text('BackDoorScanner', 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(150, 150, 150);
  doc.text('Security Vulnerability Report', 14, 28);

  // Divider
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(14, 32, pageWidth - 14, 32);

  // Meta info
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const meta = [
    `Date: ${format(result.timestamp, 'PPpp')}`,
    `Language: ${result.language.charAt(0).toUpperCase() + result.language.slice(1)}`,
    `Scan Duration: ${result.scanDuration}ms`,
    `Scan ID: ${result.id}`,
  ];
  meta.forEach((line, i) => doc.text(line, 14, 40 + i * 6));

  // Risk Score
  const scoreY = 40;
  const scoreX = pageWidth - 50;
  const scoreColor = result.riskScore >= 75 ? [239, 68, 68] :
    result.riskScore >= 50 ? [245, 158, 11] :
    result.riskScore >= 25 ? [234, 179, 8] : [16, 185, 129];

  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(scoreX - 5, scoreY - 8, 40, 20, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(`${result.riskScore}/100`, scoreX + 2, scoreY + 5);

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Risk Score', scoreX + 3, scoreY + 12);

  // Summary
  let y = 70;
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Vulnerability Summary', 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  result.vulnerabilities.forEach(v => { severityCounts[v.severity]++; });
  doc.text(`Total: ${result.vulnerabilities.length}  |  Critical: ${severityCounts.critical}  |  High: ${severityCounts.high}  |  Medium: ${severityCounts.medium}  |  Low: ${severityCounts.low}`, 14, y);
  y += 10;

  // Vulnerabilities table
  if (result.vulnerabilities.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['#', 'Type', 'Severity', 'Line', 'Description', 'Recommendation']],
      body: result.vulnerabilities.map((v, i) => [
        String(i + 1),
        v.type,
        v.severity.toUpperCase(),
        String(v.line) + (v.endLine ? `-${v.endLine}` : ''),
        v.description,
        v.recommendation,
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 25 },
        2: { cellWidth: 18 },
        3: { cellWidth: 12 },
        4: { cellWidth: 55 },
        5: { cellWidth: 55 },
      },
      alternateRowStyles: { fillColor: [245, 245, 250] },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `BackDoorScanner Report — Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`security-report-${result.id}.pdf`);
}
