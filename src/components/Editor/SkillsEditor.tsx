import React from 'react';
import { SkillCategory } from '../../types/cv';
import { Button, Card, Input, TextArea, Switch, Chip } from '@heroui/react';
import { Plus, Trash2, Wrench, Tag } from 'lucide-react';

interface Props {
  data: SkillCategory[];
  onChange: (updated: SkillCategory[]) => void;
}

const COMMON_SKILL_PRESETS = [
  { name: 'Frontend', skills: 'React, Next.js, TypeScript, Tailwind CSS, Redux, Vue.js' },
  { name: 'Backend', skills: 'Node.js, Express, NestJS, Go, Python, FastAPI, Django, Java' },
  { name: 'DevOps & Cloud', skills: 'Docker, Kubernetes, AWS, Azure, GCP, CI/CD (GitHub Actions), Terraform' },
  { name: 'Databases', skills: 'PostgreSQL, MySQL, MongoDB, Redis, Prisma, TypeORM' },
];

export const SkillsEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleItemChange = (id: string, field: keyof SkillCategory, value: any) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      name: 'New Skill Category',
      skills: '',
      isVisible: true,
    };
    onChange([...data, newCat]);
  };

  const handleDeleteCategory = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const handleToggleVisibility = (id: string) => {
    onChange(
      data.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item))
    );
  };

  const handleApplyPreset = (preset: { name: string; skills: string }) => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      name: preset.name,
      skills: preset.skills,
      isVisible: true,
    };
    onChange([...data, newCat]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Wrench className="w-4 h-4 text-accent" />
          Skills & Technical Proficiencies ({data.length})
        </h3>
        <Button
          variant="primary"
          size="sm"
          onPress={handleAddCategory}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </Button>
      </div>

      {/* Preset Suggestions */}
      <Card variant="secondary" className="border-border">
        <Card.Content className="p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
            <Tag className="w-3.5 h-3.5 text-accent" />
            Quick Presets
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SKILL_PRESETS.map((preset, idx) => (
              <Button
                key={idx}
                variant="tertiary"
                size="sm"
                onPress={() => handleApplyPreset(preset)}
                className="text-xs h-7 px-2.5"
              >
                + {preset.name}
              </Button>
            ))}
          </div>
        </Card.Content>
      </Card>

      {data.length === 0 ? (
        <Card variant="secondary" className="text-center py-8 text-muted text-xs border-dashed border-border">
          <Card.Content>
            No skill categories added. Add categories like &quot;Programming & Frameworks&quot;, &quot;Tools & Systems&quot;, etc.
          </Card.Content>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((cat, index) => {
            const skillChips = cat.skills
              ? cat.skills.split(',').map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <Card
                key={cat.id}
                variant="secondary"
                className={`border-border transition-all duration-200 ${
                  !cat.isVisible ? 'opacity-60' : ''
                }`}
              >
                <Card.Header className="flex items-center justify-between py-2.5 px-4 border-b border-border">
                  <span className="text-xs font-semibold text-foreground">
                    #{index + 1} {cat.name || 'Untitled Category'}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-muted font-medium">Visible</span>
                      <Switch
                        size="sm"
                        isSelected={cat.isVisible}
                        onChange={() => handleToggleVisibility(cat.id)}
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
                      onPress={() => handleDeleteCategory(cat.id)}
                      aria-label="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card.Header>

                <Card.Content className="p-4 space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted">Category Label</label>
                    <Input
                      variant="secondary"
                      value={cat.name}
                      onChange={(e) => handleItemChange(cat.id, 'name', e.target.value)}
                      placeholder="e.g. Programming & Frameworks"
                      className="w-full text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted">Skills List (comma-separated)</label>
                    <TextArea
                      rows={2}
                      variant="secondary"
                      value={cat.skills}
                      onChange={(e) => handleItemChange(cat.id, 'skills', e.target.value)}
                      placeholder="e.g. JavaScript, TypeScript, React, Next.js, Node.js, Express, NestJs, Laravel"
                      className="w-full text-xs"
                    />
                  </div>

                  {skillChips.length > 0 && (
                    <div className="pt-1">
                      <div className="text-[10px] text-muted font-medium mb-1.5 uppercase tracking-wider">
                        Detected Skills ({skillChips.length}):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skillChips.map((skill, sIdx) => (
                          <Chip key={sIdx} size="sm" variant="secondary" color="accent">
                            <Chip.Label className="text-[10px] font-mono">{skill}</Chip.Label>
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
