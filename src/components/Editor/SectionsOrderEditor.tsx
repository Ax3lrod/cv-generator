import React from 'react';
import { SectionMeta } from '../../types/cv';
import { ArrowUp, ArrowDown, ListOrdered, Eye, EyeOff } from 'lucide-react';

interface Props {
  sections: SectionMeta[];
  onChange: (updated: SectionMeta[]) => void;
}

export const SectionsOrderEditor: React.FC<Props> = ({ sections, onChange }) => {
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);
    onChange(newSections);
  };

  const toggleVisibility = (id: string, isVisible: boolean) => {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, isVisible } : s))
    );
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800/80 bg-slate-950/70 px-4 py-3">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Section Order & Visibility
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Reorder sections to customize your CV layout. Toggle eye icon to show or hide.
            </p>
          </div>
        </div>

        <div className="p-3.5 space-y-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 ${
                section.isVisible
                  ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700/80 shadow-xs'
                  : 'bg-slate-950/30 border-slate-800/60 opacity-60 border-dashed'
              }`}
            >
              {/* Left: Number and Editable Title */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-3">
                <span className="font-mono text-xs text-slate-500 font-semibold w-5 shrink-0 text-center">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleTitleChange(section.id, e.target.value)}
                  className="bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1 text-xs font-medium w-full max-w-xs transition"
                  placeholder="Section Title"
                />
                {section.isCustom && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
                    Custom
                  </span>
                )}
              </div>

              {/* Right: Aligned Move and Toggle Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSection(index, 'up')}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition"
                  title="Move section up"
                  aria-label="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === sections.length - 1}
                  onClick={() => moveSection(index, 'down')}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition"
                  title="Move section down"
                  aria-label="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-px bg-slate-800 mx-1" />

                <button
                  type="button"
                  onClick={() => toggleVisibility(section.id, !section.isVisible)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                    section.isVisible
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'text-slate-500 bg-slate-900 border-slate-800 hover:text-slate-300'
                  }`}
                  title={section.isVisible ? 'Visible on CV (click to hide)' : 'Hidden from CV (click to show)'}
                  aria-label={section.isVisible ? 'Hide from CV' : 'Show on CV'}
                >
                  {section.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
