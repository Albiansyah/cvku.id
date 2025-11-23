import '../styles/global.css'

import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import Footer from "../components/Footer";
import { AuthProvider } from "../hooks/useAuth"; 

export const metadata = {
  title: "CV Builder Pro",
  description: "Build professional CVs with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        data-gramm="false"
        data-gramm_editor="false"
      >
        {/* ✅ Bungkus semua komponen dengan AuthProvider */}
        <AuthProvider>
          <Navbar />
          {children}
          <AuthModal />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}