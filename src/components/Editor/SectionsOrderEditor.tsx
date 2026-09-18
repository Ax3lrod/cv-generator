import React from 'react';
import { SectionMeta } from '../../types/cv';
import { ArrowUp, ArrowDown, Eye, EyeOff, GripVertical, Check } from 'lucide-react';

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

  const toggleVisibility = (id: string) => {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, isVisible: !s.isVisible } : s))
    );
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Section Order & Visibility
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Customize the hierarchy of your CV. Move key sections to the top, rename titles, or hide unwanted sections.
        </p>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`flex items-center justify-between p-2.5 rounded border transition ${
              section.isVisible
                ? 'bg-slate-900 border-slate-700/80 text-slate-100'
                : 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2 flex-1 mr-2">
              <span className="font-mono text-xs text-slate-500 w-5">
                {index + 1}.
              </span>
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleTitleChange(section.id, e.target.value)}
                className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 focus:bg-slate-950 px-1.5 py-0.5 text-xs font-medium rounded transition flex-1"
                placeholder="Section Title"
              />
              {section.isCustom && (
                <span className="text-[10px] bg-pink-950 text-pink-300 border border-pink-800 px-1.5 py-0.2 rounded uppercase">
                  Custom
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveSection(index, 'up')}
                className="p-1 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 transition"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={index === sections.length - 1}
                onClick={() => moveSection(index, 'down')}
                className="p-1 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-slate-400 transition"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => toggleVisibility(section.id)}
                className="p-1 text-slate-400 hover:text-blue-400 transition ml-1"
                title={section.isVisible ? 'Hide Section' : 'Show Section'}
              >
                {section.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
