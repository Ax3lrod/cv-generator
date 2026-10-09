import { CVData, DesignConfig } from '../types/cv';

export const monolithCVData: CVData = {
  personalInfo: {
    fullName: "ARYASATYA ALAAUDDIN",
    jobTitle: "Design Engineer & Full Stack Developer",
    phone: "+62 878-9895-2895",
    email: "aryasatyaalaauddin@gmail.com",
    location: "Surabaya, Indonesia",
    linkedin: "linkedin.com/in/aryasatyaalaauddin",
    website: "aryasatyaa.vercel.app",
    github: "github.com/Ax3lrod",
    summary: "Design Engineer and Full-Stack Developer with expertise bridging high-polish UI design and robust software architecture using React, Next.js, TypeScript, Node.js, and PostgreSQL. Experienced building bespoke, accessible web applications with modern design systems (Tailwind CSS, Radix UI, Framer Motion) alongside scalable backend APIs and database schemas (Prisma, Supabase, Docker). Passionate about shipping high-velocity digital products and interactive platforms for founders and fast-growing brands.",
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
        "Directed a cross-functional engineering team of 11 developers delivering the official web platform (sre-its.com) and digital assets for organizational recruitment.",
        "Engineered multi-step registration funnels with dynamic REST API integrations and robust client/server form validation, ensuring high-conversion onboarding.",
        "Established automated CI/CD workflows with GitHub Actions, Husky pre-push hooks, and lint-staged, maintaining zero-regression code quality and high release velocity.",
      ],
      isVisible: true,
    },
    {
      id: "exp-2",
      company: "ITS Student Executive Board (BEM ITS)",
      role: "Frontend & Full-Stack Developer",
      location: "Surabaya, Indonesia",
      startDate: "Mar 2025",
      endDate: "Apr 2026",
      bullets: [
        "Engineered scalable web applications serving 20,000+ university students using Next.js and Tailwind CSS, achieving sub-second page loads and optimal Core Web Vitals.",
        "Translated complex Figma designs into modular, accessible, and responsive component libraries adhering to modern design system specifications.",
        "Collaborated closely in agile sprint cycles with designers and engineers, conducting peer code reviews and driving consistent UX polish across all public pages.",
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
        "Designed modular RESTful backend services and relational database schemas supporting internal organizational management systems.",
        "Authored and mentored the 'IT Junior Preps' web development curriculum covering modern React, TypeScript, and API architecture in partnership with Hacktiv8.",
      ],
      isVisible: true,
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "VitaGo ATS Resume Builder",
      subtitle: "Precision ATS Document Engine & Design System",
      link: "vita-go.vercel.app",
      techStack: "React 19, TypeScript, Tailwind CSS, Vite, WCAG 2.1 AA",
      bullets: [
        "Engineered a client-side document compiler with a dynamic 1-page auto-scaling algorithm, millimeter-accurate CSS paged media, and native vector export.",
        "Crafted an accessible design system conforming to WCAG 2.1 AA standards, featuring zero-layout-shift preview rendering and keyboard-first navigation.",
      ],
      isVisible: true,
    },
    {
      id: "proj-2",
      name: "SaveFile Platform API & Workers",
      subtitle: "Gaming Social Platform & Automated Activity Sync Engine",
      link: "github.com/Ax3lrod/savefile-backend",
      techStack: "Node.js, NestJS, TypeScript, PostgreSQL, Prisma, Docker",
      bullets: [
        "Architected a modular monolith backend API with NestJS and Prisma ORM backed by PostgreSQL, designing normalized relational schemas for user libraries.",
        "Engineered automated asynchronous background workers and cron pipelines to ingest, parse, and enrich third-party platform metadata without blocking user request threads.",
        "Implemented secure OAuth authentication, strict DTO request validation, and comprehensive error handling with containerized Docker deployments.",
      ],
      isVisible: true,
    },
    {
      id: "proj-3",
      name: "CiviGo Public Service Platform",
      subtitle: "Public Service Booking & Civic Queue Management System",
      link: "github.com/Ax3lrod/civigo",
      techStack: "React, Next.js, TypeScript, PostgreSQL (Supabase), Vitest",
      bullets: [
        "Built a full-stack civic service platform with Next.js web dashboard and RESTful route handlers on Supabase PostgreSQL with Server Actions.",
        "Designed relational database schemas with migration scripts, location-based query filters, and role-based access control for administrative workflows.",
        "Authored automated unit and integration test suites with Vitest, ensuring robust API endpoints and high-reliability data validation.",
      ],
      isVisible: true,
    }
  ],
  skills: [
    {
      id: "skill-1",
      name: "Design Engineering & Frontend",
      skills: "React, Next.js (App Router), TypeScript, Tailwind CSS, Radix UI, Framer Motion, HTML5/CSS3, Responsive Design, Design Systems, Core Web Vitals",
      isVisible: true,
    },
    {
      id: "skill-2",
      name: "Backend & Full-Stack",
      skills: "Node.js, Express, NestJS, RESTful APIs, Server Actions, PostgreSQL, Prisma ORM, Supabase, Docker",
      isVisible: true,
    },
    {
      id: "skill-3",
      name: "Engineering & Tooling",
      skills: "Git, GitHub Actions (CI/CD), Vitest, Jest, React Hook Form, Zod, Postman, Linux, Figma to Code",
      isVisible: true,
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "2nd Place — GEMASTIK XVIII (Smart City Division)",
      event: "National ICT Competition (Puspresnas / Kemendikbudristek)",
      date: "Oct 2025",
      description: "Proposed 'ARJUNA', an adaptive flood early warning platform utilizing digital twin concepts and machine learning.",
      isVisible: true,
    },
    {
      id: "ach-2",
      title: "3rd Place — FIT Competition 2025 (Web Development Category)",
      event: "Faculty of Information Technology (FTI UKSW)",
      date: "Aug 2025",
      description: "Built SustainaMap, an interactive environmental awareness web application with map visualization and personal air quality metrics.",
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
  ],
};

export const monolithDesignConfig: DesignConfig = {
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
