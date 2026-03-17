'use client';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { IconFileExport } from '@/components/icons';

export default function ResultReportExport({ batch, students }) {
  const exportPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // PAGE 1: COVER
    doc.setFillColor(26, 74, 46); // #1a4a2e
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('JEE Sprint', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Advanced Performance Analytics', 105, 28, { align: 'center' });

    doc.setTextColor(26, 74, 46);
    doc.setFontSize(32);
    doc.text('BATCH PERFORMANCE REPORT', 105, 80, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text(batch.name, 105, 100, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Subject Focus: ${batch.subject}`, 105, 115, { align: 'center' });
    doc.text(`Teacher: ${batch.teacher?.name || 'Unassigned'}`, 105, 122, { align: 'center' });
    doc.text(`Generated On: ${date}`, 105, 129, { align: 'center' });

    // PAGE 2: SUMMARY
    doc.addPage();
    doc.setFontSize(20);
    doc.text('Batch Summary Metrics', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Total Students: ${students.length}`, 20, 50);
    doc.text(`Avg Syllabus Coverage: 42%`, 20, 60);
    doc.text(`Avg Mock score: 185 / 300`, 20, 70);
    doc.text(`Accuracy Rate: 76%`, 20, 80);

    // PAGE 3+: STUDENT TABLE
    doc.addPage();
    doc.text('Student Performance Matrix', 20, 20);
    
    const tableData = students.map((s, i) => [
      i + 1,
      s.name,
      '42%',
      '185/300',
      '82%',
      'Active'
    ]);

    doc.autoTable({
      startY: 30,
      head: [['#', 'Name', 'Coverage %', 'Last Score', 'Accuracy', 'Status']],
      body: tableData,
      headStyles: { fillStyle: '#2d6a4f', textColor: '#ffffff' },
      alternateRowStyles: { fillStyle: '#f7f9f4' }
    });

    // FOOTERS
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`${batch.name} | Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    }

    doc.save(`JEE_Sprint_Report_${batch.name}_${date}.pdf`);
  };

  return (
    <button 
      onClick={exportPDF}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#e8f5e9] text-[#2d6a4f] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2d6a4f] hover:text-white transition-all shadow-sm"
    >
      <IconFileExport className="w-3.5 h-3.5" />
      Export Result Report
    </button>
  );
}
