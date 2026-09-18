export interface PersonalInfo {
  fullName: string;
  jobTitle?: string;
  phone: string;
  email: string;
  location?: string;
  linkedin: string;
  website: string;
  github?: string;
  summary: string;
  showSummary: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  bullets?: string[];
  isVisible: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  isVisible: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  subtitle?: string;
  link?: string;
  techStack?: string;
  bullets: string[];
  isVisible: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string; // comma separated or text
  isVisible: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  event: string;
  date?: string;
  description?: string;
  isVisible: boolean;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  bullets: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
  isVisible: boolean;
}

export type SectionType = 
  | 'summary'
  | 'education' 
  | 'experiences' 
  | 'projects' 
  | 'achievements' 
  | 'skills' 
  | string;

export interface SectionMeta {
  id: SectionType;
  title: string;
  isVisible: boolean;
  isCustom?: boolean;
}

export type TemplateId = 'ats-classic' | 'modern' | 'minimal' | 'executive' | 'tech';

export type FontFamily = 
  | 'eb-garamond' 
  | 'inter' 
  | 'merriweather' 
  | 'roboto' 
  | 'jetbrains-mono';

export type PaperPreset = 'a4' | 'letter' | 'f4' | 'legal' | 'custom';

export interface DesignConfig {
  template: TemplateId;
  paperSize: PaperPreset;
  customPaperWidth: number; // mm
  customPaperHeight: number; // mm
  forceOnePage: boolean; // force all content onto 1 page
  fontFamily: FontFamily;
  baseFontSize: number; // e.g. 10 (pt)
  nameFontSize: number; // e.g. 22 (pt)
  sectionHeadingFontSize: number; // e.g. 12 (pt)
  itemTitleFontSize: number; // e.g. 10.5 (pt)
  lineHeight: number; // e.g. 1.35
  pageMarginTop: number; // mm
  pageMarginBottom: number; // mm
  pageMarginLeft: number; // mm
  pageMarginRight: number; // mm
  sectionGap: number; // mm
  itemGap: number; // mm
  bulletGap: number; // mm
  bulletStyle: 'disc' | 'dash' | 'square' | 'circle';
  headerAlign: 'center' | 'left' | 'split';
  uppercaseName: boolean;
  uppercaseHeadings: boolean;
  sectionHeadingStyle: 'line-under' | 'left-bar' | 'pill' | 'minimal' | 'double-line';
  sectionLineWidth: number; // px, e.g. 1, 1.5, 2
  accentColor: string; // e.g. #000000 or #1e3a8a
  textColor: string; // e.g. #111827
  subtextColor: string; // e.g. #374151
  dateLocationPlacement: 'inline' | 'stacked';
  boldCompanyOrRole: 'both' | 'role' | 'company';
}

export interface CVData {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
  skills: SkillCategory[];
  customSections: CustomSection[];
  sectionsOrder: SectionMeta[];
}
