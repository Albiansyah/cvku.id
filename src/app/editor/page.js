// src/app/editor/page.js

import { Suspense } from 'react';
import ClientEditorShell from './ClientEditorShell';

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div style={{ paddingTop: '120px', textAlign: 'center', fontFamily: '-apple-system, sans-serif' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Memuat CV Editor...</h2>
        <p style={{ color: '#64748b' }}>Menyiapkan kanvas kreatif Anda.</p>
      </div>
    }>
      <ClientEditorShell />
    </Suspense>
  );
}


// import { useEffect, useMemo, useRef, useState } from "react";

// import { useRouter } from "next/navigation";

// import useCvStore from "../../store/useCvStore";

// import { useAuth } from "../../hooks/useAuth";

// import useAuthModalStore from "../../store/useAuthModalStore";



// import PersonalInfoForm from "../../components/forms/PersonalInfoForm";

// import SummaryForm from "../../components/forms/SummaryForm";

// import EducationForm from "../../components/forms/EducationForm";

// import ExperienceForm from "../../components/forms/ExperienceForm";

// import OrganizationForm from "../../components/forms/OrganizationForm";

// import CertificationsForm from "../../components/forms/CertificationsForm";

// import SkillsForm from "../../components/forms/SkillsForm";

// import CVPreview from "../../components/CVPreview";



// export default function EditorPage() {

//   const router = useRouter();

//   const { currentUser } = useAuth();

//   const { openModal } = useAuthModalStore();

//   const cvData = useCvStore((s) => s.cv);



//   const [isSaving, setIsSaving] = useState(false);

//   const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

//   const [currentStep, setCurrentStep] = useState(0);

//   const [showPreview, setShowPreview] = useState(true);

//   const [validationError, setValidationError] = useState("");



//   const trackRef = useRef(null);

//   const previewBoxRef = useRef(null);

//   const touchStartX = useRef(null);

//   const touchDeltaX = useRef(0);



//   const formSections = useMemo(

//     () => [

//       { id: "personalInfo", title: "Informasi Pribadi", component: <PersonalInfoForm /> },

//       { id: "summary", title: "Ringkasan", component: <SummaryForm /> },

//       { id: "education", title: "Pendidikan", component: <EducationForm /> },

//       { id: "experience", title: "Pengalaman", component: <ExperienceForm /> },

//       { id: "organization", title: "Organisasi", component: <OrganizationForm /> },

//       { id: "certifications", title: "Sertifikasi", component: <CertificationsForm /> },

//       { id: "skills", title: "Keahlian", component: <SkillsForm /> },

//     ],

//     []

//   );



//   const progress = useMemo(() => Math.round(((currentStep + 1) / formSections.length) * 100), [currentStep, formSections.length]);



//   // === Resize preview observer -> sesuaikan tinggi form ===

//   useEffect(() => {

//     if (!showPreview) return;

//     const el = previewBoxRef.current;

//     if (!el) return;

//     const ro = new ResizeObserver(([entry]) => {

//       const h = Math.round(entry.contentRect.height);

//       document.documentElement.style.setProperty("--preview-h", `${h}px`);

//     });

//     ro.observe(el);

//     return () => ro.disconnect();

//   }, [showPreview]);



//   // === Save CV ===

//   const handleSave = async () => {

//     if (!currentUser) {

//       openModal("login");

//       setSaveMessage({ type: "warning", text: "Silakan login untuk menyimpan CV" });

//       setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);

//       return;

//     }



//     setIsSaving(true);

//     setSaveMessage({ type: "", text: "" });

//     try {

//       const token = await currentUser.getIdToken();

//       const res = await fetch("/api/cv/save", {

//         method: "POST",

//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },

//         body: JSON.stringify({

//           cvData,

//           userId: currentUser.uid,

//           userEmail: currentUser.email,

//           timestamp: new Date().toISOString(),

//         }),

//       });

//       const result = await res.json();

//       if (!res.ok) throw new Error(result?.error || "Terjadi kesalahan saat menyimpan.");

//       setSaveMessage({ type: "success", text: result.message || "CV berhasil disimpan!" });

//       if (result.cvId) setTimeout(() => router.push(`/cv/${result.cvId}`), 900);

//     } catch (e) {

//       setSaveMessage({ type: "error", text: `Gagal menyimpan: ${e.message}` });

//       console.error(e);

//     } finally {

//       setIsSaving(false);

//       setTimeout(() => setSaveMessage({ type: "", text: "" }), 5000);

//     }

//   };



//   const next = () => setCurrentStep((s) => Math.min(s + 1, formSections.length - 1));

//   const prev = () => setCurrentStep((s) => Math.max(s - 1, 0));

//   const goTo = (i) => setCurrentStep(i);

//   const togglePreview = () => setShowPreview((v) => !v);



//   // Keyboard arrows

//   useEffect(() => {

//     const onKey = (e) => {

//       if (e.key === "ArrowRight") next();

//       if (e.key === "ArrowLeft") prev();

//     };

//     window.addEventListener("keydown", onKey);

//     return () => window.removeEventListener("keydown", onKey);

//   }, []);



//   // Swipe

//   const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);

//   const onTouchMove = (e) => (touchDeltaX.current = e.touches[0].clientX - touchStartX.current);

//   const onTouchEnd = () => {

//     const threshold = 60;

//     if (touchDeltaX.current > threshold) prev();

//     else if (touchDeltaX.current < -threshold) next();

//     touchStartX.current = null;

//     touchDeltaX.current = 0;

//   };



//   // Slider transform

//   useEffect(() => {

//     if (!trackRef.current) return;

//     const percent = -currentStep * 100;

//     trackRef.current.style.transform = `translateX(${percent}%)`;

//   }, [currentStep]);



//   return (

//     <>

//       <div className="content-offset">

//         {/* Alerts */}

//         {saveMessage.text && (

//           <div className={`alert ${saveMessage.type}`}>{saveMessage.text}</div>

//         )}

//         {validationError && <div className="alert error">{validationError}</div>}



//         {/* Grid: form kiri — preview kanan */}

//         <div className="editor-wrap">

//           <section className="form-panel">

//             <div className="panel-head">

//               <div className="progress-meta">Progres {progress}%</div>

//               <div className="progress-outer"><div className="progress-inner" style={{ width: `${progress}%` }} /></div>

//               <button className="btn toggle" onClick={togglePreview}>

//                 {showPreview ? "Sembunyikan Pratinjau" : "Tampilkan Pratinjau"}

//               </button>

//             </div>



//             {/* Step Chips */}

//             <div className="step-chips">

//               {formSections.map((s, i) => (

//                 <button

//                   key={s.id}

//                   onClick={() => goTo(i)}

//                   className={`chip ${i === currentStep ? "active" : ""}`}

//                 >

//                   {i + 1}. {s.title}

//                 </button>

//               ))}

//             </div>



//             {/* Slider */}

//             <div

//               className="slider"

//               onTouchStart={onTouchStart}

//               onTouchMove={onTouchMove}

//               onTouchEnd={onTouchEnd}

//             >

//               <div className="track" ref={trackRef} style={{ width: `${formSections.length * 100}%` }}>

//                 {formSections.map((s) => (

//                   <div className="slide" key={s.id}>

//                     <div className="slide-inner">{s.component}</div>

//                   </div>

//                 ))}

//               </div>

//             </div>



//             {/* Navigation */}

//             <div className="nav-row">

//               <button className="btn muted" onClick={prev} disabled={currentStep === 0}>

//                 ← Sebelumnya

//               </button>

//               <div className="flex-spacer" />

//               {currentStep < formSections.length - 1 ? (

//                 <button className="btn primary" onClick={next}>Selanjutnya →</button>

//               ) : (

//                 <button className="btn success" onClick={handleSave} disabled={isSaving}>

//                   {isSaving ? "Menyimpan..." : "Selesai & Simpan"}

//                 </button>

//               )}

//             </div>

//           </section>



//           {showPreview && (

//             <aside className="preview-panel">

//               <div className="preview-sticky" ref={previewBoxRef}>

//                 <CVPreview />

//               </div>

//             </aside>

//           )}

//         </div>

//       </div>



//       <style jsx global>{`

//         :root{

//           --navbar-h: 64px;

//           --gutter: 16px;

//           --maxw: 1200px;

//           --preview-w: 820px;

//           --radius: 12px;

//           --border: #e5e7eb;

//           --muted: #64748b;

//           --bg: #ffffff;

//           --bgsoft: #f8fafc;

//           --brand: #0f172a;

//           --green: #16a34a;

//           --preview-h: auto;

//         }



//         .content-offset{

//           padding-top: calc(var(--navbar-h) + var(--gutter));

//         }



//         .editor-wrap{

//           margin: 16px auto;

//           padding: 0 var(--gutter) var(--gutter);

//           max-width: var(--maxw);

//           display: grid;

//           grid-template-columns: 1fr;

//           gap: 24px;

//         }

//         @media (min-width: 1100px){

//           .editor-wrap{ grid-template-columns: minmax(0,1fr) var(--preview-w); }

//         }



//         .form-panel{

//           background: var(--bg);

//           border: 1px solid var(--border);

//           border-radius: var(--radius);

//           padding: 16px;

//           min-height: var(--preview-h, 400px);

//         }



//         .preview-sticky{

//           position: sticky;

//           top: var(--gutter);

//           background: var(--bg);

//           border: 1px solid var(--border);

//           border-radius: var(--radius);

//           padding: 16px;

//         }



//         .panel-head{ display:flex; align-items:center; gap:12px; margin-bottom:12px; }

//         .progress-meta{ font-size:12px; color:var(--muted); }

//         .progress-outer{ flex:1; height:8px; background:#f1f5f9; border-radius:999px; overflow:hidden; }

//         .progress-inner{ height:100%; background:var(--brand); border-radius:999px; transition:width .25s ease; }



//         .step-chips{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:10px; }

//         .chip{ padding:6px 10px; border-radius:8px; border:1px solid var(--border); background:#f8fafc; font-size:12px; cursor:pointer; transition:.15s; }

//         .chip.active{ background:var(--brand); color:#fff; border-color:var(--brand); }



//         .slider{ position:relative; width:100%; overflow:hidden; border-radius:10px; background:var(--bgsoft); border:1px solid var(--border); }

//         .track{ display:flex; transition:transform .3s ease; }

//         .slide{ flex:0 0 100%; padding:12px; }

//         .slide-inner{ background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:12px; min-height:calc(var(--preview-h, 400px) - 32px); }



//         .nav-row{ display:flex; align-items:center; gap:8px; margin-top:12px; }

//         .flex-spacer{ flex:1; }



//         .btn{ padding:10px 16px; border-radius:8px; border:1px solid transparent; font-weight:600; cursor:pointer; transition:.15s; }

//         .btn.muted{ background:#f3f4f6; color:#334155; border-color:#e5e7eb; }

//         .btn.primary{ background:var(--brand); color:#fff; }

//         .btn.success{ background:var(--green); color:#fff; }

//         .btn:hover:not(:disabled){ filter:brightness(.95); }

//         .btn:disabled{ opacity:.5; cursor:not-allowed; }



//         .alert{ max-width:var(--maxw); margin:12px auto; padding:10px 12px; border-radius:10px; font-size:14px; }

//         .alert.success{ background:#ecfdf5; color:#065f46; }

//         .alert.warning{ background:#fffbeb; color:#92400e; }

//         .alert.error{ background:#fef2f2; color:#991b1b; }

//       `}</style>

//     </>

//   );

// }



// dan ada lagi client editor sheell:

// // src/app/editor/page.js

// import ClientEditorShell from './ClientEditorShell';



// export default function EditorPage() {

//   return (

//     <main className="min-h-screen bg-white">

//       <div className="mx-auto max-w-6xl p-6">

//         <h1 className="text-2xl font-semibold">Editor</h1>

//         <ClientEditorShell />

//       </div>

//     </main>

//   );

// }