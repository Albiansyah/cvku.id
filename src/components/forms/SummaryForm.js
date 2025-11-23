// src/components/forms/SummaryForm.js
"use client";

import useCvStore from '../../store/useCvStore';

export default function SummaryForm() {
  // Ambil state dan action secara terpisah (pola anti-gagal)
  const summary = useCvStore((state) => state.cv.summary);
  const updateSummary = useCvStore((state) => state.updateSummary);

  return (
    <>
      <div className="form-section">
        <h3 className="form-section-title">Ringkasan Profesional</h3>
        <div className="input-group">
          <label htmlFor="summary">
            Tulis 2-3 kalimat yang menyoroti pengalaman dan keahlian terbaikmu.
          </label>
          <textarea 
            id="summary" 
            name="summary" 
            rows="5"
            value={summary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Contoh: Full Stack Developer berpengalaman lebih dari 5 tahun dengan keahlian dalam React, Next.js, dan Node.js..."
          />
        </div>
      </div>
      <style jsx>{`
        .form-section { margin-bottom: 2rem; }
        .form-section-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: #2d3748; }
        .input-group label { font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem; line-height: 1.5; }
        .input-group textarea {
          width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0;
          border-radius: 8px; font-size: 1rem; box-sizing: border-box;
          font-family: inherit; resize: vertical;
        }
        .input-group textarea:focus {
          outline: none; border-color: #3182ce;
          box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
        }
      `}</style>
    </>
  );
}
