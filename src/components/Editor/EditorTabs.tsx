import React, { useState } from 'react';
import { CVData, DesignConfig, SectionMeta } from '../../types/cv';
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
    <div className="flex flex-col h-full bg-slate-900/90 border-r border-slate-800 text-slate-100">
      {/* Top Main Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 p-2 gap-1.5 shrink-0 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveMainTab('content')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
            activeMainTab === 'content'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>CV Content</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('design')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
            activeMainTab === 'design'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Design & Layout</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('order')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
            activeMainTab === 'order'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Sections Order</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('export')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
            activeMainTab === 'export'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export & ATS</span>
        </button>
      </div>

      {/* Content Subtab Pills (Only visible when main tab is 'content') */}
      {activeMainTab === 'content' && (
        <div className="flex border-b border-slate-800 bg-slate-900 px-3 py-2 gap-1.5 shrink-0 overflow-x-auto">
          {contentSubTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeContentSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveContentSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
                  isActive
                    ? 'bg-slate-800 text-blue-400 font-medium border border-blue-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
                {tab.count !== null && tab.count > 0 && (
                  <span className="text-[10px] bg-slate-700/80 text-slate-200 px-1.5 py-0.2 rounded-full font-mono">
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
