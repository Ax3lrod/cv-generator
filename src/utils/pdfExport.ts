import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { CVData, DesignConfig } from '../types/cv';
import { CVPdfDocument } from '../components/CVPreview/pdf/CVPdfDocument';

/**
 * Calculates auto-scale factor for force-one-page if content overflows
 */
export function estimateAutoScaleFactor(cvData: CVData, config: DesignConfig): number {
  if (!config.forceOnePage) return 1;

  // Check if live preview has calculated an auto-scale factor
  const cvElement = document.getElementById('cv-print-target');
  if (cvElement) {
    const innerContent = cvElement.firstElementChild as HTMLElement;
    if (innerContent) {
      const naturalHeight = innerContent.scrollHeight;
      const { heightMm } = {
        heightMm: config.paperSize === 'custom' 
          ? (config.customPaperHeight || 297) 
          : (config.paperSize === 'f4' ? 330 : config.paperSize === 'letter' ? 279.4 : 297)
      };
      const availableInnerHeightPx = (heightMm - config.pageMarginTop - config.pageMarginBottom) * 3.779527;
      if (naturalHeight > availableInnerHeightPx) {
        return Math.max(0.65, availableInnerHeightPx / naturalHeight);
      }
    }
  }

  return 1;
}

/**
 * Generates a true vector PDF Blob using @react-pdf/renderer
 */
export async function generateVectorPdfBlob(
  cvData: CVData,
  config: DesignConfig,
  autoScaleFactor?: number
): Promise<Blob> {
  const scale = autoScaleFactor ?? estimateAutoScaleFactor(cvData, config);
  const element = React.createElement(CVPdfDocument, {
    cvData,
    config,
    autoScaleFactor: scale,
  });

  const doc = pdf(element as any);
  const blob = await doc.toBlob();
  return blob;
}

/**
 * Directly downloads the vector PDF to the user's computer
 */
export async function downloadVectorPdf(
  cvData: CVData,
  config: DesignConfig,
  autoScaleFactor?: number
): Promise<void> {
  const blob = await generateVectorPdfBlob(cvData, config, autoScaleFactor);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const sanitizedName = (cvData.personalInfo.fullName || 'Resume')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '');

  anchor.href = url;
  anchor.download = `${sanitizedName}_CV.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Opens the vector PDF in a new tab for instant high-fidelity preview
 */
export async function openVectorPdfInNewTab(
  cvData: CVData,
  config: DesignConfig,
  autoScaleFactor?: number
): Promise<void> {
  const blob = await generateVectorPdfBlob(cvData, config, autoScaleFactor);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
