import React from 'react';
import { SkillCategory } from '../../types/cv';
import { Plus, Trash2, Wrench, Tag, Eye, EyeOff } from 'lucide-react';
import { Button } from '@heroui/react';

interface Props {
  data: SkillCategory[];
  onChange: (updated: SkillCategory[]) => void;
}

const COMMON_SKILL_PRESETS = [
  { name: 'Frontend', skills: 'React, Next.js, TypeScript, Tailwind CSS, Redux, Vue.js' },
  { name: 'Backend', skills: 'Node.js, Express, NestJS, Go, Python, FastAPI, Django, Java' },
  { name: 'DevOps & Cloud', skills: 'Docker, Kubernetes, AWS, Azure, GCP, CI/CD, Terraform' },
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

  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, isVisible } : item))
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
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Wrench className="w-4 h-4" />
          </div>
          Skills & Technical Proficiencies ({data.length})
        </h3>
        <Button
          size="sm"
          variant="primary"
          onPress={handleAddCategory}
          className="text-xs font-semibold h-8 px-3 rounded-lg flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Preset Suggestions */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Presets</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SKILL_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-500/30 transition-all font-medium"
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="border border-dashed border-slate-800 bg-slate-900/40 rounded-xl p-8 text-center">
          <Wrench className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-medium">
            No skill categories added. Add categories like &quot;Languages & Frameworks&quot;, &quot;Tools & Systems&quot;, etc.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {data.map((cat, index) => {
            const skillChips = cat.skills
              ? cat.skills.split(',').map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={cat.id}
                className={`rounded-xl border transition-all duration-200 shadow-sm ${
                  cat.isVisible
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-black/20'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60 border-dashed'
                }`}
              >
                {/* Card Header with Aligned Actions */}
                <div className="flex items-center justify-between py-2.5 px-3.5 border-b border-slate-800/80 bg-slate-950/70 rounded-t-xl gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {cat.name || `Category #${index + 1}`}
                    </span>
                    {!cat.isVisible && (
                      <span className="text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded shrink-0">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(cat.id, !cat.isVisible)}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                        cat.isVisible
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'text-slate-500 bg-slate-900 border-slate-800 hover:text-slate-300'
                      }`}
                      title={cat.isVisible ? 'Visible on CV (click to hide)' : 'Hidden from CV (click to show)'}
                      aria-label={cat.isVisible ? 'Hide from CV' : 'Show on CV'}
                    >
                      {cat.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 flex items-center justify-center transition-all"
                      title="Delete Category"
                      aria-label="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Category Label
                    </label>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => handleItemChange(cat.id, 'name', e.target.value)}
                      placeholder="e.g. Programming & Frameworks"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Skills List (comma-separated)
                    </label>
                    <textarea
                      rows={2}
                      value={cat.skills}
                      onChange={(e) => handleItemChange(cat.id, 'skills', e.target.value)}
                      placeholder="e.g. JavaScript, TypeScript, React, Next.js, Node.js, Express, PostgreSQL"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                    />
                  </div>

                  {skillChips.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-800/60">
                      <div className="text-[10px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                        Detected Skills ({skillChips.length}):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skillChips.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
