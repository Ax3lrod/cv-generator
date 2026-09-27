import React from 'react';
import { Document, Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer';
import { CVData, DesignConfig, CustomSection } from '../../../types/cv';
import { getPaperDimensions } from '../../../utils/paperDimensions';

interface CVPdfDocumentProps {
  cvData: CVData;
  config: DesignConfig;
  autoScaleFactor?: number;
}

const MM_TO_PT = 2.83464567;

export const CVPdfDocument: React.FC<CVPdfDocumentProps> = ({
  cvData,
  config,
  autoScaleFactor = 1,
}) => {
  const { widthMm, heightMm } = getPaperDimensions(config);
  const widthPt = widthMm * MM_TO_PT;
  const heightPt = heightMm * MM_TO_PT;

  // Proportional scale factor if forced to 1 page
  const scale = config.forceOnePage ? Math.max(0.65, autoScaleFactor) : 1;

  const fontMap: Record<string, string> = {
    'eb-garamond': 'Times-Roman',
    'merriweather': 'Times-Roman',
    'jetbrains-mono': 'Courier',
    'inter': 'Helvetica',
    'roboto': 'Helvetica',
  };
  const fontFamily = fontMap[config.fontFamily] || 'Helvetica';

  const baseFontSize = config.baseFontSize * scale;
  const nameFontSize = config.nameFontSize * scale;
  const sectionHeadingFontSize = config.sectionHeadingFontSize * scale;
  const itemTitleFontSize = config.itemTitleFontSize * scale;
  const subFontSize = Math.max(7, baseFontSize * 0.9);

  const marginTopPt = config.pageMarginTop * scale * MM_TO_PT;
  const marginBottomPt = config.pageMarginBottom * scale * MM_TO_PT;
  const marginLeftPt = config.pageMarginLeft * MM_TO_PT;
  const marginRightPt = config.pageMarginRight * MM_TO_PT;
  const sectionGapPt = Math.max(2, config.sectionGap * scale * MM_TO_PT);
  const itemGapPt = Math.max(1.5, config.itemGap * scale * MM_TO_PT);
  const bulletGapPt = Math.max(1, config.bulletGap * scale * MM_TO_PT);

  const bulletSymbol = () => {
    switch (config.bulletStyle) {
      case 'dash': return '-';
      case 'square': return '■';
      case 'circle': return 'o';
      case 'disc':
      default: return '•';
    }
  };

  const { personalInfo, education, experiences, projects, achievements, skills, customSections, sectionsOrder } = cvData;

  // Contact items for header
  const contactItems: { label: string; text: string; url?: string }[] = [];
  if (personalInfo.phone) {
    contactItems.push({ label: 'Phone', text: personalInfo.phone, url: `tel:${personalInfo.phone.replace(/\s+/g, '')}` });
  }
  if (personalInfo.email) {
    contactItems.push({ label: 'Email', text: personalInfo.email, url: `mailto:${personalInfo.email}` });
  }
  if (personalInfo.location && config.headerAlign !== 'center') {
    contactItems.push({ label: 'Location', text: personalInfo.location });
  }
  if (personalInfo.linkedin) {
    const raw = personalInfo.linkedin;
    contactItems.push({ 
      label: 'LinkedIn', 
      text: raw, 
      url: raw.startsWith('http') ? raw : `https://${raw}` 
    });
  }
  if (personalInfo.website) {
    const raw = personalInfo.website;
    contactItems.push({ 
      label: 'Website', 
      text: raw, 
      url: raw.startsWith('http') ? raw : `https://${raw}` 
    });
  }
  if (personalInfo.github) {
    const raw = personalInfo.github;
    contactItems.push({ 
      label: 'GitHub', 
      text: raw, 
      url: raw.startsWith('http') ? raw : `https://${raw}` 
    });
  }

  // Section Heading Renderer
  const renderSectionHeading = (title: string) => {
    const displayTitle = config.uppercaseHeadings ? title.toUpperCase() : title;
    const headingColor = config.accentColor !== '#000000' ? config.accentColor : config.textColor;

    if (config.sectionHeadingStyle === 'left-bar') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#cbd5e1', paddingBottom: 1.5, marginBottom: itemGapPt }}>
          <View style={{ width: 3, height: sectionHeadingFontSize, backgroundColor: config.accentColor, marginRight: 5, borderRadius: 1 }} />
          <Text style={{ fontFamily, fontWeight: 'bold', fontSize: sectionHeadingFontSize, color: headingColor }}>
            {displayTitle}
          </Text>
        </View>
      );
    }

    if (config.sectionHeadingStyle === 'double-line') {
      return (
        <View style={{ borderTopWidth: 0.5, borderTopColor: config.accentColor, borderBottomWidth: 1.5, borderBottomColor: config.accentColor, paddingVertical: 1.5, marginBottom: itemGapPt }}>
          <Text style={{ fontFamily, fontWeight: 'bold', fontSize: sectionHeadingFontSize, color: headingColor }}>
            {displayTitle}
          </Text>
        </View>
      );
    }

    if (config.sectionHeadingStyle === 'minimal') {
      return (
        <View style={{ marginBottom: itemGapPt }}>
          <Text style={{ fontFamily, fontWeight: 'bold', fontSize: sectionHeadingFontSize, color: headingColor }}>
            {displayTitle}
          </Text>
        </View>
      );
    }

    if (config.sectionHeadingStyle === 'pill') {
      return (
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', paddingBottom: 2, marginBottom: itemGapPt }}>
          <View style={{ backgroundColor: config.accentColor, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2, alignSelf: 'flex-start' }}>
            <Text style={{ fontFamily, fontWeight: 'bold', fontSize: sectionHeadingFontSize * 0.9, color: '#ffffff' }}>
              {displayTitle}
            </Text>
          </View>
        </View>
      );
    }

    // Default 'line-under' ATS standard
    return (
      <View style={{ borderBottomWidth: Math.max(0.5, config.sectionLineWidth), borderBottomColor: config.accentColor, paddingBottom: 1.5, marginBottom: itemGapPt }}>
        <Text style={{ fontFamily, fontWeight: 'bold', fontSize: sectionHeadingFontSize, color: headingColor }}>
          {displayTitle}
        </Text>
      </View>
    );
  };

  // Section Renderers
  const renderSummary = () => {
    if (!personalInfo.summary || !personalInfo.showSummary) return null;
    return (
      <View style={{ marginBottom: sectionGapPt }}>
        <Text style={{ fontFamily, fontSize: baseFontSize, lineHeight: config.lineHeight, color: config.textColor, textAlign: 'justify' }}>
          {personalInfo.summary}
        </Text>
      </View>
    );
  };

  const renderEducation = () => {
    const visibleEdu = education.filter(e => e.isVisible);
    if (visibleEdu.length === 0) return null;

    return (
      <View style={{ marginBottom: sectionGapPt }}>
        {renderSectionHeading('Education')}
        {visibleEdu.map(item => (
          <View key={item.id} style={{ marginBottom: itemGapPt }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={{ fontFamily, fontWeight: 'bold', fontSize: itemTitleFontSize, color: config.textColor }}>
                {item.institution} {item.location ? `(${item.location})` : ''}
              </Text>
              <Text style={{ fontFamily, fontSize: subFontSize, color: config.subtextColor }}>
                {item.startDate} - {item.endDate}
              </Text>
            </View>
            <Text style={{ fontFamily, fontStyle: 'italic', fontSize: baseFontSize, color: config.subtextColor, marginTop: 0.5 }}>
              {item.degree}{item.gpa ? `, ${item.gpa}` : ''}
            </Text>
            {item.bullets && item.bullets.length > 0 && (
              <View style={{ marginTop: 1 }}>
                {item.bullets.map((b, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: bulletGapPt }}>
                    <Text style={{ width: 8, fontSize: baseFontSize, color: config.accentColor, fontFamily }}>
                      {bulletSymbol()}
                    </Text>
                    <Text style={{ flex: 1, fontSize: baseFontSize, lineHeight: config.lineHeight, color: config.textColor, fontFamily }}>
                      {b}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderExperiences = () => {
    const visibleExp = experiences.filter(e => e.isVisible);
    if (visibleExp.length === 0) return null;

    return (
      <View style={{ marginBottom: sectionGapPt }}>
        {renderSectionHeading('Experiences')}
        {visibleExp.map(item => {
          const isCompanyBold = config.boldCompanyOrRole !== 'role';
          const isRoleBold = config.boldCompanyOrRole === 'role';

          return (
            <View key={item.id} style={{ marginBottom: itemGapPt }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={{ fontFamily, fontWeight: isCompanyBold ? 'bold' : 'normal', fontSize: itemTitleFontSize, color: config.textColor }}>
                  {item.company} {item.location ? `(${item.location})` : ''}
                </Text>
                <Text style={{ fontFamily, fontSize: subFontSize, color: config.subtextColor }}>
                  {item.startDate} - {item.endDate}
                </Text>
              </View>
              <Text style={{ fontFamily, fontWeight: isRoleBold ? 'bold' : 'normal', fontStyle: 'italic', fontSize: baseFontSize, color: config.subtextColor, marginTop: 0.5 }}>
                {item.role}
              </Text>
              {item.bullets && item.bullets.length > 0 && (
                <View style={{ marginTop: 1 }}>
                  {item.bullets.map((bullet, idx) => (
                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: bulletGapPt }}>
                      <Text style={{ width: 8, fontSize: baseFontSize, color: config.accentColor, fontFamily }}>
                        {bulletSymbol()}
                      </Text>
                      <Text style={{ flex: 1, fontSize: baseFontSize, lineHeight: config.lineHeight, color: config.textColor, fontFamily }}>
                        {bullet}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderProjects = () => {
    const visibleProj = projects.filter(p => p.isVisible);
    if (visibleProj.length === 0) return null;

    return (
      <View style={{ marginBottom: sectionGapPt }}>
        {renderSectionHeading('Projects')}
        {visibleProj.map(item => (
          <View key={item.id} style={{ marginBottom: itemGapPt }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', flex: 1, marginRight: 8 }}>
                <Text style={{ fontFamily, fontWeight: 'bold', fontSize: itemTitleFontSize, color: config.textColor }}>
                  {item.name}
                </Text>
                {item.techStack && (
                  <Text style={{ fontFamily, fontSize: subFontSize, color: config.subtextColor, marginLeft: 4 }}>
                    | {item.techStack}
                  </Text>
                )}
              </View>
              {item.link && (
                <Link
                  src={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                  style={{ fontFamily, fontSize: subFontSize, color: '#2563eb', textDecoration: 'underline' }}
                >
                  {item.link}
                </Link>
              )}
            </View>
            {item.subtitle && (
              <Text style={{ fontFamily, fontStyle: 'italic', fontSize: subFontSize, color: config.subtextColor, marginTop: 0.5 }}>
                {item.subtitle}
              </Text>
            )}
            {item.bullets && item.bullets.length > 0 && (
              <View style={{ marginTop: 1 }}>
                {item.bullets.map((bullet, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: bulletGapPt }}>
                    <Text style={{ width: 8, fontSize: baseFontSize, color: config.accentColor, fontFamily }}>
                      {bulletSymbol()}
                    </Text>
                    <Text style={{ flex: 1, fontSize: baseFontSize, lineHeight: config.lineHeight, color: config.textColor, fontFamily }}>
                      {bullet}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderAchievements = () => {
    const visibleAch = achievements.filter(a => a.isVisible);
    if (visibleAch.length === 0) return null;

    return (
      <View style={{ marginBottom: sectionGapPt }}>
        {renderSectionHeading('Achievements')}
        {visibleAch.map(item => (
          <View key={item.id} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: bulletGapPt + 0.5 }}>
            <Text style={{ width: 8, fontSize: baseFontSize, color: config.accentColor, fontFamily }}>
              {bulletSymbol()}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={{ fontFamily, fontSize: baseFontSize, lineHeight: config.lineHeight, color: config.textColor, flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>: {item.event}
                {item.description ? ` (${item.description})` : ''}
              </Text>
              {item.date && (
                <Text style={{ fontFamily, fontSize: subFontSize, color: config.subtextColor, marginLeft: 8 }}>
                  {item.date}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    const visibleSkills = skills.filter(s => s.isVisible);
    if (visibleSkills.length === 0) return null;

    return (
      <View style={{ marginBottom: sectionGapPt }}>
        {renderSectionHeading('Skills')}
        {visibleSkills.map(cat => (
          <View key={cat.id} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: bulletGapPt + 0.5 }}>
            <Text style={{ width: 8, fontSize: baseFontSize, color: config.accentColor, fontFamily }}>
              {bulletSymbol()}
            </Text>
            <Text style={{ flex: 1, fontFamily, fontSize: baseFontSize, lineHeight: config.lineHeight, color: config.textColor }}>
              <Text style={{ fontWeight: 'bold' }}>{cat.name}:</Text> {cat.skills}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCustomSection = (customSection: CustomSection) => {
    if (!customSection.isVisible || !customSection.items || customSection.items.length === 0) return null;

    return (
      <View key={customSection.id} style={{ marginBottom: sectionGapPt }}>
        {renderSectionHeading(customSection.title)}
        {customSection.items.map(item => (
          <View key={item.id} style={{ marginBottom: itemGapPt }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={{ fontFamily, fontWeight: 'bold', fontSize: itemTitleFontSize, color: config.textColor }}>
                {item.title}
              </Text>
              {item.date && (
                <Text style={{ fontFamily, fontSize: subFontSize, color: config.subtextColor }}>
                  {item.date}
                </Text>
              )}
            </View>
            {item.subtitle && (
              <Text style={{ fontFamily, fontStyle: 'italic', fontSize: subFontSize, color: config.subtextColor, marginTop: 0.5 }}>
                {item.subtitle}
              </Text>
            )}
            {item.bullets && item.bullets.length > 0 && (
              <View style={{ marginTop: 1 }}>
                {item.bullets.map((bullet, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: bulletGapPt }}>
                    <Text style={{ width: 8, fontSize: baseFontSize, color: config.accentColor, fontFamily }}>
                      {bulletSymbol()}
                    </Text>
                    <Text style={{ flex: 1, fontSize: baseFontSize, lineHeight: config.lineHeight, color: config.textColor, fontFamily }}>
                      {bullet}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderOrderedSections = () => {
    return sectionsOrder.map(sectionMeta => {
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
  const isCentered = config.headerAlign === 'center';
  const isSplit = config.headerAlign === 'split';

  return (
    <Document title={`${personalInfo.fullName.trim()}_CV`}>
      <Page
        size={[widthPt, heightPt]}
        wrap={!config.forceOnePage}
        style={{
          backgroundColor: '#ffffff',
          color: config.textColor,
          fontFamily,
          paddingTop: marginTopPt,
          paddingBottom: marginBottomPt,
          paddingLeft: marginLeftPt,
          paddingRight: marginRightPt,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: sectionGapPt * 1.2, alignItems: isCentered ? 'center' : 'flex-start' }}>
          <Text
            style={{
              fontFamily,
              fontWeight: 'bold',
              fontSize: nameFontSize,
              color: config.accentColor !== '#000000' ? config.accentColor : config.textColor,
              textAlign: isCentered ? 'center' : 'left',
              letterSpacing: -0.2,
            }}
          >
            {displayName}
          </Text>

          {personalInfo.jobTitle && !isCentered && (
            <Text style={{ fontFamily, fontSize: subFontSize * 1.1, color: config.subtextColor, marginTop: 1 }}>
              {personalInfo.jobTitle}
            </Text>
          )}

          {contactItems.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: isCentered ? 'center' : 'flex-start',
                alignItems: 'center',
                marginTop: 2,
              }}
            >
              {contactItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && (
                    <Text style={{ fontFamily, fontSize: subFontSize, color: '#94a3b8', marginHorizontal: 3 }}>
                      |
                    </Text>
                  )}
                  {item.url ? (
                    <Link
                      src={item.url}
                      style={{
                        fontFamily,
                        fontSize: subFontSize,
                        color: config.subtextColor,
                        textDecoration: 'none',
                      }}
                    >
                      {item.text}
                    </Link>
                  ) : (
                    <Text
                      style={{
                        fontFamily,
                        fontSize: subFontSize,
                        color: config.subtextColor,
                      }}
                    >
                      {item.text}
                    </Text>
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>

        {/* Sections */}
        <View style={{ width: '100%' }}>
          {renderOrderedSections()}
        </View>
      </Page>
    </Document>
  );
};
