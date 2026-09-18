import React from 'react';
import { CustomSection, CustomSectionItem, SectionMeta } from '../../types/cv';
import { Plus, Trash2, Eye, EyeOff, Layers } from 'lucide-react';

interface Props {
  customSections: CustomSection[];
  sectionsOrder: SectionMeta[];
  onChange: (updatedSections: CustomSection[], updatedOrder: SectionMeta[]) => void;
}

export const CustomSectionsEditor: React.FC<Props> = ({
  customSections,
  sectionsOrder,
  onChange,
}) => {
  const handleAddSection = () => {
    const sectionId = `custom-${Date.now()}`;
    const newSection: CustomSection = {
      id: sectionId,
      title: 'Certifications & Licenses',
      items: [
        {
          id: `item-${Date.now()}`,
          title: 'AWS Certified Solutions Architect',
          subtitle: 'Amazon Web Services',
          date: '2025',
          bullets: ['Credential ID: AWS-123456'],
        },
      ],
      isVisible: true,
    };

    const newMeta: SectionMeta = {
      id: sectionId,
      title: newSection.title,
      isVisible: true,
      isCustom: true,
    };

    onChange([...customSections, newSection], [...sectionsOrder, newMeta]);
  };

  const handleDeleteSection = (id: string) => {
    onChange(
      customSections.filter((s) => s.id !== id),
      sectionsOrder.filter((s) => s.id !== id)
    );
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    onChange(
      customSections.map((s) => (s.id === id ? { ...s, title: newTitle } : s)),
      sectionsOrder.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleAddItem = (sectionId: string) => {
    onChange(
      customSections.map((s) => {
        if (s.id !== sectionId) return s;
        const newItem: CustomSectionItem = {
          id: `item-${Date.now()}`,
          title: '',
          subtitle: '',
          date: '',
          bullets: [''],
        };
        return { ...s, items: [...s.items, newItem] };
      }),
      sectionsOrder
    );
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    onChange(
      customSections.map((s) => {
        if (s.id !== sectionId) return s;
        return { ...s, items: s.items.filter((it) => it.id !== itemId) };
      }),
      sectionsOrder
    );
  };

  const handleItemFieldChange = (
    sectionId: string,
    itemId: string,
    field: keyof CustomSectionItem,
    value: any
  ) => {
    onChange(
      customSections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          items: s.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)),
        };
      }),
      sectionsOrder
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-pink-400" />
          Custom Sections ({customSections.length})
        </h3>
        <button
          type="button"
          onClick={handleAddSection}
          className="flex items-center gap-1.5 text-xs bg-pink-600 hover:bg-pink-500 text-white px-2.5 py-1 rounded transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Section
        </button>
      </div>

      {customSections.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded">
          No custom sections yet. Add sections like "Certifications", "Languages", "Publications", or "Volunteer Experience".
        </div>
      ) : (
        <div className="space-y-4">
          {customSections.map((section) => (
            <div key={section.id} className="p-3 bg-slate-900 border border-slate-800 rounded space-y-3">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleTitleChange(section.id, e.target.value)}
                  className="bg-slate-950 font-semibold text-xs border border-slate-700 rounded px-2 py-1 text-slate-100 flex-1 focus:outline-none focus:border-pink-500"
                  placeholder="Section Title (e.g. Certifications)"
                />
                <button
                  type="button"
                  onClick={() => handleAddItem(section.id)}
                  className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-1 text-slate-400 hover:text-rose-400"
                  title="Delete Section"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div key={item.id} className="bg-slate-950/60 p-2.5 rounded border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemFieldChange(section.id, item.id, 'title', e.target.value)}
                        placeholder="Item Title (e.g. AWS Certified Developer)"
                        className="bg-slate-900 text-xs border border-slate-700/80 rounded px-2 py-1 text-slate-200 flex-1 mr-2"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(section.id, item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.subtitle || ''}
                        onChange={(e) => handleItemFieldChange(section.id, item.id, 'subtitle', e.target.value)}
                        placeholder="Issuer / Subtitle"
                        className="bg-slate-900 text-xs border border-slate-700/80 rounded px-2 py-1 text-slate-200"
                      />
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) => handleItemFieldChange(section.id, item.id, 'date', e.target.value)}
                        placeholder="Date / Year"
                        className="bg-slate-900 text-xs border border-slate-700/80 rounded px-2 py-1 text-slate-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
