import React from 'react';
import { CVData, DesignConfig } from '../../../types/cv';

interface TemplateProps {
  cvData: CVData;
  config: DesignConfig;
}

export const TechTemplate: React.FC<TemplateProps> = ({ cvData, config }) => {
  const { personalInfo, education, experiences, projects, achievements, skills, customSections, sectionsOrder } = cvData;

  const renderSectionHeader = (title: string) => {
    return (
      <div 
        className="flex items-center gap-2 pb-1 border-b"
        style={{ borderColor: config.accentColor, marginBottom: `${config.itemGap}mm` }}
      >
        <h2 
          className="font-bold tracking-tight uppercase"
          style={{ 
            fontSize: `${config.sectionHeadingFontSize}pt`,
            color: config.accentColor 
          }}
        >
          {title}
        </h2>
      </div>
    );
  };

  return (
    <div className="w-full text-left">
      {/* Tech Header */}
      <header className="mb-4 pb-3 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h1 
              className="font-bold tracking-tight text-slate-950 font-mono"
              style={{ fontSize: `${config.nameFontSize}pt`, color: config.accentColor }}
            >
              {config.uppercaseName ? personalInfo.fullName.toUpperCase() : personalInfo.fullName}
            </h1>
            {personalInfo.jobTitle && (
              <div className="text-xs font-mono font-semibold text-slate-700 mt-0.5">
                {personalInfo.jobTitle}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-600 sm:text-right">
            {personalInfo.email && <div><span className="text-slate-400">email:</span> {personalInfo.email}</div>}
            {personalInfo.phone && <div><span className="text-slate-400">phone:</span> {personalInfo.phone}</div>}
            {personalInfo.github && <div><span className="text-slate-400">github:</span> {personalInfo.github}</div>}
            {personalInfo.linkedin && <div><span className="text-slate-400">linkedin:</span> {personalInfo.linkedin}</div>}
            {personalInfo.website && <div><span className="text-slate-400">web:</span> {personalInfo.website}</div>}
          </div>
        </div>
      </header>

      {/* Sections */}
      <main className="space-y-3">
        {sectionsOrder.map((sectionMeta) => {
          if (!sectionMeta.isVisible) return null;

          if (sectionMeta.id === 'summary' && personalInfo.summary && personalInfo.showSummary) {
            return (
              <div key="summary" style={{ marginBottom: `${config.sectionGap}mm` }}>
                <div className="bg-slate-50 p-2 rounded border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {personalInfo.summary}
                </div>
              </div>
            );
          }

          if (sectionMeta.id === 'skills') {
            const visibleSkills = skills.filter(s => s.isVisible);
            if (visibleSkills.length === 0) return null;
            return (
              <div key="skills" style={{ marginBottom: `${config.sectionGap}mm` }}>
                {renderSectionHeader('Technical Skills')}
                <div className="space-y-1.5 text-xs">
                  {visibleSkills.map(s => (
                    <div key={s.id} className="flex items-baseline flex-wrap gap-1.5">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {s.name}
                      </span>
                      <span className="text-slate-700">{s.skills}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionMeta.id === 'experiences') {
            const visibleExp = experiences.filter(e => e.isVisible);
            if (visibleExp.length === 0) return null;
            return (
              <div key="experiences" style={{ marginBottom: `${config.sectionGap}mm` }}>
                {renderSectionHeader('Experience')}
                <div className="space-y-3">
                  {visibleExp.map(exp => (
                    <div key={exp.id} className="text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{exp.company}</span>
                        <span className="font-mono text-[11px] text-slate-500">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="font-medium text-slate-700 italic mb-1">
                        {exp.role} {exp.location && <span className="not-italic text-slate-400">({exp.location})</span>}
                      </div>
                      <ul className="space-y-1">
                        {exp.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start text-slate-700 leading-snug">
                            <span className="mr-1.5 font-bold" style={{ color: config.accentColor }}>•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionMeta.id === 'projects') {
            const visibleProjects = projects.filter(p => p.isVisible);
            if (visibleProjects.length === 0) return null;
            return (
              <div key="projects" style={{ marginBottom: `${config.sectionGap}mm` }}>
                {renderSectionHeader('Projects')}
                <div className="space-y-2.5">
                  {visibleProjects.map(p => (
                    <div key={p.id} className="text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{p.name}</span>
                        {p.techStack && (
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1 py-0.5 rounded border border-slate-200">
                            {p.techStack}
                          </span>
                        )}
                      </div>
                      <ul className="mt-1 space-y-0.5 text-slate-700">
                        {p.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start leading-snug">
                            <span className="mr-1.5 font-bold" style={{ color: config.accentColor }}>•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionMeta.id === 'education') {
            const visibleEdu = education.filter(e => e.isVisible);
            if (visibleEdu.length === 0) return null;
            return (
              <div key="education" style={{ marginBottom: `${config.sectionGap}mm` }}>
                {renderSectionHeader('Education')}
                <div className="space-y-2 text-xs">
                  {visibleEdu.map(e => (
                    <div key={e.id}>
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{e.institution}</span>
                        <span className="font-mono font-normal text-slate-500">{e.startDate} - {e.endDate}</span>
                      </div>
                      <div className="text-slate-700">
                        {e.degree} {e.gpa && <span className="font-mono font-medium">| GPA: {e.gpa}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (sectionMeta.id === 'achievements') {
            const visibleAch = achievements.filter(a => a.isVisible);
            if (visibleAch.length === 0) return null;
            return (
              <div key="achievements" style={{ marginBottom: `${config.sectionGap}mm` }}>
                {renderSectionHeader('Achievements')}
                <div className="space-y-1 text-xs">
                  {visibleAch.map(a => (
                    <div key={a.id} className="flex justify-between text-slate-800">
                      <span><strong>{a.title}</strong>: {a.event}</span>
                      {a.date && <span className="font-mono text-slate-500">{a.date}</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          const custom = customSections.find(c => c.id === sectionMeta.id);
          if (custom && custom.isVisible) {
            return (
              <div key={custom.id} style={{ marginBottom: `${config.sectionGap}mm` }}>
                {renderSectionHeader(custom.title)}
                <div className="space-y-2 text-xs">
                  {custom.items.map(item => (
                    <div key={item.id}>
                      <div className="flex justify-between font-bold">
                        <span>{item.title}</span>
                        {item.date && <span className="font-mono text-slate-500">{item.date}</span>}
                      </div>
                      {item.subtitle && <div className="text-slate-600">{item.subtitle}</div>}
                      {item.bullets.map((b, idx) => (
                        <div key={idx} className="flex items-start text-slate-700">
                          <span className="mr-1.5 text-slate-400">•</span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </main>
    </div>
  );
};
