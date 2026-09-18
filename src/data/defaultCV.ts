import { CVData, DesignConfig } from '../types/cv';

export const defaultCVData: CVData = {
  personalInfo: {
    fullName: "ALEX MORGAN",
    jobTitle: "Senior Full-Stack Engineer",
    phone: "+1 (555) 234-5678",
    email: "alex.morgan@example.com",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan-dev",
    website: "alexmorgan.dev",
    github: "github.com/alexmorgan",
    summary: "Versatile Full-Stack Engineer with 4+ years of experience architecting scalable distributed web platforms and high-throughput microservices. Proficient in TypeScript, React, Next.js, Node.js, and cloud-native deployments. Demonstrated history of improving system latency, streamlining CI/CD workflows, and collaborating across multidisciplinary product teams to deliver intuitive software solutions.",
    showSummary: true,
  },
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science in Computer Science",
      location: "Berkeley, CA",
      startDate: "Aug 2019",
      endDate: "May 2023",
      gpa: "3.88/4.00",
      bullets: [],
      isVisible: true,
    }
  ],
  experiences: [
    {
      id: "exp-1",
      company: "Apex Cloud Technologies",
      role: "Lead Full-Stack Developer",
      location: "San Francisco, CA",
      startDate: "Jun 2023",
      endDate: "Present",
      bullets: [
        "Architected and delivered an enterprise analytics dashboard serving 120,000+ daily active users using Next.js and TypeScript.",
        "Implemented event-driven microservices with Node.js and Kafka, decreasing data sync latency by 35% across all distributed systems.",
        "Spearheaded automated CI/CD pipeline modernization with Docker and GitHub Actions, shortening release cycles from 2 weeks to daily deployments.",
      ],
      isVisible: true,
    },
    {
      id: "exp-2",
      company: "Vanguard Digital Labs",
      role: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "May 2023",
      bullets: [
        "Engineered accessible, cross-platform design system components in React and Tailwind CSS adopted by 6 internal product squads.",
        "Optimized critical rendering paths and bundle splitting, achieving a 42% improvement in First Contentful Paint (FCP) and Lighthouse scores.",
        "Collaborated with product managers and security teams to implement robust OAuth2 / OpenID Connect authentication flows.",
      ],
      isVisible: true,
    },
    {
      id: "exp-3",
      company: "Horizon Software Innovations",
      role: "Full-Stack Engineering Intern",
      location: "San Jose, CA",
      startDate: "May 2021",
      endDate: "Dec 2021",
      bullets: [
        "Developed RESTful APIs and PostgreSQL database schemas for high-traffic customer onboarding and validation modules.",
        "Built an automated end-to-end testing suite with Playwright and Jest, increasing overall test coverage from 64% to 89%.",
      ],
      isVisible: true,
    },
    {
      id: "exp-4",
      company: "OpenTech Collaborative",
      role: "Open Source Contributor & Core Staff",
      location: "Remote",
      startDate: "Sep 2020",
      endDate: "May 2021",
      bullets: [
        "Authored developer documentation, triage automation bots, and sample integration guides used by over 5,000 community members.",
        "Maintained foundational UI utilities and resolved over 40 community-reported issues regarding performance and browser compatibility.",
      ],
      isVisible: true,
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Distributed Real-Time Stream Processor",
      bullets: [
        "Built an end-to-end streaming data pipeline handling 8M+ daily telemetry events with Apache Kafka, PySpark, and PostgreSQL.",
        "Engineered an anomaly detection engine with FastAPI and scikit-learn to proactively flag infrastructure anomalies in under 200ms.",
        "Containerized services with Docker Compose and orchestrated deployment across scalable AWS ECS clusters.",
      ],
      isVisible: true,
    },
    {
      id: "proj-2",
      name: "EcoMetrics Geospatial Platform",
      bullets: [
        "Developed an interactive geospatial mapping portal utilizing Mapbox GL and Next.js for environmental impact assessment.",
        "Implemented client-side data filtering and caching strategies that reduced backend query load by 50%.",
      ],
      isVisible: true,
    },
    {
      id: "proj-3",
      name: "OmniCart Modern E-Commerce Suite",
      bullets: [
        "Engineered a headless commerce solution featuring real-time inventory management, Stripe payment processing, and Webhook dispatchers.",
        "Constructed accessible UI workflows compliant with WCAG 2.1 AA standards.",
      ],
      isVisible: true,
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "1st Place Winner",
      event: "National Collegiate Hackathon (Cloud & AI Track)",
      isVisible: true,
    },
    {
      id: "ach-2",
      title: "Dean's Honor List",
      event: "College of Engineering, UC Berkeley",
      isVisible: true,
    }
  ],
  skills: [
    {
      id: "skill-1",
      name: "Programming & Frameworks",
      skills: "TypeScript, JavaScript, Python, React, Next.js, Node.js, Express, Tailwind CSS, GraphQL",
      isVisible: true,
    },
    {
      id: "skill-2",
      name: "Tools & Infrastructure",
      skills: "Docker, Kubernetes, AWS, PostgreSQL, Redis, Kafka, Git, CI/CD (GitHub Actions), Linux",
      isVisible: true,
    },
    {
      id: "skill-3",
      name: "Methodologies & Core",
      skills: "Distributed Systems, RESTful APIs, Agile/Scrum, Microservices Architecture, Test-Driven Development",
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

export const defaultDesignConfig: DesignConfig = {
  template: "ats-classic",
  paperSize: "a4",
  customPaperWidth: 210,
  customPaperHeight: 297,
  forceOnePage: true,
  fontFamily: "inter",
  baseFontSize: 9.3, // pt
  nameFontSize: 20, // pt
  sectionHeadingFontSize: 11.2, // pt
  itemTitleFontSize: 9.8, // pt
  lineHeight: 1.32,
  pageMarginTop: 10, // mm
  pageMarginBottom: 10, // mm
  pageMarginLeft: 12, // mm
  pageMarginRight: 12, // mm
  sectionGap: 2.8, // mm
  itemGap: 1.8, // mm
  bulletGap: 0.8, // mm
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
};
