// src/components/forms/EducationForm.js
"use client";

import useCvStore from '../../store/useCvStore';
// Kita tidak perlu 'shallow'
import { PlusCircle, Trash2 } from 'lucide-react';

// <-- 1. Pastikan nama fungsinya sudah benar: EducationForm
export default function EducationForm() {
  // <-- 2. Ambil state dan action secara terpisah (pola anti-gagal)
  const education = useCvStore((state) => state.cv.education);
  const addEducation = useCvStore((state) => state.addEducation);
  const removeEducation = useCvStore((state) => state.removeEducation);
  const updateEducation = useCvStore((state) => state.updateEducation);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    updateEducation(index, name, value);
  };

  return (
    <>
      <div className="form-section">
        <h3 className="form-section-title">Pendidikan</h3>
        
        {education.map((edu, index) => (
          <div key={edu.id} className="form-entry">
            <div className="entry-header">
              <h4>{edu.institution || `Pendidikan #${index + 1}`}</h4>
              <button type="button" onClick={() => removeEducation(index)} className="btn-delete" aria-label="Hapus pendidikan">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor={`degree-${edu.id}`}>Gelar / Jurusan</label>
                <input type="text" id={`degree-${edu.id}`} name="degree" value={edu.degree} onChange={(e) => handleChange(index, e)} placeholder="Contoh: S1 Teknik Informatika" />
              </div>
              <div className="input-group">
                <label htmlFor={`institution-${edu.id}`}>Nama Institusi</label>
                <input type="text" id={`institution-${edu.id}`} name="institution" value={edu.institution} onChange={(e) => handleChange(index, e)} placeholder="Contoh: Universitas Gadjah Mada" />
              </div>
              <div className="input-group">
                <label htmlFor={`startDate-${edu.id}`}>Tahun Mulai</label>
                <input type="text" id={`startDate-${edu.id}`} name="startDate" value={edu.startDate} onChange={(e) => handleChange(index, e)} placeholder="Contoh: 2018" />
              </div>
              <div className="input-group">
                <label htmlFor={`endDate-${edu.id}`}>Tahun Selesai</label>
                <input type="text" id={`endDate-${edu.id}`} name="endDate" value={edu.endDate} onChange={(e) => handleChange(index, e)} placeholder="Contoh: 2022 atau Lulus" />
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addEducation} className="btn-add-more">
          <PlusCircle size={18} />
          Tambah Pendidikan
        </button>
      </div>

      <style jsx>{`
        /* CSS ini sengaja dibuat sama persis dengan ExperienceForm untuk konsistensi */
        .form-section { margin-bottom: 2rem; }
        .form-section-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1.5rem; color: #2d3748; }
        .form-entry {
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }
        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .entry-header h4 { margin: 0; font-size: 1.1rem; color: #374151; }
        .btn-delete {
          background: none; border: none; color: #ef4444; cursor: pointer;
          padding: 0.5rem; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background-color 0.2s;
        }
        .btn-delete:hover { background-color: #fee2e2; }

        .form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 768px) { .form-grid { grid-template-columns: 1fr 1fr; } }
        .input-group { display: flex; flex-direction: column; }
        .input-group label { font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem; }
        .input-group input {
          width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0;
          border-radius: 8px; font-size: 1rem; box-sizing: border-box;
          font-family: inherit;
        }
        .input-group input:focus {
          outline: none; border-color: #3182ce;
          box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
        }

        .btn-add-more {
          width: 100%; padding: 0.75rem; background: #f8f9fa;
          border: 1px dashed #d1d5db; border-radius: 8px;
          font-weight: 600; color: #4a5568; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; transition: all 0.2s;
        }
        .btn-add-more:hover { background: #f1f5f9; border-color: #9ca3af; color: #1a202c; }
      `}</style>
    </>
  );
}
