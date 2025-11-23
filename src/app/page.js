"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Users,
  Shield,
  Lock,
  Clock,
  Target,
  Bot,
  Sparkles,
  Star,
  UserCircle2,
} from "lucide-react";
import { Inter, Poppins } from "next/font/google";

/* ===================== FONTS ===================== */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

/* ===================== COMPANY LINKS ===================== */
const companyLinks = [
  { name: "Google", url: "https://google.com", logo: "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_light_clr_74x24px.svg" },
  { name: "Microsoft", url: "https://microsoft.com", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Tokopedia", url: "https://www.tokopedia.com", logo: "https://assets.tokopedia.net/assets-tokopedia-lite/v2/arael/kratos/36c1015e.svg" },
  { name: "Gojek", url: "https://www.gojek.com", logo: "https://lelogama.go-jek.com/prime/upload/image/gojek-logo.png" },
  { name: "Meta", url: "https://about.meta.com", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Meta_Platforms_Inc._logo.svg" },
  { name: "Shopee", url: "https://shopee.co.id", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Shopee_logo.svg" },
  { name: "Grab", url: "https://www.grab.com", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Grab_Logo.svg" },
  { name: "BCA", url: "https://www.bca.co.id", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Bank_Central_Asia.svg" },
  { name: "Telkom Indonesia", url: "https://www.telkom.co.id", logo: "https://upload.wikimedia.org/wikipedia/id/0/0a/Telkom_Indonesia_2013.svg" },
  { name: "Traveloka", url: "https://www.traveloka.com", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Traveloka_logo.svg" },
  { name: "Astra", url: "https://www.astra.co.id", logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/Astra_International_logo.svg" },
  { name: "Unilever", url: "https://www.unilever.co.id", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Unilever.svg" },
];

/* ===================== INLINE STYLES ===================== */
const S = {
  page: {
    background: "#fafbfd", // putih clean (bukan #ffffff)
    color: "#0f172a",
    fontFamily: 'var(--font-inter, Inter), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    overflowX: "hidden",
  },
  wrap: { maxWidth: 1200, margin: "0 auto", padding: "0 20px" },

  /* HERO */
  hero: { padding: "110px 0 70px" },
  heroGrid: { display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "center" },
  heroTitle: {
    fontFamily: "var(--font-poppins, Poppins), var(--font-inter, Inter)",
    fontWeight: 800,
    fontSize: "clamp(28px,5vw,52px)",
    lineHeight: 1.1,
    margin: "0 0 14px",
  },
  accent: {
    backgroundImage: "linear-gradient(135deg,#2563eb,#7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSub: { color: "#475569", fontSize: "clamp(15px,2vw,18px)", lineHeight: 1.7, margin: "0 0 22px" },
  row: { display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" },
  btn: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "12px 18px", borderRadius: 12, fontWeight: 800, textDecoration: "none",
    fontFamily: "var(--font-poppins, Poppins)", transition: "transform .18s, box-shadow .18s, background .18s",
    border: "1px solid transparent", cursor: "pointer",
  },
  btnPrimary: { background: "#2563eb", color: "#fff", boxShadow: "0 10px 28px rgba(37,99,235,.25)" },
  btnSecondary: { background: "#fff", color: "#0f172a", border: "1px solid #e2e8f0" },

  metrics: { display: "flex", gap: 14, flexWrap: "wrap" },
  pill: {
    display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px",
    borderRadius: 999, background: "#fff", border: "1px solid #e2e8f0", color: "#0f172a", fontSize: 14,
  },

  /* CV MOCKUP (2 kartu) */
  visual: { display: "flex", justifyContent: "center", position: "relative" },
  mock: { position: "relative", width: 520, height: 520 },
  cv: {
    position: "absolute", width: 320, borderRadius: 14, padding: 22,
    boxShadow: "0 20px 60px rgba(15,23,42,.08)", transition: "transform .25s ease, box-shadow .25s ease",
    cursor: "pointer",
  },
  cvLight: { background: "#fff", left: -20, top: 20, zIndex: 3, transform: "rotate(-3deg)" },
  cvDark: { right: -30, top: 140, background: "linear-gradient(135deg,#1e293b,#0f172a)", zIndex: 2, transform: "rotate(4deg)" },

  cvTop: { display: "flex", alignItems: "center", gap: 12, paddingBottom: 12, borderBottom: "1px solid rgba(0,0,0,.08)" },
  cvTopDark: { borderBottom: "1px solid rgba(255,255,255,.12)" },
  avatar: {
    width: 48, height: 48, borderRadius: "50%", display: "grid", placeItems: "center",
    background: "linear-gradient(135deg,#2563eb,#8b5cf6)", color: "#fff", flexShrink: 0,
  },
  avatarDark: { background: "linear-gradient(135deg,#8b5cf6,#ec4899)" },
  id: { flex: 1, minWidth: 0 },
  idName: { fontWeight: 800, color: "#0b1220", fontSize: 15 },
  idRole: { fontSize: 13.5, color: "#64748b" },
  idNameAlt: { color: "#fff" },
  idRoleAlt: { color: "rgba(255,255,255,.7)" },
  badge: { marginLeft: "auto", background: "#2563eb", color: "#fff", padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 800, flexShrink: 0 },
  status: { color: "#2563eb", fontWeight: 700, margin: "10px 0 12px", fontSize: 15 },
  lines: { display: "grid", gap: 8 },
  line: { height: 8, borderRadius: 4, background: "#e5e7eb" },
  lineShort: { width: "60%" },
  lineMid: { width: "80%" },
  block: { marginTop: 16 },
  blockTitle: { color: "#93c5fd", fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 8 },
  bar: { height: 6, background: "rgba(255,255,255,.14)", borderRadius: 4, marginBottom: 6 },
  barShort: { width: "70%" },
  dots: { display: "flex", gap: 8 },
  dot: { width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,.22)" },

  /* TRUSTED */
  trusted: { background: "#fff", padding: "36px 0 42px", textAlign: "center", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" },
  trustedTitle: { color: "#64748b", fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 18 },
  logosViewport: {
    width: "100%", overflow: "hidden",
    WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
    maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
  },
  logos: { display: "flex", gap: 28, willChange: "transform" },
  logoItem: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 180, height: 60, textDecoration: "none", position: "relative" },
  logoImg: {
    maxWidth: 140,
    maxHeight: 48,
    objectFit: "contain",
    filter: "grayscale(100%) opacity(.8)", // dari .65 → .8
    transition: "opacity .2s, transform .2s, filter .2s",
  },
  /* SECTIONS */
  section: { padding: "72px 20px", maxWidth: 1100, margin: "0 auto", textAlign: "center" },
  sectionTitle: { fontFamily: "var(--font-poppins, Poppins)", fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, marginBottom: 10 },
  sectionDesc: { color: "#64748b", maxWidth: 680, margin: "0 auto 34px", fontSize: 17 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 },
  card: { background: "#fff", color: "#0f172a", borderRadius: 14, padding: 22, textAlign: "left", boxShadow: "0 4px 20px rgba(15,23,42,.08)", border: "1px solid #e2e8f0", transition: "transform .18s, box-shadow .18s" },
  iconBox: { width: 44, height: 44, borderRadius: 10, background: "rgba(37,99,235,.12)", color: "#2563eb", display: "grid", placeItems: "center", marginBottom: 12 },
  cardTitle: { fontFamily: "var(--font-poppins, Poppins)", fontSize: 18, fontWeight: 800, marginBottom: 8 },
  chip: { display: "inline-block", marginTop: 12, padding: "4px 10px", fontSize: 12, fontWeight: 800, color: "#2563eb", borderRadius: 999, background: "#eef2ff" },

  /* PROOF */
  proofBox: { background: "#f1f5f9", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" },
  proofGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 900, margin: "18px auto 28px" },
  pCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 22, textAlign: "center" },
  pNum: { fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, color: "#2563eb", marginBottom: 6, lineHeight: 1 },
  pLabel: { color: "#64748b", fontWeight: 600, fontSize: 15 },
  quote: { maxWidth: 680, margin: "0 auto", textAlign: "center", color: "#0f172a" },
  quoteP: { fontSize: 18, fontStyle: "italic", marginBottom: 6, color: "#64748b" },

  /* CTA */
  cta: { background: "#ffffff", padding: "70px 20px 84px" },
  ctaInner: { maxWidth: 760, margin: "0 auto", textAlign: "center" },
  ctaTitle: { fontFamily: "var(--font-poppins, Poppins)", fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, marginBottom: 10 },
  ctaSub: { color: "#64748b", marginBottom: 20 },
  guarantee: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", color: "#64748b" },
  guaranteePill: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 999, background: "#fff", border: "1px solid #e2e8f0" },

  /* FAQ */
  faqBox: { background: "#fafbfd" },
  faqWrap: { maxWidth: 760, margin: "0 auto", textAlign: "left" },
  faqItem: { borderBottom: "1px solid #e2e8f0" },
  faqQ: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", color: "#0f172a", border: 0, cursor: "pointer", fontWeight: 800, fontSize: 17, textAlign: "left" },
  plus: { fontSize: 22, color: "#2563eb", marginLeft: 12, transition: "transform .3s ease" },
  faqAOuter: { overflow: "hidden", height: 0, transition: "height .32s ease" },
  faqAText: { color: "#64748b", padding: "0 0 16px", lineHeight: 1.6 },

  /* STICKY CTA (mobile) */
  sticky: {
    position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,.95)",
    backdropFilter: "blur(10px)", padding: "12px 16px", boxShadow: "0 -8px 20px rgba(15,23,42,.1)",
    borderTop: "1px solid #e2e8f0", display: "none", zIndex: 50,
  },
};

/* ===================== PAGE ===================== */
export default function Home() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [cvCount, setCvCount] = useState(15000);
  const [isMobile, setIsMobile] = useState(false);

  // counter
  useEffect(() => {
    const t = setInterval(() => {
      setCvCount((p) => (p >= 15500 ? 15500 : p + (1 + Math.floor(Math.random() * 3))));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // simple responsive switch
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ===== RUNNING LOGO (MARQUEE) ===== */
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const marqueeData = useMemo(() => [...companyLinks, ...companyLinks], []);

  useEffect(() => {
    let raf;
    let x = 0;
    const speed = 0.6; // px per frame
    const step = () => {
      const track = trackRef.current;
      if (!track) { raf = requestAnimationFrame(step); return; }
      const halfWidth = track.scrollWidth / 2; // karena diduplikasi
      x -= speed;
      if (Math.abs(x) >= halfWidth) x = 0;
      setOffset(x);
      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ===== FAQ HEIGHT ANIMATION ===== */
  const faqRefs = useRef([]);

  const toggleFAQ = (i) => {
    const isOpen = openFAQ === i;
    const next = isOpen ? null : i;
    // Animate current closing
    if (!isOpen && faqRefs.current[i]) {
      const el = faqRefs.current[i];
      el.style.height = "0px";
      requestAnimationFrame(() => {
        const inner = el.firstChild;
        if (inner) el.style.height = inner.scrollHeight + "px";
      });
    }
    setOpenFAQ(next);
  };

  useEffect(() => {
    // set correct heights on open/close
    faqRefs.current.forEach((el, idx) => {
      if (!el) return;
      const inner = el.firstChild;
      if (!inner) return;
      if (openFAQ === idx) {
        el.style.height = inner.scrollHeight + "px";
      } else {
        el.style.height = "0px";
      }
    });
  }, [openFAQ]);

  // helpers
  const hover = (el, on, styleObj) => { if (!el) return; Object.assign(el.style, on ? styleObj.on : styleObj.off); };

  const faqData = [
    { q: "Apakah CVKU.id gratis?", a: "Ya. Mulai gratis dengan template dasar. Fitur premium seperti analisis AI dan template eksklusif tersedia mulai Rp 29.000/bulan." },
    { q: "Apakah CV bisa diunduh PDF?", a: "Bisa. Semua CV dapat diunduh sebagai PDF berkualitas tinggi, siap kirim ke perusahaan." },
    { q: "Apakah template ramah ATS Indonesia?", a: "Ya. Seluruh template dirancang dan diuji agar ramah ATS di perusahaan lokal maupun multinasional." },
    { q: "Apakah data saya aman?", a: "Data dienkripsi (SSL 256-bit) dan disimpan aman. Kami tidak membagikan data Anda ke pihak ketiga." },
  ];

  return (
    <div className={`${inter.variable} ${poppins.variable}`} style={S.page}>
      {/* HERO */}
      <section style={S.hero}>
        <div style={S.wrap}>
          <div
            style={{
              ...S.heroGrid,
              gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
              gap: isMobile ? 32 : 56,
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <div>
              <h1 style={S.heroTitle}>
                Buat CV <span style={S.accent}>Profesional</span> dalam hitungan menit
              </h1>
              <p style={S.heroSub}>
                Platform mudah digunakan untuk membuat CV yang menonjol dan lolos screening HRD.
                Selaraskan dengan ATS, tambahkan poin berdampak, dan kirimkan dengan percaya diri.
              </p>

              <div style={{ ...S.row, justifyContent: isMobile ? "center" : "flex-start" }}>
                <a
                  href="/editor"
                  style={{ ...S.btn, ...S.btnPrimary }}
                  onMouseEnter={(e) => hover(e.currentTarget, true, {
                    on: { transform: "translateY(-1.5px)", boxShadow: "0 14px 34px rgba(37,99,235,.35)", background: "#1d4ed8" },
                    off: {},
                  })}
                  onMouseLeave={(e) => hover(e.currentTarget, false, {
                    on: {}, off: { transform: "none", boxShadow: "0 10px 28px rgba(37,99,235,.25)", background: "#2563eb" },
                  })}
                >
                  Mulai Gratis
                </a>
                <a
                  href="/extra/preview"
                  style={{ ...S.btn, ...S.btnSecondary }}
                  onMouseEnter={(e) => hover(e.currentTarget, true, {
                    on: { transform: "translateY(-1px)", borderColor: "#2563eb" },
                    off: {},
                  })}
                  onMouseLeave={(e) => hover(e.currentTarget, false, {
                    on: {}, off: { transform: "none", borderColor: "#e2e8f0" },
                  })}
                >
                  Lihat Contoh
                </a>
              </div>

              <div style={{ ...S.metrics, justifyContent: isMobile ? "center" : "flex-start" }}>
                <span style={S.pill}><Users size={18} /> {cvCount.toLocaleString()}+ CV dibuat</span>
                <span style={S.pill}><Shield size={18} /> Ramah ATS</span>
                <span style={S.pill}><Star size={18} /> Rating 4.8/5</span>
              </div>
            </div>

            {/* VISUAL (2 kartu) */}
            <div style={S.visual}>
              <div style={{ ...S.mock, width: isMobile ? 360 : 520, height: isMobile ? 430 : 520, margin: isMobile ? "0 auto" : 0 }}>
                {/* Light */}
                <div
                  style={{ ...S.cv, ...S.cvLight, ...(isMobile ? { left: 0, top: 30, width: 280, padding: 18 } : null) }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 30px 80px rgba(15,23,42,.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 20px 60px rgba(15,23,42,.08)")}
                >
                  <div style={S.cvTop}>
                    <div style={S.avatar}><UserCircle2 /></div>
                    <div style={S.id}>
                      <div style={S.idName}>SUSAN ADAMS</div>
                      <div style={S.idRole}>Product Designer</div>
                    </div>
                    <div style={S.badge}>Generate</div>
                  </div>
                  <div style={S.status}>Sedang membuat CV…</div>
                  <div style={S.lines}>
                    <span style={S.line} />
                    <span style={{ ...S.line, ...S.lineShort }} />
                    <span style={S.line} />
                    <span style={{ ...S.line, ...S.lineMid }} />
                  </div>
                </div>

                {/* Dark */}
                <div
                  style={{ ...S.cv, ...S.cvDark, ...(isMobile ? { right: 0, top: 160, width: 280, padding: 18 } : null) }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 30px 80px rgba(15,23,42,.25)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 20px 60px rgba(15,23,42,.08)")}
                >
                  <div style={{ ...S.cvTop, ...S.cvTopDark }}>
                    <div style={{ ...S.avatar, ...S.avatarDark }} />
                    <div style={S.id}>
                      <div style={{ ...S.idName, ...S.idNameAlt }}>Sarah Benjamin</div>
                      <div style={{ ...S.idRole, ...S.idRoleAlt }}>UX Designer</div>
                    </div>
                  </div>
                  <div style={S.block}>
                    <div style={S.blockTitle}>PENGALAMAN</div>
                    <div style={S.bar} />
                    <div style={{ ...S.bar, ...S.barShort }} />
                  </div>
                  <div style={S.block}>
                    <div style={S.blockTitle}>KEAHLIAN</div>
                    <div style={S.dots}>
                      <span style={S.dot} /><span style={S.dot} /><span style={S.dot} /><span style={S.dot} /><span style={S.dot} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED (RUNNING) */}
      <section style={S.trusted}>
        <div style={S.wrap}>
          <p style={S.trustedTitle}>Dipercaya profesional di perusahaan ternama</p>
          <div style={S.logosViewport} ref={viewportRef}>
            <div
              ref={trackRef}
              style={{
                ...S.logos,
                gap: isMobile ? 20 : 28,
                transform: `translateX(${offset}px)`,
              }}
            >
              {marqueeData.map((c, idx) => (
              <a
                key={`${c.name}-${idx}`}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                aria-label={c.name}
                title={c.name}
                style={{ ...S.logoItem, width: isMobile ? 140 : 180, height: isMobile ? 50 : 60 }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) Object.assign(img.style, { filter: "grayscale(0%) opacity(1)", transform: "scale(1.05)" });
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) Object.assign(img.style, { filter: "grayscale(100%) opacity(.8)", transform: "none" });
                }}
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  style={{ ...S.logoImg, maxWidth: isMobile ? 110 : 140, maxHeight: isMobile ? 38 : 48 }}
                  loading="lazy"
                  onError={(e) => {
                    // sembunyikan gambar & tampilkan teks fallback
                    e.currentTarget.style.display = "none";
                    const fb = e.currentTarget.nextElementSibling;
                    if (fb) fb.style.display = "inline-block";
                  }}
                />
                <span
                  className="logo-fallback"
                  style={{
                    display: "none",
                    fontWeight: 700,
                    color: "#64748b",
                    fontSize: isMobile ? 14 : 16,
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                  }}
                >
                  {c.name}
                </span>
              </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={S.section}>
        <h2 style={S.sectionTitle}>Kenapa CVKU.id Berbeda?</h2>
        <p style={S.sectionDesc}>Bukan sekadar template. Ini senjata untuk lolos screening HRD.</p>

        <div style={{ ...S.grid3, gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 14 : 18 }}>
          <div
            style={S.card}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(15,23,42,.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,23,42,.08)")}
          >
            <div style={S.iconBox}><Target /></div>
            <h3 style={S.cardTitle}>Skor ATS Real-time</h3>
            <p style={{ color: "#64748b", lineHeight: 1.6 }}>
              Lihat skor CV dan dapatkan saran spesifik untuk meningkatkannya. Rata-rata pengguna naik dari 60% ke 95%.
            </p>
            <span style={S.chip}>Eksklusif</span>
          </div>

          <div
            style={S.card}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(15,23,42,.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,23,42,.08)")}
          >
            <div style={S.iconBox}><Sparkles /></div>
            <h3 style={S.cardTitle}>Template Khusus Indonesia</h3>
            <p style={{ color: "#64748b", lineHeight: 1.6 }}>
              Disukai HRD di berbagai industri: startup hingga BUMN. Teruji di 500+ perusahaan lokal.
            </p>
            <span style={S.chip}>Leader Pasar</span>
          </div>

          <div
            style={S.card}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(15,23,42,.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,23,42,.08)")}
          >
            <div style={S.iconBox}><Bot /></div>
            <h3 style={S.cardTitle}>AI Writing Assistant</h3>
            <p style={{ color: "#64748b", lineHeight: 1.6 }}>
              Bingung merangkum pengalaman? AI kami bantu membuat deskripsi yang tajam & relevan dengan posisi.
            </p>
            <span style={S.chip}>Powered by AI</span>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section style={{ ...S.section, ...S.proofBox }}>
        <h2 style={S.sectionTitle}>Bukan Cuma Janji — Ini Buktinya</h2>
        <div style={{ ...S.proofGrid, gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 12 : 16 }}>
          <div style={S.pCard}><div style={S.pNum}>{cvCount.toLocaleString()}</div><div style={S.pLabel}>CV Berhasil Dibuat</div></div>
          <div style={S.pCard}><div style={S.pNum}>95%</div><div style={S.pLabel}>Dapat Interview</div></div>
          <div style={S.pCard}><div style={S.pNum}>14</div><div style={S.pLabel}><span>Hari Rata-rata</span><div style={{fontSize:13,color:"#64748b"}}>Diterima Kerja</div></div></div>
          <div style={S.pCard}><div style={S.pNum}>4.8/5</div><div style={S.pLabel}>Rating Pengguna</div></div>
        </div>
        <div style={S.quote}>
          <p style={S.quoteP}>"Setelah pakai CVKU.id, panggilan interview langsung berdatangan."</p>
          <strong>— Rata-rata ulasan pengguna</strong>
        </div>
      </section>

      {/* CTA */}
      <section style={S.cta}>
        <div style={S.ctaInner}>
          <h2 style={S.ctaTitle}>Siap Jadi Kandidat Favorit HRD?</h2>
          <p style={S.ctaSub}>Bergabung dengan ribuan profesional Indonesia yang sudah membuktikannya.</p>
          <div style={{ marginBottom: 14 }}>
            <a
              href="/editor"
              style={{ ...S.btn, ...S.btnPrimary, padding: "14px 22px", fontSize: "1.05rem" }}
              onMouseEnter={(e) => hover(e.currentTarget, true, {
                on: { transform: "translateY(-1.5px)", boxShadow: "0 14px 34px rgba(37,99,235,.35)", background: "#1d4ed8" },
                off: {},
              })}
              onMouseLeave={(e) => hover(e.currentTarget, false, {
                on: {}, off: { transform: "none", boxShadow: "0 10px 28px rgba(37,99,235,.25)", background: "#2563eb" },
              })}
            >
              Buat CV Gratis Sekarang
            </a>
          </div>

          <div style={S.guarantee}>
            <span style={S.guaranteePill}><Lock size={16} /> Data aman</span>
            <span style={S.guaranteePill}><Clock size={16} /> Hasil cepat (±5 menit)</span>
            <span style={S.guaranteePill}><Shield size={16} /> Gratis untuk mulai</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ ...S.section, ...S.faqBox }}>
        <h2 style={S.sectionTitle}>Pertanyaan yang Sering Ditanyakan</h2>
        <div style={S.faqWrap}>
          {faqData.map((faq, i) => {
            const open = openFAQ === i;
            return (
              <div key={i} style={S.faqItem}>
                <button
                  style={S.faqQ}
                  onClick={() => toggleFAQ(i)}
                  aria-expanded={open}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#0f172a")}
                >
                  <span>{faq.q}</span>
                  <span style={{ ...S.plus, transform: open ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                <div
                  ref={(el) => (faqRefs.current[i] = el)}
                  style={{ ...S.faqAOuter, height: 0 }}
                >
                  <div><p style={S.faqAText}>{faq.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MOBILE STICKY CTA */}
      {isMobile && (
        <div style={{ ...S.sticky, display: "block" }}>
          <a
            href="/editor"
            style={{ ...S.btn, ...S.btnPrimary, width: "100%" }}
            onMouseEnter={(e) => hover(e.currentTarget, true, {
              on: { transform: "translateY(-1px)", background: "#1d4ed8" },
              off: {},
            })}
            onMouseLeave={(e) => hover(e.currentTarget, false, {
              on: {}, off: { transform: "none", background: "#2563eb" },
            })}
          >
            Mulai Gratis Sekarang
          </a>
        </div>
      )}
    </div>
  );
}
