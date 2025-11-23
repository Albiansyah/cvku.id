"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import useAuthModalStore from "../store/useAuthModalStore";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from 'next/navigation';

// SVG Icons
const GoogleIcon = () => (
  <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.057,4.844C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.651-3.356-11.303-8H6.393c3.56,8.049,11.567,14,20.607,14C23.013,44,23.507,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.99,35.917,44,30.551,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0077B5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
  </svg>
);

// Slider content
const sliderContent = [
  {
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    title: "Buat CV Profesional",
    description: "Desain CV menarik dengan template modern yang siap pakai"
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    title: "Cover Letter Sempurna",
    description: "Tulis cover letter yang menarik perhatian recruiter"
  },
  {
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
    title: "Portal Pekerjaan",
    description: "Temukan ribuan lowongan kerja yang sesuai dengan keahlian Anda"
  },
  {
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    title: "Kursus & Pelatihan",
    description: "Tingkatkan skill Anda dengan kursus berkualitas"
  }
];

// Slider Component
function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderContent.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderContent.length) % sliderContent.length);
  };

  return (
    <div className="slider-container">
      <div className="slider-content">
        {sliderContent.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="slider-nav prev" onClick={prevSlide} aria-label="Previous slide">
        <ChevronLeft size={24} />
      </button>
      <button className="slider-nav next" onClick={nextSlide} aria-label="Next slide">
        <ChevronRight size={24} />
      </button>
      
      <div className="slider-dots">
        {sliderContent.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Login Modal Component
function LoginModal() {
  const { closeModal, openModal } = useAuthModalStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // PENTING: Tutup modal PERTAMA sebelum redirect
      closeModal();
      
      // Tunggu sebentar agar modal benar-benar tertutup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id);
          
          let redirectUrl = '/dashboard';
          
          if (!profileError && profileData && profileData.length > 0) {
            const role = profileData[0].role?.toLowerCase().trim();
            
            switch (role) {
              case 'super_admin':
              case 'admin':
                redirectUrl = '/admin/dashboard';
                break;
              case 'recruiter':
                redirectUrl = '/recruiter/dashboard';
                break;
              case 'courses_manager':
                redirectUrl = '/courses-admin/dashboard';
                break;
              default:
                redirectUrl = '/dashboard';
            }
          }
          
          // Langsung redirect tanpa delay
          router.push(redirectUrl);
          
        } else {
          router.push('/dashboard');
        }
      } catch (redirectError) {
        router.push('/dashboard');
      }
      
    } catch (err) {
      setLoginError("Email atau password salah. Coba lagi.");
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoginError('');
    setLoading(true);
    try {
      const { error: socialError } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (socialError) throw socialError;
      
      closeModal();
      
    } catch (err) {
      setLoginError(`Gagal login dengan ${provider}. Coba lagi.`);
      setLoading(false);
    }
  };

  return (
    <div className="modal-right-content">
      <div className="modal-header">
        <h2 className="title">Selamat Datang Kembali</h2>
        <p className="subtitle">Masuk untuk melanjutkan perjalanan karir Anda</p>
      </div>

      <form onSubmit={handleEmailLogin} className="auth-form">
        <div className="input-group">
          <label htmlFor="login-email">Email</label>
          <input 
            type="email" 
            id="login-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@example.com" 
            required 
            disabled={loading} 
          />
        </div>
        <div className="input-group">
          <label htmlFor="login-password">Password</label>
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              id="login-password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
              disabled={loading} 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="password-toggle-icon" 
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="forgot-password-link">
          <button type="button" onClick={() => openModal('forgot-password')}>
            Lupa Password?
          </button>
        </div>
        
        {loginError && <p className="error-message">{loginError}</p>}
        
        <button type="submit" className="btn-primary-auth" disabled={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>

      <div className="separator">
        <span>atau lanjutkan dengan</span>
      </div>
      
      <div className="social-buttons-container">
        <button className="btn-social" onClick={() => handleSocialLogin('google')} disabled={loading} type="button">
          <GoogleIcon />
          <span>Google</span>
        </button>
        <button className="btn-social" onClick={() => handleSocialLogin('linkedin')} disabled={loading} type="button">
          <LinkedInIcon />
          <span>LinkedIn</span>
        </button>
      </div>

      <p className="redirect-link">
        Belum punya akun?{' '}
        <button type="button" onClick={() => openModal('register')}>
          Daftar sekarang
        </button>
      </p>
    </div>
  );
}

// Register Modal Component
function RegisterModal() {
  const { closeModal, openModal } = useAuthModalStore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    
    if (formData.password !== formData.confirmPassword) {
      setRegisterError('Password tidak cocok');
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (signUpError) throw signUpError;

      closeModal();
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/dashboard');
      
    } catch (err) {
      setRegisterError("Gagal membuat akun. Coba lagi.");
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider) => {
    setRegisterError('');
    setLoading(true);
    try {
      const { error: socialError } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (socialError) throw socialError;
      
      closeModal();
      
    } catch (err) {
      setRegisterError(`Gagal register dengan ${provider}. Coba lagi.`);
      setLoading(false);
    }
  };

  return (
    <div className="modal-right-content">
      <div className="modal-header">
        <h2 className="title">Buat Akun Baru</h2>
        <p className="subtitle">Bergabunglah dan mulai perjalanan karir Anda</p>
      </div>

      <form onSubmit={handleEmailRegister} className="auth-form">
        <div className="input-group">
          <label htmlFor="register-fullName">Nama Lengkap</label>
          <input 
            type="text" 
            id="register-fullName" 
            name="fullName"
            value={formData.fullName} 
            onChange={handleInputChange} 
            placeholder="John Doe" 
            required 
            disabled={loading} 
          />
        </div>
        <div className="input-group">
          <label htmlFor="register-email">Email</label>
          <input 
            type="email" 
            id="register-email" 
            name="email"
            value={formData.email} 
            onChange={handleInputChange} 
            placeholder="you@example.com" 
            required 
            disabled={loading} 
          />
        </div>
        <div className="input-group">
          <label htmlFor="register-password">Password</label>
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              id="register-password" 
              name="password"
              value={formData.password} 
              onChange={handleInputChange} 
              placeholder="••••••••" 
              required 
              disabled={loading}
              minLength={6}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="password-toggle-icon" 
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="register-confirmPassword">Konfirmasi Password</label>
          <div className="password-input-wrapper">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              id="register-confirmPassword" 
              name="confirmPassword"
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
              placeholder="••••••••" 
              required 
              disabled={loading}
              minLength={6}
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className="password-toggle-icon" 
              aria-label="Toggle password visibility"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        {registerError && <p className="error-message">{registerError}</p>}
        
        <button type="submit" className="btn-primary-auth" disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      <div className="separator">
        <span>atau lanjutkan dengan</span>
      </div>
      
      <div className="social-buttons-container">
        <button className="btn-social" onClick={() => handleSocialRegister('google')} disabled={loading} type="button">
          <GoogleIcon />
          <span>Google</span>
        </button>
        <button className="btn-social" onClick={() => handleSocialRegister('linkedin')} disabled={loading} type="button">
          <LinkedInIcon />
          <span>LinkedIn</span>
        </button>
      </div>

      <p className="redirect-link">
        Sudah punya akun?{' '}
        <button type="button" onClick={() => openModal('login')}>
          Login di sini
        </button>
      </p>
    </div>
  );
}

// Forgot Password Modal Component
function ForgotPasswordModal() {
  const { closeModal, openModal } = useAuthModalStore();
  const [email, setEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess('Link reset password telah dikirim ke email Anda. Silakan cek inbox Anda.');
      
    } catch (err) {
      setForgotError('Gagal mengirim email reset password. Pastikan email Anda benar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-right-content">
      <div className="modal-header">
        <h2 className="title">Lupa Password?</h2>
        <p className="subtitle">Masukkan email Anda untuk mendapatkan link reset password</p>
      </div>

      <form onSubmit={handleForgotPassword} className="auth-form">
        <div className="input-group">
          <label htmlFor="forgot-email">Email</label>
          <input 
            type="email" 
            id="forgot-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@example.com" 
            required 
            disabled={loading} 
          />
        </div>
        
        {forgotError && <p className="error-message">{forgotError}</p>}
        {success && <p className="success-message">{success}</p>}
        
        <button type="submit" className="btn-primary-auth" disabled={loading}>
          {loading ? 'Mengirim...' : 'Kirim Link Reset'}
        </button>
      </form>

      <p className="redirect-link">
        Ingat password Anda?{' '}
        <button type="button" onClick={() => openModal('login')}>
          Login di sini
        </button>
      </p>
    </div>
  );
}

// Main AuthModal Component
export default function AuthModal() {
  const { view, closeModal } = useAuthModalStore();

  if (!view) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={closeModal}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <button onClick={closeModal} className="close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
          
          <div className="modal-grid">
            <div className="modal-left">
              <ImageSlider />
            </div>
            
            <div className="modal-right">
              {view === 'login' && <LoginModal />}
              {view === 'register' && <RegisterModal />}
              {view === 'forgot-password' && <ForgotPasswordModal />}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1010;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container {
          position: relative;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 1000px;
          max-height: 90vh;
          overflow: hidden;
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #374151;
          transition: all 0.2s ease;
          z-index: 1011;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .close-btn:hover {
          background: #fff;
          transform: rotate(90deg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 600px;
        }

        .modal-left {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .slider-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .slider-content {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }

        .slide.active {
          opacity: 1;
        }

        .slide-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 3rem 2.5rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: white;
        }

        .slide-overlay h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .slide-overlay p {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          margin: 0;
          opacity: 0.95;
          line-height: 1.5;
        }

        .slider-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #374151;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .slider-nav:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.1);
        }

        .slider-nav.prev {
          left: 1.5rem;
        }

        .slider-nav.next {
          right: 1.5rem;
        }

        .slider-dots {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 10;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .dot.active {
          width: 24px;
          border-radius: 4px;
          background: #fff;
        }

        .modal-right {
          padding: 3rem 2.5rem;
          overflow-y: auto;
          max-height: 90vh;
        }

        .modal-right::-webkit-scrollbar {
          width: 6px;
        }

        .modal-right::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .modal-right::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .modal-right::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .modal-right-content {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.9375rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group label {
          font-family: 'Inter', sans-serif;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .input-group input {
          font-family: 'Inter', sans-serif;
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 0.9375rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .input-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .input-group input:disabled {
          background-color: #f9fafb;
          cursor: not-allowed;
        }

        .password-input-wrapper {
          position: relative;
          width: 100%;
        }

        .password-input-wrapper input {
          padding-right: 45px;
        }

        .password-toggle-icon {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .password-toggle-icon:hover {
          color: #374151;
        }

        .forgot-password-link {
          text-align: right;
          font-size: 0.875rem;
          margin-top: -0.5rem;
        }

        .forgot-password-link button {
          font-family: 'Inter', sans-serif;
          background: none;
          border: none;
          padding: 0;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          font-size: inherit;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .forgot-password-link button:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        .error-message {
          font-family: 'Inter', sans-serif;
          color: #ef4444;
          font-size: 0.875rem;
          text-align: left;
          margin: 0;
          padding: 0.75rem;
          background: #fef2f2;
          border-radius: 8px;
          border-left: 3px solid #ef4444;
        }

        .success-message {
          font-family: 'Inter', sans-serif;
          color: #10b981;
          font-size: 0.875rem;
          text-align: left;
          margin: 0;
          padding: 0.75rem;
          background: #f0fdf4;
          border-radius: 8px;
          border-left: 3px solid #10b981;
        }

        .btn-primary-auth {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 0.875rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          width: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-primary-auth:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
          transform: translateY(-1px);
        }

        .btn-primary-auth:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-primary-auth:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
        }

        .separator {
          display: flex;
          align-items: center;
          text-align: center;
          color: #9ca3af;
          margin: 1.5rem 0;
        }

        .separator::before,
        .separator::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e5e7eb;
        }

        .separator span {
          font-family: 'Inter', sans-serif;
          padding: 0 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .social-buttons-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .btn-social {
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #fff;
          color: #374151;
          border: 1.5px solid #e5e7eb;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-social:hover:not(:disabled) {
          background-color: #f9fafb;
          border-color: #d1d5db;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .btn-social:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
          border-color: #e5e7eb;
        }

        .social-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .redirect-link {
          font-family: 'Inter', sans-serif;
          text-align: center;
          margin-top: 1.5rem;
          color: #6b7280;
          font-size: 0.9375rem;
        }

        .redirect-link button {
          font-family: 'Inter', sans-serif;
          background: none;
          border: none;
          padding: 0;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          font-size: inherit;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .redirect-link button:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .modal-container {
            max-width: 100%;
            max-height: 100vh;
            border-radius: 0;
          }

          .modal-grid {
            grid-template-columns: 1fr;
            min-height: 100vh;
          }

          .modal-left {
            display: none;
          }

          .modal-right {
            padding: 2rem 1.5rem;
            max-height: 100vh;
          }

          .close-btn {
            top: 1rem;
            right: 1rem;
          }

          .title {
            font-size: 1.5rem;
          }

          .subtitle {
            font-size: 0.875rem;
          }

          .social-buttons-container {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .modal-right {
            padding: 1.5rem 1rem;
          }

          .modal-right-content {
            max-width: 100%;
          }

          .input-group input {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}