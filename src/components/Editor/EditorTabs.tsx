import React, { useState } from 'react';
import { CVData, DesignConfig } from '../../types/cv';
import { PersonalInfoEditor } from './PersonalInfoEditor';
import { EducationEditor } from './EducationEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { SkillsEditor } from './SkillsEditor';
import { AchievementsEditor } from './AchievementsEditor';
import { CustomSectionsEditor } from './CustomSectionsEditor';
import { DesignConfigEditor } from './DesignConfigEditor';
import { SectionsOrderEditor } from './SectionsOrderEditor';
import { ExportImportEditor } from './ExportImportEditor';
import { 
  FileText, 
  Palette, 
  ListOrdered, 
  Download, 
  User, 
  GraduationCap, 
  Briefcase, 
  FolderGit2, 
  Wrench, 
  Award, 
  Layers 
} from 'lucide-react';

interface Props {
  cvData: CVData;
  designConfig: DesignConfig;
  onUpdateCVData: (updated: CVData) => void;
  onUpdateDesignConfig: (updated: DesignConfig) => void;
}

type MainTab = 'content' | 'design' | 'order' | 'export';
type ContentSubTab = 'personal' | 'education' | 'experiences' | 'projects' | 'skills' | 'achievements' | 'custom';

export const EditorTabs: React.FC<Props> = ({
  cvData,
  designConfig,
  onUpdateCVData,
  onUpdateDesignConfig,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('content');
  const [activeContentSubTab, setActiveContentSubTab] = useState<ContentSubTab>('personal');

  const mainTabs = [
    { id: 'content' as const, label: 'CV Content', icon: FileText },
    { id: 'design' as const, label: 'Design & Layout', icon: Palette },
    { id: 'order' as const, label: 'Sections Order', icon: ListOrdered },
    { id: 'export' as const, label: 'Export & ATS', icon: Download },
  ];

  const contentSubTabs = [
    { id: 'personal' as const, label: 'Profile', icon: User, count: null },
    { id: 'education' as const, label: 'Education', icon: GraduationCap, count: cvData.education.length },
    { id: 'experiences' as const, label: 'Experience', icon: Briefcase, count: cvData.experiences.length },
    { id: 'projects' as const, label: 'Projects', icon: FolderGit2, count: cvData.projects.length },
    { id: 'skills' as const, label: 'Skills', icon: Wrench, count: cvData.skills.length },
    { id: 'achievements' as const, label: 'Awards', icon: Award, count: cvData.achievements.length },
    { id: 'custom' as const, label: 'Custom', icon: Layers, count: cvData.customSections.length },
  ];

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border text-foreground transition-colors">
      {/* Top Main Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 p-2 gap-1.5 shrink-0 overflow-x-auto custom-scrollbar">
        {mainTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeMainTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveMainTab(t.id)}
              className={`h-9 px-3.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Subtab Pills (Only visible when main tab is 'content') */}
      {activeMainTab === 'content' && (
        <div className="flex border-b border-slate-800/80 bg-slate-950/70 px-3 py-2 gap-1.5 shrink-0 overflow-x-auto custom-scrollbar">
          {contentSubTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeContentSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveContentSubTab(tab.id)}
                className={`h-7 px-2.5 text-xs rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-slate-900 text-blue-400 border border-blue-500/40 font-semibold shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
                {tab.count !== null && tab.count > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeMainTab === 'content' && (
          <div>
            {activeContentSubTab === 'personal' && (
              <PersonalInfoEditor
                data={cvData.personalInfo}
                onChange={(updated) => onUpdateCVData({ ...cvData, personalInfo: updated })}
                designConfig={designConfig}
                onUpdateDesignConfig={onUpdateDesignConfig}
              />
            )}
            {activeContentSubTab === 'education' && (
              <EducationEditor
                data={cvData.education}
                onChange={(updated) => onUpdateCVData({ ...cvData, education: updated })}
              />
            )}
            {activeContentSubTab === 'experiences' && (
              <ExperienceEditor
                data={cvData.experiences}
                onChange={(updated) => onUpdateCVData({ ...cvData, experiences: updated })}
              />
            )}
            {activeContentSubTab === 'projects' && (
              <ProjectsEditor
                data={cvData.projects}
                onChange={(updated) => onUpdateCVData({ ...cvData, projects: updated })}
              />
            )}
            {activeContentSubTab === 'skills' && (
              <SkillsEditor
                data={cvData.skills}
                onChange={(updated) => onUpdateCVData({ ...cvData, skills: updated })}
              />
            )}
            {activeContentSubTab === 'achievements' && (
              <AchievementsEditor
                data={cvData.achievements}
                onChange={(updated) => onUpdateCVData({ ...cvData, achievements: updated })}
              />
            )}
            {activeContentSubTab === 'custom' && (
              <CustomSectionsEditor
                customSections={cvData.customSections}
                sectionsOrder={cvData.sectionsOrder}
                onChange={(updatedSections, updatedOrder) =>
                  onUpdateCVData({
                    ...cvData,
                    customSections: updatedSections,
                    sectionsOrder: updatedOrder,
                  })
                }
              />
            )}
          </div>
        )}

        {activeMainTab === 'design' && (
          <DesignConfigEditor
            config={designConfig}
            onChange={onUpdateDesignConfig}
          />
        )}

        {activeMainTab === 'order' && (
          <SectionsOrderEditor
            sections={cvData.sectionsOrder}
            onChange={(updatedOrder) => onUpdateCVData({ ...cvData, sectionsOrder: updatedOrder })}
          />
        )}

        {activeMainTab === 'export' && (
          <ExportImportEditor
            cvData={cvData}
            designConfig={designConfig}
            onUpdateCVData={onUpdateCVData}
            onUpdateDesignConfig={onUpdateDesignConfig}
          />
        )}
      </div>
    </div>
  );
};
