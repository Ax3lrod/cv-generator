import React from 'react';
import { CVData, DesignConfig } from '../../../types/cv';

interface TemplateProps {
  cvData: CVData;
  config: DesignConfig;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ cvData, config }) => {
  const { personalInfo, education, experiences, projects, achievements, skills, customSections, sectionsOrder } = cvData;

  const renderSectionHeader = (title: string) => {
    return (
      <div 
        className="border-b-2 border-slate-900 pb-1 flex justify-between items-baseline uppercase tracking-wider font-serif"
        style={{ borderColor: config.accentColor, marginBottom: `${config.itemGap}mm` }}
      >
        <h2 
          className="font-bold text-sm tracking-widest"
          style={{ 
            fontSize: `${config.sectionHeadingFontSize}pt`,
            color: config.accentColor 
          }}
        >
          {title}
        </h2>
        <span className="text-[10px] text-slate-400 font-sans tracking-normal">■</span>
      </div>
    );
  };

  const contactList = [
    personalInfo.phone,
    personalInfo.email,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.website,
    personalInfo.github
  ].filter(Boolean);

  const hasPhoto = Boolean(personalInfo.showPhoto && personalInfo.photoUrl);
  const photoAspectRatio = config.photoAspectRatio || '1:1';
  const isPortrait = photoAspectRatio === '3:4';
  const photoShape = isPortrait && config.photoShape === 'circle' ? 'rounded' : (config.photoShape || 'circle');
  const photoWidthMm = config.photoSize || 26;
  const photoHeightMm = isPortrait ? Math.round((photoWidthMm * 4) / 3) : photoWidthMm;
  const photoBorder = config.photoBorder !== false;
  const photoPosition = config.photoPosition || 'right';

  const shapeRadiusClass = 
    photoShape === 'circle' && !isPortrait ? 'rounded-full' :
    photoShape === 'rounded' || isPortrait ? 'rounded-lg' :
    'rounded-none';

  const photoElement = hasPhoto ? (
    <div 
      className="shrink-0 flex items-center justify-center overflow-hidden"
      style={{
        width: `${photoWidthMm}mm`,
        height: `${photoHeightMm}mm`,
      }}
    >
      <img 
        src={personalInfo.photoUrl} 
        alt={personalInfo.fullName}
        className={`w-full h-full object-cover ${shapeRadiusClass} ${photoBorder ? 'border-2 border-slate-400 p-0.5 shadow-sm' : ''}`}
      />
    </div>
  ) : null;

  const headerContent = (
    <div className="text-center">
      <h1 
        className="font-serif font-bold tracking-wide"
        style={{ fontSize: `${config.nameFontSize}pt`, color: config.accentColor }}
      >
        {config.uppercaseName ? personalInfo.fullName.toUpperCase() : personalInfo.fullName}
      </h1>
      {personalInfo.jobTitle && (
        <div className="text-xs uppercase tracking-widest text-slate-600 font-medium mt-1">
          {personalInfo.jobTitle}
        </div>
      )}
      <div className="text-[11px] text-slate-600 mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
        {contactList.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-slate-300">◆</span>}
            <span>{c}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full text-left">
      {/* Executive Header Banner */}
      <header className="cv-header mb-4 pb-3 border-b border-slate-300">
        {hasPhoto ? (
          <div className={`flex items-center gap-4 ${photoPosition === 'left' ? 'flex-row' : 'flex-row-reverse'} justify-between`}>
            {photoElement}
            <div className="flex-1">
              {headerContent}
            </div>
            <div style={{ width: `${photoWidthMm}mm` }} className="invisible shrink-0" aria-hidden="true" />
          </div>
        ) : (
          headerContent
        )}
      </header>

      {/* Sections */}
      <main className="space-y-3">
        {sectionsOrder.map((sectionMeta) => {
          if (!sectionMeta.isVisible) return null;

          if (sectionMeta.id === 'summary' && personalInfo.summary && personalInfo.showSummary) {
            return (
              <div key="summary" style={{ marginBottom: `${config.sectionGap}mm` }}>
                <p className="text-slate-800 leading-relaxed text-justify text-xs italic">
                  "{personalInfo.summary}"
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
                    <div key={e.id} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{e.institution} {e.location ? `(${e.location})` : ''}</span>
                        <span className="font-normal text-slate-600">{e.startDate} - {e.endDate}</span>
                      </div>
                      <div className="italic text-slate-700">
                        {e.degree} {e.gpa && `(GPA: ${e.gpa})`}
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
                {renderSectionHeader('Professional Experience')}
                <div className="space-y-3">
                  {visibleExp.map(exp => (
                    <div key={exp.id} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.company} {exp.location ? `(${exp.location})` : ''}</span>
                        <span className="font-normal text-slate-600">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="italic text-slate-700 font-semibold mb-1">
                        {exp.role}
                      </div>
                      <ul className="space-y-1">
                        {exp.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start text-slate-700 leading-snug">
                            <span className="mr-2 text-slate-500 font-serif">›</span>
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
                {renderSectionHeader('Key Projects')}
                <div className="space-y-2">
                  {visibleProjects.map(p => (
                    <div key={p.id} className="text-xs">
                      <div className="font-bold text-slate-900">
                        {p.name}
                        {p.techStack && <span className="font-normal text-slate-500 ml-2">[{p.techStack}]</span>}
                      </div>
                      <ul className="mt-0.5 space-y-0.5 text-slate-700">
                        {p.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start leading-snug">
                            <span className="mr-2 text-slate-500 font-serif">›</span>
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
                {renderSectionHeader('Core Competencies')}
                <div className="space-y-1 text-xs text-slate-800">
                  {visibleSkills.map(s => (
                    <div key={s.id}>
                      <strong className="font-bold text-slate-900">{s.name}:</strong> {s.skills}
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
                {renderSectionHeader('Honors & Awards')}
                <div className="space-y-1 text-xs text-slate-800">
                  {visibleAch.map(a => (
                    <div key={a.id} className="flex justify-between">
                      <span><strong>{a.title}</strong>: {a.event}</span>
                      {a.date && <span className="text-slate-500">{a.date}</span>}
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
                        {item.date && <span>{item.date}</span>}
                      </div>
                      {item.subtitle && <div className="italic text-slate-600">{item.subtitle}</div>}
                      {item.bullets.map((b, idx) => (
                        <div key={idx} className="flex items-start">
                          <span className="mr-2 text-slate-500">›</span>
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
