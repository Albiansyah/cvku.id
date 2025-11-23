"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import {
  UserCircle2,
  LogOut,
  Crown,
  User,
  LayoutDashboard,
  Loader2,
  AlertTriangle,
  Settings,
  Bell,
  Briefcase,
  GraduationCap,
  Shield,
  Zap,
  Layers,
  FileText,
  Wand2,
  GaugeCircle,
  ChevronDown,
} from "lucide-react";
import useAuthModalStore from "../store/useAuthModalStore";
import { Inter, Poppins } from "next/font/google";

// Fonts (Inter untuk body, Poppins untuk judul/label)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function Navbar() {
  const { openModal } = useAuthModalStore();
  const { currentUser, profile, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProdukOpen, setIsProdukOpen] = useState(false); // dropdown Produk (desktop)

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const produkRef = useRef(null);

  // Lock scroll saat overlay/modal
  useEffect(() => {
    document.body.style.overflow = isMenuOpen || showLogoutConfirm ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, showLogoutConfirm]);

  // Click outside & escape handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
      if (produkRef.current && !produkRef.current.contains(e.target)) setIsProdukOpen(false);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowLogoutConfirm(false);
        setIsDropdownOpen(false);
        setShowNotifications(false);
        setIsMenuOpen(false);
        setIsProdukOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Role-based dashboard config (TETAP, tidak diubah)
  const getDashboardConfig = () => {
    const role = (profile?.role || "user").toLowerCase().trim();
    const configs = {
      super_admin: { url: "/admin/dashboard", label: "Super Admin", icon: Shield, theme: "super-admin" },
      admin: { url: "/admin/dashboard", label: "Admin", icon: Settings, theme: "admin" },
      recruiter: { url: "/recruiter/dashboard", label: "Recruiter", icon: Briefcase, theme: "recruiter" },
      courses_manager: { url: "/courses-admin/dashboard", label: "Courses", icon: GraduationCap, theme: "courses" },
      user: { url: "/dashboard", label: "Dashboard", icon: LayoutDashboard, theme: "default" },
    };
    return configs[role] || configs.user;
  };

  const dashboardConfig = getDashboardConfig();
  const DashIcon = dashboardConfig.icon;

  // Navigasi ke dashboard (TETAP)
  const handleDashboardClick = (e) => {
    if (e) e.preventDefault();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    setShowNotifications(false);
    setIsProdukOpen(false);
    router.push(dashboardConfig.url);
  };

  // Logout (TETAP)
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setShowLogoutConfirm(false);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Nav utama
  const navLinks = [
    { href: "/improveCv", label: "Perbaiki CV", icon: Zap },
    { href: "/jobs", label: "Lowongan", icon: Briefcase },
    { href: "/courses", label: "Kursus", icon: GraduationCap },
    { href: "/pricing", label: "Harga", icon: Crown },
  ];

  // Dropdown Produk (desktop)
  const produkItems = [
    { href: "/cv-maker", label: "CV Maker", icon: Layers },
    { href: "/cover-letter", label: "Cover Letter", icon: FileText },
    { href: "/ai-optimizer", label: "AI Optimizer", icon: Wand2 },
    { href: "/ai-skor-ats", label: "AI Skor CV ATS", icon: GaugeCircle },
  ];

  // Notifikasi mock → Bahasa Indonesia
  const mockNotifications = [
    { text: "Analisis CV kamu sudah siap", time: "2 menit lalu" },
    { text: "Ada 7 lowongan cocok untukmu", time: "1 jam lalu" },
    { text: "Kursus baru kamu terdaftar", time: "3 jam lalu" },
  ];
  const unreadCount = mockNotifications.length;

  // Komponen Notifikasi
  const NotificationDropdown = () => (
    <div className="notif-dropdown">
      <div className="notif-header">
        <h4>Notifikasi</h4>
        <span>{unreadCount} baru</span>
      </div>
      <div className="notif-list">
        {mockNotifications.map((notif, i) => (
          <div key={i} className="notif-item">
            <div className="dot" />
            <div>
              <p>{notif.text}</p>
              <span>{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
      <Link href="/notifications" onClick={() => setShowNotifications(false)} className="notif-link">
        Lihat semua
      </Link>
    </div>
  );

  // Komponen Profile Dropdown
  const ProfileDropdown = () => (
    <div className="dropdown">
      <div className="dropdown-header">
        <div className="user-info">
          <div className="avatar-circle">
            {currentUser.user_metadata?.avatar_url ? (
              <img src={currentUser.user_metadata.avatar_url} alt="Avatar" />
            ) : (
              <UserCircle2 size={32} />
            )}
          </div>
          <div>
            <p className="name">{currentUser.user_metadata?.full_name || "Pengguna"}</p>
            <p className="email">{currentUser.email}</p>
          </div>
        </div>
        {profile?.role && profile.role !== "user" && (
          <span className={`role-badge ${dashboardConfig.theme}`}>
            <DashIcon size={12} />
            {dashboardConfig.label}
          </span>
        )}
      </div>
      <ul className="dropdown-menu">
        <li>
          <button onClick={handleDashboardClick}>
            <DashIcon size={16} />
            <span>{dashboardConfig.label}</span>
          </button>
        </li>
        <li>
          <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
            <User size={16} />
            <span>Profil</span>
          </Link>
        </li>
        <li>
          <Link href="/notifications" onClick={() => setIsDropdownOpen(false)}>
            <Bell size={16} />
            <span>Notifikasi</span>
            {unreadCount > 0 && <span className="mini-badge">{unreadCount}</span>}
          </Link>
        </li>
        <li>
          <Link href="/pricing" className="upgrade" onClick={() => setIsDropdownOpen(false)}>
            <Crown size={16} />
            <span>Upgrade</span>
          </Link>
        </li>
        <li className="divider" />
        <li>
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              setShowLogoutConfirm(true);
            }}
            className="logout"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <>
      <header className={`${inter.variable} ${poppins.variable} navbar ${dashboardConfig.theme}`}>
        <nav className="nav-container">
          <Link href="/" className="logo">
            CVKU.id
          </Link>

          {/* Desktop Navigation */}
          <ul className="nav-links">
            {/* Produk (dropdown) */}
            <li className="produk" ref={produkRef}>
              <button
                className={`produk-btn ${isProdukOpen ? "open" : ""}`}
                onClick={() => setIsProdukOpen((v) => !v)}
                aria-expanded={isProdukOpen}
                aria-haspopup="true"
              >
                <Layers size={16} />
                <span>Produk</span>
                <ChevronDown size={16} className="chev" />
              </button>

              {isProdukOpen && (
                <div className="produk-dropdown">
                  {produkItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="produk-item"
                      onClick={() => setIsProdukOpen(false)}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className={pathname === href ? "active" : ""}>
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="actions">
            {currentUser ? (
              <>
                {/* Notifikasi */}
                <div className="notif-wrap" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="notif-btn"
                    aria-expanded={showNotifications}
                    aria-label="Buka notifikasi"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                  </button>
                  {showNotifications && <NotificationDropdown />}
                </div>

                {/* Dashboard */}
                <button onClick={handleDashboardClick} className={`dash-btn ${dashboardConfig.theme}`}>
                  <DashIcon size={18} />
                  <span>{dashboardConfig.label}</span>
                </button>

                {/* Profile */}
                <div className="profile-wrap" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="avatar-btn"
                    aria-expanded={isDropdownOpen}
                    aria-label="Buka profil"
                  >
                    {currentUser.user_metadata?.avatar_url ? (
                      <img src={currentUser.user_metadata.avatar_url} alt="Avatar" />
                    ) : (
                      <UserCircle2 size={36} />
                    )}
                  </button>
                  {isDropdownOpen && <ProfileDropdown />}
                </div>
              </>
            ) : loading ? (
              <div className="skeleton">
                <div className="skeleton-btn" />
                <div className="skeleton-avatar" />
              </div>
            ) : (
              <div className="auth-btns">
                <button onClick={() => openModal("register")} className="btn-secondary">
                  Daftar
                </button>
                <button onClick={() => openModal("login")} className="btn-primary">
                  Masuk
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="hamburger"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsProdukOpen(false);
              setIsDropdownOpen(false);
              setShowNotifications(false);
            }}
            aria-label="Buka menu"
          >
            <span className={isMenuOpen ? "open" : ""} />
            <span className={isMenuOpen ? "open" : ""} />
            <span className={isMenuOpen ? "open" : ""} />
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)} />
          <div className="mobile-menu">
            {currentUser && (
              <div className="mobile-header">
                <div className="mobile-user">
                  {currentUser.user_metadata?.avatar_url ? (
                    <img src={currentUser.user_metadata.avatar_url} alt="Avatar" />
                  ) : (
                    <UserCircle2 size={48} />
                  )}
                  <div>
                    <p className="mobile-name">{currentUser.user_metadata?.full_name || "Pengguna"}</p>
                    <p className="mobile-email">{currentUser.email}</p>
                    {profile?.role && profile.role !== "user" && (
                      <span className={`mobile-role ${dashboardConfig.theme}`}>
                        <DashIcon size={12} />
                        {dashboardConfig.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mobile-nav">
              {/* Grup Produk */}
              <div className="mobile-group">
                <div className="mobile-group-title">
                  <Layers size={18} />
                  <span>Produk</span>
                </div>
                {produkItems.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} onClick={() => setIsMenuOpen(false)}>
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

              {/* Link utama */}
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={pathname === href ? "active" : ""}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {currentUser ? (
              <div className="mobile-actions">
                <button onClick={() => { setIsMenuOpen(false); handleDashboardClick(); }} className={`mobile-dash ${dashboardConfig.theme}`}>
                  <DashIcon size={20} />
                  <span>{dashboardConfig.label}</span>
                </button>
                <button onClick={() => { setIsMenuOpen(false); setShowLogoutConfirm(true); }} className="mobile-logout">
                  <LogOut size={20} />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <div className="mobile-auth">
                <button onClick={() => { setIsMenuOpen(false); openModal("login"); }} className="btn-primary mobile">
                  Masuk
                </button>
                <button onClick={() => { setIsMenuOpen(false); openModal("register"); }} className="btn-secondary mobile">
                  Daftar
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div className="modal-backdrop" onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={48} className="warning-icon" />
            <h3>Keluar?</h3>
            <p>Kamu akan keluar dan diarahkan ke halaman utama.</p>
            <div className="modal-actions">
              <button onClick={() => setShowLogoutConfirm(false)} className="btn-cancel" disabled={isLoggingOut}>
                Batal
              </button>
              <button onClick={handleLogout} className="btn-danger" disabled={isLoggingOut}>
                {isLoggingOut ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Sedang keluar…
                  </>
                ) : (
                  <>
                    <LogOut size={18} />
                    Keluar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style jsx global>{`
        :root {
          --navbar-h: 72px;
          --primary: #0066cc;
          --super-admin: #ff3b30;
          --admin: #ff9500;
          --recruiter: #007aff;
          --courses: #34c759;
          --font-body: var(--font-inter, Inter), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          --font-title: var(--font-poppins, Poppins), var(--font-inter, Inter), sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .navbar {
          position: fixed;
          top: 0;
          inset-inline: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.82);
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          height: var(--navbar-h);
          font-family: var(--font-body);
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1.25rem;
          gap: 0.75rem;
        }

        .logo {
          font-size: 1.375rem;
          font-weight: 800;
          color: #0b1220;
          text-decoration: none;
          letter-spacing: 0.2px;
          font-family: var(--font-title);
          transition: transform 0.2s ease;
        }
        .logo:hover { transform: translateY(-2px); }

        .nav-links {
          display: flex;
          gap: 0.25rem;
          list-style: none;
          align-items: center;
        }

        .nav-links a,
        .produk-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 0.9rem;
          color: #111827;
          text-decoration: none;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 600;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          font-family: var(--font-body);
          background: transparent;
        }

        .nav-links a:hover,
        .produk-btn:hover {
          background: rgba(0, 102, 204, 0.08);
          color: var(--primary);
        }

        .nav-links a.active {
          background: rgba(0, 102, 204, 0.1);
          color: var(--primary);
          border-color: rgba(0, 102, 204, 0.18);
        }

        /* Produk dropdown (desktop) */
        .produk { position: relative; }
        .produk-btn {
          cursor: pointer;
          border: 1px solid rgba(0, 0, 0, 0.06);
          background: rgba(255, 255, 255, 0.6);
        }
        .produk-btn .chev { transition: transform 0.2s ease; }
        .produk-btn.open .chev { transform: rotate(180deg); }

        .produk-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 280px;
          background: rgba(255, 255, 255, 0.95);
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.12);
          padding: 8px;
          z-index: 1001;
          animation: fadeIn 0.18s ease;
        }
        .produk-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 10px;
          color: #0b1220;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .produk-item:hover {
          background: rgba(0, 102, 204, 0.08);
          transform: translateX(4px);
          color: var(--primary);
        }

        .actions { display: flex; align-items: center; gap: 0.6rem; }

        .skeleton { display: flex; gap: 0.6rem; }
        .skeleton-btn, .skeleton-avatar {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        .skeleton-btn { height: 40px; width: 100px; }
        .skeleton-avatar { height: 40px; width: 40px; border-radius: 50%; }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .auth-btns { display: flex; gap: 0.6rem; }
        .btn-primary, .btn-secondary {
          padding: 0.7rem 1.2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9375rem;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
          font-family: var(--font-title);
        }
        .btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          color: #fff;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.28);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4); }
        .btn-secondary {
          background: rgba(0, 0, 0, 0.05);
          color: #111827;
          border: 1.5px solid rgba(0, 0, 0, 0.08);
        }
        .btn-secondary:hover { background: rgba(0, 0, 0, 0.08); transform: translateY(-2px); }

        /* Notifikasi */
        .notif-wrap { position: relative; }
        .notif-btn {
          position: relative;
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.04);
          border: none;
          cursor: pointer;
          color: #0b1220;
          transition: all 0.2s;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .notif-btn:hover { background: rgba(0, 0, 0, 0.08); color: var(--primary); }
        .notif-btn .badge {
          position: absolute; top: 4px; right: 4px;
          background: #ff3b30; color: #fff;
          font-size: 0.625rem; font-weight: 800;
          border-radius: 10px; padding: 0.1rem 0.35rem; min-width: 16px;
          display: inline-flex; align-items: center; justify-content: center;
        }

        .notif-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0; width: 320px;
          background: rgba(255, 255, 255, 0.98);
          -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px);
          border-radius: 14px; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(0, 0, 0, 0.08); animation: fadeIn 0.18s;
          z-index: 1001;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

        .notif-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.9rem 1rem; border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        .notif-header h4 { font-size: 1rem; font-weight: 700; font-family: var(--font-title); }
        .notif-header span { font-size: 0.8125rem; color: #6b7280; }

        .notif-list { max-height: 280px; overflow-y: auto; padding: 0.5rem; }
        .notif-item { display: flex; gap: 0.75rem; padding: 0.75rem; border-radius: 10px; transition: background 0.2s; }
        .notif-item:hover { background: rgba(0,0,0,0.02); }
        .notif-item .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); margin-top: 0.375rem; }
        .notif-item p { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; }
        .notif-item span { font-size: 0.75rem; color: #6b7280; }

        .notif-link { display: block; text-align: center; padding: 0.75rem; color: var(--primary); font-weight: 700; text-decoration: none; border-top: 1px solid rgba(0,0,0,0.06); }
        .notif-link:hover { background: rgba(0,102,204,0.05); }

        /* Dashboard button */
        .dash-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 0.9rem; border-radius: 12px;
          font-size: 0.9375rem; font-weight: 700;
          border: 1px solid; cursor: pointer; transition: all 0.2s;
          background: rgba(0, 102, 204, 0.08); color: var(--primary); border-color: rgba(0, 102, 204, 0.2);
          font-family: var(--font-title);
        }
        .dash-btn.super-admin { background: rgba(255,59,48,0.08); color: var(--super-admin); border-color: rgba(255,59,48,0.2); }
        .dash-btn.admin { background: rgba(255,149,0,0.08); color: var(--admin); border-color: rgba(255,149,0,0.2); }
        .dash-btn.recruiter { background: rgba(0,122,255,0.08); color: var(--recruiter); border-color: rgba(0,122,255,0.2); }
        .dash-btn.courses { background: rgba(52,199,89,0.08); color: var(--courses); border-color: rgba(52,199,89,0.2); }
        .dash-btn:hover { transform: translateY(-1.5px); box-shadow: 0 4px 12px rgba(0,102,204,0.18); }

        /* Avatar/Profile */
        .profile-wrap { position: relative; }
        .avatar-btn { width: 40px; height: 40px; border-radius: 50%; background: none; border: none; cursor: pointer; padding: 0; transition: transform 0.2s; }
        .avatar-btn:hover { transform: scale(1.05); }
        .avatar-btn img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid rgba(0,0,0,0.08); }

        .dropdown {
          position: absolute; top: calc(100% + 12px); right: 0;
          background: rgba(255,255,255,0.95);
          -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px);
          border-radius: 18px; box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          width: 300px; z-index: 1001; animation: dropdownSlide 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes dropdownSlide { from { opacity: 0; transform: translateY(-10px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .dropdown-header { padding: 1.1rem; background: rgba(37,99,235,0.05); border-bottom: 1px solid rgba(0,0,0,0.06); }
        .user-info { display: flex; gap: 0.8rem; margin-bottom: 0.8rem; }
        .avatar-circle { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(37,99,235,0.2); }
        .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
        .name { font-weight: 800; color: #0b1220; font-size: 1rem; margin-bottom: 0.3rem; font-family: var(--font-title); }
        .email { font-size: 0.8125rem; color: #6b7280; }

        .role-badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; font-size: 0.6875rem; font-weight: 800; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; background: linear-gradient(135deg, var(--primary), #5ba7e8); color: #fff; }
        .role-badge.super-admin { background: linear-gradient(135deg, var(--super-admin), #ff7a72); }
        .role-badge.admin { background: linear-gradient(135deg, var(--admin), #ffbb66); }
        .role-badge.recruiter { background: linear-gradient(135deg, var(--recruiter), #79b7ff); }
        .role-badge.courses { background: linear-gradient(135deg, var(--courses), #79e0a2); }

        .dropdown-menu { padding: 0.6rem; list-style: none; }
        .dropdown-menu button, .dropdown-menu a {
          display: flex; align-items: center; gap: 0.8rem; width: 100%;
          padding: 0.8rem 0.9rem; font-size: 0.9375rem; color: #0b1220;
          background: none; border: none; text-decoration: none; border-radius: 12px; cursor: pointer; transition: all 0.2s; font-weight: 600; font-family: var(--font-body);
        }
        .dropdown-menu button:hover, .dropdown-menu a:hover { background: rgba(37,99,235,0.08); transform: translateX(4px); color: var(--primary); }

        .mini-badge { background: #ff3b30; color: white; font-size: 0.6875rem; font-weight: 800; border-radius: 12px; padding: 0.25rem 0.5rem; margin-left: auto; }

        .upgrade { color: var(--primary) !important; }
        .divider { height: 1px; background: rgba(0,0,0,0.08); margin: 0.4rem 0; }
        .logout { color: #ff3b30 !important; }

        /* Hamburger */
        .hamburger { display: none; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: 0.4rem; }
        .hamburger span { width: 24px; height: 2px; background: #0b1220; border-radius: 2px; transition: all 0.3s; }
        .hamburger span.open:nth-child(1) { transform: rotate(45deg) translateY(6px); }
        .hamburger span.open:nth-child(2) { opacity: 0; }
        .hamburger span.open:nth-child(3) { transform: rotate(-45deg) translateY(-6px); }

        /* Modal */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); z-index: 1020; display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.2s; }
        .modal { background: #fff; border-radius: 16px; padding: 1.6rem; width: 100%; max-width: 420px; box-shadow: 0 24px 48px rgba(0,0,0,0.2); text-align: center; font-family: var(--font-body); }
        .modal .warning-icon { color: #ff9500; margin-bottom: 0.75rem; }
        .modal h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; font-family: var(--font-title); }
        .modal p { color: #6b7280; margin-bottom: 1.2rem; font-size: 0.95rem; }

        .modal-actions { display: flex; gap: 0.75rem; }
        .modal-actions button { flex: 1; padding: 0.75rem 1rem; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.9375rem; font-family: var(--font-title); }
        .btn-cancel { background: rgba(0,0,0,0.05); color: #0b1220; }
        .btn-cancel:hover:not(:disabled) { background: rgba(0,0,0,0.08); }
        .btn-danger { background: #ff3b30; color: white; }
        .btn-danger:hover:not(:disabled) { background: #ff2d21; transform: translateY(-1px); }
        .modal-actions button:disabled { opacity: 0.6; cursor: not-allowed; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* MOBILE */
        @media (max-width: 1024px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .actions { gap: 0.5rem; }
          .dash-btn span { display: none; }
          .dash-btn { padding: 0.6rem; width: 40px; height: 40px; justify-content: center; }
          .notif-btn, .avatar-btn { width: 36px; height: 36px; }
        }

        .mobile-overlay, .mobile-menu { display: none; }
        @media (max-width: 1024px) {
          .mobile-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 998; animation: fadeIn 0.2s; }
          .mobile-menu {
            display: flex; flex-direction: column; position: fixed; top: 0; right: 0;
            width: 84%; max-width: 360px; height: 100vh; background: #fff;
            box-shadow: -4px 0 24px rgba(0,0,0,0.18); z-index: 999; animation: slideIn 0.25s ease; overflow-y: auto;
          }
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

          .mobile-header { padding: 1.2rem; border-bottom: 1px solid rgba(0,0,0,0.08); }
          .mobile-user { display: flex; align-items: center; gap: 0.75rem; }
          .mobile-user img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(0,0,0,0.08); }
          .mobile-name { font-size: 1rem; font-weight: 800; margin-bottom: 0.2rem; font-family: var(--font-title); }
          .mobile-email { font-size: 0.875rem; color: #6b7280; margin-bottom: 0.4rem; }
          .mobile-role { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.6rem; font-size: 0.6875rem; font-weight: 800; border-radius: 999px; text-transform: uppercase; background: var(--primary); color: #fff; }
          .mobile-role.super-admin { background: var(--super-admin); } .mobile-role.admin { background: var(--admin); } .mobile-role.recruiter { background: var(--recruiter); } .mobile-role.courses { background: var(--courses); }

          .mobile-nav { padding: 0.75rem; display: grid; gap: 0.4rem; }
          .mobile-group { background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; padding: 0.5rem; }
          .mobile-group-title { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; margin: 0.2rem 0 0.4rem; font-family: var(--font-title); }
          .mobile-group a,
          .mobile-nav > a {
            display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem; color: #0b1220; text-decoration: none; border-radius: 12px; font-size: 1rem; font-weight: 600; transition: all 0.18s;
          }
          .mobile-nav a:hover, .mobile-group a:hover { background: rgba(0,102,204,0.08); color: var(--primary); }
          .mobile-nav a.active { background: rgba(0,102,204,0.1); color: var(--primary); }

          .mobile-actions, .mobile-auth { padding: 0.9rem; border-top: 1px solid rgba(0,0,0,0.08); display: grid; gap: 0.6rem; }
          .mobile-dash, .mobile-logout {
            display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
            padding: 0.95rem; border-radius: 12px; font-size: 1rem; font-weight: 800; border: 1px solid; cursor: pointer; transition: all 0.18s; width: 100%;
          }
          .mobile-dash { background: rgba(0,102,204,0.08); color: var(--primary); border-color: rgba(0,102,204,0.2); }
          .mobile-dash.super-admin { background: rgba(255,59,48,0.08); color: var(--super-admin); border-color: rgba(255,59,48,0.2); }
          .mobile-dash.admin { background: rgba(255,149,0,0.08); color: var(--admin); border-color: rgba(255,149,0,0.2); }
          .mobile-dash.recruiter { background: rgba(0,122,255,0.08); color: var(--recruiter); border-color: rgba(0,122,255,0.2); }
          .mobile-dash.courses { background: rgba(52,199,89,0.08); color: var(--courses); border-color: rgba(52,199,89,0.2); }
          .mobile-logout { background: rgba(255,59,48,0.08); color: #ff3b30; border-color: rgba(255,59,48,0.2); }

          .mobile-auth .btn-primary, .mobile-auth .btn-secondary { width: 100%; padding: 1rem; font-size: 1rem; }
        }

        @media (max-width: 480px) {
          .nav-container { padding: 0 1rem; }
          .logo { font-size: 1.2rem; }
          .modal { padding: 1.25rem; }
          .mobile-menu { width: 100%; max-width: 100%; }
        }
      `}</style>
    </>
  );
}
