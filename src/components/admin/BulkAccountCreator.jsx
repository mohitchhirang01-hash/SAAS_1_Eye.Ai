'use client';

import { useState, useCallback } from 'react';
import { useAdminInstitutes } from '@/hooks/useAdminInstitutes';
import StatusBadge from '@/components/admin/StatusBadge';
import { 
  IconCheck, 
  IconUser, 
  IconTeacher, 
  IconStudent, 
  IconFileExport, 
  IconPlus,
  IconLoader,
  IconUsers
} from '@/components/icons';

export default function BulkAccountCreator({ instituteId, instituteName }) {
  const { generateAccounts, exportCredentialsPDF } = useAdminInstitutes();
  const [teacherNames, setTeacherNames] = useState('');
  const [studentNames, setStudentNames] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState(null);

  const handleGenerate = async () => {
    if (!teacherNames && !studentNames) return;
    setIsGenerating(true);
    
    const tList = teacherNames.split('\n').filter(n => n.trim());
    const sList = studentNames.split('\n').filter(n => n.trim());
    
    const result = await generateAccounts(instituteId, sList, tList);
    setIsGenerating(false);
    
    if (result.success) {
      setGeneratedBatch(result.accounts);
      setTeacherNames('');
      setStudentNames('');
      // Automatically export PDF after generation
      exportCredentialsPDF(instituteId, instituteName, result.accounts);
    } else {
      alert(`Error generating accounts: ${result.error}`);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-8">
        {/* Teachers Section */}
        <div className="bg-[#f7f9f4] p-8 rounded-3xl border border-[#c8dfc8] flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#1a4a2e]">
            <IconUser className="w-5 h-5" />
            <h4 className="font-black font-['Syne',sans-serif]">Add Teachers</h4>
          </div>
          <textarea 
            className="w-full h-40 p-5 bg-white border border-[#c8dfc8] rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all resize-none"
            placeholder="Paste teacher names (one per line)...&#10;Ex: Ramesh Sharma&#10;Priya Singh"
            value={teacherNames}
            onChange={(e) => setTeacherNames(e.target.value)}
          />
        </div>

        {/* Students Section */}
        <div className="bg-[#f7f9f4] p-8 rounded-3xl border border-[#c8dfc8] flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#1a4a2e]">
            <IconUsers className="w-5 h-5" />
            <h4 className="font-black font-['Syne',sans-serif]">Add Students</h4>
          </div>
          <textarea 
            className="w-full h-40 p-5 bg-white border border-[#c8dfc8] rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#2d6a4f]/5 focus:border-[#2d6a4f] transition-all resize-none"
            placeholder="Paste student names (one per line)...&#10;Ex: Mohit Verma&#10;Sanya Iyer"
            value={studentNames}
            onChange={(e) => setStudentNames(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || (!teacherNames && !studentNames)}
          className="px-10 py-5 bg-[#2d6a4f] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-[#2d6a4f]/20 hover:bg-[#1a4a2e] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-all"
        >
          {isGenerating ? (
            <IconLoader className="w-5 h-5 animate-spin" />
          ) : (
            <IconFileExport className="w-5 h-5" />
          )}
          Generate All & Export PDF
        </button>

        {generatedBatch && (
          <div className="flex items-center gap-2 text-[#2d6a4f] font-black text-xs uppercase tracking-widest bg-[#e8f5e9] px-4 py-2 rounded-full">
            <IconCheck className="w-4 h-4" />
            Batch of {generatedBatch.length} accounts generated successfully
          </div>
        )}
      </div>
    </div>
  );
}
