"use client";

import { Save } from 'lucide-react';

// Props 'onSave' adalah fungsi yang akan kita kirim dari halaman editor
// Props 'isSaving' adalah untuk menampilkan status loading
export default function EditorHeader({ onSave, isSaving }) {
  return (
    <>
      <div className="editor-header">
        <h1 className="form-panel-title">Lengkapi CV Anda</h1>
        <button onClick={onSave} className="btn-save" disabled={isSaving}>
          <Save size={16} />
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
      <style jsx>{`
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 0 2rem 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .form-panel-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }
        .btn-save {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #16a34a; /* Warna hijau untuk simpan */
          color: white;
          padding: 0.6rem 1.25rem;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-save:hover:not(:disabled) {
          background-color: #15803d;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .btn-save:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}