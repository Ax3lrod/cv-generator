import React from 'react';
import { ExperienceItem } from '../../types/cv';
import { Plus, Trash2, Briefcase, Minus } from 'lucide-react';
import { Button, Card, Switch, Input } from '@heroui/react';

interface Props {
  data: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

export const ExperienceEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleItemChange = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddItem = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      bullets: [''],
      isVisible: true,
    };
    onChange([newItem, ...data]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const handleToggleVisibility = (id: string, isVisible: boolean) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, isVisible } : item))
    );
  };

  // Bullets handler
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
        const newBullets = item.bullets.filter((_, idx) => idx !== bulletIdx);
        return { ...item, bullets: newBullets };
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/15 text-accent">
            <Briefcase className="w-4 h-4" />
          </div>
          Experiences ({data.length})
        </h3>
        <Button
          size="sm"
          variant="primary"
          onPress={handleAddItem}
          className="text-xs font-medium h-8 px-3 rounded-lg"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Experience</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <Card variant="secondary" className="border border-dashed border-border p-6 text-center">
          <p className="text-muted text-xs">
            No experience items yet. Click &quot;Add Experience&quot; to add work or organizational roles.
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
                  #{index + 1} {item.company ? `${item.company} · ${item.role}` : 'Untitled Role'}
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

              <Card.Content className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1">Company / Organization</label>
                    <Input
                      variant="secondary"
                      value={item.company}
                      onChange={(e) => handleItemChange(item.id, 'company', e.target.value)}
                      placeholder="e.g. Apex Cloud Technologies"
                      className="w-full text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1">Role / Position</label>
                    <Input
                      variant="secondary"
                      value={item.role}
                      onChange={(e) => handleItemChange(item.id, 'role', e.target.value)}
                      placeholder="e.g. Lead Full-Stack Developer"
                      className="w-full text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-muted mb-1">Location</label>
                    <Input
                      variant="secondary"
                      value={item.location}
                      onChange={(e) => handleItemChange(item.id, 'location', e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-muted mb-1">Start Date</label>
                      <Input
                        variant="secondary"
                        value={item.startDate}
                        onChange={(e) => handleItemChange(item.id, 'startDate', e.target.value)}
                        placeholder="e.g. Jun 2023"
                        className="w-full text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-muted mb-1">End Date</label>
                      <Input
                        variant="secondary"
                        value={item.endDate}
                        onChange={(e) => handleItemChange(item.id, 'endDate', e.target.value)}
                        placeholder="e.g. Present"
                        className="w-full text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Bullets List */}
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-medium text-muted">
                      Key Responsibilities & Achievements (Bullets)
                    </label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onPress={() => handleAddBullet(item.id)}
                      className="text-[11px] text-accent hover:text-accent-foreground font-medium h-6 px-2"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Bullet
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    {item.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-1.5">
                        <span className="text-muted text-xs select-none w-3 text-center">•</span>
                        <Input
                          variant="secondary"
                          value={bullet}
                          onChange={(e) => handleBulletChange(item.id, bIdx, e.target.value)}
                          placeholder="e.g. Architected microservices boosting throughput by 42%..."
                          className="flex-1 text-xs"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          isIconOnly
                          onPress={() => handleDeleteBullet(item.id, bIdx)}
                          className="h-7 w-7 text-muted hover:text-danger rounded-lg shrink-0"
                          aria-label="Remove Bullet"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
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
