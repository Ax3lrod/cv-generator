import React from 'react';
import { SkillCategory } from '../../types/cv';
import { Plus, Trash2, Eye, EyeOff, Wrench, Tag } from 'lucide-react';

interface Props {
  data: SkillCategory[];
  onChange: (updated: SkillCategory[]) => void;
}

const COMMON_SKILL_PRESETS = [
  { name: 'Frontend', skills: 'React, Next.js, TypeScript, Tailwind CSS, Redux, Vue.js' },
  { name: 'Backend', skills: 'Node.js, Express, NestJS, Go, Python, FastAPI, Django, Java' },
  { name: 'DevOps & Cloud', skills: 'Docker, Kubernetes, AWS, Azure, GCP, CI/CD (GitHub Actions), Terraform' },
  { name: 'Databases', skills: 'PostgreSQL, MySQL, MongoDB, Redis, Prisma, TypeORM' },
];

export const SkillsEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleItemChange = (id: string, field: keyof SkillCategory, value: any) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      name: 'New Skill Category',
      skills: '',
      isVisible: true,
    };
    onChange([...data, newCat]);
  };

  const handleDeleteCategory = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const handleToggleVisibility = (id: string) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item))
    );
  };

  const handleApplyPreset = (preset: { name: string; skills: string }) => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      name: preset.name,
      skills: preset.skills,
      isVisible: true,
    };
    onChange([...data, newCat]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-cyan-400" />
          Skills & Technical Proficiencies ({data.length})
        </h3>
        <button
          type="button"
          onClick={handleAddCategory}
          className="flex items-center gap-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-2.5 py-1 rounded transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      {/* Preset Suggestions */}
      <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 mb-1.5">
          <Tag className="w-3.5 h-3.5 text-cyan-400" />
          Preset Categories:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SKILL_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition"
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded">
          No skill categories added. Add categories like "Programming & Frameworks", "Tools & Systems", etc.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((cat, index) => (
            <div
              key={cat.id}
              className={`p-3 rounded border transition ${
                cat.isVisible
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-slate-900/30 border-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">
                  Category #{index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(cat.id)}
                    title={cat.isVisible ? 'Hide from CV' : 'Show on CV'}
                    className="p-1 text-slate-400 hover:text-slate-200 transition"
                  >
                    {cat.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    title="Delete Category"
                    className="p-1 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category Label</label>
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => handleItemChange(cat.id, 'name', e.target.value)}
                    placeholder="e.g. Programming & Frameworks"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Skills List (comma-separated)</label>
                  <textarea
                    rows={2}
                    value={cat.skills}
                    onChange={(e) => handleItemChange(cat.id, 'skills', e.target.value)}
                    placeholder="e.g. JavaScript, TypeScript, React, Next.js, Node.js, Express, NestJs, Laravel"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
