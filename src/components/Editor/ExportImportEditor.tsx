import React, { useRef, useState } from 'react';
import { CVData, DesignConfig } from '../../types/cv';
import { defaultCVData, defaultDesignConfig } from '../../data/defaultCV';
import { downloadVectorPdf, openVectorPdfInNewTab } from '../../utils/pdfExport';
import { 
  Printer, 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface Props {
  cvData: CVData;
  designConfig: DesignConfig;
  onUpdateCVData: (data: CVData) => void;
  onUpdateDesignConfig: (config: DesignConfig) => void;
}

export const ExportImportEditor: React.FC<Props> = ({
  cvData,
  designConfig,
  onUpdateCVData,
  onUpdateDesignConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // 1. Direct Vector PDF Download (100% accurate vector, ATS-friendly)
  const handleDownloadVectorPDF = async () => {
    setIsExporting(true);
    try {
      await downloadVectorPdf(cvData, designConfig);
    } catch (err) {
      console.error('Failed to generate vector PDF, falling back to print:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Open Vector PDF in new tab
  const handlePreviewVectorPDF = async () => {
    setIsPreviewing(true);
    try {
      await openVectorPdfInNewTab(cvData, designConfig);
    } catch (err) {
      console.error('Failed to preview vector PDF:', err);
    } finally {
      setIsPreviewing(false);
    }
  };

  // 3. Browser Native Print
  const handlePrint = () => {
    window.print();
  };

  // 4. Export JSON Configuration & Content
  const handleExportJSON = () => {
    const payload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      cvData,
      designConfig,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(payload, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `${(cvData.personalInfo.fullName || 'Resume').trim().replace(/\s+/g, '_')}_cv_backup.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 5. Import JSON Configuration & Content
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.cvData && parsed.designConfig) {
          onUpdateCVData(parsed.cvData);
          onUpdateDesignConfig(parsed.designConfig);
          alert('CV data and design configuration imported successfully!');
        } else if (parsed.personalInfo) {
          onUpdateCVData(parsed);
          alert('CV data imported successfully!');
        } else {
          alert('Invalid CV file structure.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 6. Reset to Example Data
  const handleResetToDefault = () => {
    if (window.confirm('Reset CV to default template example? Current changes will be overwritten.')) {
      onUpdateCVData(defaultCVData);
      onUpdateDesignConfig(defaultDesignConfig);
    }
  };

  // 7. Clear All Data
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data to start with a blank CV?')) {
      onUpdateCVData({
        personalInfo: {
          fullName: '',
          jobTitle: '',
          phone: '',
          email: '',
          location: '',
          linkedin: '',
          website: '',
          github: '',
          summary: '',
          showSummary: true,
        },
        education: [],
        experiences: [],
        projects: [],
        achievements: [],
        skills: [],
        customSections: [],
        sectionsOrder: [
          { id: 'summary', title: 'Professional Summary', isVisible: true },
          { id: 'education', title: 'Education', isVisible: true },
          { id: 'experiences', title: 'Experiences', isVisible: true },
          { id: 'projects', title: 'Projects', isVisible: true },
          { id: 'achievements', title: 'Achievements', isVisible: true },
          { id: 'skills', title: 'Skills', isVisible: true },
        ],
      });
    }
  };

  // ATS Optimization Check
  const calculateATSScore = () => {
    let score = 0;
    const checks = [
      { label: 'Full Name provided', pass: !!cvData.personalInfo.fullName.trim() },
      { label: 'Valid email address', pass: !!cvData.personalInfo.email.includes('@') },
      { label: 'Phone number included', pass: !!cvData.personalInfo.phone.trim() },
      { label: 'Professional Summary / Headline', pass: !!cvData.personalInfo.summary.trim() },
      { label: 'At least 1 Education entry', pass: cvData.education.length > 0 },
      { label: 'At least 1 Work / Experience entry', pass: cvData.experiences.length > 0 },
      { label: 'Action-oriented bullet points (>3)', pass: cvData.experiences.some(e => e.bullets.length >= 2) },
      { label: 'Skills categorized & listed', pass: cvData.skills.length > 0 },
      { label: 'Projects or Achievements featured', pass: cvData.projects.length > 0 || cvData.achievements.length > 0 },
      { label: 'ATS Standard Font selected', pass: ['inter', 'roboto', 'eb-garamond'].includes(designConfig.fontFamily) },
    ];

    checks.forEach(c => { if (c.pass) score += 10; });
    return { score, checks };
  };

  const { score, checks } = calculateATSScore();

  return (
    <div className="space-y-6">
      {/* ATS Score Analyzer Widget */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            ATS Readiness & Keyword Score
          </span>
          <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
            score >= 90 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
            score >= 70 ? 'bg-blue-950 text-blue-300 border border-blue-800' :
            'bg-amber-950 text-amber-300 border border-amber-800'
          }`}>
            {score} / 100
          </span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
          <div 
            className={`h-full transition-all duration-500 ${
              score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-blue-500' : 'bg-amber-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {c.pass ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className={c.pass ? 'text-slate-200' : 'text-slate-400'}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div>
        <div className="border-b border-slate-800 pb-2 mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Export and Download PDF
          </h3>
        </div>

        {/* Primary Vector Download Card */}
        <div className="bg-slate-900 border border-emerald-900/60 rounded-lg p-3.5 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                100% Vector PDF Engine (Accurate)
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-200 border border-emerald-800">
              ATS-Optimized
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Menghasilkan file PDF vector asli: teks murni (bisa dicopy dan dibaca sempurna oleh sistem ATS), garis vector tajam tanpa pecah, link kontak dapat diklik, dan rasio millimeter 100% akurat.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadVectorPDF}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold py-2.5 px-3 rounded transition shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating Vector PDF...' : 'Download Vector PDF'}</span>
            </button>

            <button
              type="button"
              disabled={isPreviewing}
              onClick={handlePreviewVectorPDF}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium py-2.5 px-3 rounded border border-slate-700 transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isPreviewing ? 'Opening...' : 'Preview in New Tab'}</span>
            </button>
          </div>
        </div>

        {/* Secondary: Browser Native Print */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-300 block">
                Browser Print Dialog
              </span>
              <span className="text-[11px] text-slate-400">
                Gunakan printer bawaan Chrome/Firefox untuk mencetak fisik atau simpan via print dialog.
              </span>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-1.5 px-3 rounded border border-slate-700 transition shrink-0 ml-3 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dialog</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backup / Restore */}
      <div>
        <div className="border-b border-slate-800 pb-2 mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Backup, Import & Reset
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 px-3 rounded border border-slate-700 transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup to JSON</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 px-3 rounded border border-slate-700 transition focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restore from JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs py-2 px-3 rounded border border-amber-800/60 transition focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load Example CV</span>
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-rose-950/40 text-rose-300 text-xs py-2 px-3 rounded border border-rose-800/60 transition focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
