import React from 'react';
import { EducationItem } from '../../types/cv';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { Button, Card, Switch, Input } from '@heroui/react';

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

  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, isVisible } : item))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <GraduationCap className="w-4 h-4" />
          </div>
          Education ({data.length})
        </h3>
        <Button
          size="sm"
          variant="primary"
          onPress={handleAddItem}
          className="text-xs font-medium h-8 px-3 rounded-lg"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Education</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <Card variant="secondary" className="border border-dashed border-border p-6 text-center">
          <p className="text-muted text-xs">
            No education entries added yet. Click &quot;Add Education&quot; to begin.
          </p>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {data.map((item, index) => (
            <Card
              key={item.id}
              variant="secondary"
              className={`border transition-all ${
                item.isVisible ? 'border-border shadow-xs' : 'border-border/40 opacity-60'
              }`}
            >
              <Card.Header className="flex items-center justify-between border-b border-border/60 pb-2.5 px-4 pt-3">
                <span className="text-xs font-semibold text-foreground">
                  #{index + 1} {item.institution || 'Untitled Institution'}
                </span>
                <div className="flex items-center gap-2">
                  <Switch
                    isSelected={item.isVisible}
                    onChange={(checked) => handleToggleVisibility(item.id, checked)}
                    size="sm"
                  >
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch>
                  <Button
                    size="sm"
                    variant="danger-soft"
                    isIconOnly
                    onPress={() => handleDeleteItem(item.id)}
                    className="h-7 w-7 rounded-lg"
                    aria-label="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card.Header>

              <Card.Content className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1">Institution</label>
                    <Input
                      variant="secondary"
                      value={item.institution}
                      onChange={(e) => handleItemChange(item.id, 'institution', e.target.value)}
                      placeholder="e.g. University of California, Berkeley"
                      className="w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1">Degree / Major</label>
                    <Input
                      variant="secondary"
                      value={item.degree}
                      onChange={(e) => handleItemChange(item.id, 'degree', e.target.value)}
                      placeholder="e.g. Bachelor of Computer Science"
                      className="w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1">Location</label>
                    <Input
                      variant="secondary"
                      value={item.location}
                      onChange={(e) => handleItemChange(item.id, 'location', e.target.value)}
                      placeholder="e.g. Berkeley, CA"
                      className="w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1">GPA / Honors</label>
                    <Input
                      variant="secondary"
                      value={item.gpa || ''}
                      onChange={(e) => handleItemChange(item.id, 'gpa', e.target.value)}
                      placeholder="e.g. 3.88/4.00"
                      className="w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1">Start Date</label>
                    <Input
                      variant="secondary"
                      value={item.startDate}
                      onChange={(e) => handleItemChange(item.id, 'startDate', e.target.value)}
                      placeholder="e.g. Aug 2019"
                      className="w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1">End Date</label>
                    <Input
                      variant="secondary"
                      value={item.endDate}
                      onChange={(e) => handleItemChange(item.id, 'endDate', e.target.value)}
                      placeholder="e.g. May 2023"
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
