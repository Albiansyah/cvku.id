"use client";

import { useCallback } from 'react'; // <-- 1. Impor useCallback dari React
import useCvStore from '../store/useCvStore';
import { shallow } from 'zustand/shallow';

// Ini adalah custom hook kita versi final yang tangguh (robust)
export function useCvData() {
  
  // 2. Bungkus fungsi selektor kita dengan useCallback.
  // Dependency array kosong [] berarti fungsi ini HANYA akan dibuat SATU KALI
  // dan akan terus digunakan di semua render selanjutnya.
  const selector = useCallback((state) => ({
    // Data
    personal: state.cv.personal,
    summary: state.cv.summary,
    experience: state.cv.experience,
    education: state.cv.education,
    skills: state.cv.skills,
    
    // Actions (Fungsi)
    updatePersonalInfo: state.updatePersonalInfo,
    updateSummary: state.updateSummary,
    addExperience: state.addExperience,
    removeExperience: state.removeExperience,
    updateExperience: state.updateExperience,
    addEducation: state.addEducation,
    removeEducation: state.removeEducation,
    updateEducation: state.updateEducation,
    addSkill: state.addSkill,
    removeSkill: state.removeSkill,
    resetCv: state.resetCv,
  }), []); // <-- Dependency array kosong adalah kuncinya

  // 3. Gunakan selector yang sudah di-cache tersebut dengan 'shallow'
  const cvData = useCvStore(selector, shallow);

  return cvData;
}