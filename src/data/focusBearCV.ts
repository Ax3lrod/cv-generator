import { CVData, DesignConfig } from '../types/cv';

export const focusBearCVData: CVData = {
  personalInfo: {
    fullName: "ARYASATYA ALAAUDDIN",
    jobTitle: "Full-Stack Developer Intern",
    phone: "+62 878-9895-2895",
    email: "aryasatyaalaauddin@gmail.com",
    location: "Surabaya, Indonesia",
    linkedin: "linkedin.com/in/aryasatyaalaauddin",
    website: "aryasatyaa.vercel.app",
    github: "github.com/Ax3lrod",
    summary: "Full-stack developer proficient in React, TypeScript, Node.js (Express, NestJS), and PostgreSQL. Experienced in building responsive, accessible web and mobile applications with automated testing (Vitest) and CI/CD pipelines. Passionate about crafting high-empathy, accessible software that empowers daily productivity for neurodivergent and diverse global users.",
    showSummary: true,
    photoUrl: "",
    showPhoto: false,
  },
  education: [
    {
      id: "edu-1",
      institution: "Institut Teknologi Sepuluh Nopember (ITS)",
      degree: "Bachelor of Computer Science",
      location: "Surabaya, Indonesia",
      startDate: "Aug 2023",
      endDate: "Present",
      gpa: "3.83/4.00",
      bullets: [],
      isVisible: true,
    }
  ],
  experiences: [
    {
      id: "exp-1",
      company: "Society of Renewable Energy ITS Branch",
      role: "Director of Web Development",
      location: "Surabaya, Indonesia",
      startDate: "Jul 2025",
      endDate: "Present",
      bullets: [
        "Directed a cross-functional engineering team of 11 developers to deliver and maintain the official web platform (sre-its.com), supporting high-volume organizational recruitments.",
        "Engineered multi-step registration funnels with dynamic REST API integrations and automated validation logic, reducing participant onboarding friction.",
        "Established automated CI/CD pipelines with GitHub Actions, Husky pre-push hooks, and lint-staged, reducing deployment errors and accelerating release stability.",
      ],
      isVisible: true,
    },
    {
      id: "exp-2",
      company: "ITS Student Executive Board (BEM ITS)",
      role: "Front End Developer",
      location: "Surabaya, Indonesia",
      startDate: "Mar 2025",
      endDate: "Apr 2026",
      bullets: [
        "Architected an internationalization (i18n) engine serving 20,000+ university students, enhancing usability and navigation accessibility across bilingual audiences.",
        "Optimized core web vitals and resolved critical client-side rendering bottlenecks, modularizing reusable UI components with Next.js and Tailwind CSS based on Figma designs.",
        "Collaborated closely within an agile team alongside UI/UX designers, backend developers, and QA through structured pull request reviews and weekly sprints.",
      ],
      isVisible: true,
    },
    {
      id: "exp-3",
      company: "Information Technology Student Association (HMIT)",
      role: "Staff of Research & Technology Department",
      location: "Surabaya, Indonesia",
      startDate: "Feb 2025",
      endDate: "Feb 2026",
      bullets: [
        "Designed RESTful API architectures and modular backend services handling member management and internal organization data.",
        "Authored and mentored the 'IT Junior Preps' web development curriculum covering modern React and Node.js fundamentals in partnership with Hacktiv8.",
      ],
      isVisible: true,
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "SaveFile Platform API",
      subtitle: "Game Activity Tracker & Social Platform API",
      link: "github.com/Ax3lrod/savefile-backend",
      techStack: "NestJS, TypeScript, PostgreSQL, Prisma, Docker, Steam API",
      bullets: [
        "Architected a modular monolith backend with NestJS and Prisma ORM backed by PostgreSQL, designing normalized schemas for user profiles and libraries.",
        "Implemented secure Steam OAuth / OpenID authentication pipelines and built background cron workers for async telemetry ingestion and metadata enrichment.",
        "Orchestrated containerized multi-service workflows with Docker and enforced strict DTO validation across all public REST endpoints.",
      ],
      isVisible: true,
    },
    {
      id: "proj-2",
      name: "CiviGo — Civic Service & Queue System",
      subtitle: "Cross-Platform Queue Management & Citizen Portal",
      link: "github.com/Ax3lrod/civigo",
      techStack: "React Native (Expo), Next.js, TypeScript, PostgreSQL (Supabase), Vitest",
      bullets: [
        "Built a cross-platform public service management system featuring an Expo / React Native mobile client for citizens and a Next.js administrative dashboard.",
        "Designed relational PostgreSQL schemas with Supabase, implementing migration scripts, location-based query filters, and RESTful route handlers.",
        "Authored comprehensive unit tests with Vitest and designed accessible, high-contrast step-by-step guidance for appointment bookings.",
      ],
      isVisible: true,
    },
    {
      id: "proj-3",
      name: "VitaGo — ATS Resume Builder",
      subtitle: "Precision ATS Resume Builder with Vector Print Flow",
      link: "vita-go.vercel.app",
      techStack: "React 19, TypeScript, Vite, Tailwind CSS, WCAG 2.1 AA",
      bullets: [
        "Engineered a client-side document compiler with a dynamic 1-page auto-scaling algorithm, millimeter-accurate CSS paged media, and native vector export.",
        "Complied with WCAG 2.1 AA accessibility guidelines, featuring high-contrast palettes, accessible keyboard navigation, and zero-layout-shift preview rendering.",
      ],
      isVisible: true,
    }
  ],
  skills: [
    {
      id: "skill-1",
      name: "Languages & Frameworks",
      skills: "TypeScript, JavaScript, React, Next.js, Node.js, NestJS, Express, React Native (Expo), HTML5/CSS3, Tailwind CSS",
      isVisible: true,
    },
    {
      id: "skill-2",
      name: "Databases & ORMs",
      skills: "PostgreSQL, Prisma ORM, Supabase, MongoDB, Schema Design & Migrations",
      isVisible: true,
    },
    {
      id: "skill-3",
      name: "Testing & DevOps",
      skills: "Vitest, Jest, Git, GitHub Actions, Docker, CI/CD Pipelines, Postman, RESTful APIs",
      isVisible: true,
    },
    {
      id: "skill-4",
      name: "Practices & Concepts",
      skills: "Accessibility (WCAG 2.1), Full-Stack Architecture, Code Reviews, Agile/Scrum, Async Remote Collaboration",
      isVisible: true,
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "2nd Place — GEMASTIK XVIII (Smart City)",
      event: "",
      date: "",
      description: "",
      isVisible: true,
    },
    {
      id: "ach-2",
      title: "3rd Place — FIT Competition 2025 (Web Development)",
      event: "",
      date: "",
      description: "",
      isVisible: true,
    }
  ],
  customSections: [],
  sectionsOrder: [
    { id: "summary", title: "Professional Summary", isVisible: true },
    { id: "education", title: "Education", isVisible: true },
    { id: "experiences", title: "Experiences", isVisible: true },
    { id: "projects", title: "Projects", isVisible: true },
    { id: "achievements", title: "Achievements", isVisible: true },
    { id: "skills", title: "Skills", isVisible: true },
  ]
};

export const focusBearDesignConfig: DesignConfig = {
  template: "ats-classic",
  paperSize: "a4",
  customPaperWidth: 210,
  customPaperHeight: 297,
  forceOnePage: false,
  fontFamily: "inter",
  baseFontSize: 9.2, // pt
  nameFontSize: 19, // pt
  sectionHeadingFontSize: 11.0, // pt
  itemTitleFontSize: 9.6, // pt
  lineHeight: 1.30,
  pageMarginTop: 9.5, // mm
  pageMarginBottom: 9.5, // mm
  pageMarginLeft: 12, // mm
  pageMarginRight: 12, // mm
  sectionGap: 2.6, // mm
  itemGap: 1.6, // mm
  bulletGap: 0.6, // mm
  bulletStyle: "disc",
  headerAlign: "center",
  uppercaseName: true,
  uppercaseHeadings: false,
  sectionHeadingStyle: "line-under",
  sectionLineWidth: 1,
  accentColor: "#000000",
  textColor: "#0f172a",
  subtextColor: "#334155",
  dateLocationPlacement: "inline",
  boldCompanyOrRole: "both",
  photoShape: "circle",
  photoAspectRatio: "1:1",
  photoSize: 26,
  photoBorder: true,
  photoPosition: "right",
};
