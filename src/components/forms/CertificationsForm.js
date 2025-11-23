// src/components/forms/CertificationsForm.js
"use client";

import useCvStore from '../../store/useCvStore';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function CertificationsForm() {
  // Ambil state dan action dengan pola anti-gagal
  const certifications = useCvStore((state) => state.cv.certifications);
  const addCertification = useCvStore((state) => state.addCertification);
  const removeCertification = useCvStore((state) => state.removeCertification);
  const updateCertification = useCvStore((state) => state.updateCertification);

  if (!certifications) return null;

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    updateCertification(index, name, value);
  };
  
  return (
    <>
      <div className="form-section">
        <h3 className="form-section-title">Sertifikasi & Lisensi</h3>
        
        {certifications.map((cert, index) => (
          <div key={cert.id} className="form-entry">
            <div className="entry-header">
              <h4>{cert.name || `Sertifikasi #${index + 1}`}</h4>
              <button type="button" onClick={() => removeCertification(index)} className="btn-delete" aria-label="Hapus sertifikasi">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="form-grid">
              <div className="input-group full-width">
                <label htmlFor={`cert-name-${cert.id}`}>Nama Sertifikasi</label>
                <input type="text" id={`cert-name-${cert.id}`} name="name" value={cert.name} onChange={(e) => handleChange(index, e)} placeholder="Contoh: AWS Certified Cloud Practitioner" />
              </div>
              <div className="input-group">
                <label htmlFor={`cert-issuer-${cert.id}`}>Lembaga Penerbit</label>
                <input type="text" id={`cert-issuer-${cert.id}`} name="issuer" value={cert.issuer} onChange={(e) => handleChange(index, e)} placeholder="Contoh: Amazon Web Services" />
              </div>
              <div className="input-group">
                <label htmlFor={`cert-date-${cert.id}`}>Tanggal Diterbitkan</label>
                <input type="text" id={`cert-date-${cert.id}`} name="date" value={cert.date} onChange={(e) => handleChange(index, e)} placeholder="Contoh: 2023" />
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addCertification} className="btn-add-more">
          <PlusCircle size={18} />
          Tambah Sertifikasi
        </button>
      </div>

      <style jsx>{`
        /* CSS ini menggunakan class yang sama dengan form sebelumnya untuk konsistensi */
        .form-section { margin-bottom: 2rem; }
        .form-section-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1.5rem; color: #2d3748; }
        .form-entry { padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 1.5rem; }
        .entry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .entry-header h4 { margin: 0; font-size: 1.1rem; color: #374151; }
        .btn-delete { background: none; border: none; color: #ef4444; cursor: pointer; padding: 0.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s; }
        .btn-delete:hover { background-color: #fee2e2; }
        .form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 768px) { .form-grid { grid-template-columns: 1fr 1fr; } }
        .input-group { display: flex; flex-direction: column; }
        .input-group.full-width { grid-column: 1 / -1; }
        .input-group label { font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem; }
        .input-group input { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; box-sizing: border-box; font-family: inherit; }
        .input-group input:focus { outline: none; border-color: #3182ce; box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2); }
        .btn-add-more { width: 100%; padding: 0.75rem; background: #f8f9fa; border: 1px dashed #d1d5db; border-radius: 8px; font-weight: 600; color: #4a5568; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; }
        .btn-add-more:hover { background: #f1f5f9; border-color: #9ca3af; color: #1a202c; }
      `}</style>
    </>
  );
}
