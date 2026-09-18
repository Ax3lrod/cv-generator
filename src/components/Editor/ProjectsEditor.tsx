import React from 'react';
import { ProjectItem } from '../../types/cv';
import { Plus, Trash2, Eye, EyeOff, FolderGit2 } from 'lucide-react';

interface Props {
  data: ProjectItem[];
  onChange: (updated: ProjectItem[]) => void;
}

export const ProjectsEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleItemChange = (id: string, field: keyof ProjectItem, value: any) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddItem = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      subtitle: '',
      techStack: '',
      link: '',
      bullets: [''],
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
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-purple-400" />
          Projects ({data.length})
        </h3>
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1 rounded transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded">
          No projects added yet. Click "Add Project" to showcase key software or research projects.
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
                  #{index + 1} {item.name || 'Untitled Project'}
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
                    title="Delete Project"
                    className="p-1 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    placeholder="e.g. Distributed Real-Time Stream Processor"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tech Stack (optional)</label>
                  <input
                    type="text"
                    value={item.techStack || ''}
                    onChange={(e) => handleItemChange(item.id, 'techStack', e.target.value)}
                    placeholder="e.g. Kafka, PySpark, Trino, FastAPI, Docker"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Project Link / Repo (optional)</label>
                  <input
                    type="text"
                    value={item.link || ''}
                    onChange={(e) => handleItemChange(item.id, 'link', e.target.value)}
                    placeholder="e.g. github.com/user/repo"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Subtitle / Context (optional)</label>
                  <input
                    type="text"
                    value={item.subtitle || ''}
                    onChange={(e) => handleItemChange(item.id, 'subtitle', e.target.value)}
                    placeholder="e.g. Personal Project / Capstone"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Bullet Points */}
              <div className="border-t border-slate-800/80 pt-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Bullets / Contributions
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet(item.id)}
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
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
                        placeholder="Key technical accomplishments, metrics, architecture..."
                        className="flex-1 bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
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
