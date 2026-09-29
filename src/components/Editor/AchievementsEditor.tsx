import React from 'react';
import { AchievementItem } from '../../types/cv';
import { Button, Card, Input, Switch } from '@heroui/react';
import { Plus, Trash2, Award } from 'lucide-react';

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
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Award className="w-4 h-4 text-accent" />
          Achievements & Awards ({data.length})
        </h3>
        <Button
          variant="primary"
          size="sm"
          onPress={handleAddItem}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Award
        </Button>
      </div>

      {data.length === 0 ? (
        <Card variant="secondary" className="text-center py-8 text-muted text-xs border-dashed border-border">
          <Card.Content>
            No achievements added yet. Click &quot;Add Award&quot; to list competitions, rankings, or honors.
          </Card.Content>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <Card
              key={item.id}
              variant="secondary"
              className={`border-border transition-all duration-200 ${
                !item.isVisible ? 'opacity-60' : ''
              }`}
            >
              <Card.Header className="flex items-center justify-between py-2.5 px-4 border-b border-border">
                <span className="text-xs font-semibold text-foreground">
                  #{index + 1} {item.title || 'Untitled Award'}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted font-medium">Visible</span>
                    <Switch
                      size="sm"
                      isSelected={item.isVisible}
                      onChange={() => handleToggleVisibility(item.id)}
                    >
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>
                  </div>
                  <Button
                    variant="danger-soft"
                    size="sm"
                    isIconOnly
                    onPress={() => handleDeleteItem(item.id)}
                    aria-label="Delete Award"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card.Header>

              <Card.Content className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted">Placement / Award Title</label>
                    <Input
                      variant="secondary"
                      value={item.title}
                      onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                      placeholder="e.g. 1st Place Winner"
                      className="w-full text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted">Competition / Event</label>
                    <Input
                      variant="secondary"
                      value={item.event}
                      onChange={(e) => handleItemChange(item.id, 'event', e.target.value)}
                      placeholder="e.g. National Collegiate Hackathon"
                      className="w-full text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted">Date / Year (optional)</label>
                    <Input
                      variant="secondary"
                      value={item.date || ''}
                      onChange={(e) => handleItemChange(item.id, 'date', e.target.value)}
                      placeholder="e.g. 2023"
                      className="w-full text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted">Brief Detail (optional)</label>
                    <Input
                      variant="secondary"
                      value={item.description || ''}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      placeholder="e.g. Out of 300+ national teams"
                      className="w-full text-xs"
                    />
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
