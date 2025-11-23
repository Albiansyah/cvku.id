"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../hooks/useAuth";
import { 
  UploadCloud, Target, Edit3, Layout, ArrowRight, CheckCircle,
  Zap, Users, FileText, TrendingUp, Shield, Clock, X, AlertCircle, 
  ChevronDown, ArrowDown, Quote, GraduationCap, HelpCircle
} from "lucide-react";

export default function ImproveCvPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [stats, setStats] = useState({ cvs: 0, users: 0, success: 0 });

  // State untuk FAQ, item pertama terbuka secara default
  const [openFaq, setOpenFaq] = useState(0); 

  useEffect(() => {
    const animate = (key, end, duration = 1500) => {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(start) }));
      }, 16);
    };
    animate('cvs', 12547);
    animate('users', 8392);
    animate('success', 94);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) validateFile(e.dataTransfer.files[0]);
  };

  const validateFile = (f) => {
    if (!f) return;
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(f.type)) {
      setError("Hanya file PDF atau DOCX yang diizinkan");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Ukuran file harus di bawah 10MB");
      return;
    }
    setFile(f);
    setError("");
  };

  const simulateProgress = async () => {
    for (let i = 0; i <= 90; i += 8) {
      await new Promise(r => setTimeout(r, 80));
      setUploadProgress(i);
    }
  };

  const handleUpload = async (mode = "comprehensive") => {
    if (!file) return setError("Silakan pilih file terlebih dahulu.");
    if (!currentUser?.id) return setError("Anda harus login.");

    try {
      setUploading(true);
      setError("");
      setUploadProgress(0);
      simulateProgress().catch(() => {});
      const safeName = file.name.replace(/\s+/g, "_");
      const fileName = `${Date.now()}_${safeName}`;
      const filePath = `${currentUser.id}/${fileName}`;

      const { error: upErr } = await supabase.storage.from("cv_uploads").upload(filePath, file, { upsert: false });
      if (upErr) throw upErr;

      const title = file.name.replace(/\.[^/.]+$/, "");
      const payload = { user_id: currentUser.id, title, template_id: null, cv_data: { storage_bucket: "cv_uploads", storage_path: filePath }, download_count: 0, has_watermark: false };
      const { data: inserted, error: insErr } = await supabase.from("cvs").insert([payload]).select().single();
      if (insErr) throw insErr;

      setUploadProgress(100);
      const routes = { comprehensive: `/improveCv/results?cvId=${inserted.id}`, ats: `/improveCv/ats-score?cvId=${inserted.id}`, edit: `/editor?cvId=${inserted.id}` };
      router.push(routes[mode] || routes.edit);
    } catch (e) {
      console.error(e);
      setError(e.message || "Gagal mengunggah");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 600);
    }
  };

  const ActionCard = ({ icon: Icon, title, desc, color, action, recommended }) => (
    <div onClick={action} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"} style={{ background: 'white', borderRadius: '1rem', padding: '1.75rem 1.5rem', borderTop: `3px solid ${color}`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.3s', position: 'relative' }}>
      {recommended && (<div style={{ position: 'absolute', top: '1rem', right: '1rem', background: color, color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>Disarankan</div>)}
      <div style={{ width: '56px', height: '56px', borderRadius: '0.875rem', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}><Icon size={28} color={color} strokeWidth={1.8} /></div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', margin: '0 0 0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: '1.5', margin: '0 0 1rem' }}>{desc}</p>
      <ArrowRight size={18} color={color} />
    </div>
  );

  const FaqItem = ({ q, a, isOpen, onToggle }) => {
    return (
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.875rem', marginBottom: '0.75rem', overflow: 'hidden', transition: 'box-shadow 0.3s', boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}>
        <button onClick={onToggle} style={{ width: '100%', background: 'none', border: 'none', padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.95rem', fontWeight: '600', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HelpCircle size={20} color={isOpen ? '#8b5cf6' : '#9ca3af'} style={{ transition: 'color 0.3s' }} />
            <span>{q}</span>
          </div>
          <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s', flexShrink: 0 }} />
        </button>
        <div style={{ maxHeight: isOpen ? '200px' : '0', transition: 'max-height 0.4s ease-in-out' }}>
          <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.9rem', color: '#6b7280', lineHeight: '1.6', background: '#fafafa', borderTop: '1px solid #f3f4f6' }}>
            {a}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingTop: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '4rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } } @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } } @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } } @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } } @keyframes pulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes bobbing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        .animate-slide-left { animation: slideInLeft 0.8s ease-out; } .animate-slide-right { animation: slideInRight 0.8s ease-out; } .float-animation { animation: float 3s ease-in-out infinite; } .pulse-animation { animation: pulse 2s ease-in-out infinite; }
        @media (max-width: 992px) { .feature-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .hero-title { font-size: 2rem !important; } .hero-grid { grid-template-columns: 1fr !important; } .stats-grid, .cards-grid { grid-template-columns: 1fr !important; } .illustration-container { display: none !important; } .cta-grid { flex-direction: column; text-align: center; gap: 1rem !important; } }
      `}</style>

      {/* Hero Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 5rem', position: 'relative' }}>
        {/* ... (Konten Hero Section tidak berubah, tetap sama) ... */}
         <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center' }}>
          <div className="animate-slide-left" style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', color: '#1e40af', padding: '0.6rem 1.25rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(30, 64, 175, 0.15)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1e40af', animation: 'pulse 2s ease-in-out infinite' }} />
              Pertama kali? Kami akan memandu Anda
            </div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(1rem, 5vw, 3.5rem)', fontWeight: '800', color: '#111827', lineHeight: '1.1', margin: '0 0 1.5rem', letterSpacing: '-0.03em' }}>
              Dapatkan Pekerjaan Impian <span style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block' }}>Lebih Cepat</span>
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: '#6b7280', lineHeight: '1.6', margin: '0 0 2rem', maxWidth: '540px' }}>
              Analisis CV bertenaga AI • Dapatkan hasil dalam 30 detik • Gratis untuk memulai
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '2.5rem', paddingTop: '1.5rem', borderTop: '2px solid #f3f4f6' }}>
              {[ { num: `${stats.cvs.toLocaleString()}+`, label: 'CV Dianalisis', color: '#8b5cf6' }, { num: `${stats.success}%`, label: 'Tingkat Sukses', color: '#10b981' }, { num: `${stats.users.toLocaleString()}+`, label: 'Pengguna Puas', color: '#f59e0b' } ].map((stat, i) => ( <div key={i} style={{ textAlign: 'left' }}> <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.4rem', background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stat.num}</div> <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>{stat.label}</div> </div> ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {[ { icon: CheckCircle, text: 'Optimal ATS', color: '#10b981' }, { icon: Shield, text: '100% Aman', color: '#8b5cf6' }, { icon: Clock, text: 'Analisis 30dtk', color: '#f59e0b' }, { icon: Zap, text: 'Didukung AI', color: '#ec4899' } ].map((item, i) => ( <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'white', padding: '0.7rem 1.1rem', borderRadius: '999px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'default' }}> <item.icon size={18} color={item.color} strokeWidth={2.5} /> <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>{item.text}</span> </div> ))}
            </div>
          </div>
          <div className="animate-slide-right illustration-container" style={{ position: 'relative', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="pulse-animation" style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)', borderRadius: '50%', top: '50px', left: '0' }} /> <div className="pulse-animation" style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', borderRadius: '50%', bottom: '50px', right: '0', animationDelay: '1s' }} /> <div className="float-animation" style={{ position: 'relative', width: '280px', height: '380px', background: 'white', borderRadius: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', padding: '2rem 1.5rem', zIndex: 2 }}> <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '2px solid #f3f4f6' }}> <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' }} /> <div style={{ flex: 1 }}> <div style={{ height: '12px', background: '#e5e7eb', borderRadius: '6px', marginBottom: '0.5rem', width: '120px' }} /> <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', width: '80px' }} /> </div> </div> {[100, 80, 90, 70, 100, 85, 95].map((width, i) => (<div key={i} style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', marginBottom: '0.75rem', width: `${width}%` }} />))} <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}> {['React', 'Node', 'Python'].map((skill, i) => (<div key={i} style={{ padding: '0.4rem 0.8rem', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600', color: '#16a34a' }}>{skill}</div>))} </div> </div> <div className="float-animation" style={{ position: 'absolute', top: '40px', right: '20px', width: '80px', height: '80px', background: 'white', borderRadius: '1.25rem', boxShadow: '0 12px 32px rgba(139, 92, 246, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', animationDelay: '0.5s', zIndex: 3 }}><Target size={40} color="#8b5cf6" strokeWidth={2} /></div> <div className="float-animation" style={{ position: 'absolute', bottom: '80px', left: '0', width: '70px', height: '70px', background: 'white', borderRadius: '1rem', boxShadow: '0 12px 32px rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', animationDelay: '1s', zIndex: 3 }}><CheckCircle size={36} color="#10b981" strokeWidth={2} /></div> <div className="float-animation" style={{ position: 'absolute', top: '55%', right: '-10px', width: '75px', height: '75px', background: 'white', borderRadius: '1.125rem', boxShadow: '0 12px 32px rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', animationDelay: '1.5s', zIndex: 3 }}><TrendingUp size={38} color="#f59e0b" strokeWidth={2} /></div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '-2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', animation: 'bobbing 2s ease-in-out infinite' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Gulir untuk fitur utama</span>
          <ArrowDown size={20} />
        </div>
      </div>

      {/* --- BAGIAN FITUR UTAMA (DIPERLEBAR & DIPERBAIKI) --- */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>Mulai Analisis CV Anda</h2>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>Unggah CV Anda untuk mendapatkan skor ATS, saran perbaikan dari AI, dan lihat seberapa cocok Anda dengan lowongan kerja.</p>
        </div>
        <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem 2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              {[ { icon: UploadCloud, label: 'Unggah CV', active: true }, { icon: Zap, label: 'Analisis AI', active: !!file }, { icon: FileText, label: 'Dapatkan Hasil', active: uploading }, ].map((step, i) => ( <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: step.active ? '#8b5cf6' : '#9ca3af', transition: 'color 0.3s' }}> <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: step.active ? '#f5f3ff' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}> <step.icon size={20} /> </div> <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{step.label}</span> </div> ))}
            </div>
            <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => !uploading && document.getElementById('fileInput')?.click()} style={{ border: file ? '2px solid #10b981' : '2px dashed #d1d5db', borderRadius: '1rem', padding: '2.5rem 1.5rem', textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', background: file ? '#f0fdf4' : dragActive ? '#faf5ff' : '#fafafa', marginBottom: '1.5rem', ...(dragActive && { borderColor: '#8b5cf6', transform: 'scale(1.02)' }) }}>
              {!file ? ( <> <UploadCloud size={48} color="#8b5cf6" style={{ margin: '0 auto 1rem' }} /> <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem' }}>Letakkan CV Anda di sini atau klik</h3> <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0' }}>PDF atau DOCX • Maks 10MB</p> <input id="fileInput" type="file" accept=".pdf,.docx" onChange={(e) => validateFile(e.target.files?.[0])} style={{ display: 'none' }} /> </> ) : ( <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> <FileText size={40} color="#10b981" /> <div style={{ flex: 1, textAlign: 'left' }}> <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.25rem', wordBreak: 'break-all' }}>{file.name}</h4> <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p> </div> <button onClick={(e) => { e.stopPropagation(); setFile(null); setError(""); }} style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}><X size={18} /></button> </div> )}
            </div>
            {error && (<div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '0.875rem 1rem', color: '#dc2626', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}><AlertCircle size={18} /> {error}</div>)}
            {uploading && ( <div style={{ marginBottom: '1.5rem' }}> <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.75rem' }}><div style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', width: `${uploadProgress}%`, transition: 'width 0.3s', borderRadius: '999px' }} /></div> <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', margin: '0' }}> {uploadProgress < 30 ? "📤 Mengunggah CV Anda..." : uploadProgress < 70 ? "🔍 Menganalisis konten..." : "✨ Hampir selesai..."} </p> </div> )}
            <button onClick={() => handleUpload("comprehensive")} disabled={!file || uploading} onMouseEnter={(e) => { if (file && !uploading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(139, 92, 246, 0.4)"; } }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = file && !uploading ? "0 4px 16px rgba(139, 92, 246, 0.3)" : "none"; }} style={{ width: '100%', padding: '1rem 1.5rem', borderRadius: '0.875rem', fontSize: '1rem', fontWeight: '700', border: 'none', cursor: !file || uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: 'all 0.3s', color: 'white', background: !file || uploading ? '#e5e7eb' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', boxShadow: !file || uploading ? 'none' : '0 4px 16px rgba(139, 92, 246, 0.3)' }}>
              {uploading ? (<><div style={{ width: '18px', height: '18px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Menganalisis...</>) : (<>Dapatkan Analisis Penuh (Disarankan) <ArrowRight size={20} /></>)}
            </button>
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', margin: '1rem 0 0', minHeight: '40px' }}>
              {!file ? "💡 Unggah CV untuk membuka alat analisis dan pengeditan." : "✅ CV Anda siap diproses! Klik tombol di atas untuk melihat keajaiban AI."}
            </p>
          </div>
          <div style={{ paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>Mengapa Menganalisis CV Anda?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[ { icon: Target, title: "Lolos Filter ATS", text: "Pastikan CV Anda dapat dibaca dengan benar oleh sistem pelacakan pelamar (ATS) yang digunakan oleh 90% perusahaan." }, { icon: Edit3, title: "Saran Cerdas dari AI", text: "Dapatkan masukan instan tentang cara memperbaiki deskripsi pekerjaan, poin-poin pencapaian, dan pilihan kata kunci Anda." }, { icon: Shield, title: "Privasi Anda Terjamin", text: "File yang Anda unggah dienkripsi dan hanya dapat diakses oleh Anda. Kami tidak akan pernah membagikan data Anda." }, ].map(item => ( <div key={item.title} style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}> <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '0.75rem', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <item.icon size={20} color="#8b5cf6" /> </div> <div> <h4 style={{ margin: '0 0 0.25rem', fontWeight: '600', color: '#1f2937' }}>{item.title}</h4> <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.text}</p> </div> </div> ))}
            </div>
            <div style={{ marginTop: '2.5rem', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '1rem', padding: '1.5rem', position: 'relative' }}>
              <Quote size={24} style={{ position: 'absolute', top: '1rem', left: '1rem', color: '#d1d5db', transform: 'rotate(180deg)' }} />
              <p style={{ fontStyle: 'italic', color: '#4b5563', margin: '0 0 1rem', padding: '0 1rem' }}>"Platform ini mengubah cara saya melamar kerja. Tiga panggilan interview dalam seminggu pertama setelah memperbaiki CV saya di sini!"</p>
              <p style={{ textAlign: 'right', fontWeight: '600', color: '#111827', margin: 0 }}>- Rian Pratama, <span style={{ color: '#6b7280', fontWeight: '500' }}>Digital Marketer</span></p>
            </div>
          </div>
        </div>
      </div>

      {file && ( <div style={{ maxWidth: '1200px', margin: '0 auto 5rem' }}> <div style={{ position: 'relative', textAlign: 'center', margin: '3rem auto 2rem' }}> <span style={{ background: '#fafafa', padding: '0 1rem', position: 'relative', zIndex: 1, color: '#9ca3af', fontSize: '0.9rem', fontWeight: '500' }}>Atau pilih tindakan cepat</span> <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)' }} /> </div> <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}> <ActionCard icon={Target} title="Skor ATS" desc="Periksa kompatibilitas dengan sistem lamaran kerja" color="#8b5cf6" recommended action={() => handleUpload("ats")} /> <ActionCard icon={Edit3} title="Edit Langsung" desc="Langsung ke editor dan mulai sesuaikan" color="#3b82f6" action={() => handleUpload("edit")} /> <ActionCard icon={Layout} title="Template" desc="Jelajahi 50+ desain profesional" color="#10b981" action={() => router.push("/templates")} /> </div> </div> )}

      {/* --- BAGIAN FAQ (DIPERBAIKI) --- */}
      <div style={{ maxWidth: '900px', margin: '5rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Masih Punya Pertanyaan?</h2>
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Kami punya jawaban untuk pertanyaan paling umum di sini.</p>
        </div>
        {[
          { q: "Berapa lama proses analisis?", a: "Biasanya 20-30 detik. Kami menganalisis struktur CV, kata kunci, kompatibilitas ATS, dan format Anda." },
          { q: "Apakah data saya aman?", a: "Ya! CV Anda dienkripsi dan hanya bisa dilihat oleh Anda. Kami tidak pernah membagikan data Anda dengan pihak ketiga." },
          { q: "Apakah ini benar-benar gratis?", a: "Analisis dasar 100% gratis. Fitur premium seperti unduhan tanpa batas tersedia di versi Pro." },
          { q: "Format file apa yang didukung?", a: "Kami mendukung file PDF dan DOCX hingga 10MB. PDF disarankan untuk hasil terbaik." }
        ].map((item, index) => (
          <FaqItem key={index} q={item.q} a={item.a} isOpen={openFaq === index} onToggle={() => setOpenFaq(openFaq === index ? null : index)} />
        ))}
      </div>

      {/* --- BOTTOM CTA (DIPERBAIKI) --- */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid #fcd34d', borderRadius: '1.5rem', padding: '2rem 2.5rem', boxShadow: '0 8px 30px rgba(252, 211, 77, 0.2)' }}>
        <div className="cta-grid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ flexShrink: 0, width: '60px', height: '60px', background: '#fff', border: '1px solid #fde68a', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={32} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#92400e', margin: '0 0 0.25rem' }}>Baru Lulus? Mulai Karir Anda di Sini.</h3>
              <p style={{ color: '#b45309', margin: 0, lineHeight: '1.5' }}>Kami telah membantu ribuan lulusan baru mendapatkan pekerjaan pertama mereka dengan CV yang menonjol.</p>
            </div>
          </div>
          <button onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"} style={{ padding: '0.75rem 1.5rem', background: '#92400e', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(146, 64, 14, 0.2)', whiteSpace: 'nowrap' }}>
            Buat CV Pertamamu
          </button>
        </div>
      </div>
    </div>
  );
}