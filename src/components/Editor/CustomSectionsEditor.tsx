import React from 'react';
import { CustomSection, CustomSectionItem, SectionMeta } from '../../types/cv';
import { Plus, Trash2, Layers } from 'lucide-react';
import { Button } from '@heroui/react';

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
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Layers className="w-4 h-4" />
          </div>
          Custom Sections ({customSections.length})
        </h3>
        <Button
          size="sm"
          variant="primary"
          onPress={handleAddSection}
          className="text-xs font-semibold h-8 px-3 rounded-lg flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Section</span>
        </Button>
      </div>

      {customSections.length === 0 ? (
        <div className="border border-dashed border-slate-800 bg-slate-900/40 rounded-xl p-8 text-center">
          <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-medium">
            No custom sections yet. Add sections like &quot;Certifications&quot;, &quot;Languages&quot;, &quot;Publications&quot;, or &quot;Volunteer Experience&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {customSections.map((section) => (
            <div key={section.id} className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
              {/* Custom Section Header */}
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-950/80 border-b border-slate-800">
                <div className="flex-1 max-w-sm">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleTitleChange(section.id, e.target.value)}
                    placeholder="Section Title (e.g. Certifications)"
                    className="w-full bg-slate-900 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 text-slate-100 rounded-lg px-2.5 py-1 text-xs font-semibold placeholder:text-slate-500 transition"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddItem(section.id)}
                    className="text-xs text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(section.id)}
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 flex items-center justify-center transition"
                    title="Delete Section"
                    aria-label="Delete Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="p-3.5 space-y-2.5">
                {section.items.map((item) => (
                  <div key={item.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 space-y-2.5">
                    <div className="flex justify-between items-center gap-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemFieldChange(section.id, item.id, 'title', e.target.value)}
                        placeholder="Item Title (e.g. AWS Certified Solutions Architect)"
                        className="flex-1 bg-slate-900 border border-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs font-medium placeholder:text-slate-600 transition"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(section.id, item.id)}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 flex items-center justify-center transition"
                        title="Delete Item"
                        aria-label="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.subtitle || ''}
                        onChange={(e) => handleItemFieldChange(section.id, item.id, 'subtitle', e.target.value)}
                        placeholder="Issuer / Subtitle (e.g. Amazon Web Services)"
                        className="bg-slate-900 border border-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
                      />
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) => handleItemFieldChange(section.id, item.id, 'date', e.target.value)}
                        placeholder="Date / Year (e.g. 2025)"
                        className="bg-slate-900 border border-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 text-slate-100 rounded-lg px-2.5 py-1.5 text-xs placeholder:text-slate-600 transition"
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
