import React, { useRef, useState } from 'react';
import { CVData, DesignConfig } from '../../types/cv';
import { defaultCVData, defaultDesignConfig } from '../../data/defaultCV';
import { getPaperDimensions } from '../../utils/paperDimensions';
import { Printer, Download, Upload, RefreshCw, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

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

  // 1. Browser Native Print (Produces vector PDF)
  const handlePrint = () => {
    window.print();
  };

  // 2. Direct PDF Download via html2pdf
  const handleDownloadPDF = async () => {
    const element = document.getElementById('cv-print-target');
    if (!element) return;

    setIsExporting(true);
    const { widthMm, heightMm } = getPaperDimensions(designConfig);

    // Create an isolated, unscaled container with pure white background to avoid transform clipping & dark background bleed
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = `${widthMm}mm`;
    container.style.backgroundColor = '#ffffff';
    container.style.zIndex = '999999';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';

    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.backgroundColor = '#ffffff';
    clone.style.color = '#000000';
    clone.style.width = `${widthMm}mm`;
    clone.style.minHeight = `${heightMm}mm`;

    if (designConfig.forceOnePage) {
      clone.style.height = `${heightMm}mm`;
      clone.style.maxHeight = `${heightMm}mm`;
      clone.style.overflow = 'hidden';
    }

    container.appendChild(clone);
    document.body.appendChild(container);

    try {
      const opt = {
        margin: 0,
        filename: `${cvData.personalInfo.fullName.trim().replace(/\s+/g, '_')}_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
          windowWidth: clone.offsetWidth,
        },
        jsPDF: {
          unit: 'mm',
          format: [widthMm, heightMm],
          orientation: 'portrait',
        },
      };
      await html2pdf().set(opt).from(clone).save();
    } catch (err) {
      console.error('Failed to export PDF, falling back to print:', err);
      window.print();
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      setIsExporting(false);
    }
  };

  // 3. Export JSON Configuration & Content
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
      `${cvData.personalInfo.fullName.trim().replace(/\s+/g, '_')}_cv_backup.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 4. Import JSON Configuration & Content
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
          // Backward compatibility if just CVData
          onUpdateCVData(parsed);
          alert('CV data imported successfully!');
        } else {
          alert('Invalid CV configuration JSON format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 5. Reset to Example Data
  const handleResetToDefault = () => {
    if (window.confirm('Reset CV to default template example? Current changes will be overwritten.')) {
      onUpdateCVData(defaultCVData);
      onUpdateDesignConfig(defaultDesignConfig);
    }
  };

  // 6. Clear All Data
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
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
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
            Export and Print CV
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded transition shadow-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save PDF</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded transition shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF Direct'}</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-300 mt-2">
          <strong className="text-slate-200">Recommendation:</strong> Using "Print or Save PDF" with destination set to "Save as PDF" produces searchable vector text, ideal for ATS parsers.
        </p>
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
