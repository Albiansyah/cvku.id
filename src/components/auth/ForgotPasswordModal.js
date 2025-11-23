"use client";

import { useState } from "react";
import { X } from "lucide-react";
import useAuthModalStore from '../../store/useAuthModalStore';
import { auth } from "../../lib/firebase"; // <-- Import auth dari firebase.js
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordModal() {
  const { closeModal, openModal } = useAuthModalStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fungsi untuk mengirim link reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Link reset password telah dikirim. Silakan periksa inbox (dan folder spam) email Anda.");
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError("Email tidak ditemukan. Pastikan email sudah benar.");
      } else {
        setError("Gagal mengirim email. Coba beberapa saat lagi.");
      }
      console.error("Error saat reset password:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button onClick={closeModal} className="close-btn" aria-label="Tutup modal"><X size={24} /></button>
          
          <div className="modal-header">
            <h2 className="title">Reset Password</h2>
            {!successMessage && <p className="subtitle">Masukkan email Anda untuk menerima link reset password.</p>}
          </div>

          {/* Tampilkan pesan sukses jika ada, sebaliknya tampilkan form */}
          {successMessage ? (
            <div className="success-message">
              <p>{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email terdaftar Anda" required disabled={loading} />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="btn-primary-auth" disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
              </button>
            </form>
          )}

          <p className="redirect-link">
            Ingat password Anda?{' '}
            <button type="button" onClick={() => openModal('login')}>Kembali ke Login</button>
          </p>
        </div>
      </div>
      <style jsx global>{`
        /* --- CSS DI SINI SAMA PERSIS DENGAN LoginModal.js --- */
        .modal-backdrop { z-index: 1010; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease; padding: 1rem; }
        .modal-content { background: #fff; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 100%; max-width: 420px; position: relative; animation: slideUp 0.4s ease; text-align: center; }
        .close-btn { position: absolute; top: 1rem; right: 1rem; background: #f3f4f6; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; transition: background-color 0.2s ease; }
        .close-btn:hover { background-color: #e5e7eb; }
        .modal-header { margin-bottom: 2rem; }
        .title { font-size: 1.75rem; font-weight: 700; color: #111827; margin: 0 0 0.5rem 0; }
        .subtitle { font-size: 1rem; color: #6b7280; margin: 0; }
        .auth-form { display: flex; flex-direction: column; gap: 1rem; width: 100%; margin: 0 auto; }
        .input-group { text-align: left; }
        .input-group label { font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; display: block; }
        .input-group input { width: 100%; box-sizing: border-box; padding: 0.75rem 1rem; font-size: 1rem; border: 1px solid #d1d5db; border-radius: 8px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .input-group input:focus { outline: none; border-color: #111827; box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1); }
        .redirect-link button { background: none; border: none; padding: 0; color: #111827; text-decoration: none; font-weight: 600; font-size: inherit; font-family: inherit; cursor: pointer; }
        .redirect-link button:hover { text-decoration: underline; }
        .error-message { color: #ef4444; font-size: 0.875rem; text-align: center; margin-top: -0.5rem; margin-bottom: 0.5rem; }
        .success-message { color: #16a34a; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 1rem; border-radius: 8px; text-align: center; font-weight: 500; }
        .btn-primary-auth { background: #111827; color: white; padding: 0.875rem; font-size: 1rem; font-weight: 600; border-radius: 8px; border: none; cursor: pointer; width: 100%; transition: background-color 0.2s ease; margin-top: 1rem; }
        .btn-primary-auth:hover:not(:disabled) { background: #374151; }
        .btn-primary-auth:disabled { background-color: #d1d5db; cursor: not-allowed; }
        .redirect-link { text-align: center; margin-top: 1.5rem; color: #6b7280; font-size: 0.9375rem; }
        @media (max-width: 480px) { .modal-content { padding: 2rem 1.5rem; } .title { font-size: 1.5rem; } .subtitle { font-size: 0.9rem; } }
      `}</style>
    </>
  );
}