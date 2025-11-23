// src/app/editor/ClientEditorShell.jsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useCvStore from "../../store/useCvStore";
import ResumeViewer from "../../components/resume/ResumeViewer";
import {
  User, Target, GraduationCap, Briefcase, Building, Award, Lightbulb,
  ChevronDown, Download, Eye, X, Crown, Wallet, FileType, Save, Check, AlertCircle, Sparkles
} from "lucide-react";

import { supabase } from "../../lib/supabaseClient";
import { generatePdfFromElement } from "./utils/generatePdf";
import LoginModal from "../../components/auth/LoginModal";

// 🔁 Fallback lokal untuk template yang belum ada row di DB
import { TEMPLATE_REGISTRY } from "../../components/resume/templates/registry";

// Helpers UI
const LabeledInput = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="form-group">
    <label>{label}</label>
    <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);
const LabeledTextarea = ({ label, rows = 6, value, onChange, placeholder }) => (
  <div className="form-group">
    <label>{label}</label>
    <textarea rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);
const toIDR = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(n || 0));

// Modal Konfirmasi Pembayaran
const PaymentModal = ({ isOpen, onClose, onConfirm, templateName, format, price, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <Wallet size={24} className="modal-icon" />
          <h3>Konfirmasi Pembayaran</h3>
        </div>
        <div className="modal-body">
          <div className="payment-details">
            <div className="detail-row">
              <span className="detail-label">Template:</span>
              <span className="detail-value">{templateName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Format:</span>
              <span className="detail-value">{format === 'pdf' ? 'PDF' : 'Word'}</span>
            </div>
            <div className="detail-row price-row">
              <span className="detail-label">Total:</span>
              <span className="detail-value price">{toIDR(price)}</span>
            </div>
          </div>
          <p className="payment-note">
            Setelah pembayaran berhasil, Anda akan dapat mengunduh CV dalam format {format === 'pdf' ? 'PDF' : 'Word'}.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-modal-cancel" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button className="btn-modal-confirm" onClick={onConfirm} disabled={loading}>
            {loading ? 'Memproses...' : 'Lanjut ke Pembayaran'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ClientEditorShell() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ==== Store CV ====
  const cv = useCvStore((s) => s.cv);
  const updatePersonalInfo = useCvStore((s) => s.updatePersonalInfo);
  const updateSummary = useCvStore((s) => s.updateSummary);
  const addEducation = useCvStore((s) => s.addEducation);
  const updateEducation = useCvStore((s) => s.updateEducation);
  const removeEducation = useCvStore((s) => s.removeEducation);
  const addExperience = useCvStore((s) => s.addExperience);
  const updateExperience = useCvStore((s) => s.updateExperience);
  const removeExperience = useCvStore((s) => s.removeExperience);
  const addOrganization = useCvStore((s) => s.addOrganization);
  const updateOrganization = useCvStore((s) => s.updateOrganization);
  const removeOrganization = useCvStore((s) => s.removeOrganization);
  const addCertification = useCvStore((s) => s.addCertification);
  const updateCertification = useCvStore((s) => s.updateCertification);
  const removeCertification = useCvStore((s) => s.removeCertification);
  const addSkill = useCvStore((s) => s.addSkill);
  const removeSkill = useCvStore((s) => s.removeSkill);

  // ==== UI & Auth ====
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [showPreview, setShowPreview] = useState(true);
  const [expandedSections, setExpandedSections] = useState(["personalInfo"]);
  const [mounted, setMounted] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [cvId, setCvId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ==== Payment Modal ====
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // ==== Template & Entitlements ====
  const [templateMeta, setTemplateMeta] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [checkingEnt, setCheckingEnt] = useState(false);
  const [entPdf, setEntPdf] = useState({ allowed: false, reason: "", price: 0 });
  const [entWord, setEntWord] = useState({ allowed: false, reason: "", price: 0 });
  const [profilePlan, setProfilePlan] = useState(null);

  useEffect(() => setMounted(true), []);

  // ==== Auth init & listener ====
  useEffect(() => {
    if (!mounted) return;
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsGuest(!user);
      if (user) {
        supabase
          .from("profiles")
          .select("active_plan, plan_expires_at")
          .eq("id", user.id).single()
          .then(({ data }) => setProfilePlan(data?.active_plan || null))
          .catch(() => null);
      }
    };
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      setIsGuest(!session);
      if (session) setShowLoginModal(false);
    });
    return () => subscription?.unsubscribe();
  }, [mounted]);

  // ==== Ambil template by slug (atau id) + fallback registry ====
  const paramTemplateId = searchParams.get("templateId") || "ats-free";
  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    const fetchTemplate = async () => {
      try {
        setLoadingTemplate(true);
        let row = null;
        let { data, error } = await supabase
          .from("templates")
          .select("id,name,slug,tier,supports_word,price_pdf,price_word")
          .eq("slug", paramTemplateId)
          .maybeSingle();

        if (!error && data) row = data;

        if (!row && /^[0-9a-f-]{36}$/i.test(paramTemplateId)) {
          const { data: byId } = await supabase
            .from("templates")
            .select("id,name,slug,tier,supports_word,price_pdf,price_word")
            .eq("id", paramTemplateId)
            .maybeSingle();
          if (byId) row = byId;
        }

        if (!row) {
          const local = TEMPLATE_REGISTRY[paramTemplateId];
          if (local) row = { ...local, id: null };
        }

        if (!cancelled) setTemplateMeta(row);
      } catch {
        if (!cancelled) setTemplateMeta(null);
      } finally {
        if (!cancelled) setLoadingTemplate(false);
      }
    };
    fetchTemplate();
    return () => { cancelled = true; };
  }, [mounted, paramTemplateId]);

  // ==== Cek entitlements ====
  const checkEntitlements = useCallback(async (t) => {
    if (!t?.id) {
      const basePdf = t?.tier === "free" ? { allowed: true, reason: "ok", price: 0 } :
        { allowed: false, reason: "needs_payment", price: t?.price_pdf || 0 };
      const baseWord = t?.supports_word
        ? (t?.tier === "free" ? { allowed: false, reason: "not_supported", price: 0 } : { allowed: false, reason: "needs_payment", price: t?.price_word || 0 })
        : { allowed: false, reason: "not_supported", price: 0 };
      setEntPdf(basePdf);
      setEntWord(baseWord);
      return;
    }

    try {
      setCheckingEnt(true);
      const { data: pdfRows, error: pdfErr } = await supabase.rpc("can_export", {
        template_id: t.id,
        format: "pdf",
      });
      if (pdfErr) throw pdfErr;
      const pdfRes = Array.isArray(pdfRows) ? (pdfRows[0] || {}) : (pdfRows || {});
      setEntPdf({ allowed: !!pdfRes.allowed, reason: pdfRes.reason || "unknown", price: Number(pdfRes.price || 0) });

      if (t.supports_word) {
        const { data: wordRows, error: wordErr } = await supabase.rpc("can_export", {
          template_id: t.id,
          format: "word",
        });
        if (wordErr) throw wordErr;
        const wordRes = Array.isArray(wordRows) ? (wordRows[0] || {}) : (wordRows || {});
        setEntWord({ allowed: !!wordRes.allowed, reason: wordRes.reason || "unknown", price: Number(wordRes.price || 0) });
      } else {
        setEntWord({ allowed: false, reason: "not_supported", price: 0 });
      }
    } catch (e) {
      setSaveMessage({ type: "error", text: `Gagal verifikasi akses: ${e.message || e}` });
    } finally {
      setCheckingEnt(false);
    }
  }, []);

  useEffect(() => {
    if (templateMeta) checkEntitlements(templateMeta);
  }, [templateMeta, isGuest, checkEntitlements]);

  // ==== [DIHAPUS] Blok useEffect yang menggunakan localStorage.getItem("lastPaidRef") ====
  // (Blok kode tersebut sebelumnya ada di sini)

  // ==== Realtime sinkron dari table orders ====
  useEffect(() => {
    if (!mounted || !templateMeta?.id) return;
    const channel = supabase
      .channel("orders-refresh")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `template_id=eq.${templateMeta.id}` },
        async (payload) => {
          const newStatus = String(payload?.new?.status || "").toUpperCase();
          if (["PAID", "SUCCESS", "SETTLEMENT"].includes(newStatus)) {
            await checkEntitlements(templateMeta);
            setSaveMessage({ type: "success", text: "Pembayaran diterima. Silakan unduh sekarang." });
          }
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [mounted, templateMeta, checkEntitlements]);

  // auto-hide toast
  useEffect(() => {
    if (saveMessage.text) {
      const t = setTimeout(() => setSaveMessage({ type: "", text: "" }), 4000);
      return () => clearTimeout(t);
    }
  }, [saveMessage]);

  // ==== Helpers ====
  const fileNameSafe = (str) => (str || "My CV").replace(/[^\w\d\- ]+/g, "").trim().replace(/\s+/g, "-");
  const cvTitle = useMemo(() => {
    const name = cv?.personal?.name?.trim();
    const role = cv?.personal?.jobTitle?.trim();
    if (name && role) return `${name} - ${role}`;
    if (name) return `${name} - CV`;
    return "My CV";
  }, [cv]);

  const getPayloadForDb = () => ({
    personal: cv.personal,
    summary: cv.summary,
    education: cv.education,
    experience: cv.experience,
    organizations: cv.organizations,
    certifications: cv.certifications,
    skills: cv.skills,
    templateId: templateMeta?.slug || paramTemplateId,
  });

  // ==== Save ====
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage({ type: "", text: "" });

      const { data: { user }, error: uErr } = await supabase.auth.getUser();
      if (uErr) throw uErr;
      if (!user) {
        setSaveMessage({ type: "warning", text: "Silakan login untuk menyimpan CV Anda." });
        setShowLoginModal(true);
        return;
      }

      const title = cvTitle;
      const payload = getPayloadForDb();

      if (cvId) {
        const { error } = await supabase
          .from("cvs")
          .update({ title, template_id: templateMeta?.id || null, cv_data: payload })
          .eq("id", cvId).eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase
          .from("cvs")
          .insert([{ user_id: user.id, title, template_id: templateMeta?.id || null, cv_data: payload }])
          .select("id").single();
        if (error) throw error;
        setCvId(inserted.id);
      }
      setSaveMessage({ type: "success", text: "CV berhasil disimpan!" });
    } catch (e) {
      setSaveMessage({ type: "error", text: `Gagal menyimpan CV: ${e.message || "Error tidak diketahui"}` });
    } finally {
      setIsSaving(false);
    }
  };

  // ==== Checkout PPU ====
  const initiatePayment = (fmt) => {
    const price = fmt === 'pdf' ? (templateMeta?.price_pdf || entPdf.price) : (templateMeta?.price_word || entWord.price);
    setPendingPayment({ format: fmt, price });
    setShowPaymentModal(true);
  };

  const handleCheckout = async () => {
    if (!pendingPayment) return;
    try {
      setProcessingPayment(true);

      if (!templateMeta?.id) {
        setSaveMessage({
          type: "warning",
          text: "Template premium ini belum terdaftar di database. Hubungi admin.",
        });
        setShowPaymentModal(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setSaveMessage({ type: "warning", text: "Silakan login terlebih dahulu." });
        setShowPaymentModal(false);
        setShowLoginModal(true);
        return;
      }

      // Save CV dulu
      await handleSave();

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ templateId: templateMeta.id, format: pendingPayment.format }),
      });
      const js = await res.json();
      if (!res.ok) {
        setSaveMessage({ type: "error", text: js?.error || "Gagal memulai pembayaran." });
        return;
      }
      window.location.href = js.redirectUrl;
    } catch (e) {
      setSaveMessage({ type: "error", text: `Checkout gagal: ${e.message || e}` });
    } finally {
      setProcessingPayment(false);
      setShowPaymentModal(false);
      setPendingPayment(null);
    }
  };

  // ==== Download PDF ====
  const handleDownloadPdf = async () => {
    try {
      setSaveMessage({ type: "", text: "" });

      if (!templateMeta?.id) {
        if (templateMeta?.tier === "free") {
          await generatePdfFromElement({
            elementId: "cv-preview-root",
            filename: `${fileNameSafe(cvTitle)}.pdf`,
            withWatermark: false,
            quality: 2.0,
          });
          setSaveMessage({ type: "success", text: "PDF berhasil diunduh!" });
          return;
        }
        setSaveMessage({
          type: "warning",
          text: "Template premium ini belum terdaftar di database.",
        });
        return;
      }

      const { data: rows, error } = await supabase.rpc("can_export", {
        template_id: templateMeta.id,
        format: "pdf",
      });
      if (error) throw error;
      const r = Array.isArray(rows) ? (rows[0] || {}) : (rows || {});
      if (!r.allowed) {
        if (r.reason === "needs_login") {
          setSaveMessage({ type: "warning", text: "Login untuk melanjutkan." });
          setShowLoginModal(true);
        } else if (r.reason === "needs_payment") {
          setSaveMessage({ type: "info", text: "Akses premium diperlukan. Lakukan pembayaran untuk unduh PDF." });
        } else if (r.reason === "not_supported") {
          setSaveMessage({ type: "error", text: "Format tidak didukung oleh template ini." });
        } else {
          setSaveMessage({ type: "error", text: "Akses unduh tidak diizinkan." });
        }
        return;
      }

      await generatePdfFromElement({
        elementId: "cv-preview-root",
        filename: `${fileNameSafe(cvTitle)}.pdf`,
        withWatermark: false,
        quality: 2.1,
      });

      await supabase.rpc("consume_export", { template_id: templateMeta.id, format: "pdf" }).catch(() => null);
      setSaveMessage({ type: "success", text: "PDF berhasil diunduh!" });
    } catch (e) {
      setSaveMessage({ type: "error", text: `Gagal membuat PDF: ${e.message || e}` });
    }
  };

  // ==== Download Word ====
  const handleDownloadWord = async () => {
    try {
      if (!templateMeta?.supports_word) {
        setSaveMessage({ type: "error", text: "Template ini tidak mendukung Word." });
        return;
      }
      if (!templateMeta?.id) {
        setSaveMessage({
          type: "warning",
          text: "Template ini belum terdaftar di database.",
        });
        return;
      }
      const { data: rows, error } = await supabase.rpc("can_export", {
        template_id: templateMeta.id,
        format: "word",
      });
      if (error) throw error;
      const r = Array.isArray(rows) ? (rows[0] || {}) : (rows || {});
      if (!r.allowed) {
        if (r.reason === "needs_login") {
          setSaveMessage({ type: "warning", text: "Login untuk melanjutkan." });
          setShowLoginModal(true);
        } else if (r.reason === "needs_payment") {
          setSaveMessage({ type: "info", text: "Akses premium diperlukan. Lakukan pembayaran untuk unduh Word." });
        } else if (r.reason === "not_supported") {
          setSaveMessage({ type: "error", text: "Format tidak didukung." });
        } else {
          setSaveMessage({ type: "error", text: "Akses unduh tidak diizinkan." });
        }
        return;
      }
      setSaveMessage({ type: "success", text: "Akses Word aktif. Endpoint export Word belum diaktifkan." });
      await supabase.rpc("consume_export", { template_id: templateMeta.id, format: "word" }).catch(() => null);
    } catch (e) {
      setSaveMessage({ type: "error", text: `Gagal unduh Word: ${e.message || e}` });
    }
  };

  const toggleSection = (id) => setExpandedSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  const togglePreview = () => setShowPreview((v) => !v);

  if (!mounted) return null;

  // Check if needs upsell
  const needsPdfPayment = !entPdf.allowed && entPdf.reason === "needs_payment";
  const needsWordPayment = templateMeta?.supports_word && !entWord.allowed && entWord.reason === "needs_payment";

  return (
    <>
      {/* Toast Notification - Top Center */}
      {saveMessage.text && (
        <div className={`toast-notification ${saveMessage.type}`}>
          <div className="toast-content">
            {saveMessage.type === 'success' && <Check size={20} />}
            {saveMessage.type === 'error' && <AlertCircle size={20} />}
            {saveMessage.type === 'warning' && <AlertCircle size={20} />}
            {saveMessage.type === 'info' && <Sparkles size={20} />}
            <span>{saveMessage.text}</span>
          </div>
        </div>
      )}

      {/* Modal Login */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPendingPayment(null);
        }}
        onConfirm={handleCheckout}
        templateName={templateMeta?.name || "Template"}
        format={pendingPayment?.format || 'pdf'}
        price={pendingPayment?.price || 0}
        loading={processingPayment}
      />

      <div className="content-offset" suppressHydrationWarning>
        <div className="editor-wrap">
          <section className="form-panel">
            {/* Compact Header */}
            <div className="panel-header">
              <button className="btn-back" onClick={() => router.back()}>
                <X size={16} /> Keluar
              </button>
              <div className="header-actions">
                <button className="btn-template" onClick={() => router.push("/extra/preview")}>
                  <Sparkles size={14} /> Template
                </button>
                <button className="btn-preview" onClick={togglePreview}>
                  <Eye size={14} /> {showPreview ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Compact Upsell Banner */}
            {(needsPdfPayment || needsWordPayment) && (
              <div className="upsell-banner">
                <div className="upsell-content">
                  <Crown size={18} className="upsell-icon" />
                  <div className="upsell-text">
                    <strong>Premium</strong>
                    <span>Unlock {needsPdfPayment && 'PDF'}{needsPdfPayment && needsWordPayment && ' & '}{needsWordPayment && 'Word'}</span>
                  </div>
                </div>
                <div className="upsell-actions">
                  {needsPdfPayment && (
                    <button className="btn-upsell" onClick={() => initiatePayment('pdf')}>
                      <Wallet size={12} /> {toIDR(templateMeta?.price_pdf || entPdf.price)}
                    </button>
                  )}
                  {needsWordPayment && (
                    <button className="btn-upsell" onClick={() => initiatePayment('word')}>
                      <Wallet size={12} /> {toIDR(templateMeta?.price_word || entWord.price)}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Compact Template Info */}
            <div className="template-info-card">
              <div className="template-info-left">
                {loadingTemplate ? (
                  <span className="loading-text">Loading...</span>
                ) : templateMeta ? (
                  <>
                    <strong className="template-name">{templateMeta.name}</strong>
                    <span className={`tier-badge ${templateMeta.tier === "premium" ? "tier-premium" : "tier-free"}`}>
                      {templateMeta.tier === "premium" ? (<><Crown size={12} /> Premium</>) : "Free"}
                    </span>
                    {profilePlan && (<span className="plan-badge"><Crown size={10} /> {profilePlan}</span>)}
                  </>
                ) : (
                  <span className="error-text">Template not found</span>
                )}
              </div>
              <div className="template-info-right">
                {entPdf.allowed && <span className="access-badge active">PDF</span>}
                {entWord.allowed && <span className="access-badge active">Word</span>}
              </div>
            </div>

            {/* Accordion form */}
            <div className="accordion-container">
              {[
                { id: "personalInfo", title: "Informasi Pribadi", icon: User },
                { id: "summary", title: "Objektif", icon: Target },
                { id: "education", title: "Riwayat Pendidikan", icon: GraduationCap },
                { id: "experience", title: "Riwayat Pekerjaan", icon: Briefcase },
                { id: "organization", title: "Riwayat Magang / Organisasi / Volunteer", icon: Building },
                { id: "certifications", title: "Sertifikasi", icon: Award },
                { id: "skills", title: "Skills", icon: Lightbulb },
              ].map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSections.includes(section.id);
                return (
                  <div key={section.id} className={`accordion-item ${isExpanded ? "expanded" : ""}`}>
                    <button className="accordion-header" onClick={() => toggleSection(section.id)}>
                      <span className="accordion-icon"><Icon size={20} /></span>
                      <span className="accordion-title">{section.title}</span>
                      <span className={`accordion-chevron ${isExpanded ? "rotated" : ""}`}><ChevronDown size={20} /></span>
                    </button>

                    {isExpanded && (
                      <div className="accordion-content">
                        <div className="form-content">
                          {section.id === "personalInfo" && (
                            <div className="form-fields">
                              <LabeledInput label="Nama Lengkap" value={cv.personal.name} onChange={(v) => updatePersonalInfo("name", v)} placeholder="Nama lengkap Anda" />
                              <LabeledInput label="Posisi / Job Title" value={cv.personal.jobTitle} onChange={(v) => updatePersonalInfo("jobTitle", v)} placeholder="e.g. Full Stack Developer" />
                              <LabeledInput label="Email" type="email" value={cv.personal.email} onChange={(v) => updatePersonalInfo("email", v)} placeholder="email@example.com" />
                              <LabeledInput label="Nomor Telepon" value={cv.personal.phone} onChange={(v) => updatePersonalInfo("phone", v)} placeholder="08xxxxxxxxxx" />
                              <LabeledInput label="Alamat" value={cv.personal.address} onChange={(v) => updatePersonalInfo("address", v)} placeholder="Kota, Provinsi" />
                              <LabeledInput label="LinkedIn" value={cv.personal.linkedin} onChange={(v) => updatePersonalInfo("linkedin", v)} placeholder="linkedin.com/in/username" />
                              <LabeledInput label="Website/Portfolio" value={cv.personal.website} onChange={(v) => updatePersonalInfo("website", v)} placeholder="yourwebsite.com" />
                            </div>
                          )}

                          {section.id === "summary" && (
                            <div className="form-fields">
                              <LabeledTextarea label="Ringkasan Profesional" rows={6} value={cv.summary}
                                onChange={(v) => updateSummary(v)} placeholder="Ceritakan tentang diri Anda, pengalaman, dan keahlian..." />
                            </div>
                          )}

                          {section.id === "education" && (
                            <div className="form-fields">
                              {cv.education.map((ed, i) => (
                                <div key={ed.id} className="form-group">
                                  <div className="form-fields" style={{ gap: 10 }}>
                                    <LabeledInput label="Institusi" value={ed.institution} onChange={(v) => updateEducation(i, "institution", v)} placeholder="Nama universitas / sekolah" />
                                    <LabeledInput label="Gelar" value={ed.degree} onChange={(v) => updateEducation(i, "degree", v)} placeholder="S1 Ilmu Komputer" />
                                    <LabeledInput label="Mulai" value={ed.startDate} onChange={(v) => updateEducation(i, "startDate", v)} placeholder="2015" />
                                    <LabeledInput label="Selesai" value={ed.endDate} onChange={(v) => updateEducation(i, "endDate", v)} placeholder="2019 / Sekarang" />
                                    <LabeledInput label="Lokasi" value={ed.location ?? ""} onChange={(v) => updateEducation(i, "location", v)} placeholder="Kota" />
                                  </div>
                                  <div style={{ marginTop: 8 }}>
                                    <button className="btn-remove" onClick={() => removeEducation(i)}>Hapus</button>
                                  </div>
                                  <hr style={{ margin: "12px 0", borderColor: "#e5e7eb" }} />
                                </div>
                              ))}
                              <button className="btn-add" onClick={addEducation}>+ Tambah Pendidikan</button>
                            </div>
                          )}

                          {section.id === "experience" && (
                            <div className="form-fields">
                              {cv.experience.map((ex, i) => (
                                <div key={ex.id} className="form-group">
                                  <div className="form-fields" style={{ gap: 10 }}>
                                    <LabeledInput label="Perusahaan" value={ex.company} onChange={(v) => updateExperience(i, "company", v)} placeholder="Nama perusahaan" />
                                    <LabeledInput label="Posisi" value={ex.position} onChange={(v) => updateExperience(i, "position", v)} placeholder="Frontend Developer" />
                                    <LabeledInput label="Mulai" value={ex.startDate} onChange={(v) => updateExperience(i, "startDate", v)} placeholder="Jan 2022" />
                                    <LabeledInput label="Selesai" value={ex.endDate} onChange={(v) => updateExperience(i, "endDate", v)} placeholder="Sekarang / Jan 2024" />
                                    <LabeledTextarea label="Deskripsi" rows={4} value={ex.description} onChange={(v) => updateExperience(i, "description", v)} placeholder="Tanggung jawab & capaian..." />
                                  </div>
                                  <div style={{ marginTop: 8 }}>
                                    <button className="btn-remove" onClick={() => removeExperience(i)}>Hapus</button>
                                  </div>
                                  <hr style={{ margin: "12px 0", borderColor: "#e5e7eb" }} />
                                </div>
                              ))}
                              <button className="btn-add" onClick={addExperience}>+ Tambah Pengalaman</button>
                            </div>
                          )}

                          {section.id === "organization" && (
                            <div className="form-fields">
                              {cv.organizations.map((og, i) => (
                                <div key={og.id} className="form-group">
                                  <div className="form-fields" style={{ gap: 10 }}>
                                    <LabeledInput label="Nama Organisasi / Magang" value={og.name} onChange={(v) => updateOrganization(i, "name", v)} placeholder="Nama organisasi / tempat magang" />
                                    <LabeledInput label="Peran / Jabatan" value={og.position} onChange={(v) => updateOrganization(i, "position", v)} placeholder="Ketua Divisi / Intern" />
                                    <LabeledInput label="Mulai" value={og.startDate} onChange={(v) => updateOrganization(i, "startDate", v)} placeholder="2017" />
                                    <LabeledInput label="Selesai" value={og.endDate} onChange={(v) => updateOrganization(i, "endDate", v)} placeholder="2018" />
                                    <LabeledTextarea label="Deskripsi" rows={4} value={og.description} onChange={(v) => updateOrganization(i, "description", v)} placeholder="Aktivitas & dampak..." />
                                  </div>
                                  <div style={{ marginTop: 8 }}>
                                    <button className="btn-remove" onClick={() => removeOrganization(i)}>Hapus</button>
                                  </div>
                                  <hr style={{ margin: "12px 0", borderColor: "#e5e7eb" }} />
                                </div>
                              ))}
                              <button className="btn-add" onClick={addOrganization}>+ Tambah Organisasi / Magang</button>
                            </div>
                          )}

                          {section.id === "certifications" && (
                            <div className="form-fields">
                              {cv.certifications.map((ct, i) => (
                                <div key={ct.id} className="form-group">
                                  <div className="form-fields" style={{ gap: 10 }}>
                                    <LabeledInput label="Nama Sertifikasi" value={ct.name} onChange={(v) => updateCertification(i, "name", v)} placeholder="Nama sertifikasi" />
                                    <LabeledInput label="Penerbit" value={ct.issuer} onChange={(v) => updateCertification(i, "issuer", v)} placeholder="Coursera / Google / dll" />
                                    <LabeledInput label="Tahun" value={ct.date} onChange={(v) => updateCertification(i, "date", v)} placeholder="2023" />
                                  </div>
                                  <div style={{ marginTop: 8 }}>
                                    <button className="btn-remove" onClick={() => removeCertification(i)}>Hapus</button>
                                  </div>
                                  <hr style={{ margin: "12px 0", borderColor: "#e5e7eb" }} />
                                </div>
                              ))}
                              <button className="btn-add" onClick={addCertification}>+ Tambah Sertifikasi</button>
                            </div>
                          )}

                          {section.id === "skills" && (
                            <div className="form-fields">
                              <div className="form-group">
                                <label>Skills</label>
                                <div className="skills-tags">
                                  {cv.skills.map((skill, i) => (
                                    <span key={`${skill}-${i}`} className="skill-tag">
                                      {skill}
                                      <button className="skill-remove" onClick={() => removeSkill(i)}>×</button>
                                    </span>
                                  ))}
                                </div>
                                <input type="text" placeholder="Ketik skill lalu Enter"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const val = e.currentTarget.value.trim();
                                      if (val) addSkill(val);
                                      e.currentTarget.value = "";
                                    }
                                  }} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Preview */}
          {showPreview && (
            <aside className="preview-panel">
              <div className="preview-sticky">
                <div id="cv-preview-root" className="preview-content" style={{
                  background: "#fff", padding: 24, width: "100%", minHeight: "1000px",
                  boxSizing: "border-box", margin: "0 auto", position: "relative",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderRadius: "12px",
                }}>
                  {isGuest && (<div className="live-watermark"><span>Preview</span></div>)}
                  <ResumeViewer data={cv} templateId={templateMeta?.slug || paramTemplateId} />
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="sticky-action-bar">
          <div className="action-bar-content">
            <div className="action-left">
              {!isGuest && (
                <button className="btn-save-subtle" onClick={handleSave} disabled={isSaving}>
                  <Save size={16} />
                  {isSaving ? "Menyimpan..." : cvId ? "Tersimpan" : "Simpan"}
                </button>
              )}
            </div>
            <div className="action-right">
              {entPdf.allowed ? (
                <button className="btn-download-primary" onClick={handleDownloadPdf}>
                  <Download size={18} /> Download PDF
                </button>
              ) : entPdf.reason === "needs_payment" ? (
                <button className="btn-unlock" onClick={() => initiatePayment('pdf')}>
                  <Crown size={18} /> Unlock PDF ({toIDR(templateMeta?.price_pdf || entPdf.price)})
                </button>
              ) : entPdf.reason === "needs_login" ? (
                <button className="btn-download-primary" onClick={() => setShowLoginModal(true)}>
                  <Download size={18} /> Login & Download PDF
                </button>
              ) : (
                <button className="btn-download-primary" onClick={handleDownloadPdf} disabled>
                  <Download size={18} /> Download PDF
                </button>
              )}

              {templateMeta?.supports_word && (
                <>
                  {entWord.allowed ? (
                    <button className="btn-download-secondary" onClick={handleDownloadWord}>
                      <FileType size={18} /> Word
                    </button>
                  ) : entWord.reason === "needs_payment" ? (
                    <button className="btn-unlock-secondary" onClick={() => initiatePayment('word')}>
                      <Crown size={18} /> Word ({toIDR(templateMeta?.price_word || entWord.price)})
                    </button>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --navbar-h: 64px; 
          --gutter: 20px; 
          --maxw: 1400px; 
          --preview-w: 700px;
          --radius: 12px; 
          --border: #e2e8f0; 
          --muted: #64748b; 
          --bg: #ffffff;
          --bgsoft: #f8fafc; 
          --brand: #3b82f6; 
          --text: #1e293b;
          --success: #10b981;
          --warning: #f59e0b;
          --error: #ef4444;
          --premium: #8b5cf6;
        }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
          background: #f8fafc; 
          color: var(--text); 
        }
        .content-offset { 
          padding-top: calc(var(--navbar-h) + var(--gutter)); 
          padding-bottom: 100px;
          min-height: 100vh; 
        }
        .editor-wrap { 
          margin: 0 auto; 
          padding: 0 var(--gutter); 
          max-width: var(--maxw); 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 24px; 
        }
        @media (min-width: 1100px) { 
          .editor-wrap { 
            grid-template-columns: minmax(0, 1fr) var(--preview-w); 
          } 
        }
        
        /* Toast Notification - Top Center */
        .toast-notification {
          position: fixed;
          top: calc(var(--navbar-h) + 16px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          animation: slideDown 0.3s ease forwards;
          padding: 14px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          max-width: 500px;
          backdrop-filter: blur(8px);
        }
        @keyframes slideDown { 
          from { opacity: 0; transform: translate(-50%, -20px); } 
          to { opacity: 1; transform: translate(-50%, 0); } 
        }
        .toast-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toast-notification.success { 
          background: rgba(236, 253, 245, 0.95); 
          color: #065f46; 
          border: 1px solid #86efac; 
        }
        .toast-notification.warning { 
          background: rgba(255, 251, 235, 0.95); 
          color: #92400e; 
          border: 1px solid #fde047; 
        }
        .toast-notification.error { 
          background: rgba(254, 242, 242, 0.95); 
          color: #991b1b; 
          border: 1px solid #fca5a5; 
        }
        .toast-notification.info { 
          background: rgba(239, 246, 255, 0.95); 
          color: #1e40af; 
          border: 1px solid #93c5fd; 
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          max-width: 480px;
          width: 90%;
          animation: scaleIn 0.2s ease;
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-header {
          padding: 24px 24px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--border);
        }
        .modal-icon {
          color: var(--brand);
        }
        .modal-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--text);
        }
        .modal-body {
          padding: 24px;
        }
        .payment-details {
          background: var(--bgsoft);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .detail-label {
          color: var(--muted);
        }
        .detail-value {
          font-weight: 500;
          color: var(--text);
        }
        .price-row {
          border-top: 1px solid var(--border);
          margin-top: 8px;
          padding-top: 12px;
        }
        .detail-value.price {
          font-size: 18px;
          font-weight: 600;
          color: var(--brand);
        }
        .payment-note {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.5;
        }
        .modal-footer {
          padding: 16px 24px 24px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .btn-modal-cancel {
          padding: 10px 20px;
          border: 1px solid var(--border);
          background: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text);
        }
        .btn-modal-cancel:hover {
          background: var(--bgsoft);
        }
        .btn-modal-confirm {
          padding: 10px 24px;
          border: none;
          background: var(--brand);
          color: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-modal-confirm:hover {
          background: #2563eb;
        }
        .btn-modal-confirm:disabled,
        .btn-modal-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Form Panel */
        .form-panel { 
          background: var(--bg); 
          border-radius: var(--radius); 
          box-shadow: 0 1px 3px rgba(0,0,0,0.08); 
          overflow: hidden; 
        }
        
        /* Panel Header - Compact */
        .panel-header { 
          padding: 12px 16px; 
          border-bottom: 1px solid var(--border); 
          display: flex; 
          align-items: center; 
          justify-content: space-between;
          gap: 8px;
          background: var(--bgsoft);
        }
        .header-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .btn-back { 
          background: transparent; 
          border: 1px solid var(--border); 
          padding: 6px 12px; 
          border-radius: 6px; 
          font-size: 13px; 
          cursor: pointer; 
          transition: all .2s; 
          display: flex; 
          align-items: center; 
          gap: 4px; 
          color: var(--text); 
          font-weight: 500; 
        }
        .btn-back:hover { 
          background: white; 
        }
        .btn-template {
          background: white;
          border: 1px solid var(--border);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all .2s;
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--premium);
        }
        .btn-template:hover {
          background: #faf5ff;
          border-color: var(--premium);
        }
        .btn-preview {
          background: white;
          border: 1px solid var(--border);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all .2s;
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text);
        }
        .btn-preview:hover {
          background: var(--bgsoft);
        }

        /* Upsell Banner - Compact */
        .upsell-banner {
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          border-bottom: 1px solid #e9d5ff;
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .upsell-content {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }
        .upsell-icon {
          color: var(--premium);
          flex-shrink: 0;
          width: 18px;
          height: 18px;
        }
        .upsell-text {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .upsell-text strong {
          font-size: 13px;
          color: var(--text);
          font-weight: 600;
        }
        .upsell-text span {
          font-size: 12px;
          color: var(--muted);
        }
        .upsell-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btn-upsell {
          background: var(--premium);
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .btn-upsell:hover {
          background: #7c3aed;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        /* Template Info Card - Compact */
        .template-info-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          border-bottom: 1px solid var(--border);
          background: #fff;
          gap: 10px;
          flex-wrap: wrap;
        }
        .template-info-left {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .template-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }
        .loading-text, .error-text {
          font-size: 13px;
          color: var(--muted);
        }
        .tier-badge {
          display: inline-flex;
          gap: 3px;
          align-items: center;
          padding: 3px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 500;
        }
        .tier-free {
          background: #ecfeff;
          border: 1px solid #a5f3fc;
          color: #0e7490;
        }
        .tier-premium {
          background: #faf5ff;
          border: 1px solid #e9d5ff;
          color: #7c3aed;
        }
        .plan-badge {
          display: inline-flex;
          gap: 3px;
          align-items: center;
          font-size: 11px;
          color: var(--muted);
          padding: 3px 6px;
          background: var(--bgsoft);
          border-radius: 4px;
        }
        .template-info-right {
          display: flex;
          gap: 6px;
          align-items: center;
          flex-wrap: wrap;
        }
        .access-badge {
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 500;
        }
        .access-badge.active {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #86efac;
        }

        /* Accordion */
        .accordion-container { 
          padding: 12px; 
        }
        .accordion-item { 
          margin-bottom: 10px; 
          border: 1px solid var(--border); 
          border-radius: 10px; 
          overflow: hidden; 
          transition: all .2s; 
          background: var(--bgsoft); 
        }
        .accordion-item.expanded { 
          background: white; 
        }
        .accordion-header { 
          width: 100%; 
          padding: 16px 20px; 
          background: transparent; 
          border: none; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          cursor: pointer; 
          transition: all .2s; 
          text-align: left; 
        }
        .accordion-header:hover { 
          background: rgba(59,130,246,0.05); 
        }
        .accordion-icon { 
          width: 24px; 
          height: 24px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: var(--brand); 
        }
        .accordion-title { 
          flex: 1; 
          font-weight: 500; 
          font-size: 15px; 
          color: var(--text); 
        }
        .accordion-chevron { 
          color: var(--brand); 
          transition: transform .2s; 
          display: flex; 
          align-items: center; 
        }
        .accordion-chevron.rotated { 
          transform: rotate(180deg); 
        }
        .accordion-content { 
          padding: 0 20px 20px; 
          background: white; 
          animation: slideDownContent .2s ease; 
        }
        @keyframes slideDownContent { 
          from { opacity: 0; transform: translateY(-8px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .form-content { 
          padding-top: 8px; 
        }
        .form-fields { 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
        }
        .form-group { 
          display: flex; 
          flex-direction: column; 
          gap: 6px; 
        }
        .form-group label { 
          font-size: 13px; 
          font-weight: 500; 
          color: var(--text); 
        }
        .form-group input, .form-group textarea { 
          padding: 10px 12px; 
          border: 1px solid var(--border); 
          border-radius: 8px; 
          font-size: 14px; 
          transition: all .2s; 
          font-family: inherit; 
        }
        .form-group input:focus, .form-group textarea:focus { 
          outline: none; 
          border-color: var(--brand); 
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1); 
        }
        .skills-tags { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 8px; 
          margin-bottom: 8px; 
        }
        .skill-tag { 
          display: inline-flex; 
          align-items: center; 
          gap: 6px; 
          padding: 6px 12px; 
          background: var(--bgsoft); 
          border: 1px solid var(--border); 
          border-radius: 6px; 
          font-size: 13px; 
          color: var(--text); 
        }
        .skill-remove { 
          background: none; 
          border: none; 
          color: var(--muted); 
          cursor: pointer; 
          font-size: 18px; 
          line-height: 1; 
          padding: 0; 
          margin-left: 2px; 
        }
        .skill-remove:hover { 
          color: #ef4444; 
        }
        
        /* Preview Panel */
        .preview-panel { 
          position: sticky; 
          top: calc(var(--navbar-h) + var(--gutter)); 
          height: fit-content; 
        }
        .preview-sticky { 
          background: transparent; 
          border-radius: 0; 
          box-shadow: none; 
          padding: 0; 
          max-height: calc(100vh - var(--navbar-h) - var(--gutter) - 120px); 
          overflow-y: auto; 
        }
        .preview-content { 
          color: var(--muted); 
          font-size: 14px; 
        }
        .live-watermark { 
          position: absolute; 
          top: 0; 
          left: 0; 
          right: 0; 
          bottom: 0; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 60px; 
          color: rgba(0, 0, 0, 0.06); 
          font-weight: bold; 
          z-index: 1000; 
          pointer-events: none; 
          overflow: hidden; 
        }
        .live-watermark span { 
          transform: rotate(-35deg); 
          white-space: nowrap; 
          user-select: none; 
          padding: 20px; 
        }

        /* Sticky Bottom Action Bar */
        .sticky-action-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid var(--border);
          box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
          z-index: 999;
          padding: 16px var(--gutter);
        }
        .action-bar-content {
          max-width: var(--maxw);
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .action-left {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .action-right {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .btn-save-subtle {
          padding: 10px 20px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--muted);
        }
        .btn-save-subtle:hover {
          background: var(--bgsoft);
          color: var(--text);
        }
        .btn-save-subtle:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-download-primary {
          padding: 12px 24px;
          background: var(--brand);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }
        .btn-download-primary:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        .btn-download-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .btn-download-secondary {
          padding: 12px 20px;
          background: white;
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-download-secondary:hover {
          background: var(--bgsoft);
          border-color: var(--brand);
        }
        .btn-unlock {
          padding: 12px 24px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
        }
        .btn-unlock:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        .btn-unlock-secondary {
          padding: 12px 20px;
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          color: var(--premium);
          border: 1px solid #e9d5ff;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-unlock-secondary:hover {
          background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
          border-color: var(--premium);
        }

        /* Responsive */
        @media (max-width: 768px) { 
          .panel-header {
            flex-direction: column;
            align-items: stretch;
          }
          .header-actions {
            width: 100%;
            justify-content: space-between;
          }
          .upsell-banner {
            flex-direction: column;
            align-items: stretch;
          }
          .upsell-actions {
            width: 100%;
            justify-content: stretch;
          }
          .btn-upsell {
            flex: 1;
            justify-content: center;
          }
          .action-bar-content {
            flex-direction: column;
            gap: 10px;
          }
          .action-left,
          .action-right {
            width: 100%;
            justify-content: center;
          }
          .btn-download-primary,
          .btn-unlock {
            width: 100%;
            justify-content: center;
          }
          .template-info-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .template-info-right {
            width: 100%;
          }
        }

        @media (max-width: 1099px) {
          .preview-panel {
            display: none;
          }
        }
      `}</style>
    </>
  );
}