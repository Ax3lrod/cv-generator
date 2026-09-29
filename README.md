# VitaGo: Your Curriculum Vitae on the Go

A focused, precision-engineered resume builder for creating clean, ATS-compliant CVs. Fast, flexible, and completely customizable with native vector print export and dynamic multi-page flow.

<p align="left">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://heroui.com/"><img src="https://img.shields.io/badge/HeroUI-000000?style=for-the-badge&logo=heroui&logoColor=white" alt="HeroUI" /></a>
</p>

---

## Tech Stack

| Technology | Role |
| :--- | :--- |
| [![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/) | Core UI library with reactive state management |
| [![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) | End-to-end type safety and component contracts |
| [![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite&logoColor=FFD62E)](https://vitejs.dev/) | Fast build tooling and hot module replacement |
| [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) | Utility-first styling with modern CSS engine |
| [![HeroUI](https://img.shields.io/badge/HeroUI-000000?style=flat-square&logo=heroui&logoColor=white)](https://heroui.com/) | Accessible design system and interface components |
| [![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-F56565?style=flat-square&logo=lucide&logoColor=white)](https://lucide.dev/) | Clean, lightweight iconography |
| [![React PDF](https://img.shields.io/badge/@react--pdf/renderer-E11D48?style=flat-square&logo=adobeacrobatreader&logoColor=white)](https://react-pdf.org/) | Client-side vector PDF document rendering |

---

## Features

### Precision Design Controls
- **Force 1-Page Layout**: Proportionally scales typography and spacing so all content fits onto a single sheet without overflowing to a second page. Includes an auto-tune spacing helper.
- **Paper Dimensions**: Standard presets for A4 (210 x 297 mm), US Letter (215.9 x 279.4 mm), F4 / Folio (215 x 330 mm), and US Legal (215.9 x 355.6 mm), plus custom millimeter width and height inputs.
- **4 Resume Templates**:
  - **ATS Classic**: Single-column layout with clean rules and clear typographic hierarchy.
  - **Modern Minimal**: Contemporary layout with pill badges and refined visual accents.
  - **Executive**: Formal layout with serif typography and double section dividers.
  - **Tech Compact**: Developer-focused layout with monospace accents and inline tech badges.
- **Typography**: Select from Inter, EB Garamond, Merriweather, Roboto, and JetBrains Mono. Configure base font size, header name size, section heading size, and line height.
- **Margins & Spacing**: Adjust top, bottom, and side margins, as well as section gaps, item gaps, and bullet point spacing in millimeters.
- **Header & Rule Styling**: Header alignment (centered, left-aligned, or split), section divider styles (full underline, left accent bar, pill badge, double line, minimal), line weight, and bullet markers.
- **Color Themes**: Curated neutral presets (ATS Black, Dark Slate, Executive Navy, Forest Emerald, Deep Burgundy, Modern Indigo, Teal Blue) and a custom hex color picker.

---

### Structured Content Editor
- **Personal Details**: Name, headline, contact information, portfolio links, GitHub, LinkedIn, and professional summary.
- **Education**: Institution, degree, study period, GPA, and academic honors.
- **Experience**: Employer, job title, location, employment dates, and bullet points describing contributions.
- **Projects**: Project title, tech stack, repository or live demo links, and key highlights.
- **Skills**: Group skills into categories with quick-add suggestions.
- **Achievements**: Competitions, awards, and recognitions with dates and organizers.
- **Custom Sections**: Create custom sections for certifications, publications, volunteer work, or languages.

---

### Section Management
- Reorder any section up or down.
- Toggle visibility for entire sections or individual items without deleting data.
- Rename section titles to match your preference (e.g. "Work Experience" instead of "Experience").

---

### Export & Storage
- **Print Dialog Export**: Native `@media print` vector output matching the chosen paper dimensions. Clean typography with no dark-mode background leaks or split headers.
- **Direct PDF Download**: Client-side vector PDF generation that mirrors your selected layout and styling.
- **JSON Backup & Restore**: Export your CV data and design settings as a JSON file to restore at any time.
- **LocalStorage Autosave**: All changes persist automatically in your browser across sessions.
- **ATS Readiness Check**: Real-time completeness score and checklist to ensure your resume covers all essential areas.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ax3lrod/cv-generator.git
   cd cv-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

To build the static application for production:
```bash
npm run build
```

The compiled output will be generated in the `dist` directory.
