import React from 'react';
import { SectionMeta } from '../../types/cv';
import { ArrowUp, ArrowDown, ListOrdered } from 'lucide-react';
import { Button, Card, Chip, Switch, Input } from '@heroui/react';

interface Props {
  sections: SectionMeta[];
  onChange: (updated: SectionMeta[]) => void;
}

export const SectionsOrderEditor: React.FC<Props> = ({ sections, onChange }) => {
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);
    onChange(newSections);
  };

  const toggleVisibility = (id: string, isVisible: boolean) => {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, isVisible } : s))
    );
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  return (
    <div className="space-y-4">
      <Card variant="secondary" className="border border-border">
        <Card.Header className="flex items-center gap-2 border-b border-border/70 pb-3 px-4 pt-3.5">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <Card.Title className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Section Order & Visibility
            </Card.Title>
            <Card.Description className="text-[11px] text-muted mt-0.5">
              Customize the hierarchy of your CV. Reorder sections, rename titles, or toggle visibility.
            </Card.Description>
          </div>
        </Card.Header>

        <Card.Content className="p-4 space-y-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                section.isVisible
                  ? 'bg-surface-tertiary/60 border-border shadow-xs'
                  : 'bg-surface-tertiary/20 border-border/40 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 mr-2">
                <span className="font-mono text-xs text-muted w-5 shrink-0">
                  {index + 1}.
                </span>
                <Input
                  variant="secondary"
                  value={section.title}
                  onChange={(e) => handleTitleChange(section.id, e.target.value)}
                  className="text-xs font-medium h-7.5 max-w-xs"
                  placeholder="Section Title"
                />
                {section.isCustom && (
                  <Chip size="sm" variant="soft" color="accent" className="text-[10px] h-4.5 px-1.5">
                    <Chip.Label>Custom</Chip.Label>
                  </Chip>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  isIconOnly
                  isDisabled={index === 0}
                  onPress={() => moveSection(index, 'up')}
                  className="h-7 w-7 rounded-lg text-muted hover:text-foreground"
                  aria-label="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  isIconOnly
                  isDisabled={index === sections.length - 1}
                  onPress={() => moveSection(index, 'down')}
                  className="h-7 w-7 rounded-lg text-muted hover:text-foreground"
                  aria-label="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </Button>

                <div className="h-4 w-px bg-border mx-0.5" />

                <Switch
                  isSelected={section.isVisible}
                  onChange={(checked) => toggleVisibility(section.id, checked)}
                  size="sm"
                >
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch>
              </div>
            </div>
          ))}
        </Card.Content>
      </Card>
    </div>
  );
};
