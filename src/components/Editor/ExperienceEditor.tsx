import React from 'react';
import { ExperienceItem } from '../../types/cv';
import { Plus, Trash2, Briefcase, Eye, EyeOff } from 'lucide-react';
import { Button } from '@heroui/react';

interface Props {
  data: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

export const ExperienceEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleItemChange = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddItem = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      bullets: [''],
      isVisible: true,
    };
    onChange([...data, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, isVisible } : item))
    );
  };

  const handleBulletChange = (itemId: string, bulletIdx: number, val: string) => {
    onChange(
      data.map((item) => {
        if (item.id !== itemId) return item;
        const newBullets = [...item.bullets];
        newBullets[bulletIdx] = val;
        return { ...item, bullets: newBullets };
      })
    );
  };

  const handleAddBullet = (itemId: string) => {
    onChange(
      data.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, bullets: [...item.bullets, ''] };
      })
    );
  };

  const handleDeleteBullet = (itemId: string, bulletIdx: number) => {
    onChange(
      data.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, bullets: item.bullets.filter((_, idx) => idx !== bulletIdx) };
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Briefcase className="w-4 h-4" />
          </div>
          Experience ({data.length})
        </h3>
        <Button
          size="sm"
          variant="primary"
          onPress={handleAddItem}
          className="text-xs font-semibold h-8 px-3 rounded-lg flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Experience</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="border border-dashed border-slate-800 bg-slate-900/40 rounded-xl p-8 text-center">
          <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-medium">
            No work experience added yet. Click &quot;Add Experience&quot; to showcase your career history.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {data.map((item, index) => (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-200 shadow-sm ${
                item.isVisible
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-black/20'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60 border-dashed'
              }`}
            >
              {/* Card Header with Aligned Actions */}
              <div className="flex items-center justify-between py-2.5 px-3.5 border-b border-slate-800/80 bg-slate-950/70 rounded-t-xl gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-100 truncate">
                    {item.role || item.company
                      ? `${item.role}${item.company ? ` at ${item.company}` : ''}`
                      : `Experience #${index + 1}`}
                  </span>
                  {!item.isVisible && (
                    <span className="text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded shrink-0">
                      Hidden
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(item.id, !item.isVisible)}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                      item.isVisible
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'text-slate-500 bg-slate-900 border-slate-800 hover:text-slate-300'
                    }`}
                    title={item.isVisible ? 'Visible on CV (click to hide)' : 'Hidden from CV (click to show)'}
                    aria-label={item.isVisible ? 'Hide from CV' : 'Show on CV'}
                  >
                    {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 flex items-center justify-center transition-all"
                    title="Delete Experience"
                    aria-label="Delete Experience"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={item.company}
                      onChange={(e) => handleItemChange(item.id, 'company', e.target.value)}
                      placeholder="e.g. Google, Stripe, or Open Source"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Job Title / Role
                    </label>
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) => handleItemChange(item.id, 'role', e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Location
                    </label>
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => handleItemChange(item.id, 'location', e.target.value)}
                      placeholder="e.g. San Francisco, CA (or Remote)"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={item.startDate}
                        onChange={(e) => handleItemChange(item.id, 'startDate', e.target.value)}
                        placeholder="e.g. Jan 2022"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                        End Date
                      </label>
                      <input
                        type="text"
                        value={item.endDate}
                        onChange={(e) => handleItemChange(item.id, 'endDate', e.target.value)}
                        placeholder="e.g. Present"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Bullet Points */}
                <div className="border-t border-slate-800/80 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Key Contributions & Impact
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddBullet(item.id)}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Bullet</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {item.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <span className="text-slate-500 text-xs mt-2 select-none">•</span>
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => handleBulletChange(item.id, bIdx, e.target.value)}
                          placeholder="Action verb + context + measurable result (e.g. Architected microservice increasing throughput by 40%)..."
                          className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteBullet(item.id, bIdx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition mt-1"
                          title="Delete bullet"
                          aria-label="Delete bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
