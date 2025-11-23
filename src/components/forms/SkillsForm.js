// src/components/forms/SkillsForm.js
"use client";

import { useState, useMemo } from 'react';
import useCvStore from '../../store/useCvStore';
import { X, PlusCircle } from 'lucide-react';
import { skillSuggestions } from '../../config/recommendedSkills'; // <-- 1. Impor "kamus" dari file baru

export default function SkillsForm() {
  const [currentSkill, setCurrentSkill] = useState('');
  
  // Ambil state dan actions dari store (pola anti-gagal)
  const skills = useCvStore((state) => state.cv.skills);
  const jobTitle = useCvStore((state) => state.cv.personal.jobTitle);
  const addSkill = useCvStore((state) => state.addSkill);
  const removeSkill = useCvStore((state) => state.removeSkill);
  
  // Logika untuk menampilkan rekomendasi (sekarang menggunakan data dari import)
  const suggestions = useMemo(() => {
    if (!jobTitle) return [];
    const lowerJobTitle = jobTitle.toLowerCase();
    for (const key in skillSuggestions) {
      if (lowerJobTitle.includes(key)) {
        return skillSuggestions[key].filter(s => !skills.includes(s));
      }
    }
    return [];
  }, [jobTitle, skills]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentSkill.trim() !== '') {
      e.preventDefault();
      addSkill(currentSkill.trim());
      setCurrentSkill('');
    }
  };

  const handleAddSuggestion = (skill) => {
    addSkill(skill);
  };

  return (
    <>
      <div className="form-section">
        <h3 className="form-section-title">Keahlian</h3>
        <div className="input-group">
          <label htmlFor="skills">
            Tambahkan keahlian (skill) Anda, tekan Enter untuk menambah.
          </label>
          <div className="tags-input-container">
            {skills.map((skill, index) => (
              <div key={index} className="tag-item">
                {skill}
                <button type="button" onClick={() => removeSkill(index)} className="btn-remove-tag">
                  <X size={14} />
                </button>
              </div>
            ))}
            <input 
              type="text" 
              id="skills"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik skill baru..."
            />
          </div>
        </div>

        {suggestions.length > 0 && (
            <div className="suggestions-container">
                <label>Rekomendasi untuk Anda:</label>
                <div className="suggestions-list">
                    {suggestions.map(skill => (
                        <button type="button" key={skill} onClick={() => handleAddSuggestion(skill)} className="suggestion-item">
                            <PlusCircle size={14} /> {skill}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>
      <style jsx>{`
        /* --- SEMUA CSS TETAP SAMA SEPERTI SEBELUMNYA --- */
        .form-section { margin-bottom: 2rem; }
        .form-section-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: #2d3748; }
        .input-group label { font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem; line-height: 1.5; }
        .tags-input-container { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 8px; transition: border-color 0.2s, box-shadow 0.2s; }
        .tags-input-container:focus-within { border-color: #3182ce; box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2); }
        .tag-item { display: inline-flex; align-items: center; gap: 0.4rem; background-color: #eef2ff; color: #4338ca; padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.9rem; font-weight: 500; }
        .btn-remove-tag { background: none; border: none; color: #4338ca; cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; padding: 0; }
        .btn-remove-tag:hover { opacity: 1; }
        .tags-input-container input { flex-grow: 1; border: none; outline: none; padding: 0.4rem; font-size: 1rem; min-width: 120px; background: transparent; }
        .suggestions-container { margin-top: 1rem; }
        .suggestions-container label { font-size: 0.875rem; font-weight: 500; color: #4a5568; }
        .suggestions-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
        .suggestion-item { display: inline-flex; align-items: center; gap: 0.4rem; background-color: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .suggestion-item:hover { background-color: #dcfce7; color: #14532d; border-color: #86efac; }
      `}</style>
    </>
  );
}