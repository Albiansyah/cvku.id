"use client";

import React, { useEffect, useState } from "react";
import {
  Crown,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  const navLinks = {
    produk: [
      { name: "Fitur", href: "#" },
      { name: "Template CV", href: "#" },
      { name: "Harga", href: "#" },
      { name: "Surat Lamaran", href: "#" },
    ],
    sumberDaya: [
      { name: "Blog", href: "#" },
      { name: "Panduan Karir", href: "#" },
      { name: "Contoh CV", href: "#" },
      { name: "Bantuan", href: "#" },
    ],
    perusahaan: [
      { name: "Tentang Kami", href: "#" },
      { name: "Kontak", href: "#" },
      { name: "Karir", href: "#" },
      { name: "Afiliasi", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "#", icon: Twitter, color: "#1DA1F2" },
    { name: "GitHub", href: "#", icon: Github, color: "#333333" },
    { name: "LinkedIn", href: "#", icon: Linkedin, color: "#0077B5" },
    { name: "Facebook", href: "#", icon: Facebook, color: "#1877F2" },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Berhasil berlangganan newsletter!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer className={`${inter.variable} ${poppins.variable}`}>
      <div className="footer">
        <div className="container">
          <div className="main">
            {/* LEFT / BRAND */}
            <section className="brand">
              <div className="brand-row">
                <Crown className="brand-logo" />
                <span className="brand-name">CVKU.id</span>
              </div>

              <p className="desc">
                Bangun masa depan profesional Anda—satu CV sempurna pada satu
                waktu. Alat canggih untuk membuat CV yang menonjol dan memikat
                recruiter.
              </p>

              <div className="contacts">
                <div className="c-item">
                  <Mail size={16} className="c-icon" />
                  <span>hello@cvbuilder.com</span>
                </div>
                <div className="c-item">
                  <Phone size={16} className="c-icon" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="c-item">
                  <MapPin size={16} className="c-icon" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </div>

              <div className="socials">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      aria-label={s.name}
                      className="soc"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </section>

            {/* RIGHT / LINKS + NEWSLETTER */}
            <section className="right">
              <div className="links">
                {Object.entries(navLinks).map(([title, items]) => (
                  <div className="col" key={title}>
                    <h3 className="col-title">
                      {title.charAt(0).toUpperCase() + title.slice(1)}
                    </h3>
                    <ul className="col-list">
                      {items.map((l) => (
                        <li key={l.name}>
                          <a href={l.href} className="link">
                            {l.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="newsletter">
                <div className="card">
                  <div className="title">
                    <Mail size={18} />
                    <span>Newsletter Eksklusif</span>
                  </div>
                  <p className="n-desc">
                    Dapatkan tips karir terbaru, template CV premium, dan
                    panduan wawancara langsung ke email Anda.
                  </p>

                  <form className="n-form" onSubmit={handleNewsletterSubmit}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email Anda…"
                      className="input"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`btn ${isSubmitting ? "btn--loading" : ""}`}
                    >
                      {isSubmitting ? (
                        <span className="spinner" />
                      ) : (
                        <ArrowRight size={18} />
                      )}
                    </button>
                  </form>

                  <div className="n-stats">
                    <Users size={14} />
                    <span>15.000+ profesional sudah bergabung</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="bottom">
            <p className="copy">© {year} CVBuilder. Dibuat di Indonesia.</p>
            <nav className="legal">
              <a href="#" className="legal-link">
                Kebijakan Privasi
              </a>
              <a href="#" className="legal-link">
                Syarat Layanan
              </a>
              <a href="#" className="legal-link">
                Cookie Policy
              </a>
            </nav>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          position: relative;
          overflow: hidden;
          color: #ffffff;
          background: #0f172a; /* satu warna biru tua solid */
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 96px 20px 28px;
          position: relative;
          z-index: 1;
          font-family: var(--font-inter, Inter), system-ui, sans-serif;
        }

        .main {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px;
          margin-bottom: 32px;
        }
        @media (min-width: 768px) {
          .main {
            grid-template-columns: 1fr 1.4fr;
            gap: 48px;
          }
        }

        .brand-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .brand-logo {
          width: 40px;
          height: 40px;
          color: #60a5fa;
        }
        .brand-name {
          font-family: var(--font-poppins, Poppins), sans-serif;
          font-size: clamp(24px, 2.4vw, 34px);
          font-weight: 700;
          background: linear-gradient(135deg, #93c5fd, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .desc {
          color: rgba(255, 255, 255, 0.86);
          line-height: 1.75;
          margin-bottom: 20px;
          font-size: 15px;
        }
        .contacts {
          display: grid;
          gap: 10px;
          margin-bottom: 20px;
        }
        .c-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.82);
          font-size: 14px;
        }
        .c-icon {
          color: #60a5fa;
        }

        .socials {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .soc {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 12px;
          color: #fff;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.16);
          transition: all 0.3s ease;
        }
        .soc:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .right {
          display: grid;
          gap: 32px;
        }

        .links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (min-width: 640px) {
          .links {
            grid-template-columns: repeat(3, 1fr);
            gap: 28px;
          }
        }

        .col-title {
          font-family: var(--font-poppins, Poppins);
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #e2e8f0;
        }
        .link {
          display: inline-block;
          color: rgba(255, 255, 255, 0.78);
          text-decoration: none;
          font-size: 14px;
          padding: 4px 0;
          transition: all 0.3s ease;
        }
        .link:hover {
          color: #93c5fd;
          transform: translateX(4px);
        }

        .newsletter .card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 14px;
          padding: 16px;
          backdrop-filter: blur(10px);
        }
        .title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-poppins, Poppins);
          font-weight: 600;
          color: #e2e8f0;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .n-desc {
          color: rgba(255, 255, 255, 0.86);
          line-height: 1.6;
          font-size: 14px;
          margin-bottom: 14px;
        }
        .n-form {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          margin-bottom: 12px;
        }
        @media (max-width: 420px) {
          .n-form {
            grid-template-columns: 1fr;
          }
        }
        .input {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 14px;
          outline: none;
        }
        .input:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
        }
        .btn {
          min-width: 52px;
          height: 44px;
          padding: 0 14px;
          border: none;
          border-radius: 12px;
          background: #2563eb;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .n-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .copy {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }
        .legal {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .legal-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }
        .legal-link:hover {
          color: #93c5fd;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
