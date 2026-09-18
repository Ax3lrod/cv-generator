import React from 'react';
import { AchievementItem } from '../../types/cv';
import { Plus, Trash2, Eye, EyeOff, Award } from 'lucide-react';

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

  const handleToggleVisibility = (id: string) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Award className="w-4 h-4 text-rose-400" />
          Achievements & Awards ({data.length})
        </h3>
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 rounded transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Award
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded">
          No achievements added yet. Click "Add Award" to list competitions, rankings, or honors.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={item.id}
              className={`p-3 rounded border transition ${
                item.isVisible
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-slate-900/30 border-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">
                  #{index + 1} {item.title || 'Untitled Award'}
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
                    title="Delete Award"
                    className="p-1 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Placement / Award Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                    placeholder="e.g. 1st Place Winner"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Competition / Event</label>
                  <input
                    type="text"
                    value={item.event}
                    onChange={(e) => handleItemChange(item.id, 'event', e.target.value)}
                    placeholder="e.g. National Collegiate Hackathon"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Date / Year (optional)</label>
                  <input
                    type="text"
                    value={item.date || ''}
                    onChange={(e) => handleItemChange(item.id, 'date', e.target.value)}
                    placeholder="e.g. 2023"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Brief Detail (optional)</label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    placeholder="e.g. Out of 300+ national teams"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
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
