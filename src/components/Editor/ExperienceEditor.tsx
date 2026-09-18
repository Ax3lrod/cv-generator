import React from 'react';
import { ExperienceItem } from '../../types/cv';
import { Plus, Trash2, Eye, EyeOff, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';

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
    onChange([newItem, ...data]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const handleToggleVisibility = (id: string) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item))
    );
  };

  // Bullets handler
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
        const newBullets = item.bullets.filter((_, idx) => idx !== bulletIdx);
        return { ...item, bullets: newBullets };
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-amber-400" />
          Experiences ({data.length})
        </h3>
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1 rounded transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded">
          No experience items yet. Click "Add Experience" to add work or organizational roles.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={item.id}
              className={`p-3 rounded border transition ${
                item.isVisible
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-slate-900/30 border-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300">
                  #{index + 1} {item.company || 'Untitled Organization / Company'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(item.id)}
                    title={item.isVisible ? 'Hide from CV' : 'Show on CV'}
                    className="p-1 text-slate-400 hover:text-slate-200 transition"
                  >
                    {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    title="Delete Entry"
                    className="p-1 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => handleItemChange(item.id, 'company', e.target.value)}
                    placeholder="e.g. Apex Cloud Technologies"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Role / Position</label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => handleItemChange(item.id, 'role', e.target.value)}
                    placeholder="e.g. Lead Full-Stack Developer"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => handleItemChange(item.id, 'location', e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={item.startDate}
                      onChange={(e) => handleItemChange(item.id, 'startDate', e.target.value)}
                      placeholder="e.g. Jun 2023"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">End Date</label>
                    <input
                      type="text"
                      value={item.endDate}
                      onChange={(e) => handleItemChange(item.id, 'endDate', e.target.value)}
                      placeholder="e.g. Present"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bullet Points */}
              <div className="border-t border-slate-800/80 pt-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Bullet Points / Key Contributions
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet(item.id)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" /> Add Bullet
                  </button>
                </div>
                <div className="space-y-1.5">
                  {item.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5">
                      <span className="text-slate-500 text-xs mt-2 select-none">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleBulletChange(item.id, bIdx, e.target.value)}
                        placeholder="Action verb + context + measurable impact (e.g., Designed and implemented a dashboard...)"
                        className="flex-1 bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteBullet(item.id, bIdx)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition mt-1"
                        title="Delete bullet"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
