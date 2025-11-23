// src/components/forms/OrganizationForm.js
"use client";

import useCvStore from '../../store/useCvStore';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function OrganizationForm() {
  // Ambil state dan action dengan pola anti-gagal
  const organizations = useCvStore((state) => state.cv.organizations);
  const addOrganization = useCvStore((state) => state.addOrganization);
  const removeOrganization = useCvStore((state) => state.removeOrganization);
  const updateOrganization = useCvStore((state) => state.updateOrganization);

  if (!organizations) return null;

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    updateOrganization(index, name, value);
  };
  
  return (
    <>
      <div className="form-section">
        <h3 className="form-section-title">Organisasi / Relawan</h3>
        
        {organizations.map((org, index) => (
          <div key={org.id} className="form-entry">
            <div className="entry-header">
              <h4>{org.name || `Pengalaman #${index + 1}`}</h4>
              <button type="button" onClick={() => removeOrganization(index)} className="btn-delete" aria-label="Hapus pengalaman">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor={`org-name-${org.id}`}>Nama Organisasi</label>
                <input type="text" id={`org-name-${org.id}`} name="name" value={org.name} onChange={(e) => handleChange(index, e)} placeholder="Contoh: Google Developer Group" />
              </div>
              <div className="input-group">
                <label htmlFor={`org-position-${org.id}`}>Posisi / Peran</label>
                <input type="text" id={`org-position-${org.id}`} name="position" value={org.position} onChange={(e) => handleChange(index, e)} placeholder="Contoh: Anggota Divisi Mobile" />
              </div>
              <div className="input-group">
                <label htmlFor={`org-startDate-${org.id}`}>Tanggal Mulai</label>
                <input type="text" id={`org-startDate-${org.id}`} name="startDate" value={org.startDate} onChange={(e) => handleChange(index, e)} placeholder="Contoh: Jan 2022" />
              </div>
              <div className="input-group">
                <label htmlFor={`org-endDate-${org.id}`}>Tanggal Selesai</label>
                <input type="text" id={`org-endDate-${org.id}`} name="endDate" value={org.endDate} onChange={(e) => handleChange(index, e)} placeholder="Contoh: Des 2023" />
              </div>
              <div className="input-group full-width">
                <label htmlFor={`org-description-${org.id}`}>Deskripsi</label>
                <textarea id={`org-description-${org.id}`} name="description" value={org.description} onChange={(e) => handleChange(index, e)} rows="3" placeholder="Jelaskan peran dan kontribusi Anda."></textarea>
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addOrganization} className="btn-add-more">
          <PlusCircle size={18} />
          Tambah Pengalaman
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
        .input-group input, .input-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; box-sizing: border-box; font-family: inherit; }
        .input-group textarea { resize: vertical; }
        .input-group input:focus, .input-group textarea:focus { outline: none; border-color: #3182ce; box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2); }
        .btn-add-more { width: 100%; padding: 0.75rem; background: #f8f9fa; border: 1px dashed #d1d5db; border-radius: 8px; font-weight: 600; color: #4a5568; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; }
        .btn-add-more:hover { background: #f1f5f9; border-color: #9ca3af; color: #1a202c; }
      `}</style>
    </>
  );
}
