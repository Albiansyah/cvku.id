'use client';

import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import AtsTemplate from './AtsTemplate';

export const templatesMap = {
  // modern family
  'modern-professional': ModernTemplate,
  'creative-designer': ModernTemplate,
  'fresh-graduate': ModernTemplate,
  'tech-innovator': ModernTemplate,
  'healthcare-pro': ModernTemplate,
  'marketing-guru': ModernTemplate,
  'finance-expert': ModernTemplate,
  'startup-founder': ModernTemplate,

  // classic
  'executive-classic': ClassicTemplate,

  // ATS default
  'ats-free': AtsTemplate,
};

export { ModernTemplate, ClassicTemplate, AtsTemplate };
