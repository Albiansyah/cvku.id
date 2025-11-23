// src/components/forms/ExperienceForm.js
"use client";

import useCvStore from '../../store/useCvStore';
// Kita tidak perlu 'shallow' lagi dengan cara ini
import { PlusCircle, Trash2 } from 'lucide-react';

export default function ExperienceForm() {
  // ==================================================================
  // KUNCI PERBAIKANNYA ADA DI SINI:
  // Kita panggil hook-nya secara terpisah untuk setiap data yang dibutuhkan.
  const experience = useCvStore((state) => state.cv.experience);
  const addExperience = useCvStore((state) => state.addExperience);
  const removeExperience = useCvStore((state) => state.removeExperience);
  const updateExperience = useCvStore((state) => state.updateExperience);
  // ==================================================================

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    updateExperience(index, name, value);
  };

  return (
    <>
      <div className="form-section">
        <h3 className="form-section-title">Pengalaman Kerja</h3>
        
        {experience.map((exp, index) => (
          <div key={exp.id} className="experience-entry">
            <div className="entry-header">
              <h4>{exp.position || `Pengalaman #${index + 1}`}</h4>
              <button type="button" onClick={() => removeExperience(index)} className="btn-delete" aria-label="Hapus pengalaman">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor={`position-${exp.id}`}>Posisi Jabatan</label>
                <input type="text" id={`position-${exp.id}`} name="position" value={exp.position} onChange={(e) => handleChange(index, e)} placeholder="Contoh: Frontend Developer" />
              </div>
              <div className="input-group">
                <label htmlFor={`company-${exp.id}`}>Nama Perusahaan</label>
                <input type="text" id={`company-${exp.id}`} name="company" value={exp.company} onChange={(e) => handleChange(index, e)} placeholder="Contoh: PT Teknologi Maju" />
              </div>
              <div className="input-group">
                <label htmlFor={`startDate-${exp.id}`}>Tanggal Mulai</label>
                <input type="text" id={`startDate-${exp.id}`} name="startDate" value={exp.startDate} onChange={(e) => handleChange(index, e)} placeholder="Contoh: Jan 2022" />
              </div>
              <div className="input-group">
                <label htmlFor={`endDate-${exp.id}`}>Tanggal Selesai</label>
                <input type="text" id={`endDate-${exp.id}`} name="endDate" value={exp.endDate} onChange={(e) => handleChange(index, e)} placeholder="Contoh: Des 2023 atau Sekarang" />
              </div>
              <div className="input-group full-width">
                <label htmlFor={`description-${exp.id}`}>Deskripsi Pekerjaan</label>
                <textarea id={`description-${exp.id}`} name="description" value={exp.description} onChange={(e) => handleChange(index, e)} rows="4" placeholder="Jelaskan tanggung jawab dan pencapaian utama Anda di sini. Gunakan poin-poin untuk mempermudah pembacaan."></textarea>
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addExperience} className="btn-add-more">
          <PlusCircle size={18} />
          Tambah Pengalaman Kerja
        </button>
      </div>

      <style jsx>{`
        .form-section { margin-bottom: 2rem; }
        .form-section-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1.5rem; color: #2d3748; }
        .experience-entry {
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
        .input-group.full-width { grid-column: 1 / -1; }
        .input-group label { font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem; }
        .input-group input, .input-group textarea {
          width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0;
          border-radius: 8px; font-size: 1rem; box-sizing: border-box;
          font-family: inherit;
        }
        .input-group input:focus, .input-group textarea:focus {
          outline: none; border-color: #3182ce;
          box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
        }
        .input-group textarea { resize: vertical; }

        .btn-add-more {
          width: 100%;
          padding: 0.75rem;
          background: #f8f9fa;
          border: 1px dashed #d1d5db;
          border-radius: 8px;
          font-weight: 600;
          color: #4a5568;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .btn-add-more:hover {
          background: #f1f5f9;
          border-color: #9ca3af;
          color: #1a202c;
        }
      `}</style>
    </>
  );
}