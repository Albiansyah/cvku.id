"use client";

import { AuthProvider } from '../lib/firebase'; // ⬅️ Import AuthProvider
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import useAuthModalStore from '../store/useAuthModalStore';

export default function ClientLayout({ children }) {
  const { view } = useAuthModalStore();

  return (
    <AuthProvider> {/* ⬅️ Bungkus semua dengan AuthProvider */}
      {/* Navbar sekarang dirender secara statis di semua halaman */}
      <Navbar />

      {/* Beri padding-top agar konten tidak tertutup Navbar */}
      <main style={{ paddingTop: '64px' }}> {/* Sesuaikan dengan tinggi Navbar */}
        {children}
      </main>

      <Footer />
      
      {view === 'login' && <LoginModal />}
      {view === 'register' && <RegisterModal />}
      {view === 'forgot-password' && <ForgotPasswordModal />}
    </AuthProvider>
  );
}