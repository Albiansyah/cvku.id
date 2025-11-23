'use client';

import React, { useMemo } from 'react';
import AtsTemplate from '../resume/templates/AtsTemplate'; 
function ModernProfessionalTemplate({ data: d }) {
  // Helper render (bawaan dari template ini)
  const renderBullets = (arr) =>
    (arr || []).filter(Boolean).map((b, i) => <li key={i}>{b}</li>);

  const renderLine = (left, right) => {
    const hasLeft = left && String(left).trim() !== '';
    const hasRight = right && String(right).trim() !== '';
    if (!hasLeft && !hasRight) return null;
    return (
      <div className="row">
        <span className="left">{left}</span>
        <span className="right">{right}</span>
      </div>
    );
  };
  
  // Variasi tema (bawaan dari template ini)
  const theme = useMemo(() => {
    const base = {
      '--cv-bg': '#ffffff',
      '--cv-text': '#0f172a',
      '--cv-muted': '#64748b',
      '--cv-border': '#e5e7eb',
      '--cv-accent': '#0f172a',
      '--cv-pill': '#f1f5f9',
      className: 't-modern',
    };
    // Di sini bisa ditambahkan map/logika tema lain jika 'ModernProfessional' punya variasi
    return base;
  }, []);

  return (
    <div className={`cv ${theme.className}`} style={theme}>
      {/* Header */}
      <section className="header">
        <h1 className="name">{d.fullName}</h1>
        <p className="headline">{d.headline}</p>
        <div className="contacts">
          {d.location && <span>{d.location}</span>}
          {d.phone && <span>{d.phone}</span>}
          {d.email && <span>{d.email}</span>}
          {d.links?.map((l, i) => l ? <span key={i}>{l}</span> : null)}
        </div>
      </section>

      {/* Summary */}
      <section className="block">
        <h2 className="block-title">Ringkasan</h2>
        <p className="summary">{d.summary}</p>
      </section>

      {/* Experience */}
      {d.experiences?.length > 0 && (
        <section className="block">
          <h2 className="block-title">Pengalaman</h2>
          <div className="stack">
            {d.experiences.map((exp) => (
              <div className="item" key={exp.id}>
                {renderLine(exp.role, `${exp.company}${exp.location ? ' • ' + exp.location : ''}`)}
                {renderLine(`${exp.start} — ${exp.end}`, null)}
                {exp.bullets?.length > 0 && <ul className="bullets">{renderBullets(exp.bullets)}</ul>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {d.educations?.length > 0 && (
        <section className="block">
          <h2 className="block-title">Pendidikan</h2>
          <div className="stack">
            {d.educations.map((ed) => (
              <div className="item" key={ed.id}>
                {renderLine(ed.school, `${ed.degree}`)}
                {renderLine([ed.start, ed.end].filter(Boolean).join(' — '), ed.gpa ? `IPK: ${ed.gpa}` : null)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {d.skills?.length > 0 && (
        <section className="block">
          <h2 className="block-title">Keahlian</h2>
          <div className="pill-wrap">
            {d.skills.map((s, i) => s ? <span key={i} className="pill">{s}</span> : null)}
          </div>
        </section>
      )}

      {/* Certifications */}
      {d.certifications?.length > 0 && (
        <section className="block">
          <h2 className="block-title">Sertifikasi</h2>
          <div className="stack">
            {d.certifications.map((c) => (
              <div className="item" key={c.id}>
                {renderLine(c.name, [c.issuer, c.year].filter(Boolean).join(' • '))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Organizations */}
      {d.organizations?.length > 0 && (
        <section className="block">
          <h2 className="block-title">Organisasi</h2>
          <div className="stack">
            {d.organizations.map((o) => (
              <div className="item" key={o.id}>
                {renderLine(o.name, [o.role, o.year].filter(Boolean).join(' • '))}
                {o.bullets?.length > 0 && <ul className="bullets">{renderBullets(o.bullets)}</ul>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Style scoped (sama persis seperti kode lama) */}
      <style jsx>{`
        .cv{
          --pad: 24px;
          width: 100%;
          background: var(--cv-bg);
          color: var(--cv-text);
          border: 1px solid var(--cv-border);
          border-radius: 12px;
          padding: var(--pad);
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        @media (min-width: 900px){
          .cv{ padding: 32px; }
        }
        .header{ text-align: left; margin-bottom: 16px; }
        .name{ font-size: 28px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 6px; }
        .headline{ color: var(--cv-accent); font-weight: 700; margin: 0 0 10px; }
        .contacts{ display: flex; flex-wrap: wrap; gap: 10px; color: var(--cv-muted); font-size: 13px; }
        .block{ margin-top: 20px; }
        .block-title{
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--cv-accent);
          border-bottom: 2px solid var(--cv-border);
          padding-bottom: 6px;
          margin-bottom: 10px;
        }
        .summary{ font-size: 14px; color: #1f2937; line-height: 1.6; }
        .stack{ display: grid; gap: 12px; }
        .item .row{
          display:flex; justify-content:space-between; gap:16px;
          font-size: 14px;
        }
        .item .left{ font-weight: 600; color: #111827; }
        .item .right{ color: var(--cv-muted); white-space: nowrap; }
        .bullets{ margin: 6px 0 0 18px; color: #1f2937; }
        .bullets li{ line-height: 1.5; margin-bottom: 4px; }
        .pill-wrap{ display:flex; flex-wrap:wrap; gap:8px; }
        .pill{
          background: var(--cv-pill);
          border: 1px solid var(--cv-border);
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          color: #0f172a;
        }
        /* Style tema kecil */
        .t-creative .name{ letter-spacing: -0.01em; }
        .t-executive .headline{ color: #111827; border-left: 4px solid var(--cv-accent); padding-left: 8px; }
        .t-fresh .block-title{ border-bottom-color: #bae6fd; }
        .t-tech .block-title{ border-bottom-color: #bae6fd; }
        .t-health .block-title{ border-bottom-color: #bbf7d0; }
        .t-marketing .block-title{ border-bottom-color: #ffe4c7; }
        .t-finance .block-title{ border-bottom-color: #cbd5e1; }
        .t-founder .block-title{ border-bottom-color: #fecaca; }
      `}</style>
    </div>
  );
}


/**
 * =================================================================
 * MAP TEMPLATE
 * Tempat mendaftarkan semua template yang tersedia
 * =================================================================
 */
const templateMap = {
  'ats-free': AtsTemplate, // <- Template dari file AtsTemplates.jsx
  'modern-professional': ModernProfessionalTemplate, // <- Template dari kode di atas
  // 'creative-designer': ModernProfessionalTemplate, // (contoh jika pakai template yg sama)
  // 'executive-classic': ModernProfessionalTemplate,
  // ...daftarkan semua templateId kamu di sini
};


/**
 * =================================================================
 * KOMPONEN UTAMA (ResumeViewer)
 * Ini adalah "Si Penengah"
 * =================================================================
 */
export default function ResumeViewer({ data, templateId = 'modern-professional' }) {
  
  // 2. NORMALISASI DATA
  // Mengubah data dari 'useCvStore' (data) menjadi format
  // yang dipahami oleh SEMUA template (d)
  const d = useMemo(() => {
    const safe = (v, fallback = '') => (v == null || v === '' ? fallback : v);
    const asArray = (v) => Array.isArray(v) ? v : (v ? [v] : []);

    // Helper untuk mengubah deskripsi (string) menjadi array bullets
    const descToBullets = (desc) => {
      if (!desc) return [];
      // Coba split berdasarkan newline, jika tidak ada, jadikan 1 item array
      const bullets = desc.split('\n').filter(Boolean);
      return bullets.length > 0 ? bullets : [desc];
    };

    return {
      // Header: map 'personal'
      fullName: safe(data.personal?.name, 'Nama Lengkap'),
      headline: safe(data.personal?.jobTitle, 'Posisi / Headline'),
      location: safe(data.personal?.address, ''),
      phone: safe(data.personal?.phone, ''),
      email: safe(data.personal?.email, ''),
      links: [
        safe(data.personal?.linkedin), 
        safe(data.personal?.website)
      ].filter(Boolean),

      // Summary
      summary: safe(data.summary, 'Ringkasan profesional...'),

      // Experience: map 'experience'
      experiences: (data.experience || []).map((e, i) => ({
        id: e?.id ?? i,
        role: safe(e?.position), // dari 'position'
        company: safe(e?.company),
        location: safe(e?.location),
        start: safe(e?.startDate), // dari 'startDate'
        end: safe(e?.endDate), // dari 'endDate'
        bullets: descToBullets(e?.description), // dari 'description'
      })),

      // Education: map 'education'
      educations: (data.education || []).map((ed, i) => ({
        id: ed?.id ?? i,
        school: safe(ed?.institution), // dari 'institution'
        degree: safe(ed?.degree),
        start: safe(ed?.startDate),
        end: safe(ed?.endDate),
        gpa: safe(ed?.gpa), // (pastikan 'gpa' ada di store jika ingin dipakai)
      })),

      // Skills
      skills: asArray(data.skills),

      // Certifications: map 'certifications'
      certifications: (data.certifications || []).map((c, i) => ({
        id: c?.id ?? i,
        name: safe(c?.name),
        issuer: safe(c?.issuer),
        year: safe(c?.date), // dari 'date'
      })),

      // Organizations: map 'organizations'
      organizations: (data.organizations || []).map((o, i) => ({
        id: o?.id ?? i,
        name: safe(o?.name),
        role: safe(o?.position), // dari 'position'
        // Gabungkan start/end date menjadi 'year'
        year: [o?.startDate, o?.endDate].filter(Boolean).join(' - '),
        bullets: descToBullets(o?.description), // dari 'description'
      })),
    };
  }, [data]); // <-- Dependency-nya HANYA 'data'

  // 3. PILIH TEMPLATE
  // Pilih komponen template berdasarkan 'templateId'
  const TemplateComponent = useMemo(() => {
    return templateMap[templateId] ?? ModernProfessionalTemplate; // Default ke Modern
  }, [templateId]); // <-- Dependency-nya HANYA 'templateId'

  // 4. RENDER
  // Render template yang dipilih dengan data yang sudah dinormalisasi
  return <TemplateComponent data={d} />;
}