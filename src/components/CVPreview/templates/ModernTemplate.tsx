import React from 'react';
import { CVData, DesignConfig, CustomSection } from '../../../types/cv';

interface TemplateProps {
  cvData: CVData;
  config: DesignConfig;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ cvData, config }) => {
  const { personalInfo, education, experiences, projects, achievements, skills, customSections, sectionsOrder } = cvData;

  const renderSectionHeader = (title: string) => {
    return (
      <div 
        className="flex items-center gap-3 border-b pb-1" 
        style={{ borderColor: `${config.accentColor}33`, marginBottom: `${config.itemGap}mm` }}
      >
        <span 
          className="w-2.5 h-2.5 rounded-full" 
          style={{ backgroundColor: config.accentColor }} 
        />
        <h2 
          className="font-bold tracking-wider text-xs uppercase"
          style={{ 
            fontSize: `${config.sectionHeadingFontSize}pt`,
            color: config.accentColor 
          }}
        >
          {title}
        </h2>
        <div className="flex-1 h-[1px] bg-slate-200" />
      </div>
    );
  };

  const contactParts: { label: string; val: string }[] = [];
  if (personalInfo.phone) contactParts.push({ label: 'Phone', val: personalInfo.phone });
  if (personalInfo.email) contactParts.push({ label: 'Email', val: personalInfo.email });
  if (personalInfo.location) contactParts.push({ label: 'Location', val: personalInfo.location });
  if (personalInfo.linkedin) contactParts.push({ label: 'LinkedIn', val: personalInfo.linkedin });
  if (personalInfo.website) contactParts.push({ label: 'Portfolio', val: personalInfo.website });
  if (personalInfo.github) contactParts.push({ label: 'GitHub', val: personalInfo.github });

  return (
    <div className="w-full text-left">
      {/* Modern Header */}
      <header className="mb-4 pb-3 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h1 
              className="font-bold tracking-tight text-slate-900 leading-tight"
              style={{ fontSize: `${config.nameFontSize}pt`, color: config.accentColor }}
            >
              {config.uppercaseName ? personalInfo.fullName.toUpperCase() : personalInfo.fullName}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-sm font-semibold tracking-wide text-slate-600 mt-0.5">
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
        </div>

        {/* Contact Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600">
          {contactParts.map((c, i) => (
            <span key={i} className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono text-[11px]">
              {c.val}
            </span>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="space-y-3">
        {sectionsOrder.map((sectionMeta) => {
          if (!sectionMeta.isVisible) return null;

          if (sectionMeta.id === 'summary' && personalInfo.summary && personalInfo.showSummary) {
            return (
              <div key="summary" style={{ marginBottom: `${config.sectionGap}mm` }}>
                <p className="text-slate-700 leading-relaxed text-justify">
                  {personalInfo.summary}
                </p>
              </div>
            );
          }

          if (sectionMeta.id === 'education') {
            const visibleEdu = education.filter(e => e.isVisible);
            if (visibleEdu.length === 0) return null;
            return (
              <div key="education" style={{ marginBottom: `${config.sectionGap}mm` }}>
                {renderSectionHeader('Education')}
                <div className="space-y-2">
                  {visibleEdu.map(e => (
                    <div key={e.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{e.institution}</span>
                        <span className="text-xs text-slate-500 font-mono">{e.startDate} – {e.endDate}</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        {e.degree} {e.gpa && <span className="font-medium text-slate-800">· GPA {e.gpa}</span>}
                        {e.location && <span className="text-slate-400"> · {e.location}</span>}
                      </div>
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
                {renderSectionHeader('Experiences')}
                <div className="space-y-3">
                  {visibleExp.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{exp.company}</span>
                        <span className="text-xs text-slate-500 font-mono">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700 italic mb-1">
                        {exp.role} {exp.location && <span className="font-normal text-slate-400 not-italic">· {exp.location}</span>}
                      </div>
                      <ul className="space-y-1 text-slate-700">
                        {exp.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start text-xs leading-relaxed">
                            <span className="text-slate-400 mr-2 font-bold select-none">•</span>
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
                    <div key={p.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-xs">{p.name}</span>
                        {p.techStack && (
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {p.techStack}
                          </span>
                        )}
                      </div>
                      <ul className="mt-1 space-y-0.5 text-slate-700">
                        {p.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start text-xs leading-relaxed">
                            <span className="text-slate-400 mr-2 select-none">•</span>
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

          if (sectionMeta.id === 'skills') {
            const visibleSkills = skills.filter(s => s.isVisible);
            if (visibleSkills.length === 0) return null;
            return (
              <div key="skills" style={{ marginBottom: `${config.sectionGap}mm` }}>
                {renderSectionHeader('Skills')}
                <div className="grid grid-cols-1 gap-1.5">
                  {visibleSkills.map(s => (
                    <div key={s.id} className="text-xs">
                      <strong className="text-slate-900">{s.name}: </strong>
                      <span className="text-slate-700">{s.skills}</span>
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
                <ul className="space-y-1">
                  {visibleAch.map(a => (
                    <li key={a.id} className="text-xs flex items-baseline justify-between text-slate-700">
                      <span><strong className="font-bold text-slate-900">{a.title}</strong>: {a.event}</span>
                      {a.date && <span className="text-[11px] text-slate-500 font-mono">{a.date}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          const custom = customSections.find(c => c.id === sectionMeta.id);
          if (custom && custom.isVisible) {
            return (
              <div key={custom.id} style={{ marginBottom: `${config.sectionGap}mm` }}>
                {renderSectionHeader(custom.title)}
                <div className="space-y-2">
                  {custom.items.map(item => (
                    <div key={item.id} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{item.title}</span>
                        {item.date && <span className="font-mono text-slate-500">{item.date}</span>}
                      </div>
                      {item.subtitle && <div className="italic text-slate-600">{item.subtitle}</div>}
                      {item.bullets.map((b, idx) => (
                        <div key={idx} className="flex items-start text-slate-700 mt-0.5">
                          <span className="mr-1.5">•</span>
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
