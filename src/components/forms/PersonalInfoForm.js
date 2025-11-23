// src/components/forms/PersonalInfoForm.js
"use client";

import useCvStore from '../../store/useCvStore';
// Tidak perlu 'shallow'

export default function PersonalInfoForm() {
  // --- PERBAIKAN: Ambil state dan action secara terpisah ---
  const personal = useCvStore((state) => state.cv.personal);
  const updatePersonalInfo = useCvStore((state) => state.updatePersonalInfo);

  // Jika state 'personal' belum ada, render null untuk mencegah error
  if (!personal) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    updatePersonalInfo(name, value);
  };

  return (
    <>
      <div className="form-section">
        <h3 className="form-section-title">Informasi Pribadi</h3>
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input type="text" id="name" name="name" value={personal.name} onChange={handleChange} placeholder="Contoh: Budi Santoso" />
          </div>
          <div className="input-group">
            <label htmlFor="jobTitle">Jabatan</label>
            <input type="text" id="jobTitle" name="jobTitle" value={personal.jobTitle} onChange={handleChange} placeholder="Contoh: Software Engineer" />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={personal.email} onChange={handleChange} placeholder="budi.santoso@email.com" />
          </div>
          <div className="input-group">
            <label htmlFor="phone">Telepon</label>
            <input type="tel" id="phone" name="phone" value={personal.phone} onChange={handleChange} placeholder="08123456789" />
          </div>
          <div className="input-group full-width">
            <label htmlFor="address">Alamat</label>
            <input type="text" id="address" name="address" value={personal.address} onChange={handleChange} placeholder="Jakarta, Indonesia" />
          </div>
          <div className="input-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input type="text" id="linkedin" name="linkedin" value={personal.linkedin} onChange={handleChange} placeholder="linkedin.com/in/username" />
          </div>
          <div className="input-group">
            <label htmlFor="website">Website / Portofolio</label>
            <input type="text" id="website" name="website" value={personal.website} onChange={handleChange} placeholder="nama-website.com" />
          </div>
        </div>
      </div>
      <style jsx>{`
        .form-section { margin-bottom: 2rem; }
        .form-section-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 1.5rem; color: #2d3748; }
        .form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 768px) { .form-grid { grid-template-columns: 1fr 1fr; } }
        .input-group { display: flex; flex-direction: column; }
        .input-group.full-width { grid-column: 1 / -1; }
        .input-group label { font-size: 0.875rem; font-weight: 500; color: #4a5568; margin-bottom: 0.5rem; }
        .input-group input { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; box-sizing: border-box; }
        .input-group input:focus { outline: none; border-color: #3182ce; box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2); }
      `}</style>
    </>
  );
}