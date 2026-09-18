import React, { useState, useEffect } from 'react';
import { CVData, DesignConfig } from './types/cv';
import { defaultCVData, defaultDesignConfig } from './data/defaultCV';
import { Navbar } from './components/Navbar';
import { EditorTabs } from './components/Editor/EditorTabs';
import { CVPreview } from './components/CVPreview/CVPreview';

const STORAGE_KEY_DATA = 'cv_studio_data_v1';
const STORAGE_KEY_CONFIG = 'cv_studio_config_v1';

export function App() {
  // Load initial data from localStorage if available, or default to example CV
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved CV data, using default:', e);
    }
    return defaultCVData;
  });

  const [designConfig, setDesignConfig] = useState<DesignConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved design config, using default:', e);
    }
    return defaultDesignConfig;
  });

  const [scale, setScale] = useState<number>(0.85);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // Auto-save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(cvData));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [cvData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(designConfig));
    } catch (e) {
      console.warn('Could not save config to localStorage:', e);
    }
  }, [designConfig]);

  // Adjust default scale on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setScale(0.75);
      } else if (window.innerWidth < 1536) {
        setScale(0.85);
      } else {
        setScale(0.95);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <Navbar
        scale={scale}
        onScaleChange={setScale}
        onPrint={handlePrint}
        mobileView={mobileView}
        onToggleMobileView={setMobileView}
      />

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Config & Content Editor */}
        <aside
          className={`w-full lg:w-[500px] xl:w-[560px] 2xl:w-[620px] h-full flex-shrink-0 z-20 ${
            mobileView === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <EditorTabs
            cvData={cvData}
            designConfig={designConfig}
            onUpdateCVData={setCvData}
            onUpdateDesignConfig={setDesignConfig}
          />
        </aside>

        {/* Right Pane: Live CV Canvas Preview */}
        <main
          className={`flex-1 h-full overflow-y-auto bg-slate-900/70 p-4 sm:p-8 flex justify-center cv-preview-container custom-scrollbar ${
            mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="my-auto py-6">
            <CVPreview
              cvData={cvData}
              designConfig={designConfig}
              scale={scale}
              showPageBreaks={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
