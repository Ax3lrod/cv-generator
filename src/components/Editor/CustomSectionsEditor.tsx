import React from 'react';
import { CustomSection, CustomSectionItem, SectionMeta } from '../../types/cv';
import { Button, Card, Input } from '@heroui/react';
import { Plus, Trash2, Layers } from 'lucide-react';

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
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          Custom Sections ({customSections.length})
        </h3>
        <Button
          variant="primary"
          size="sm"
          onPress={handleAddSection}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Section
        </Button>
      </div>

      {customSections.length === 0 ? (
        <Card variant="secondary" className="text-center py-8 text-muted text-xs border-dashed border-border">
          <Card.Content>
            No custom sections yet. Add sections like &quot;Certifications&quot;, &quot;Languages&quot;, &quot;Publications&quot;, or &quot;Volunteer Experience&quot;.
          </Card.Content>
        </Card>
      ) : (
        <div className="space-y-4">
          {customSections.map((section) => (
            <Card key={section.id} variant="secondary" className="border-border">
              <Card.Header className="flex items-center justify-between gap-3 py-2.5 px-4 border-b border-border">
                <div className="flex-1 max-w-sm">
                  <Input
                    variant="secondary"
                    value={section.title}
                    onChange={(e) => handleTitleChange(section.id, e.target.value)}
                    placeholder="Section Title (e.g. Certifications)"
                    className="font-semibold text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="tertiary"
                    size="sm"
                    onPress={() => handleAddItem(section.id)}
                    className="flex items-center gap-1 text-xs text-accent"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </Button>
                  <Button
                    variant="danger-soft"
                    size="sm"
                    isIconOnly
                    onPress={() => handleDeleteSection(section.id)}
                    aria-label="Delete Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card.Header>

              <Card.Content className="p-4 space-y-3">
                {section.items.map((item) => (
                  <Card key={item.id} variant="secondary" className="border-border/60 bg-surface/50">
                    <Card.Content className="p-3 space-y-2.5">
                      <div className="flex justify-between items-center gap-2">
                        <Input
                          variant="secondary"
                          value={item.title}
                          onChange={(e) => handleItemFieldChange(section.id, item.id, 'title', e.target.value)}
                          placeholder="Item Title (e.g. AWS Certified Developer)"
                          className="flex-1 text-xs"
                        />
                        <Button
                          variant="danger-soft"
                          size="sm"
                          isIconOnly
                          onPress={() => handleDeleteItem(section.id, item.id)}
                          aria-label="Delete Item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input
                          variant="secondary"
                          value={item.subtitle || ''}
                          onChange={(e) => handleItemFieldChange(section.id, item.id, 'subtitle', e.target.value)}
                          placeholder="Issuer / Subtitle"
                          className="text-xs"
                        />
                        <Input
                          variant="secondary"
                          value={item.date || ''}
                          onChange={(e) => handleItemFieldChange(section.id, item.id, 'date', e.target.value)}
                          placeholder="Date / Year"
                          className="text-xs"
                        />
                      </div>
                    </Card.Content>
                  </Card>
                ))}
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
