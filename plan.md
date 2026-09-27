# Implementation Plan: Dynamic & Highly Customizable CV Generator

## 1. Project Overview
A web-based CV Generator featuring deep customization capabilities (typography, margins, section order, color schemes, layout styles, and ATS optimization), pre-loaded with an industry-standard ATS resume template and placeholder profile.

---

## 2. Core Features & Specifications
- [x] **Phase 1: Project Setup & Architecture**
  - [x] Analyze ATS layout requirements for all required fields and styling.
  - [x] Initialize Vite + React + TypeScript + Tailwind CSS project with Lucide icons.
  - [x] Define comprehensive TypeScript data models for CV Content (Personal, Education, Experience, Projects, Skills, Achievements, Custom Sections) and CV Design Configurations (Paper size, margins, font scale, heading styles, line height, colors, section ordering, alignments).
  - [x] Create default data store with realistic, professional dummy data.

- [x] **Phase 2: Core Components & Real-time CV Preview Engine**
  - [x] Build CV Preview Component rendering exact ATS layout (A4 / Letter accurate aspect ratios, headers, dividers, bullet points).
  - [x] Implement multi-template support:
    - **Classic ATS** (Standard ATS layout)
    - **Modern Minimal** (Contemporary clean layout)
    - **Executive** (Header banner / elegant lines)
    - **Tech Compact** (Highlighting projects and skills tags)
  - [x] Implement dynamic CSS variables / style injection based on real-time configuration (font family, font scale, line height, margins, spacing, accent colors).
  - [x] Implement page-overflow detection & visual page break indicators (Page 1 / Page 2 indicator with 1-page fit helper).

- [x] **Phase 3: Deep Configuration & Editing Panels**
  - [x] **Content Editor Tab**:
    - Header & Contact Info (Name, Phone, Email, LinkedIn, Portfolio, GitHub, Location, Bio/Summary)
    - Education Manager (School, Degree, GPA, Dates, Location, Highlights)
    - Experience Manager (Company, Role, Dates, Location, Bullet points with add/remove/reorder)
    - Projects Manager (Project title, Subtitle, Tech stack, Bullets, Links)
    - Skills Manager (Category name, skill items with tags/comma separation, ability to add unlimited categories)
    - Achievements Manager (Title, Context, Date)
    - Custom Section Builder (Add any arbitrary section with title & bullet/entry list)
  - [x] **Design & Layout Configuration Tab**:
    - Typography (Font families: Inter, Garamond, Merriweather, Roboto, JetBrains Mono; Font size scaling; Line spacing)
    - Margins & Spacing (Top/Bottom/Left/Right page margins, Section gap, Entry gap, Bullet gap)
    - Header Styling (Center aligned, Left aligned, Split column, Avatar/Photo toggle)
    - Section Heading Styles (Full underline, Thick bar, Pill/Badge, Minimal, Uppercase toggle, Line thickness/style)
    - Color Customization (Primary/Accent color picker + Curated palettes)
    - Date & Location layout (Right inline, Subtitle stacked, Italic/Bold toggle)
  - [x] **Section Reorder & Visibility Tab**:
    - Reorder any section up/down
    - Toggle visibility of any section on/off
    - Rename section titles (e.g. "Work Experience" vs "Experiences", "Projects" vs "Selected Works")

- [x] **Phase 4: Export, Import & Utilities**
  - [x] Pixel-perfect Print & PDF Export using print CSS (`@media print` with exact page sizing `@page { size: A4; margin: 0; }`).
  - [x] Direct PDF download helper (`html2pdf.js` / canvas print stream).
  - [x] JSON Export / Import (save full CV state & layout configuration to file and restore).
  - [x] LocalStorage auto-save and reset/restore example data.
  - [x] ATS Readability & Keyword check panel with tips.

- [x] **Phase 5: Polish & Testing**
  - [x] Verify visual layout match and responsive editing.
  - [x] Verify print and PDF export accuracy.
  - [x] Test all customization sliders, colors, font families, and section reordering.
  - [x] Build & verification without errors.

- [x] **Phase 6: Data Sanitization, Git Setup & Push to GitHub**
  - [x] Create `.gitignore` to ignore `node_modules`, `dist`, `*.pdf`, `.env*`, etc.
  - [x] Replace default profile data in `src/data/defaultCV.ts` with generic high-quality placeholder ("Alex Morgan").
  - [x] Sanitize placeholder texts in editor components (`PersonalInfoEditor.tsx`, `ExportImportEditor.tsx`, etc.).
  - [x] Sanitize `README.md` (remove personal names, absolute user paths, and personal PDF references).
  - [x] Thorough automated verification grep across all files for personal details.
  - [x] Verify build with `npm run build`.
  - [x] Initialize git repo, commit, set remote `https://github.com/Ax3lrod/cv-generator.git`, and push to `main`.

- [x] **Phase 7: 100% Accurate Native Vector PDF Engine (@react-pdf/renderer)**
  - [x] Implement CVPdfDocument component supporting exact millimeter paper sizing (A4, F4, Letter, Custom) and accurate margin mapping.
  - [x] Implement layout renderers for all CV templates (ATS Classic, Modern, Executive, Tech) with vector typography, dividers, and clickable hyperlinks.
  - [x] Support dynamic styling controls (font size scale, line height, section gap, item gap, bullet style, uppercase headers, accent colors).
  - [x] Support Force 1-Page auto-scaling and exact page constraints.
  - [x] Integrate vector PDF generator into ExportImportEditor with instant download and preview.
  - [x] Verify build, zero regression, and test PDF output quality.

- [x] **Phase 8: Profile Photo Support (Upload, Toggle, Shapes, Live Preview & Vector PDF Integration)**
  - [x] Extend PersonalInfo and DesignConfig data models in `src/types/cv.ts`.
  - [x] Implement image uploader with client-side canvas auto-compression (max 600x600) in `PersonalInfoEditor.tsx`.
  - [x] Add photo controls (Toggle on/off, Shape: Circle/Rounded/Square, Size slider) in `PersonalInfoEditor.tsx` and `DesignConfigEditor.tsx`.
  - [x] Render profile photo in all 4 preview templates (`ATSClassicTemplate`, `ModernTemplate`, `ExecutiveTemplate`, `TechTemplate`).
  - [x] Implement `<Image>` rendering in `CVPdfDocument.tsx` for 100% accurate vector PDF export.
  - [x] Verify build, test image upload, and verify print and PDF download.

- [x] **Phase 9: Interactive Photo Cropping & Adjustment**
  - [x] Add `rawPhotoUrl?: string` to `PersonalInfo` in `src/types/cv.ts`.
  - [x] Implement canvas crop utility `getCroppedImg` supporting zoom, rotation, pan in `src/utils/imageUtils.ts`.
  - [x] Build `PhotoCropModal.tsx` component with `react-easy-crop` (interactive drag, zoom slider, 90° rotation, aspect ratio switcher 1:1 and 3:4, crop shape preview).
  - [x] Integrate crop modal trigger on initial file upload and via "Crop / Adjust" button in `PersonalInfoEditor.tsx`.
  - [x] Verify build, test cropping, rotation, zoom, and live preview update.


