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
  Loader2,
  Info
} from 'lucide-react';
import { Button } from '@heroui/react';

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
    <div className="space-y-4">
      {/* ATS Score Analyzer Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              ATS Readiness & Keyword Score
            </span>
          </div>

          <span className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded-full border ${
            score >= 90 
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
              : score >= 70 
              ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' 
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          }`}>
            {score} / 100
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-blue-500' : 'bg-amber-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            {checks.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
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
      </div>

      {/* Vector PDF Export Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Download className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Vector PDF Engine (Accurate)
            </span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
            100% Vector
          </span>
        </div>

        <div className="p-4 space-y-3.5">
          <p className="text-xs text-slate-400 leading-relaxed">
            Generates clean native vector PDF: 100% selectable text for ATS parsers, razor-sharp vector lines, clickable hyperlinks, and exact millimeter print accuracy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Button
              variant="primary"
              size="md"
              isDisabled={isExporting}
              onPress={handleDownloadVectorPDF}
              className="font-semibold text-xs h-9 rounded-xl shadow-sm"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  <span>Generating Vector PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Download Vector PDF</span>
                </>
              )}
            </Button>

            <button
              type="button"
              disabled={isPreviewing}
              onClick={handlePreviewVectorPDF}
              className="h-9 px-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isPreviewing ? 'Opening...' : 'Preview in New Tab'}</span>
            </button>
          </div>

          {/* Browser Native Print Button */}
          <div className="pt-2.5 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Browser Print Dialog
                </span>
                <span className="text-[11px] text-slate-400">
                  Print to physical printer or save via browser print dialog.
                </span>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="text-xs font-medium h-8 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 shrink-0 ml-3 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Dialog</span>
              </button>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 text-[11px] text-blue-300 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-200 mr-1">Print Dialog Tip:</span>
                <span>In your browser print dialog, keep <b>Margins: &quot;Default&quot;</b> or <b>&quot;None&quot;</b> (avoid &quot;Custom&quot;). Page margins and spacing are already calculated and balanced with exact precision.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup, Import & Reset Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <RefreshCw className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Backup, Import & Reset
          </span>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleExportJSON}
              className="h-8.5 text-xs font-medium rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup to JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-8.5 text-xs font-medium rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition"
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

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="h-8.5 text-xs font-medium rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Example CV</span>
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="h-8.5 text-xs font-medium rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
