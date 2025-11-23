"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Quote,
  Award,
  FileText,
  TrendingUp,
  Target,
  Shield,
  Clock,
  Users,
  Zap,
  Star,
  Lock,
  Check,
  ChevronDown,
} from "lucide-react";
import { supabase } from "../../hooks/useAuth";

// Helper format Rupiah
const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const pricingPlans = {
  trial7: [
    {
      sku: "CVB-FREE",
      name: "Gratis",
      price: 0,
      features: ["1 CV", "Download PDF", "3 Template Dasar", "Basic Support"],
      popular: false,
      limits: "1 CV/bulan",
    },
    {
      sku: "CVB-TRIAL-7",
      name: "Trial Pro",
      price: 1,
      priceSuffix: "/ 7 hari",
      originalPrice: 75000,
      features: [
        "CV Tanpa Batas",
        "Semua Template Premium",
        "Analisis CV AI",
        "Support Prioritas",
        "7 Hari Full Access",
      ],
      popular: true,
      limits: "Unlimited",
      badge: "Coba Dulu!",
    },
    {
      sku: "CVB-PRO-MONTHLY",
      name: "Pro",
      price: 1,
      priceSuffix: "/ bulan",
      features: [
        "CV Tanpa Batas",
        "Semua Template Premium",
        "Analisis CV AI",
        "Support Prioritas",
        "Export Multiple Format",
      ],
      popular: false,
      limits: "Unlimited",
    },
  ],
  trial14: [
    {
      sku: "CVB-FREE",
      name: "Gratis",
      price: 0,
      features: ["1 CV", "Download PDF", "3 Template Dasar", "Basic Support"],
      popular: false,
      limits: "1 CV/bulan",
    },
    {
      sku: "CVB-TRIAL-14",
      name: "Trial Pro",
      price: 1,
      priceSuffix: "/ 14 hari",
      originalPrice: 75000,
      features: [
        "CV Tanpa Batas",
        "Semua Template Premium",
        "Analisis CV AI",
        "Support Prioritas",
        "14 Hari Full Access",
        "Money Back Guarantee",
      ],
      popular: true,
      limits: "Unlimited",
      badge: "Paling Populer!",
    },
    {
      sku: "CVB-PRO-MONTHLY",
      name: "Pro",
      price: 1,
      priceSuffix: "/ bulan",
      features: [
        "CV Tanpa Batas",
        "Semua Template Premium",
        "Analisis CV AI",
        "Support Prioritas",
        "Export Multiple Format",
      ],
      popular: false,
      limits: "Unlimited",
    },
  ],
  monthly: [
    {
      sku: "CVB-FREE",
      name: "Gratis",
      price: 0,
      features: ["1 CV", "Download PDF", "3 Template Dasar", "Basic Support"],
      popular: false,
      limits: "1 CV/bulan",
    },
    {
      sku: "CVB-PRO-MONTHLY",
      name: "Pro",
      price: 1,
      priceSuffix: "/ bulan",
      features: [
        "CV Tanpa Batas",
        "Semua Template Premium",
        "Analisis CV AI",
        "Support Prioritas",
        "Export Multiple Format",
      ],
      popular: true,
      limits: "Unlimited",
    },
    {
      sku: "CVB-TEAM-MONTHLY",
      name: "Tim",
      price: 1,
      priceSuffix: "/ bulan",
      features: [
        "Semua Fitur Pro",
        "5 Anggota Tim",
        "Manajemen Terpusat",
        "Analytics Dashboard",
        "Custom Branding",
      ],
      popular: false,
      limits: "5 users",
    },
  ],
  yearly: [
    {
      sku: "CVB-FREE",
      name: "Gratis",
      price: 0,
      features: ["1 CV", "Download PDF", "3 Template Dasar", "Basic Support"],
      popular: false,
      limits: "1 CV/bulan",
    },
    {
      sku: "CVB-PRO-YEARLY",
      name: "Pro",
      price: 1,
      priceSuffix: "/ tahun",
      originalPrice: 900000,
      features: [
        "HEMAT 33%!",
        "CV Tanpa Batas",
        "Semua Template Premium",
        "Analisis CV AI",
        "Support Prioritas",
        "Export Multiple Format",
      ],
      popular: true,
      limits: "Unlimited",
      badge: "Best Value!",
    },
    {
      sku: "CVB-TEAM-YEARLY",
      name: "Tim",
      price: 1,
      priceSuffix: "/ tahun",
      originalPrice: 3000000,
      features: [
        "HEMAT 33%!",
        "Semua Fitur Pro",
        "5 Anggota Tim",
        "Manajemen Terpusat",
        "Analytics Dashboard",
        "Custom Branding",
      ],
      popular: false,
      limits: "5 users",
    },
  ],
};

const testimonials = [
  {
    quote: "Setelah pakai CVBuilder Pro, salary saya naik 45% di job baru! ROI-nya incredible, worth every rupiah.",
    name: "Andi Wijaya",
    title: "Senior Software Engineer",
    company: "Tokopedia",
    increase: "+45% salary",
  },
  {
    quote: "Trial 14 hari bikin saya yakin. Dalam 2 minggu dapat 5 panggilan interview, langsung upgrade ke yearly!",
    name: "Sarah Putri",
    title: "UI/UX Designer",
    company: "Gojek",
    result: "5 interviews",
  },
  {
    quote: "Fresh grad dengan CVBuilder Pro? Game changer! Dapat kerja di startup unicorn dalam 3 minggu.",
    name: "Budi Santoso",
    title: "Product Manager",
    company: "Startup Unicorn",
    result: "Hired in 3 weeks",
  },
];

const pricingFAQ = [
  {
    q: "Apakah ada money-back guarantee?",
    a: "Ya! Kami memberikan 100% money-back guarantee dalam 30 hari pertama jika Anda tidak puas dengan hasilnya.",
  },
  {
    q: "Bagaimana cara kerja trial 7/14 hari?",
    a: "Trial memberikan akses penuh ke semua fitur Pro selama periode tersebut. Setelah selesai, Anda bisa upgrade ke paket bulanan/tahunan atau downgrade ke gratis.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Absolutely! Kami menggunakan enkripsi SSL 256-bit dan server yang comply dengan standar keamanan internasional. Data tidak akan dibagikan ke pihak ketiga.",
  },
  {
    q: "Bisakah saya cancel kapan saja?",
    a: "Ya, Anda bisa cancel subscription kapan saja tanpa penalty. Akses premium akan berlanjut sampai akhir periode yang sudah dibayar.",
  },
];

const comparisonFeatures = [
  { name: "Jumlah CV", free: "1", pro: "Unlimited", team: "Unlimited" },
  { name: "Template Premium", free: "3 Basic", pro: "50+ Premium", team: "50+ Premium" },
  { name: "AI Analysis", free: false, pro: true, team: true },
  { name: "Export Format", free: "PDF", pro: "PDF, Word, PNG", team: "All Formats" },
  { name: "Support", free: "Email", pro: "Priority", team: "Dedicated" },
  { name: "Team Management", free: false, pro: false, team: true },
];

const planMap = {
  "CVB-TRIAL-7": "premium_7_days",
  "CVB-TRIAL-14": "premium_14_days",
  "CVB-PRO-MONTHLY": "premium_monthly",
  "CVB-PRO-YEARLY": "premium_yearly",
  "CVB-TEAM-MONTHLY": "premium_monthly",
  "CVB-TEAM-YEARLY": "premium_yearly",
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("trial14");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const uid = data?.user?.id || "";
        if (mounted) setUserId(uid);
        if (uid) window.SUPABASE_USER_ID = uid;
      } catch (_) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChoosePlan = async (plan) => {
    if (plan.price === 0) {
      window.location.href = "/editor";
      return;
    }

    setLoadingPlan(plan.name);

    try {
      const mappedPlan = planMap[plan.sku];
      if (!mappedPlan) {
        alert("SKU tidak dikenali. Hubungi admin.");
        setLoadingPlan(null);
        return;
      }

      const res = await fetch("/api/tripay/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userId ? { "x-user-id": userId } : {}),
        },
        body: JSON.stringify({
          plan: mappedPlan,
          sku: plan.sku,
        }),
      });

      const data = await res.json();

      if (res.ok && data?.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert(`Gagal membuat transaksi: ${data?.error || "Terjadi kesalahan."}`);
        setLoadingPlan(null);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke server.");
      setLoadingPlan(null);
    }
  };

  const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

  const currentPlans = pricingPlans[billingCycle];

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-text">
            <h1>Investasi Terbaik untuk Karir Masa Depan Anda</h1>
            <p className="subtitle">
              Bergabung dengan <strong>15,000+ professionals</strong> yang berhasil meningkatkan karir mereka.
              Rata-rata pengguna Pro mendapat <strong>salary increase 40%</strong> dalam 6 bulan.
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <Users size={28} />
              <div>
                <strong>15,000+</strong>
                <span>Professionals</span>
              </div>
            </div>
            <div className="stat">
              <TrendingUp size={28} />
              <div>
                <strong>40%</strong>
                <span>Avg Salary Increase</span>
              </div>
            </div>
            <div className="stat">
              <Clock size={28} />
              <div>
                <strong>2 Minggu</strong>
                <span>Rata-rata Hired</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="icon-grid">
            <div className="icon-card">
              <Award size={64} />
            </div>
            <div className="icon-card">
              <FileText size={64} />
            </div>
            <div className="icon-card">
              <TrendingUp size={64} />
            </div>
            <div className="icon-card">
              <Target size={64} />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="trust-badges">
        <div className="badge">
          <Star size={18} />
          <span>4.9/5 rating</span>
        </div>
        <div className="badge">
          <Lock size={18} />
          <span>Money Back Guarantee</span>
        </div>
        <div className="badge">
          <Shield size={18} />
          <span>SSL Encrypted</span>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="billing-section">
        <h2>Pilih Periode yang Cocok untuk Anda</h2>
        <div className="billing-tabs">
          <button
            className={`tab ${billingCycle === "trial7" ? "active" : ""}`}
            onClick={() => setBillingCycle("trial7")}
          >
            7 Hari Trial
          </button>
          <button
            className={`tab ${billingCycle === "trial14" ? "active" : ""}`}
            onClick={() => setBillingCycle("trial14")}
          >
            14 Hari Trial
          </button>
          <button
            className={`tab ${billingCycle === "monthly" ? "active" : ""}`}
            onClick={() => setBillingCycle("monthly")}
          >
            Bulanan
          </button>
          <button
            className={`tab ${billingCycle === "yearly" ? "active" : ""}`}
            onClick={() => setBillingCycle("yearly")}
          >
            Tahunan
            <span className="save-badge">Hemat 33%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {currentPlans.map((plan, index) => (
          <div key={index} className={`card ${plan.popular ? "popular" : ""}`}>
            {plan.badge && <div className="badge-popular">{plan.badge}</div>}
            
            <div className="card-header">
              <h3>{plan.name}</h3>
              {plan.originalPrice && (
                <span className="original-price">{formatCurrency(plan.originalPrice)}</span>
              )}
              <div className="price">
                <span className="amount">{formatCurrency(plan.price)}</span>
                {plan.priceSuffix && <span className="suffix">{plan.priceSuffix}</span>}
              </div>
              <div className="limits">{plan.limits}</div>
            </div>

            <ul className="features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <CheckCircle2 size={18} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleChoosePlan(plan)}
              className={`btn-choose ${plan.popular ? "primary" : "secondary"}`}
              disabled={loadingPlan === plan.name}
            >
              {loadingPlan === plan.name
                ? "Memproses..."
                : plan.price === 0
                ? "Mulai Gratis"
                : plan.name.includes("Trial")
                ? "Mulai Trial"
                : "Pilih Paket"}
            </button>

            {plan.popular && (
              <div className="guarantee">
                <Shield size={16} />
                <span>30 hari money-back guarantee</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison */}
      <div className="comparison-section">
        <button className="btn-toggle" onClick={() => setShowComparison(!showComparison)}>
          {showComparison ? "Sembunyikan" : "Lihat"} Perbandingan Lengkap
          <ChevronDown size={20} className={showComparison ? "rotate" : ""} />
        </button>

        {showComparison && (
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Fitur</th>
                  <th>Gratis</th>
                  <th>Pro</th>
                  <th>Tim</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index}>
                    <td className="feature-name">{feature.name}</td>
                    <td>
                      {typeof feature.free === "boolean" ? (
                        feature.free ? <Check size={20} className="check" /> : "—"
                      ) : (
                        feature.free
                      )}
                    </td>
                    <td>
                      {typeof feature.pro === "boolean" ? (
                        feature.pro ? <Check size={20} className="check" /> : "—"
                      ) : (
                        feature.pro
                      )}
                    </td>
                    <td>
                      {typeof feature.team === "boolean" ? (
                        feature.team ? <Check size={20} className="check" /> : "—"
                      ) : (
                        feature.team
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>Success Stories dari Pengguna Pro</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial">
              <Quote size={32} className="quote-icon" />
              <p className="quote-text">"{t.quote}"</p>
              <div className="author">
                <div className="author-info">
                  <strong>{t.name}</strong>
                  <span>{t.title} • {t.company}</span>
                </div>
                <div className="metric">{t.increase || t.result}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <h2>Pertanyaan Seputar Harga</h2>
        <div className="faq-list">
          {pricingFAQ.map((faq, index) => (
            <div key={index} className={`faq-item ${openFAQ === index ? "open" : ""}`}>
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{faq.q}</span>
                <ChevronDown size={20} />
              </button>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .pricing-page {
          font-family: 'Poppins', -apple-system, system-ui, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 24px 60px;
          background: #ffffff;
        }

        /* Hero */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          margin-bottom: 56px;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .hero-text {
          margin-bottom: 16px;
        }

        .hero-text h1 {
          font-size: clamp(32px, 5vw, 42px);
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
          letter-spacing: -0.03em;
          line-height: 1.15;
        }

        .subtitle {
          font-size: clamp(14px, 2.5vw, 16px);
          color: #64748b;
          line-height: 1.7;
        }

        .subtitle strong {
          color: #0f172a;
          font-weight: 600;
        }

        .hero-stats {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 140px;
        }

        .stat svg {
          color: #3b82f6;
          flex-shrink: 0;
          width: 24px;
          height: 24px;
        }

        .stat div {
          display: flex;
          flex-direction: column;
        }

        .stat strong {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }

        .stat span {
          font-size: 11px;
          color: #64748b;
          line-height: 1.4;
          margin-top: 3px;
        }

        .hero-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 420px;
        }

        .icon-card {
          aspect-ratio: 1;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          padding: 28px;
        }

        .icon-card svg {
          width: 56px;
          height: 56px;
        }

        .icon-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .icon-card:nth-child(1) {
          color: #f59e0b;
        }

        .icon-card:nth-child(2) {
          color: #3b82f6;
        }

        .icon-card:nth-child(3) {
          color: #10b981;
        }

        .icon-card:nth-child(4) {
          color: #ef4444;
        }

        /* Trust Badges */
        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 48px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #475569;
          font-weight: 500;
        }

        .badge svg {
          color: #f59e0b;
        }

        /* Billing Section */
        .billing-section {
          text-align: center;
          margin-bottom: 48px;
        }

        .billing-section h2 {
          font-size: 24px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 24px;
        }

        .billing-tabs {
          display: inline-flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 12px;
          gap: 4px;
        }

        .tab {
          padding: 12px 24px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .tab:hover {
          color: #0f172a;
        }

        .tab.active {
          background: white;
          color: #0f172a;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .save-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #10b981;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }

        /* Pricing Grid */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px 24px;
          position: relative;
          transition: all 0.2s;
        }

        .card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .card.popular {
          border-color: #3b82f6;
          box-shadow: 0 8px 24px rgba(59,130,246,0.15);
        }

        .badge-popular {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #3b82f6;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .card-header {
          text-align: center;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f1f5f9;
        }

        .card-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .original-price {
          display: block;
          text-decoration: line-through;
          color: #94a3b8;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin-bottom: 12px;
        }

        .amount {
          font-size: 40px;
          font-weight: 700;
          color: #0f172a;
        }

        .suffix {
          font-size: 14px;
          color: #64748b;
        }

        .limits {
          display: inline-block;
          background: #f1f5f9;
          color: #475569;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
        }

        .features {
          list-style: none;
          margin-bottom: 24px;
        }

        .features li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
          font-size: 14px;
          color: #475569;
        }

        .features svg {
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .btn-choose {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-choose.primary {
          background: #10b981;
          color: white;
        }

        .btn-choose.primary:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16,185,129,0.3);
        }

        .btn-choose.secondary {
          background: #f1f5f9;
          color: #0f172a;
        }

        .btn-choose.secondary:hover {
          background: #e2e8f0;
        }

        .btn-choose:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        .guarantee {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 16px;
          font-size: 13px;
          color: #10b981;
          font-weight: 500;
        }

        /* Comparison */
        .comparison-section {
          margin-bottom: 64px;
          text-align: center;
        }

        .btn-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-toggle:hover {
          border-color: #cbd5e1;
        }

        .btn-toggle svg {
          transition: transform 0.2s;
        }

        .btn-toggle svg.rotate {
          transform: rotate(180deg);
        }

        .comparison-table {
          margin-top: 24px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 16px 12px;
          text-align: left;
          border-bottom: 1px solid #f1f5f9;
        }

        th {
          background: #f8fafc;
          font-weight: 600;
          color: #0f172a;
          font-size: 14px;
        }

        td {
          font-size: 14px;
          color: #64748b;
        }

        .feature-name {
          font-weight: 500;
          color: #0f172a;
        }

        .check {
          color: #10b981;
        }

        /* Testimonials */
        .testimonials {
          margin-bottom: 64px;
        }

        .testimonials h2 {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 32px;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .testimonial {
          background: #f8fafc;
          padding: 24px;
          border-radius: 12px;
          position: relative;
        }

        .quote-icon {
          color: #cbd5e1;
          margin-bottom: 16px;
        }

        .quote-text {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 20px;
          font-style: italic;
        }

        .author {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .author-info strong {
          display: block;
          font-size: 15px;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .author-info span {
          font-size: 13px;
          color: #64748b;
        }

        .metric {
          background: #10b981;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        /* FAQ */
        .faq {
          margin-bottom: 64px;
        }

        .faq h2 {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin-bottom: 32px;
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-item {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 12px;
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: none;
          border: none;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .faq-question:hover {
          background: #f8fafc;
        }

        .faq-question svg {
          flex-shrink: 0;
          transition: transform 0.2s;
          color: #64748b;
        }

        .faq-item.open .faq-question svg {
          transform: rotate(180deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .faq-item.open .faq-answer {
          max-height: 500px;
        }

        .faq-answer p {
          padding: 0 24px 20px 24px;
          font-size: 14px;
          line-height: 1.6;
          color: #64748b;
        }

        /* Responsive */
        @media (max-width: 968px) {
          .hero {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-right {
            justify-content: center;
          }

          .icon-grid {
            max-width: 400px;
          }
        }

        @media (max-width: 768px) {
          .pricing-page {
            padding: 100px 16px 40px;
          }

          .hero-stats {
            flex-direction: column;
            gap: 16px;
          }

          .stat {
            min-width: auto;
          }

          .icon-grid {
            max-width: 320px;
            gap: 16px;
          }

          .icon-card {
            padding: 24px;
          }

          .icon-card svg {
            width: 56px;
            height: 56px;
          }

          .trust-badges {
            flex-direction: row;
            justify-content: center;
          }

          .billing-tabs {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }

          .tab {
            width: 100%;
          }

          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .author {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .pricing-page {
            padding: 90px 12px 32px;
          }

          .hero-text h1 {
            font-size: 28px;
          }

          .icon-grid {
            grid-template-columns: 1fr;
            max-width: 200px;
          }

          .icon-card svg {
            width: 48px;
            height: 48px;
          }

          .card {
            padding: 24px 16px;
          }

          .faq-question {
            padding: 16px 20px;
            font-size: 14px;
          }

          .faq-answer p {
            padding: 0 20px 16px 20px;
          }
        }
      `}</style>
    </div>
  );
}