// "use client";

// import { useState } from "react";
// import { useRouter } from 'next/navigation';
// import { X, Eye, EyeOff } from "lucide-react";
// import useAuthModalStore from '../../store/useAuthModalStore';
// import { useAuth } from "../../hooks/useAuth";

// // SVG Ikon untuk Google & LinkedIn
// const GoogleIcon = () => (
//   <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
//     <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
//     <path fill="#FF3D00" d="M6.306,14.691l6.057,4.844C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
//     <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.651-3.356-11.303-8H6.393c3.56,8.049,11.567,14,20.607,14C23.013,44,23.507,44,24,44z"/>
//     <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.99,35.917,44,30.551,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
//   </svg>
// );

// const LinkedInIcon = () => (
//   <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0077B5">
//     <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
//   </svg>
// );

// export default function LoginModal() {
//   const { closeModal, openModal } = useAuthModalStore();
//   const { signIn, signInWithOAuth, profile } = useAuth();
//   const router = useRouter();
  
//   // Form states
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Function to handle role-based navigation
//   const handleRoleBasedRedirect = (userProfile) => {
//     console.log('Handling redirect for profile:', userProfile);
    
//     if (!userProfile?.role) {
//       console.log('No role found, redirecting to default dashboard');
//       router.push('/dashboard');
//       return;
//     }

//     const userRole = userProfile.role;
//     console.log('User role detected:', userRole);

//     switch (userRole) {
//       case 'super_admin':
//         console.log('Redirecting to super admin dashboard');
//         router.push('/admin/dashboard');
//         break;
//       case 'admin':
//         console.log('Redirecting to admin dashboard');
//         router.push('/admin/dashboard');
//         break;
//       case 'recruiter':
//         console.log('Redirecting to recruiter dashboard');
//         router.push('/recruiter/dashboard');
//         break;
//       case 'courses_manager':
//         console.log('Redirecting to courses admin dashboard');
//         router.push('/courses-admin/dashboard');
//         break;
//       default: // untuk 'user' dan role lainnya
//         console.log('Redirecting to default user dashboard for role:', userRole);
//         router.push('/dashboard');
//         break;
//     }
//   };

//   // Reset form when modal opens
//   const resetForm = () => {
//     setEmail('');
//     setPassword('');
//     setShowPassword(false);
//     setError('');
//     setLoading(false);
//   };

//   const handleCloseModal = () => {
//     resetForm();
//     closeModal();
//   };

//   const handleEmailLogin = async (e) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!email.trim() || !password.trim()) {
//       setError('Email dan password harus diisi');
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setError('Format email tidak valid');
//       return;
//     }

//     setError('');
//     setLoading(true);

//     try {
//       console.log('Attempting login with:', email);
//       const { error: signInError, data, profile: userProfile } = await signIn(email.trim(), password);

//       if (signInError) {
//         console.error('Login error:', signInError);
        
//         // Handle specific error messages
//         if (signInError.message.includes('Invalid login credentials')) {
//           setError('Email atau password salah. Silakan coba lagi.');
//         } else if (signInError.message.includes('Email not confirmed')) {
//           setError('Silakan konfirmasi email Anda terlebih dahulu.');
//         } else if (signInError.message.includes('Too many requests')) {
//           setError('Terlalu banyak percobaan login. Coba lagi dalam beberapa menit.');
//         } else {
//           setError('Terjadi kesalahan saat login. Silakan coba lagi.');
//         }
//         return;
//       }

//       console.log("Login berhasil!", data);
//       console.log("User profile from login:", userProfile);
      
//       // Close modal and reset form first
//       resetForm();
//       closeModal();
      
//       // Redirect based on role from the login response
//       // If userProfile from login response exists, use it; otherwise use current profile from hook
//       const profileToUse = userProfile || profile;
//       console.log("Profile to use for redirect:", profileToUse);
      
//       // Small delay to ensure modal closes before redirect
//       setTimeout(() => {
//         handleRoleBasedRedirect(profileToUse);
//       }, 100);
      
//     } catch (err) {
//       console.error("Unexpected error during login:", err);
//       setError('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSocialLogin = async (provider) => {
//     setError('');
//     setLoading(true);
    
//     try {
//       console.log(`Attempting ${provider} login`);
//       const { error: socialError, data } = await signInWithOAuth(provider);
      
//       if (socialError) {
//         console.error(`${provider} login error:`, socialError);
//         setError(`Gagal login dengan ${provider === 'google' ? 'Google' : 'LinkedIn'}. Silakan coba lagi.`);
//         setLoading(false);
//         return;
//       }

//       console.log(`${provider} login initiated`);
      
//       // For OAuth, close modal since redirect will be handled by OAuth flow
//       resetForm();
//       closeModal();
      
//       // OAuth will redirect to callback page which should handle role-based routing
      
//     } catch (err) {
//       console.error(`Unexpected error during ${provider} login:`, err);
//       setError(`Terjadi kesalahan saat login dengan ${provider === 'google' ? 'Google' : 'LinkedIn'}.`);
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Escape') {
//       handleCloseModal();
//     }
//   };

//   return (
//     <>
//       <div 
//         className="modal-backdrop" 
//         onClick={handleCloseModal}
//         onKeyDown={handleKeyDown}
//         tabIndex={-1}
//       >
//         <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//           <button 
//             onClick={handleCloseModal} 
//             className="close-btn" 
//             aria-label="Tutup modal"
//             disabled={loading}
//           >
//             <X size={24} />
//           </button>
          
//           <div className="modal-header">
//             <h2 className="title">Selamat Datang Kembali</h2>
//             <p className="subtitle">Login untuk melanjutkan ke dashboard Anda.</p>
//           </div>

//           <form onSubmit={handleEmailLogin} className="auth-form" noValidate>
//             <div className="input-group">
//               <label htmlFor="login-email">Email</label>
//               <input 
//                 type="email" 
//                 id="login-email" 
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
//                 placeholder="contoh@email.com" 
//                 required 
//                 disabled={loading}
//                 autoComplete="email"
//                 aria-describedby={error ? "login-error" : undefined}
//               />
//             </div>
            
//             <div className="input-group">
//               <label htmlFor="login-password">Password</label>
//               <div className="password-input-wrapper">
//                 <input 
//                   type={showPassword ? "text" : "password"} 
//                   id="login-password" 
//                   value={password} 
//                   onChange={(e) => setPassword(e.target.value)} 
//                   placeholder="••••••••" 
//                   required 
//                   disabled={loading}
//                   autoComplete="current-password"
//                   aria-describedby={error ? "login-error" : undefined}
//                 />
//                 <button 
//                   type="button" 
//                   onClick={() => setShowPassword(!showPassword)} 
//                   className="password-toggle-icon" 
//                   aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
//                   disabled={loading}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               <div className="forgot-password-link">
//                 <button 
//                   type="button" 
//                   onClick={() => openModal('forgot-password')}
//                   disabled={loading}
//                 >
//                   Lupa Password?
//                 </button>
//               </div>
//             </div>
            
//             {error && (
//               <p className="error-message" id="login-error" role="alert">
//                 {error}
//               </p>
//             )}
            
//             <button 
//               type="submit" 
//               className="btn-primary-auth" 
//               disabled={loading || !email.trim() || !password.trim()}
//             >
//               {loading ? 'Memproses...' : 'Login'}
//             </button>
//           </form>

//           <div className="separator">
//             <span>ATAU</span>
//           </div>
          
//           <div className="social-buttons-container">
//             <button 
//               className="btn-social" 
//               onClick={() => handleSocialLogin('google')} 
//               disabled={loading}
//               type="button"
//             >
//               <GoogleIcon />
//               <span>Lanjutkan dengan Google</span>
//             </button>
//             <button 
//               className="btn-social" 
//               onClick={() => handleSocialLogin('linkedin_oidc')} 
//               disabled={loading}
//               type="button"
//             >
//               <LinkedInIcon />
//               <span>Lanjutkan dengan LinkedIn</span>
//             </button>
//           </div>

//           <p className="redirect-link">
//             Belum punya akun?{' '}
//             <button 
//               type="button" 
//               onClick={() => openModal('register')}
//               disabled={loading}
//             >
//               Daftar di sini
//             </button>
//           </p>
//         </div>
//       </div>

//       <style jsx global>{`
//         .modal-backdrop {
//           position: fixed; top: 0; left: 0; right: 0; bottom: 0;
//           background: rgba(0, 0, 0, 0.5);
//           backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
//           z-index: 1010; display: flex; align-items: center; justify-content: center;
//           padding: 1rem; animation: fadeIn 0.3s ease;
//         }
//         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

//         .modal-content {
//           position: relative; background: #fff;
//           padding: 2.5rem; border-radius: 16px;
//           box-shadow: 0 10px 30px rgba(0,0,0,0.1);
//           width: 100%; max-width: 420px;
//           animation: slideUp 0.4s ease;
//         }
//         @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
//         .close-btn {
//           position: absolute; top: 1rem; right: 1rem;
//           background: #f3f4f6; border: none; border-radius: 50%;
//           width: 36px; height: 36px;
//           display: flex; align-items: center; justify-content: center;
//           cursor: pointer; color: #6b7280;
//           transition: background-color 0.2s ease;
//         }
//         .close-btn:hover:not(:disabled) { background-color: #e5e7eb; }
//         .close-btn:disabled { opacity: 0.6; cursor: not-allowed; }

//         .modal-header { text-align: center; margin-bottom: 2rem; }
//         .title { font-size: 1.75rem; font-weight: 700; color: #111827; margin: 0 0 0.5rem 0; }
//         .subtitle { font-size: 1rem; color: #6b7280; margin: 0; }

//         .auth-form { display: flex; flex-direction: column; gap: 0.5rem; }
//         .input-group { display: flex; flex-direction: column; }
//         .input-group label { 
//           text-align: left; font-size: 0.875rem; font-weight: 500; 
//           color: #374151; margin-bottom: 0.5rem; 
//         }
//         .input-group input {
//           width: 100%; padding: 0.75rem 1rem; font-size: 1rem;
//           border: 1px solid #d1d5db; border-radius: 8px;
//           transition: border-color 0.2s ease, box-shadow 0.2s ease;
//           box-sizing: border-box;
//         }
//         .input-group input:focus {
//           outline: none; border-color: #111827;
//           box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
//         }
//         .input-group input:disabled {
//           background-color: #f9fafb; color: #6b7280; cursor: not-allowed;
//         }

//         .password-input-wrapper { position: relative; width: 100%; }
//         .password-input-wrapper input { padding-right: 48px; }
//         .password-toggle-icon {
//           position: absolute; top: 50%; right: 12px;
//           transform: translateY(-50%); background: none; border: none;
//           cursor: pointer; padding: 4px; color: #9ca3af;
//           border-radius: 4px; transition: all 0.2s ease;
//         }
//         .password-toggle-icon:hover:not(:disabled) { 
//           color: #374151; background-color: #f3f4f6; 
//         }
//         .password-toggle-icon:disabled { 
//           opacity: 0.5; cursor: not-allowed; 
//         }
        
//         .forgot-password-link { 
//           text-align: right; font-size: 0.875rem; margin-top: 0.5rem; 
//         }
//         .forgot-password-link button, .redirect-link button {
//           background: none; border: none; padding: 0;
//           color: #111827; text-decoration: none; font-weight: 600;
//           font-size: inherit; font-family: inherit; cursor: pointer;
//           transition: all 0.2s ease;
//         }
//         .forgot-password-link button:hover:not(:disabled), 
//         .redirect-link button:hover:not(:disabled) { 
//           text-decoration: underline; color: #374151; 
//         }
//         .forgot-password-link button:disabled, 
//         .redirect-link button:disabled {
//           opacity: 0.5; cursor: not-allowed;
//         }
        
//         .error-message { 
//           color: #ef4444; font-size: 0.875rem; text-align: center; 
//           margin: 0.5rem 0; padding: 0.5rem; background-color: #fef2f2; 
//           border-radius: 6px; border: 1px solid #fecaca;
//         }

//         .btn-primary-auth {
//           background: #111827; color: white; margin-top: 1rem;
//           padding: 0.875rem; font-size: 1rem; font-weight: 600;
//           border-radius: 8px; border: none; cursor: pointer; width: 100%;
//           transition: all 0.2s ease;
//         }
//         .btn-primary-auth:hover:not(:disabled) { 
//           background: #374151; transform: translateY(-1px); 
//         }
//         .btn-primary-auth:disabled { 
//           background: #9ca3af; cursor: not-allowed; transform: none;
//         }

//         .separator {
//           display: flex; align-items: center; text-align: center;
//           color: #9ca3af; margin: 1.5rem 0;
//         }
//         .separator::before, .separator::after { 
//           content: ''; flex: 1; border-bottom: 1px solid #e5e7eb; 
//         }
//         .separator span { 
//           padding: 0 1rem; font-size: 0.75rem; font-weight: 600; 
//         }

//         .social-buttons-container {
//           display: flex; flex-direction: column; gap: 0.75rem;
//         }

//         .btn-social {
//           display: flex; align-items: center; justify-content: center; gap: 0.75rem;
//           background: #fff; color: #374151; border: 1px solid #d1d5db;
//           width: 100%; padding: 0.75rem; font-size: 0.9375rem; font-weight: 600;
//           border-radius: 8px; cursor: pointer;
//           transition: all 0.2s ease;
//         }
//         .btn-social:hover:not(:disabled) { 
//           background-color: #f9fafb; border-color: #9ca3af;
//           transform: translateY(-1px);
//         }
//         .btn-social:disabled { 
//           background-color: #f3f4f6; color: #9ca3af; cursor: not-allowed;
//           transform: none;
//         }
//         .social-icon { width: 24px; height: 24px; flex-shrink: 0; }
        
//         .redirect-link { 
//           text-align: center; margin-top: 1.5rem; color: #6b7280; 
//           font-size: 0.9375rem; 
//         }

//         @media (max-width: 480px) {
//           .modal-content { padding: 2rem 1.5rem; }
//           .title { font-size: 1.5rem; }
//           .subtitle { font-size: 0.9rem; }
//         }

//         /* Loading state styles */
//         .modal-content.loading {
//           pointer-events: none;
//         }
        
//         .loading .input-group input,
//         .loading .btn-primary-auth,
//         .loading .btn-social {
//           opacity: 0.7;
//         }
//       `}</style>
//     </>
//   );
// }
