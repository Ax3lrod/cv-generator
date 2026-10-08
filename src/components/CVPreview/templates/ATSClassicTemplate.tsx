import React from 'react';
import { CVData, DesignConfig, CustomSection } from '../../../types/cv';

interface TemplateProps {
  cvData: CVData;
  config: DesignConfig;
}

export const ATSClassicTemplate: React.FC<TemplateProps> = ({ cvData, config }) => {
  const { personalInfo, education, experiences, projects, achievements, skills, customSections, sectionsOrder } = cvData;

  // Header alignment classes
  const headerAlignClass = 
    config.headerAlign === 'center' ? 'text-center' :
    config.headerAlign === 'split' ? 'text-left md:flex md:justify-between md:items-end' :
    'text-left';

  // Section Heading style generator
  const renderSectionHeader = (title: string) => {
    const isUpper = config.uppercaseHeadings;
    const displayTitle = isUpper ? title.toUpperCase() : title;

    if (config.sectionHeadingStyle === 'left-bar') {
      return (
        <div 
          className="cv-section-heading flex items-center gap-2 border-b pb-0.5"
          style={{ borderColor: config.accentColor, marginBottom: `${config.itemGap}mm` }}
        >
          <span 
            className="w-1 self-stretch rounded-full" 
            style={{ backgroundColor: config.accentColor }}
          />
          <h2 
            className="font-bold tracking-tight"
            style={{ 
              fontSize: `${config.sectionHeadingFontSize}pt`,
              color: config.accentColor !== '#000000' ? config.accentColor : config.textColor 
            }}
          >
            {displayTitle}
          </h2>
        </div>
      );
    }

    if (config.sectionHeadingStyle === 'pill') {
      return (
        <div 
          className="cv-section-heading border-b pb-1"
          style={{ borderColor: '#e2e8f0', marginBottom: `${config.itemGap}mm` }}
        >
          <span 
            className="inline-block px-2.5 py-0.5 rounded font-bold text-white text-xs"
            style={{ backgroundColor: config.accentColor }}
          >
            {displayTitle}
          </span>
        </div>
      );
    }

    if (config.sectionHeadingStyle === 'double-line') {
      return (
        <div 
          className="cv-section-heading border-b-2 border-t border-solid pb-0.5 pt-0.5"
          style={{ borderColor: config.accentColor, marginBottom: `${config.itemGap}mm` }}
        >
          <h2 
            className="font-bold tracking-tight"
            style={{ 
              fontSize: `${config.sectionHeadingFontSize}pt`,
              color: config.accentColor !== '#000000' ? config.accentColor : config.textColor 
            }}
          >
            {displayTitle}
          </h2>
        </div>
      );
    }

    if (config.sectionHeadingStyle === 'minimal') {
      return (
        <div className="cv-section-heading" style={{ marginBottom: `${config.itemGap}mm` }}>
          <h2 
            className="font-bold tracking-tight"
            style={{ 
              fontSize: `${config.sectionHeadingFontSize}pt`,
              color: config.accentColor !== '#000000' ? config.accentColor : config.textColor 
            }}
          >
            {displayTitle}
          </h2>
        </div>
      );
    }

    // Default 'line-under' ATS standard (1:1 with user's PDF)
    return (
      <div 
        className="cv-section-heading border-b pb-0.5"
        style={{ 
          borderColor: config.accentColor, 
          borderBottomWidth: `${config.sectionLineWidth}px`,
          marginBottom: `${config.itemGap}mm` 
        }}
      >
        <h2 
          className="font-bold tracking-tight"
          style={{ 
            fontSize: `${config.sectionHeadingFontSize}pt`,
            color: config.accentColor !== '#000000' ? config.accentColor : config.textColor 
          }}
        >
          {displayTitle}
        </h2>
      </div>
    );
  };

  // Bullet style helper
  const bulletSymbol = () => {
    switch (config.bulletStyle) {
      case 'dash': return '-';
      case 'square': return '▪';
      case 'circle': return '○';
      case 'disc':
      default: return '•';
    }
  };

  // Contacts line elements
  const contactParts: string[] = [];
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.location && config.headerAlign !== 'center') contactParts.push(personalInfo.location);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo.website) contactParts.push(personalInfo.website);
  if (personalInfo.github) contactParts.push(personalInfo.github);

  // Section Renderers
  const renderSummary = () => {
    if (!personalInfo.summary || !personalInfo.showSummary) return null;
    return (
      <div className="cv-section cv-summary" style={{ marginBottom: `${config.sectionGap}mm` }}>
        <p className="text-justify leading-relaxed" style={{ color: config.textColor }}>
          {personalInfo.summary}
        </p>
      </div>
    );
  };

  const renderEducation = () => {
    const visibleEdu = education.filter(e => e.isVisible);
    if (visibleEdu.length === 0) return null;

    return (
      <div className="cv-section" style={{ marginBottom: `${config.sectionGap}mm` }}>
        {renderSectionHeader('Education')}
        <div className="flex flex-col" style={{ gap: `${config.itemGap}mm` }}>
          {visibleEdu.map((item) => (
            <div key={item.id} className="cv-entry text-left">
              <div className="flex justify-between items-baseline flex-wrap">
                <span className="font-bold" style={{ fontSize: `${config.itemTitleFontSize}pt` }}>
                  {item.institution} {item.location ? `(${item.location})` : ''}
                </span>
                <span className="text-right text-xs font-medium" style={{ color: config.subtextColor }}>
                  {item.startDate} - {item.endDate}
                </span>
              </div>
              <div className="italic" style={{ color: config.subtextColor }}>
                {item.degree}{item.gpa ? `, ${item.gpa}` : ''}
              </div>
              {item.bullets && item.bullets.length > 0 && (
                <ul className="mt-1" style={{ gap: `${config.bulletGap}mm` }}>
                  {item.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-1.5 select-none font-bold" style={{ color: config.accentColor }}>
                        {bulletSymbol()}
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperiences = () => {
    const visibleExp = experiences.filter(e => e.isVisible);
    if (visibleExp.length === 0) return null;

    return (
      <div className="cv-section" style={{ marginBottom: `${config.sectionGap}mm` }}>
        {renderSectionHeader('Experiences')}
        <div className="flex flex-col" style={{ gap: `${config.itemGap}mm` }}>
          {visibleExp.map((item) => (
            <div key={item.id} className="cv-entry text-left">
              <div className="flex justify-between items-baseline flex-wrap">
                <span 
                  className={config.boldCompanyOrRole === 'role' ? 'font-normal' : 'font-bold'}
                  style={{ fontSize: `${config.itemTitleFontSize}pt` }}
                >
                  {item.company} {item.location ? `(${item.location})` : ''}
                </span>
                <span className="text-right text-xs font-medium" style={{ color: config.subtextColor }}>
                  {item.startDate} - {item.endDate}
                </span>
              </div>
              <div 
                className={`italic ${config.boldCompanyOrRole === 'role' ? 'font-bold' : ''}`}
                style={{ color: config.subtextColor }}
              >
                {item.role}
              </div>
              {item.bullets && item.bullets.length > 0 && (
                <ul className="flex flex-col mt-0.5" style={{ gap: `${config.bulletGap}mm` }}>
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start leading-snug">
                      <span className="mr-1.5 select-none font-bold text-xs" style={{ color: config.accentColor }}>
                        {bulletSymbol()}
                      </span>
                      <span className="flex-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    const visibleProjects = projects.filter(p => p.isVisible);
    if (visibleProjects.length === 0) return null;

    return (
      <div className="cv-section" style={{ marginBottom: `${config.sectionGap}mm` }}>
        {renderSectionHeader('Projects')}
        <div className="flex flex-col" style={{ gap: `${config.itemGap}mm` }}>
          {visibleProjects.map((item) => (
            <div key={item.id} className="cv-entry text-left">
              <div className="flex justify-between items-baseline flex-wrap">
                <span className="font-bold" style={{ fontSize: `${config.itemTitleFontSize}pt` }}>
                  {item.name}
                  {item.techStack && (
                    <span className="font-normal text-xs ml-2 text-slate-500">
                      | {item.techStack}
                    </span>
                  )}
                </span>
                {item.link && (
                  <a 
                    href={item.link.startsWith('http') ? item.link : `https://${item.link}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-blue-600 underline"
                  >
                    {item.link}
                  </a>
                )}
              </div>
              {item.subtitle && (
                <div className="italic text-xs" style={{ color: config.subtextColor }}>
                  {item.subtitle}
                </div>
              )}
              {item.bullets && item.bullets.length > 0 && (
                <ul className="flex flex-col mt-0.5" style={{ gap: `${config.bulletGap}mm` }}>
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start leading-snug">
                      <span className="mr-1.5 select-none font-bold text-xs" style={{ color: config.accentColor }}>
                        {bulletSymbol()}
                      </span>
                      <span className="flex-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    const visibleAch = achievements.filter(a => a.isVisible);
    if (visibleAch.length === 0) return null;

    return (
      <div className="cv-section" style={{ marginBottom: `${config.sectionGap}mm` }}>
        {renderSectionHeader('Achievements')}
        <ul className="flex flex-col" style={{ gap: `${config.bulletGap + 0.5}mm` }}>
          {visibleAch.map((item) => (
            <li key={item.id} className="cv-entry flex items-start leading-snug">
              <span className="mr-1.5 select-none font-bold text-xs" style={{ color: config.accentColor }}>
                {bulletSymbol()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0 text-left">
                    <strong className="font-bold">{item.title}</strong>
                    {item.event && <span>: {item.event}</span>}
                  </div>
                  {item.date && (
                    <span 
                      className="text-right text-xs whitespace-nowrap shrink-0 font-medium"
                      style={{ color: config.subtextColor }}
                    >
                      {item.date}
                    </span>
                  )}
                </div>
                {item.description && (
                  <div className="text-xs mt-0.5 text-left" style={{ color: config.subtextColor }}>
                    {item.description}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderSkills = () => {
    const visibleSkills = skills.filter(s => s.isVisible);
    if (visibleSkills.length === 0) return null;

    return (
      <div className="cv-section" style={{ marginBottom: `${config.sectionGap}mm` }}>
        {renderSectionHeader('Skills')}
        <ul className="flex flex-col" style={{ gap: `${config.bulletGap + 0.5}mm` }}>
          {visibleSkills.map((cat) => (
            <li key={cat.id} className="cv-entry flex items-start leading-snug">
              <span className="mr-1.5 select-none font-bold text-xs" style={{ color: config.accentColor }}>
                {bulletSymbol()}
              </span>
              <div className="flex-1">
                <span className="font-bold">{cat.name}:</span>{' '}
                <span>{cat.skills}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderCustomSection = (customSection: CustomSection) => {
    if (!customSection.isVisible || !customSection.items || customSection.items.length === 0) return null;

    return (
      <div key={customSection.id} className="cv-section" style={{ marginBottom: `${config.sectionGap}mm` }}>
        {renderSectionHeader(customSection.title)}
        <div className="flex flex-col" style={{ gap: `${config.itemGap}mm` }}>
          {customSection.items.map((item) => (
            <div key={item.id} className="cv-entry text-left">
              <div className="flex justify-between items-baseline flex-wrap">
                <span className="font-bold" style={{ fontSize: `${config.itemTitleFontSize}pt` }}>
                  {item.title}
                </span>
                {item.date && (
                  <span className="text-right text-xs font-medium" style={{ color: config.subtextColor }}>
                    {item.date}
                  </span>
                )}
              </div>
              {item.subtitle && (
                <div className="italic" style={{ color: config.subtextColor }}>
                  {item.subtitle}
                </div>
              )}
              {item.bullets && item.bullets.length > 0 && (
                <ul className="flex flex-col mt-0.5" style={{ gap: `${config.bulletGap}mm` }}>
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start leading-snug">
                      <span className="mr-1.5 select-none font-bold text-xs" style={{ color: config.accentColor }}>
                        {bulletSymbol()}
                      </span>
                      <span className="flex-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Section order dispatcher
  const renderOrderedSections = () => {
    return sectionsOrder.map((sectionMeta) => {
      if (!sectionMeta.isVisible) return null;

      switch (sectionMeta.id) {
        case 'summary':
          return <React.Fragment key={sectionMeta.id}>{renderSummary()}</React.Fragment>;
        case 'education':
          return <React.Fragment key={sectionMeta.id}>{renderEducation()}</React.Fragment>;
        case 'experiences':
          return <React.Fragment key={sectionMeta.id}>{renderExperiences()}</React.Fragment>;
        case 'projects':
          return <React.Fragment key={sectionMeta.id}>{renderProjects()}</React.Fragment>;
        case 'achievements':
          return <React.Fragment key={sectionMeta.id}>{renderAchievements()}</React.Fragment>;
        case 'skills':
          return <React.Fragment key={sectionMeta.id}>{renderSkills()}</React.Fragment>;
        default: {
          const custom = customSections.find(c => c.id === sectionMeta.id);
          if (custom) {
            return <React.Fragment key={sectionMeta.id}>{renderCustomSection(custom)}</React.Fragment>;
          }
          return null;
        }
      }
    });
  };

  const displayName = config.uppercaseName ? personalInfo.fullName.toUpperCase() : personalInfo.fullName;
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
        className={`w-full h-full object-cover ${shapeRadiusClass} ${photoBorder ? 'border border-slate-300 shadow-xs' : ''}`}
      />
    </div>
  ) : null;

  const headerContent = (
    <div className={config.headerAlign === 'center' ? 'text-center' : 'text-left'}>
      <h1 
        className="font-bold tracking-tight text-slate-950 leading-none"
        style={{ 
          fontSize: `${config.nameFontSize}pt`,
          color: config.accentColor !== '#000000' ? config.accentColor : config.textColor 
        }}
      >
        {displayName}
      </h1>

      {personalInfo.jobTitle && config.headerAlign !== 'center' && (
        <div className="text-sm font-medium mt-1" style={{ color: config.subtextColor }}>
          {personalInfo.jobTitle}
        </div>
      )}

      {contactParts.length > 0 && (
        <div 
          className="flex flex-wrap items-center text-xs mt-1.5 gap-x-2 gap-y-0.5"
          style={{ 
            color: config.subtextColor,
            justifyContent: config.headerAlign === 'center' ? 'center' : 'flex-start' 
          }}
        >
          {contactParts.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-400 select-none">|</span>}
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* CV Header */}
      <header className="cv-header mb-3">
        {hasPhoto ? (
          config.headerAlign === 'center' ? (
            <div className={`flex items-center gap-3 ${photoPosition === 'left' ? 'flex-row' : 'flex-row-reverse'} justify-between`}>
              {photoElement}
              <div className="flex-1">
                {headerContent}
              </div>
              <div style={{ width: `${photoWidthMm}mm` }} className="invisible shrink-0" aria-hidden="true" />
            </div>
          ) : (
            <div className={`flex items-center gap-4 ${photoPosition === 'left' ? 'flex-row' : 'flex-row-reverse'} justify-between`}>
              {photoElement}
              <div className="flex-1">
                {headerContent}
              </div>
            </div>
          )
        ) : (
          headerContent
        )}
      </header>

      {/* Sections rendered in user-configured order */}
      <main className="w-full">
        {renderOrderedSections()}
      </main>
    </div>
  );
};
