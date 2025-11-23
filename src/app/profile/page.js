"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Lock, BadgeCheck, ShieldCheck, AlertTriangle, Crown, ArrowLeft, Phone, Home, Globe, Briefcase, Edit2, Eye, EyeOff } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          toast.error('Gagal memuat profil: ' + error.message);
        } else if (profileData) {
          setProfile(profileData);
          setFullName(profileData.full_name || '');
          setPhoneNumber(profileData.phone_number || '');
          setAddress(profileData.address || '');
          setBio(profileData.bio || '');
          setPortfolioUrl(profileData.portfolio_url || '');
          setLinkedinUrl(profileData.linkedin_url || '');
          setAvatarUrl(profileData.avatar_url || '');
          setAvatarPreview(profileData.avatar_url || null);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    };
    fetchUserAndProfile();
  }, [router]);

  const validateForm = () => {
    const newErrors = {};
    if (portfolioUrl && !isValidUrl(portfolioUrl)) newErrors.portfolioUrl = 'URL portfolio tidak valid.';
    if (linkedinUrl && !isValidUrl(linkedinUrl)) newErrors.linkedinUrl = 'URL LinkedIn tidak valid.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const showNotification = (message, type = 'success') => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoadingProfile(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          address: address,
          bio: bio,
          portfolio_url: portfolioUrl,
          linkedin_url: linkedinUrl,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        throw error.code === 'ABORT_ERR' ? new Error('Waktu koneksi habis, coba lagi.') : error;
      }

      showNotification('Profil berhasil diperbarui!', 'success');
      setAvatarPreview(avatarUrl);
    } catch (error) {
      showNotification(
        error.message === 'Waktu koneksi habis, coba lagi.' 
          ? error.message 
          : 'Gagal memperbarui profil: ' + (error.message || 'Terjadi kesalahan tidak diketahui'),
        'error'
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification('Password baru tidak cocok.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showNotification('Password minimal harus 6 karakter.', 'error');
      return;
    }
    setLoadingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showNotification('Password berhasil diubah!', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      showNotification('Gagal mengubah password: ' + error.message, 'error');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Ukuran file maksimum 5MB.', 'error');
        return;
      }
      setAvatarPreview(URL.createObjectURL(file));
      handlePhotoUpload(e);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingProfile(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { signal: controller.signal });

      clearTimeout(timeoutId);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);
      showNotification('Foto profil berhasil diunggah!', 'success');
    } catch (error) {
      showNotification(
        error.code === 'ABORT_ERR' 
          ? 'Waktu unggah foto habis, coba lagi.' 
          : 'Gagal mengunggah foto: ' + (error.message || 'Terjadi kesalahan tidak diketahui'),
        'error'
      );
      setAvatarPreview(avatarUrl);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleteModalOpen(false);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      showNotification('Akun telah dihapus. Anda akan diarahkan ke halaman login.', 'info');
      router.push('/login');
    } catch (error) {
      showNotification('Gagal menghapus akun: ' + error.message, 'error');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading || !user || !profile) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const getTierBadge = (plan) => {
    if (plan.toLowerCase().includes('premium')) {
      return <span className="tier-badge premium">Premium {plan.split(' ').pop()}</span>;
    } else if (plan.toLowerCase().includes('pro')) {
      return <span className="tier-badge pro">Pro</span>;
    } else {
      return <span className="tier-badge free">Gratis</span>;
    }
  };

  return (
    <>
      <div className="profile-page-container">
        <button className="btn-back" onClick={handleBack}>
          <ArrowLeft size={20} /> Kembali
        </button>

        <header className="profile-header">
          <h1>Pengaturan Akun</h1>
          <p>Kelola informasi profil, keamanan, dan status akun Anda.</p>
        </header>

        <div className="profile-grid">
          {/* LEFT COLUMN - Status Card */}
          <aside className="sidebar">
            <div className="card status-card">
              <h2 className="card-title"><BadgeCheck size={20} /> Status Akun</h2>
              <div className="user-info">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="avatar" />
                ) : (
                  <div className="avatar-placeholder"><User size={40} /></div>
                )}
                <div className="user-details">
                  <p className="user-name">{fullName || 'Pengguna'}</p>
                  <p className="user-email">{user.email}</p>
                  <p className="user-role"><ShieldCheck size={14} /> {profile.role || 'User'}</p>
                </div>
              </div>

              <div className="tier-info">
                <p>Paket Aktif</p>
                {getTierBadge(profile.active_plan || 'Gratis')}
              </div>

              {profile.plan_expires && (
                <p className="plan-expires">
                  Berlaku hingga: {new Date(profile.plan_expires).toLocaleDateString('id-ID')}
                </p>
              )}

              <button className="btn-upgrade" onClick={() => router.push('/pricing')}>
                <Crown size={18} /> Upgrade Paket
              </button>
            </div>
          </aside>

          {/* RIGHT COLUMN - Forms */}
          <main className="main-content">
            {/* Informasi Pribadi */}
            <div className="card">
              <h2 className="card-title"><User size={20} /> Informasi Pribadi</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={user.email} disabled />
                    <small>Email tidak dapat diubah.</small>
                  </div>

                  <div className="input-group">
                    <label htmlFor="fullName"><Edit2 size={14} /> Nama Lengkap</label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama Lengkap Anda"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="phoneNumber"><Phone size={14} /> Nomor Telepon</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Nomor Telepon Anda"
                    />
                  </div>

                  <div className="input-group full-width">
                    <label htmlFor="address"><Home size={14} /> Alamat</label>
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Alamat Anda"
                    />
                  </div>

                  <div className="input-group full-width">
                    <label htmlFor="bio"><Edit2 size={14} /> Bio</label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Deskripsi singkat tentang Anda"
                      rows={3}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="portfolioUrl"><Briefcase size={14} /> Portfolio URL</label>
                    <input
                      type="url"
                      id="portfolioUrl"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://portfolio.example.com"
                    />
                    {errors.portfolioUrl && <small className="error">{errors.portfolioUrl}</small>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="linkedinUrl"><Globe size={14} /> LinkedIn URL</label>
                    <input
                      type="url"
                      id="linkedinUrl"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                    {errors.linkedinUrl && <small className="error">{errors.linkedinUrl}</small>}
                  </div>

                  <div className="input-group full-width">
                    <label htmlFor="photo">Foto Profil</label>
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={loadingProfile}
                    />
                    <small>Ukuran maksimum 5MB, format JPG/PNG.</small>
                  </div>
                </div>

                <button type="submit" className="btn-save" disabled={loadingProfile}>
                  {loadingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            </div>

            {/* Keamanan */}
            <div className="card">
              <h2 className="card-title"><ShieldCheck size={20} /> Keamanan</h2>
              <form onSubmit={handleUpdatePassword}>
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="newPassword"><Lock size={14} /> Password Baru</label>
                    <div className="password-wrapper">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="toggle-password">
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="confirmPassword">Konfirmasi Password</label>
                    <div className="password-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password baru"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-password">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-save" disabled={loadingPassword}>
                  {loadingPassword ? 'Menyimpan...' : 'Ubah Password'}
                </button>
              </form>
            </div>

            {/* Zona Berbahaya */}
            <div className="card danger-zone">
              <h2 className="card-title"><AlertTriangle size={20} /> Zona Berbahaya</h2>
              <p>Aksi di bawah ini bersifat permanen dan tidak dapat dibatalkan.</p>
              <button onClick={() => setIsDeleteModalOpen(true)} className="btn-danger">
                Hapus Akun Saya
              </button>
            </div>
          </main>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={48} className="modal-icon" />
            <h3>Konfirmasi Hapus Akun</h3>
            <p>Apakah Anda benar-benar yakin ingin menghapus akun Anda? Aksi ini tidak dapat dibatalkan.</p>
            <div className="modal-buttons">
              <button onClick={() => setIsDeleteModalOpen(false)} className="btn-cancel">Batal</button>
              <button onClick={handleDeleteAccount} className="btn-confirm-danger">Hapus Akun</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .profile-page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
          padding: 100px 1.5rem 3rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .btn-back {
          position: fixed;
          top: 90px;
          left: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: white;
          color: #1a202c;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          font-weight: 500;
          z-index: 100;
        }
        .btn-back:hover {
          background: #f7fafc;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .profile-header {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeIn 0.6s ease;
        }
        .profile-header h1 {
          font-size: 2.5rem;
          color: #1a202c;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }
        .profile-header p {
          font-size: 1.125rem;
          color: #718096;
          max-width: 600px;
          margin: 0 auto;
        }

        .profile-grid {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .profile-grid {
            grid-template-columns: 380px 1fr;
            gap: 2.5rem;
          }
        }

        .sidebar {
          display: flex;
          flex-direction: column;
        }

        .main-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s, box-shadow 0.2s;
          animation: slideUp 0.6s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.375rem;
          color: #1a202c;
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
          font-weight: 600;
        }

        /* STATUS CARD */
        .status-card {
          position: sticky;
          top: 90px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .avatar,
        .avatar-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-bottom: 1rem;
        }

        .avatar {
          object-fit: cover;
          border: 3px solid #e2e8f0;
          transition: border-color 0.3s;
        }
        .avatar:hover {
          border-color: #cbd5e0;
        }

        .avatar-placeholder {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-details {
          width: 100%;
        }

        .user-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .user-email {
          font-size: 0.9375rem;
          color: #718096;
          margin-bottom: 0.5rem;
          word-break: break-all;
        }

        .user-role {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          color: #4a5568;
          background: #f7fafc;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-weight: 500;
        }

        .tier-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f7fafc;
          padding: 1.25rem;
          border-radius: 12px;
          margin-bottom: 1rem;
        }
        .tier-info p {
          font-weight: 600;
          color: #4a5568;
          font-size: 0.9375rem;
        }

        .tier-badge {
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .tier-badge.free {
          background: #e2e8f0;
          color: #4a5568;
        }
        .tier-badge.premium {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
        }
        .tier-badge.pro {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
          color: white;
        }

        .plan-expires {
          font-size: 0.875rem;
          color: #718096;
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .btn-upgrade {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-upgrade:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        /* FORMS */
        form {
          display: flex;
          flex-direction: column;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .form-grid .full-width {
            grid-column: 1 / -1;
          }
        }

        .input-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.625rem;
          font-size: 0.9375rem;
        }

        .input-group input,
        .input-group textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #cbd5e0;
          font-size: 0.9375rem;
          transition: all 0.2s;
          font-family: inherit;
        }
        .input-group textarea {
          resize: vertical;
          min-height: 80px;
        }
        .input-group input:focus,
        .input-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .input-group input:disabled {
          background: #f7fafc;
          cursor: not-allowed;
          color: #a0aec0;
        }

        .input-group small {
          display: block;
          font-size: 0.8125rem;
          color: #a0aec0;
          margin-top: 0.375rem;
        }
        .input-group .error {
          color: #e53e3e;
        }

        .password-wrapper {
          position: relative;
        }
        .password-wrapper input {
          padding-right: 3rem;
        }
        .toggle-password {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #a0aec0;
          transition: color 0.2s;
          padding: 0.25rem;
        }
        .toggle-password:hover {
          color: #4a5568;
        }

        .btn-save {
          align-self: flex-end;
          padding: 0.875rem 2rem;
          background: #1a202c;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-save:hover:not(:disabled) {
          background: #2d3748;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(26, 32, 44, 0.3);
        }
        .btn-save:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
          transform: none;
        }

        /* DANGER ZONE */
        .danger-zone {
          border: 2px solid #feb2b2;
          background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
        }
        .danger-zone .card-title {
          color: #c53030;
          border-bottom-color: #feb2b2;
        }
        .danger-zone p {
          color: #742a2a;
          margin-bottom: 1.5rem;
          font-size: 0.9375rem;
        }

        .btn-danger {
          padding: 0.875rem 2rem;
          background: #e53e3e;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-danger:hover {
          background: #c53030;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
        }

        /* LOADING */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
        }
        .spinner {
          border: 4px solid #e2e8f0;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 450px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        .modal-icon {
          color: #f59e0b;
          margin-bottom: 1.5rem;
        }

        .modal-content h3 {
          font-size: 1.75rem;
          color: #c53030;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .modal-content p {
          color: #4a5568;
          font-size: 1rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .modal-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn-cancel,
        .btn-confirm-danger {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-cancel {
          background: #e2e8f0;
          color: #4a5568;
        }
        .btn-cancel:hover {
          background: #cbd5e0;
          transform: translateY(-2px);
        }

        .btn-confirm-danger {
          background: #e53e3e;
          color: white;
        }
        .btn-confirm-danger:hover {
          background: #c53030;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
        }

        /* RESPONSIVE */
        @media (max-width: 1023px) {
          .profile-page-container {
            padding: 90px 1rem 2rem;
          }

          .btn-back {
            position: static;
            margin-bottom: 1.5rem;
            width: fit-content;
          }

          .profile-header h1 {
            font-size: 2rem;
          }

          .profile-header p {
            font-size: 1rem;
          }

          .status-card {
            position: static;
          }

          .card {
            padding: 1.5rem;
          }

          .card-title {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 767px) {
          .profile-header h1 {
            font-size: 1.75rem;
          }

          .user-name {
            font-size: 1.25rem;
          }

          .avatar,
          .avatar-placeholder {
            width: 80px;
            height: 80px;
          }

          .btn-upgrade {
            font-size: 0.9375rem;
            padding: 0.75rem;
          }

          .modal-content {
            padding: 2rem 1.5rem;
          }

          .modal-content h3 {
            font-size: 1.5rem;
          }

          .modal-buttons {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .profile-page-container {
            padding: 80px 0.75rem 1.5rem;
          }

          .card {
            padding: 1.25rem;
            border-radius: 12px;
          }

          .profile-header h1 {
            font-size: 1.5rem;
          }

          .profile-header p {
            font-size: 0.9375rem;
          }

          .btn-back {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </>
  );
}