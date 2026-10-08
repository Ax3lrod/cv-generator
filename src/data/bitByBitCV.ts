import { CVData, DesignConfig } from '../types/cv';

export const bitByBitCVData: CVData = {
  personalInfo: {
    fullName: "ARYASATYA ALAAUDDIN",
    jobTitle: "Full-Stack Engineer Intern",
    phone: "+62 878-9895-2895",
    email: "aryasatyaalaauddin@gmail.com",
    location: "Surabaya, Indonesia",
    linkedin: "linkedin.com/in/aryasatyaalaauddin",
    website: "aryasatyaa.vercel.app",
    github: "github.com/Ax3lrod",
    summary: "Full-stack engineer with hands-on experience building high-throughput web applications, AI/ML data pipelines, and scalable APIs using React, Next.js, Node.js, Python, and PostgreSQL. Proven track record designing distributed data pipelines processing 6M+ records (Kafka, PySpark, BERT) and architecting containerized microservices with Docker and CI/CD. Passionate about building intelligent, AI-powered automation infrastructure for modern e-commerce and communication workflows.",
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
        "Directed an 11-member engineering team delivering the official web platform (sre-its.com) and automated registration workflows for high-volume participant intake.",
        "Built dynamic REST API integrations and robust client/server form validation pipelines, cutting onboarding errors and ensuring data integrity.",
        "Established automated CI/CD pipelines with GitHub Actions, Husky pre-push hooks, and lint-staged, streamlining deployments and eliminating release regressions.",
      ],
      isVisible: true,
    },
    {
      id: "exp-2",
      company: "ITS Student Executive Board (BEM ITS)",
      role: "Full-Stack / Frontend Developer",
      location: "Surabaya, Indonesia",
      startDate: "Mar 2025",
      endDate: "Apr 2026",
      bullets: [
        "Engineered scalable web features using Next.js and Tailwind CSS serving 20,000+ university students, optimizing Core Web Vitals and client rendering efficiency.",
        "Integrated third-party REST APIs and structured data layers, ensuring low-latency data synchronization and state consistency across high-traffic portal pages.",
        "Collaborated in cross-functional agile sprints, conducting peer code reviews, sprint planning, and writing maintainable, reusable component libraries.",
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
        "Designed scalable RESTful API architectures and database schemas for organizational member management and service integrations.",
        "Authored and mentored the 'IT Junior Preps' web development curriculum covering modern React, Node.js, and API design in partnership with Hacktiv8.",
      ],
      isVisible: true,
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "AI-Powered NLP & Review Intelligence Pipeline",
      subtitle: "Large-Scale Streaming & Conversational Data Processing System",
      link: "github.com/Ax3lrod/final-project-big-data",
      techStack: "Python, FastAPI, BERT, Kafka, PySpark, Trino, Docker",
      bullets: [
        "Designed and implemented an end-to-end data pipeline processing 6.4M+ text records using Apache Kafka for real-time streaming and PySpark for distributed batch preprocessing.",
        "Built an AI classification pipeline fusing fine-tuned BERT transformer embeddings with anomaly detection (Isolation Forest, K-Means) to detect fraudulent text patterns.",
        "Developed high-throughput REST APIs with FastAPI to serve sub-200ms model inferences and orchestrated 9+ containerized services using Docker Compose.",
      ],
      isVisible: true,
    },
    {
      id: "proj-2",
      name: "SaveFile — High-Throughput Platform API & Workers",
      subtitle: "Gaming Social Platform & Automated Activity Sync Engine",
      link: "github.com/Ax3lrod/savefile-backend",
      techStack: "Node.js, NestJS, TypeScript, PostgreSQL, Prisma, Docker, Steam API",
      bullets: [
        "Architected a modular monolith backend API with NestJS and Prisma ORM backed by PostgreSQL, designing normalized relational schemas for user libraries.",
        "Engineered automated asynchronous background workers and cron pipelines to ingest, parse, and enrich third-party platform metadata without blocking user request threads.",
        "Implemented secure OAuth authentication, strict DTO request validation, and comprehensive error handling with containerized Docker deployments.",
      ],
      isVisible: true,
    },
    {
      id: "proj-3",
      name: "CiviGo — Cross-Platform Service Platform & API",
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
      name: "Languages & Core",
      skills: "TypeScript, JavaScript, Python, SQL, HTML5/CSS3, Bash",
      isVisible: true,
    },
    {
      id: "skill-2",
      name: "Frontend & Web",
      skills: "React, Next.js, Tailwind CSS, Responsive Design, State Management, Core Web Vitals",
      isVisible: true,
    },
    {
      id: "skill-3",
      name: "Backend, APIs & AI",
      skills: "Node.js, Express, NestJS, FastAPI (Python), RESTful APIs, Webhooks & Third-Party Integrations, BERT, Transformers, Kafka",
      isVisible: true,
    },
    {
      id: "skill-4",
      name: "Databases & DevOps",
      skills: "PostgreSQL, Prisma ORM, Supabase, MongoDB, Docker, Git, CI/CD (GitHub Actions), Unit Testing (Vitest, PyTest), Linux",
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
    { id: "experiences", title: "Work Experience", isVisible: true },
    { id: "projects", title: "Key Projects", isVisible: true },
    { id: "skills", title: "Technical Skills", isVisible: true },
    { id: "achievements", title: "Honors & Achievements", isVisible: true },
  ]
};

export const bitByBitDesignConfig: DesignConfig = {
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
