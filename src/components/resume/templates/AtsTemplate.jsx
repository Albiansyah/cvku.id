'use client';
import React from 'react';

// Komponen helper untuk Judul Bagian (Section)
function Section({ title, children, isFirst = false }) {
  return (
    <section className={`section ${isFirst ? 'is-first' : ''}`}>
      <h2 className="title">{title}</h2>
      <hr className="divider" />
      {children}
    </section>
  );
}

/** * Template ATS Free: 
 * - Font: Times New Roman (standar)
 * - Ukuran: Sesuai spesifikasi (Nama 18pt, Judul 12pt, Isi 11pt)
 * - Layout: Single column, rata kiri (header center)
 * - Warna: Hitam/Gelap
 * - No icons, no tables, no fancy elements.
 */
export default function AtsTemplate({ data }) {
  // Helper untuk format kontak dengan pemisah '|'
  const contactInfo = [
    data.email, 
    data.phone, 
    data.location, 
    ...data.links
  ].filter(Boolean); // Filter data yang kosong

  return (
    <div className="ats">
      {/* Header (Center-aligned, sesuai gambar) */}
      <header className="header">
        <h1 className="name">{data.fullName}</h1>
        <p className="headline">{data.headline}</p>
        <div className="contacts">
          {contactInfo.map((item, index) => (
            <span key={index}>
              {item}
              {index < contactInfo.length - 1 && '  |  '}
            </span>
          ))}
        </div>
      </header>

      {/* Summary (Left-aligned) */}
      {/* Tandai sebagai 'isFirst' untuk spasi yang konsisten */}
      <Section title="Summary" isFirst={true}>
        <p className="summary-text">{data.summary}</p>
      </Section>

      {/* Experience */}
      {data.experiences?.length > 0 && (
        <Section title="Experience">
          <div className="stack">
            {data.experiences.map((exp) => (
              <div className="item" key={exp.id}>
                <h3 className="item-title">{exp.company}</h3>
                <p className="item-subtitle">
                  {exp.role}
                  {(exp.start || exp.end) && (
                    <span> ({[exp.start, exp.end].filter(Boolean).join(' - ')})</span>
                  )}
                </p>
                {exp.bullets?.length > 0 && (
                  <ul className="bullets">
                    {exp.bullets.map((b, i) => (b ? <li key={i}>{b}</li> : null))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {data.educations?.length > 0 && (
        <Section title="Education">
          <div className="stack">
            {data.educations.map((ed) => (
              <div className="item" key={ed.id}>
                <h3 className="item-title">
                  {ed.school}
                  {(ed.start || ed.end) && (
                    <span> ({[ed.start, ed.end].filter(Boolean).join(' - ')})</span>
                  )}
                </h3>
                <p className="item-subtitle">
                  {ed.degree}
                  {ed.gpa && ` | GPA: ${ed.gpa}`}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <Section title="Skills">
          {/* Menggunakan bullet points, sangat ATS-friendly */}
          <ul className="bullets skills-list">
            {data.skills.filter(Boolean).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <Section title="Certifications">
          <div className="stack">
            {data.certifications.map((c) => (
              <div className="item" key={c.id}>
                <h3 className="item-title">{c.name}</h3>
                <p className="item-subtitle">
                  {[c.issuer, c.year].filter(Boolean).join(' | ')}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Organizations */}
      {data.organizations?.length > 0 && (
        <Section title="Organizations">
          <div className="stack">
            {data.organizations.map((o) => (
              <div className="item" key={o.id}>
                <h3 className="item-title">{o.name}</h3>
                <p className="item-subtitle">
                  {o.role}
                  {o.year && <span> ({o.year})</span>}
                </p>
                {o.bullets?.length > 0 && (
                  <ul className="bullets">
                    {o.bullets.map((b, i) => (b ? <li key={i}>{b}</li> : null))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Styles (CSS) */}
      <style jsx>{`
        .ats {
          background: #fff;
          color: #111827; /* Dark Gray, almost black */
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 32px;
          
          /* --- Font & Spacing Rules --- */
          font-family: "Times New Roman", Times, serif; /* Font Standar */
          font-size: 11pt; /* Base (10-12pt range) */
          line-height: 1.15; /* Spasi (1.0-1.15 range) */
          text-align: left; /* Default Rata Kiri */
        }

        /* --- Header (Sesuai Gambar) --- */
        .header {
          text-align: center;
          margin-bottom: 0;
          border-bottom: 1px solid #111827; /* Garis pemisah header */
          padding-bottom: 12px; /* Diperbesar dari 8px ke 12px */
        }
        .name {
          font-size: 18pt; /* (16-20pt range) */
          font-weight: 700; /* Bold */
          margin: 0 0 4px;
        }
        .headline {
          font-size: 12pt; /* (12-14pt range) */
          font-weight: 500;
          margin: 0 0 8px;
        }
        .contacts {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 4px 8px;
          color: #374151; /* Sedikit lebih muda */
          font-size: 10pt; /* (10-12pt range) */
        }
        .contacts span {
          white-space: nowrap;
        }

        /* --- Section (Sesuai Gambar) --- */
        .section {
          /* Jarak antar section diperbesar untuk lebih breathable */
          margin-top: 36px; /* Diperbesar dari 24px */
        }
        .section.is-first {
          /* Jarak dari header ke section pertama (Summary) */
          margin-top: 32px; /* Diperbesar dari 16px */
        }

        .title {
          font-size: 12pt; /* (12-14pt range) */
          font-weight: 700; /* Bold */
          text-transform: uppercase;
          letter-spacing: .05em;
          margin: 0;
        }
        .divider {
          border: 0;
          border-top: 1px solid #111827;
          margin: 4px 0 12px 0; /* Diperbesar dari 2px 0 10px 0 */
        }
        .summary-text {
          font-size: 11pt;
          line-height: 1.3; /* Diperbesar dari 1.15 untuk readability */
          color: #1f2937;
          margin: 0;
        }

        /* --- Item (Pendidikan, Pengalaman, dll) --- */
        .stack {
          display: grid;
          gap: 16px; /* Diperbesar dari 12px */
        }
        .item {
          /* tidak perlu style khusus, hanya container */
        }
        .item-title {
          font-size: 11pt;
          font-weight: 700; /* Bold (Sesuai gambar) */
          margin: 0;
        }
        .item-subtitle {
          font-size: 11pt;
          font-weight: 400; /* Normal */
          color: #1f2937;
          margin: 3px 0 0; /* Diperbesar dari 2px */
        }
        
        /* --- Bullets (Sesuai Gambar & Aturan) --- */
        .bullets {
          margin: 8px 0 0 18px; /* Diperbesar dari 6px */
          padding-left: 0;
          list-style-position: outside;
        }
        .bullets li {
          font-size: 11pt;
          line-height: 1.3; /* Diperbesar dari 1.15 */
          margin-bottom: 5px; /* Diperbesar dari 4px */
          color: #1f2937;
        }
        
        .skills-list {
          display: grid;
          /* Tampilan list skill menjadi 2 kolom jika muat */
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0 10px;
        }
      `}</style>
    </div>
  );
}