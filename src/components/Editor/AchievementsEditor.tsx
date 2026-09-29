import React from 'react';
import { AchievementItem } from '../../types/cv';
import { Plus, Trash2, Award, Eye, EyeOff } from 'lucide-react';
import { Button } from '@heroui/react';

interface Props {
  data: AchievementItem[];
  onChange: (updated: AchievementItem[]) => void;
}

export const AchievementsEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleItemChange = (id: string, field: keyof AchievementItem, value: any) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddItem = () => {
    const newItem: AchievementItem = {
      id: `ach-${Date.now()}`,
      title: '',
      event: '',
      date: '',
      description: '',
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

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Award className="w-4 h-4" />
          </div>
          Achievements & Awards ({data.length})
        </h3>
        <Button
          size="sm"
          variant="primary"
          onPress={handleAddItem}
          className="text-xs font-semibold h-8 px-3 rounded-lg flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Award</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="border border-dashed border-slate-800 bg-slate-900/40 rounded-xl p-8 text-center">
          <Award className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-medium">
            No achievements added yet. Click &quot;Add Award&quot; to list competitions, rankings, or honors.
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
                  <span className="w-5 h-5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-100 truncate">
                    {item.title || `Award #${index + 1}`}
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
                    title="Delete Award"
                    aria-label="Delete Award"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Placement / Award Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                      placeholder="e.g. 1st Place Winner"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Competition / Event
                    </label>
                    <input
                      type="text"
                      value={item.event}
                      onChange={(e) => handleItemChange(item.id, 'event', e.target.value)}
                      placeholder="e.g. National Collegiate Hackathon"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Date / Year (optional)
                    </label>
                    <input
                      type="text"
                      value={item.date || ''}
                      onChange={(e) => handleItemChange(item.id, 'date', e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                      Brief Detail (optional)
                    </label>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      placeholder="e.g. Selected out of 350+ national teams"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                    />
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
