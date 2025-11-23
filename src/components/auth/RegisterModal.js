// "use client";

// import { useState } from "react";
// import { X, Eye, EyeOff, CheckCircle2, Mail, Lock, User, Shield } from "lucide-react";

// // Mock store functions - replace with your actual implementation
// const useAuthModalStore = () => ({
//   closeModal: () => console.log('Close modal'),
//   openModal: (type) => console.log('Open modal:', type)
// });

// const GoogleIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
//     <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
//     <path fill="#FF3D00" d="M6.306,14.691l6.057,4.844C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
//     <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.651-3.356-11.303-8H6.393c3.56,8.049,11.567,14,20.607,14C23.013,44,23.507,44,24,44z"/>
//     <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.99,35.917,44,30.551,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
//   </svg>
// );

// const LinkedInIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
//     <path fill="#0078d4" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5 V37z"/>
//     <path fill="#fff" d="M30,37V26.901c0-1.689-0.819-2.698-2.192-2.698c-0.815,0-1.414,0.459-1.779,1.364 c-0.017,0.064-0.041,0.325-0.031,1.114L26,37h-7V18h7v1.061C27.022,18.356,28.275,18,29.738,18c4.547,0,7.261,3.093,7.261,8.274 L37,37H30z M11,37V18h3.457C12.454,18,11,16.528,11,14.499C11,12.472,12.478,11,14.514,11c2.012,0,3.445,1.431,3.486,3.479 C18,16.523,16.521,18,14.485,18H18v19H11z"/>
//   </svg>
// );

// export default function RegisterModal() {
//   const { closeModal, openModal } = useAuthModalStore();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isRegistered, setIsRegistered] = useState(false);

//   // Password strength calculator
//   const getPasswordStrength = (pwd) => {
//     if (pwd.length === 0) return { strength: 'none', label: '', color: '#e5e7eb', width: '0%' };
//     if (pwd.length < 6) return { strength: 'weak', label: 'Lemah', color: '#ef4444', width: '33%' };
//     if (pwd.length < 10) return { strength: 'medium', label: 'Sedang', color: '#f59e0b', width: '66%' };
//     return { strength: 'strong', label: 'Kuat', color: '#10b981', width: '100%' };
//   };

//   const passwordStrength = getPasswordStrength(password);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (password.length < 6) {
//       setError("Password minimal 6 karakter");
//       return;
//     }
//     setError('');
//     setLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       console.log("Registering:", { name, email, password });
//       setIsRegistered(true);
//       setLoading(false);
//     }, 1500);
//   };
  
//   const handleGoogleSignIn = async () => {
//     setError('');
//     setLoading(true);
//     setTimeout(() => {
//       console.log("Google sign in");
//       setLoading(false);
//       closeModal();
//     }, 1000);
//   };

//   const handleLinkedInSignIn = async () => {
//     setError('');
//     setLoading(true);
//     setTimeout(() => {
//       console.log("LinkedIn sign in");
//       setLoading(false);
//       closeModal();
//     }, 1000);
//   };

//   return (
//     <div style={{
//       position: 'fixed',
//       inset: 0,
//       backgroundColor: 'rgba(0, 0, 0, 0.6)',
//       backdropFilter: 'blur(8px)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '16px',
//       zIndex: 9999,
//       animation: 'fadeIn 0.2s ease-out',
//       fontFamily: "'Inter', 'Poppins', sans-serif"
//     }} onClick={closeModal}>
//       <div style={{
//         background: '#ffffff',
//         borderRadius: '20px',
//         boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
//         width: '100%',
//         maxWidth: '440px',
//         maxHeight: '90vh',
//         overflowY: 'auto',
//         position: 'relative',
//         animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
//       }} onClick={(e) => e.stopPropagation()}>
        
//         {/* Close Button */}
//         <button onClick={closeModal} style={{
//           position: 'absolute',
//           top: '16px',
//           right: '16px',
//           background: '#f3f4f6',
//           border: 'none',
//           borderRadius: '50%',
//           width: '36px',
//           height: '36px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           cursor: 'pointer',
//           color: '#6b7280',
//           transition: 'all 0.2s ease',
//           zIndex: 10
//         }} onMouseEnter={(e) => {
//           e.currentTarget.style.background = '#e5e7eb';
//           e.currentTarget.style.transform = 'rotate(90deg)';
//         }} onMouseLeave={(e) => {
//           e.currentTarget.style.background = '#f3f4f6';
//           e.currentTarget.style.transform = 'rotate(0deg)';
//         }}>
//           <X size={20} />
//         </button>

//         <div style={{ padding: '32px 28px 28px' }}>
//           {!isRegistered ? (
//             <>
//               {/* Header */}
//               <div style={{ textAlign: 'center', marginBottom: '24px' }}>
//                 <h2 style={{
//                   fontSize: '26px',
//                   fontWeight: '700',
//                   color: '#111827',
//                   margin: '0 0 8px 0',
//                   letterSpacing: '-0.02em'
//                 }}>Buat Akun Baru</h2>
//                 <p style={{
//                   fontSize: '14px',
//                   color: '#6b7280',
//                   margin: 0,
//                   fontWeight: '400'
//                 }}>Mulai perjalanan karir Anda bersama kami</p>
//               </div>

//               {/* Social Login Buttons */}
//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: '1fr 1fr',
//                 gap: '12px',
//                 marginBottom: '20px'
//               }}>
//                 <button onClick={handleGoogleSignIn} disabled={loading} style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: '8px',
//                   background: '#ffffff',
//                   color: '#374151',
//                   border: '1.5px solid #e5e7eb',
//                   padding: '12px 16px',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   borderRadius: '12px',
//                   cursor: loading ? 'not-allowed' : 'pointer',
//                   transition: 'all 0.2s ease',
//                   fontFamily: "'Inter', 'Poppins', sans-serif",
//                   opacity: loading ? 0.6 : 1
//                 }} onMouseEnter={(e) => {
//                   if (!loading) {
//                     e.currentTarget.style.background = '#f9fafb';
//                     e.currentTarget.style.borderColor = '#d1d5db';
//                     e.currentTarget.style.transform = 'translateY(-2px)';
//                     e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
//                   }
//                 }} onMouseLeave={(e) => {
//                   e.currentTarget.style.background = '#ffffff';
//                   e.currentTarget.style.borderColor = '#e5e7eb';
//                   e.currentTarget.style.transform = 'translateY(0)';
//                   e.currentTarget.style.boxShadow = 'none';
//                 }}>
//                   <GoogleIcon />
//                   <span style={{ fontSize: '13px' }}>Google</span>
//                 </button>

//                 <button onClick={handleLinkedInSignIn} disabled={loading} style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: '8px',
//                   background: '#ffffff',
//                   color: '#374151',
//                   border: '1.5px solid #e5e7eb',
//                   padding: '12px 16px',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   borderRadius: '12px',
//                   cursor: loading ? 'not-allowed' : 'pointer',
//                   transition: 'all 0.2s ease',
//                   fontFamily: "'Inter', 'Poppins', sans-serif",
//                   opacity: loading ? 0.6 : 1
//                 }} onMouseEnter={(e) => {
//                   if (!loading) {
//                     e.currentTarget.style.background = '#f9fafb';
//                     e.currentTarget.style.borderColor = '#d1d5db';
//                     e.currentTarget.style.transform = 'translateY(-2px)';
//                     e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
//                   }
//                 }} onMouseLeave={(e) => {
//                   e.currentTarget.style.background = '#ffffff';
//                   e.currentTarget.style.borderColor = '#e5e7eb';
//                   e.currentTarget.style.transform = 'translateY(0)';
//                   e.currentTarget.style.boxShadow = 'none';
//                 }}>
//                   <LinkedInIcon />
//                   <span style={{ fontSize: '13px' }}>LinkedIn</span>
//                 </button>
//               </div>

//               {/* Divider */}
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 textAlign: 'center',
//                 color: '#9ca3af',
//                 margin: '20px 0',
//                 fontSize: '12px',
//                 fontWeight: '500'
//               }}>
//                 <div style={{ flex: 1, borderBottom: '1px solid #e5e7eb' }} />
//                 <span style={{ padding: '0 16px' }}>ATAU</span>
//                 <div style={{ flex: 1, borderBottom: '1px solid #e5e7eb' }} />
//               </div>

//               {/* Form */}
//               <form onSubmit={handleRegister} style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: '16px'
//               }}>
//                 {/* Name Input */}
//                 <div>
//                   <label style={{
//                     fontSize: '13px',
//                     fontWeight: '600',
//                     color: '#374151',
//                     marginBottom: '6px',
//                     display: 'block'
//                   }}>Nama Lengkap</label>
//                   <div style={{ position: 'relative' }}>
//                     <User size={18} style={{
//                       position: 'absolute',
//                       left: '14px',
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       color: '#9ca3af',
//                       pointerEvents: 'none'
//                     }} />
//                     <input
//                       type="text"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       placeholder="John Doe"
//                       required
//                       disabled={loading}
//                       style={{
//                         width: '100%',
//                         boxSizing: 'border-box',
//                         padding: '12px 14px 12px 42px',
//                         fontSize: '14px',
//                         border: '1.5px solid #e5e7eb',
//                         borderRadius: '12px',
//                         transition: 'all 0.2s ease',
//                         fontFamily: "'Inter', 'Poppins', sans-serif",
//                         outline: 'none',
//                         background: loading ? '#f9fafb' : '#ffffff'
//                       }}
//                       onFocus={(e) => {
//                         e.currentTarget.style.borderColor = '#111827';
//                         e.currentTarget.style.boxShadow = '0 0 0 4px rgba(17, 24, 39, 0.08)';
//                       }}
//                       onBlur={(e) => {
//                         e.currentTarget.style.borderColor = '#e5e7eb';
//                         e.currentTarget.style.boxShadow = 'none';
//                       }}
//                     />
//                   </div>
//                 </div>

//                 {/* Email Input */}
//                 <div>
//                   <label style={{
//                     fontSize: '13px',
//                     fontWeight: '600',
//                     color: '#374151',
//                     marginBottom: '6px',
//                     display: 'block'
//                   }}>Email</label>
//                   <div style={{ position: 'relative' }}>
//                     <Mail size={18} style={{
//                       position: 'absolute',
//                       left: '14px',
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       color: '#9ca3af',
//                       pointerEvents: 'none'
//                     }} />
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="nama@email.com"
//                       required
//                       disabled={loading}
//                       style={{
//                         width: '100%',
//                         boxSizing: 'border-box',
//                         padding: '12px 14px 12px 42px',
//                         fontSize: '14px',
//                         border: '1.5px solid #e5e7eb',
//                         borderRadius: '12px',
//                         transition: 'all 0.2s ease',
//                         fontFamily: "'Inter', 'Poppins', sans-serif",
//                         outline: 'none',
//                         background: loading ? '#f9fafb' : '#ffffff'
//                       }}
//                       onFocus={(e) => {
//                         e.currentTarget.style.borderColor = '#111827';
//                         e.currentTarget.style.boxShadow = '0 0 0 4px rgba(17, 24, 39, 0.08)';
//                       }}
//                       onBlur={(e) => {
//                         e.currentTarget.style.borderColor = '#e5e7eb';
//                         e.currentTarget.style.boxShadow = 'none';
//                       }}
//                     />
//                   </div>
//                 </div>

//                 {/* Password Input */}
//                 <div>
//                   <label style={{
//                     fontSize: '13px',
//                     fontWeight: '600',
//                     color: '#374151',
//                     marginBottom: '6px',
//                     display: 'block'
//                   }}>Password</label>
//                   <div style={{ position: 'relative' }}>
//                     <Lock size={18} style={{
//                       position: 'absolute',
//                       left: '14px',
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       color: '#9ca3af',
//                       pointerEvents: 'none',
//                       zIndex: 1
//                     }} />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Minimal 6 karakter"
//                       required
//                       disabled={loading}
//                       style={{
//                         width: '100%',
//                         boxSizing: 'border-box',
//                         padding: '12px 42px 12px 42px',
//                         fontSize: '14px',
//                         border: '1.5px solid #e5e7eb',
//                         borderRadius: '12px',
//                         transition: 'all 0.2s ease',
//                         fontFamily: "'Inter', 'Poppins', sans-serif",
//                         outline: 'none',
//                         background: loading ? '#f9fafb' : '#ffffff'
//                       }}
//                       onFocus={(e) => {
//                         e.currentTarget.style.borderColor = '#111827';
//                         e.currentTarget.style.boxShadow = '0 0 0 4px rgba(17, 24, 39, 0.08)';
//                       }}
//                       onBlur={(e) => {
//                         e.currentTarget.style.borderColor = '#e5e7eb';
//                         e.currentTarget.style.boxShadow = 'none';
//                       }}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       style={{
//                         position: 'absolute',
//                         right: '14px',
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         background: 'none',
//                         border: 'none',
//                         cursor: 'pointer',
//                         padding: 0,
//                         color: '#9ca3af',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         transition: 'color 0.2s ease'
//                       }}
//                       onMouseEnter={(e) => e.currentTarget.style.color = '#374151'}
//                       onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
//                     >
//                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
                  
//                   {/* Password Strength Indicator */}
//                   {password.length > 0 && (
//                     <div style={{ marginTop: '8px' }}>
//                       <div style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                         marginBottom: '6px'
//                       }}>
//                         <span style={{
//                           fontSize: '11px',
//                           fontWeight: '500',
//                           color: passwordStrength.color
//                         }}>
//                           {passwordStrength.label}
//                         </span>
//                       </div>
//                       <div style={{
//                         width: '100%',
//                         height: '4px',
//                         background: '#e5e7eb',
//                         borderRadius: '2px',
//                         overflow: 'hidden'
//                       }}>
//                         <div style={{
//                           width: passwordStrength.width,
//                           height: '100%',
//                           background: passwordStrength.color,
//                           transition: 'all 0.3s ease'
//                         }} />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                   <div style={{
//                     padding: '12px',
//                     background: '#fef2f2',
//                     border: '1px solid #fecaca',
//                     borderRadius: '10px',
//                     color: '#dc2626',
//                     fontSize: '13px',
//                     fontWeight: '500',
//                     textAlign: 'center'
//                   }}>
//                     {error}
//                   </div>
//                 )}

//                 {/* Trust Badge */}
//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: '6px',
//                   padding: '10px',
//                   background: '#f0fdf4',
//                   borderRadius: '10px',
//                   marginTop: '4px'
//                 }}>
//                   <Shield size={14} style={{ color: '#10b981' }} />
//                   <span style={{
//                     fontSize: '12px',
//                     color: '#059669',
//                     fontWeight: '500'
//                   }}>Data Anda aman & terenkripsi</span>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   style={{
//                     background: loading ? '#9ca3af' : '#111827',
//                     color: '#ffffff',
//                     padding: '14px',
//                     fontSize: '15px',
//                     fontWeight: '600',
//                     borderRadius: '12px',
//                     border: 'none',
//                     cursor: loading ? 'not-allowed' : 'pointer',
//                     width: '100%',
//                     transition: 'all 0.2s ease',
//                     fontFamily: "'Inter', 'Poppins', sans-serif',
//                     marginTop: '4px'
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!loading) {
//                       e.currentTarget.style.background = '#1f2937';
//                       e.currentTarget.style.transform = 'translateY(-2px)';
//                       e.currentTarget.style.boxShadow = '0 8px 20px rgba(17, 24, 39, 0.25)';
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = loading ? '#9ca3af' : '#111827';
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = 'none';
//                   }}
//                 >
//                   {loading ? 'Memproses...' : 'Buat Akun'}
//                 </button>
//               </form>

//               {/* Redirect Link */}
//               <p style={{
//                 textAlign: 'center',
//                 marginTop: '20px',
//                 color: '#6b7280',
//                 fontSize: '14px',
//                 fontWeight: '400'
//               }}>
//                 Sudah punya akun?{' '}
//                 <button
//                   type="button"
//                   onClick={() => openModal('login')}
//                   style={{
//                     background: 'none',
//                     border: 'none',
//                     padding: 0,
//                     color: '#111827',
//                     textDecoration: 'none',
//                     fontWeight: '600',
//                     fontSize: 'inherit',
//                     fontFamily: "'Inter', 'Poppins', sans-serif",
//                     cursor: 'pointer',
//                     transition: 'color 0.2s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.textDecoration = 'underline';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.textDecoration = 'none';
//                   }}
//                 >
//                   Login di sini
//                 </button>
//               </p>
//             </>
//           ) : (
//             /* Success View */
//             <div style={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               textAlign: 'center',
//               gap: '16px',
//               padding: '20px 0'
//             }}>
//               <div style={{
//                 width: '80px',
//                 height: '80px',
//                 borderRadius: '50%',
//                 background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
//               }}>
//                 <CheckCircle2 size={48} style={{ color: '#ffffff' }} />
//               </div>
//               <h2 style={{
//                 fontSize: '24px',
//                 fontWeight: '700',
//                 color: '#111827',
//                 margin: 0,
//                 letterSpacing: '-0.02em'
//               }}>Satu Langkah Lagi!</h2>
//               <p style={{
//                 fontSize: '14px',
//                 color: '#6b7280',
//                 margin: 0,
//                 maxWidth: '320px',
//                 lineHeight: '1.6'
//               }}>
//                 Kami telah mengirimkan link verifikasi ke <strong style={{ color: '#111827' }}>{email}</strong>.
//                 Silakan periksa inbox (dan folder spam) Anda untuk mengaktifkan akun.
//               </p>
//               <button
//                 onClick={() => openModal('login')}
//                 style={{
//                   background: '#111827',
//                   color: '#ffffff',
//                   padding: '14px 32px',
//                   fontSize: '15px',
//                   fontWeight: '600',
//                   borderRadius: '12px',
//                   border: 'none',
//                   cursor: 'pointer',
//                   marginTop: '8px',
//                   transition: 'all 0.2s ease',
//                   fontFamily: "'Inter', 'Poppins', sans-serif"
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = '#1f2937';
//                   e.currentTarget.style.transform = 'translateY(-2px)';
//                   e.currentTarget.style.boxShadow = '0 8px 20px rgba(17, 24, 39, 0.25)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = '#111827';
//                   e.currentTarget.style.transform = 'translateY(0)';
//                   e.currentTarget.style.boxShadow = 'none';
//                 }}
//               >
//                 Lanjutkan ke Login
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
        
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
        
//         @keyframes scaleIn {
//           from {
//             transform: scale(0);
//             opacity: 0;
//           }
//           to {
//             transform: scale(1);
//             opacity: 1;
//           }
//         }
        
//         * {
//           -webkit-font-smoothing: antialiased;
//           -moz-osx-font-smoothing: grayscale;
//         }
        
//         /* Mobile Responsive */
//         @media (max-width: 480px) {
//           div[style*="padding: 32px 28px 28px"] {
//             padding: 24px 20px 20px !important;
//           }
          
//           h2[style*="fontSize: '26px'"] {
//             font-size: 22px !important;
//           }
          
//           button[style*="gridTemplateColumns"] {
//             font-size: 13px !important;
//           }
//         }
        
//         /* Tablet Responsive */
//         @media (max-width: 768px) and (min-width: 481px) {
//           div[style*="maxWidth: '440px'"] {
//             max-width: 400px !important;
//           }
//         }
        
//         /* Scrollbar Styling */
//         div[style*="overflowY: 'auto'"]::-webkit-scrollbar {
//           width: 6px;
//         }
        
//         div[style*="overflowY: 'auto'"]::-webkit-scrollbar-track {
//           background: #f3f4f6;
//         }
        
//         div[style*="overflowY: 'auto'"]::-webkit-scrollbar-thumb {
//           background: #d1d5db;
//           border-radius: 3px;
//         }
        
//         div[style*="overflowY: 'auto'"]::-webkit-scrollbar-thumb:hover {
//           background: #9ca3af;
//         }
//       `}</style>