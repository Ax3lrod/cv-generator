import React from 'react';
import { EducationItem } from '../../types/cv';
import { Plus, Trash2, Eye, EyeOff, GraduationCap } from 'lucide-react';

interface Props {
  data: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

export const EducationEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleItemChange = (id: string, field: keyof EducationItem, value: any) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddItem = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      gpa: '',
      bullets: [],
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
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          Education ({data.length})
        </h3>
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded">
          No education entries added yet. Click "Add Education" to begin.
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
                  #{index + 1} {item.institution || 'Untitled Institution'}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Institution</label>
                  <input
                    type="text"
                    value={item.institution}
                    onChange={(e) => handleItemChange(item.id, 'institution', e.target.value)}
                    placeholder="e.g. University of California, Berkeley"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Degree / Major</label>
                  <input
                    type="text"
                    value={item.degree}
                    onChange={(e) => handleItemChange(item.id, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Computer Science"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => handleItemChange(item.id, 'location', e.target.value)}
                    placeholder="e.g. Berkeley, CA"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">GPA / Honors</label>
                  <input
                    type="text"
                    value={item.gpa || ''}
                    onChange={(e) => handleItemChange(item.id, 'gpa', e.target.value)}
                    placeholder="e.g. 3.88/4.00"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={item.startDate}
                    onChange={(e) => handleItemChange(item.id, 'startDate', e.target.value)}
                    placeholder="e.g. Aug 2019"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">End Date</label>
                  <input
                    type="text"
                    value={item.endDate}
                    onChange={(e) => handleItemChange(item.id, 'endDate', e.target.value)}
                    placeholder="e.g. May 2023"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
