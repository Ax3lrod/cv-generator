import React from 'react';
import { ProjectItem } from '../../types/cv';
import { Button, Card, Input, TextArea, Switch } from '@heroui/react';
import { Plus, Trash2, FolderGit2 } from 'lucide-react';

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
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-accent" />
          Projects ({data.length})
        </h3>
        <Button
          variant="primary"
          size="sm"
          onPress={handleAddItem}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </Button>
      </div>

      {data.length === 0 ? (
        <Card variant="secondary" className="text-center py-8 text-muted text-xs border-dashed border-border">
          <Card.Content>
            No projects added yet. Click &quot;Add Project&quot; to showcase key software or research projects.
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
                  #{index + 1} {item.name || 'Untitled Project'}
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
                    aria-label="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card.Header>

              <Card.Content className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted">Project Name</label>
                    <Input
                      variant="secondary"
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      placeholder="e.g. Distributed Real-Time Stream Processor"
                      className="w-full text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted">Tech Stack (optional)</label>
                    <Input
                      variant="secondary"
                      value={item.techStack || ''}
                      onChange={(e) => handleItemChange(item.id, 'techStack', e.target.value)}
                      placeholder="e.g. Kafka, PySpark, Trino, FastAPI, Docker"
                      className="w-full text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted">Project Link / Repo (optional)</label>
                    <Input
                      variant="secondary"
                      value={item.link || ''}
                      onChange={(e) => handleItemChange(item.id, 'link', e.target.value)}
                      placeholder="e.g. github.com/user/repo"
                      className="w-full text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted">Subtitle / Context (optional)</label>
                    <Input
                      variant="secondary"
                      value={item.subtitle || ''}
                      onChange={(e) => handleItemChange(item.id, 'subtitle', e.target.value)}
                      placeholder="e.g. Personal Project / Capstone"
                      className="w-full text-xs"
                    />
                  </div>
                </div>

                {/* Bullet Points */}
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                      Bullets / Contributions
                    </label>
                    <Button
                      variant="tertiary"
                      size="sm"
                      onPress={() => handleAddBullet(item.id)}
                      className="flex items-center gap-1 text-xs text-accent"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {item.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <span className="text-muted text-xs mt-2 select-none">•</span>
                        <TextArea
                          rows={2}
                          variant="secondary"
                          value={bullet}
                          onChange={(e) => handleBulletChange(item.id, bIdx, e.target.value)}
                          placeholder="Key technical accomplishments, metrics, architecture..."
                          className="flex-1 text-xs"
                        />
                        <Button
                          variant="danger-soft"
                          size="sm"
                          isIconOnly
                          onPress={() => handleDeleteBullet(item.id, bIdx)}
                          className="mt-1"
                          aria-label="Delete bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
