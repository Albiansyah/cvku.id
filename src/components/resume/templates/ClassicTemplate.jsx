'use client';

import React from 'react';

export default function ClassicTemplate({ data }) {
  return (
    <div className="classic">
      <header className="header">
        <h1 className="name">{data.fullName}</h1>
        <p className="headline">{data.headline}</p>
      </header>

      <div className="grid">
        {/* Sidebar */}
        <aside className="sidebar">
          {/* Contacts */}
          <div className="card">
            <h3 className="card-title">Kontak</h3>
            <ul className="list">
              {data.location && <li>{data.location}</li>}
              {data.phone && <li>{data.phone}</li>}
              {data.email && <li>{data.email}</li>}
              {data.links?.map((l, i) => (l ? <li key={i}>{l}</li> : null))}
            </ul>
          </div>

          {/* Skills */}
          {data.skills?.length > 0 && (
            <div className="card">
              <h3 className="card-title">Keahlian</h3>
              <div className="pill-wrap">
                {data.skills.map((s, i) => (s ? <span key={i} className="pill">{s}</span> : null))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications?.length > 0 && (
            <div className="card">
              <h3 className="card-title">Sertifikasi</h3>
              <ul className="list">
                {data.certifications.map((c) => (
                  <li key={c.id}>
                    <strong>{c.name}</strong>
                    <div className="muted">
                      {[c.issuer, c.year].filter(Boolean).join(' • ')}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="main">
          {/* Summary */}
          <section className="block">
            <h2 className="block-title">Ringkasan</h2>
            <p className="summary">{data.summary}</p>
          </section>

          {/* Experience */}
          {data.experiences?.length > 0 && (
            <section className="block">
              <h2 className="block-title">Pengalaman</h2>
              <div className="stack">
                {data.experiences.map((exp) => (
                  <div className="item" key={exp.id}>
                    <div className="row">
                      <span className="left">{exp.role}</span>
                      <span className="right">
                        {[exp.company, exp.location].filter(Boolean).join(' • ')}
                      </span>
                    </div>
                    <div className="row small muted">
                      <span>{`${exp.start} — ${exp.end}`}</span>
                    </div>
                    {exp.bullets?.length > 0 && (
                      <ul className="bullets">
                        {exp.bullets.map((b, i) => (b ? <li key={i}>{b}</li> : null))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.educations?.length > 0 && (
            <section className="block">
              <h2 className="block-title">Pendidikan</h2>
              <div className="stack">
                {data.educations.map((ed) => (
                  <div className="item" key={ed.id}>
                    <div className="row">
                      <span className="left">{ed.school}</span>
                      <span className="right">{ed.degree}</span>
                    </div>
                    <div className="row small muted">
                      <span>
                        {[ed.start, ed.end].filter(Boolean).join(' — ')}
                        {ed.gpa ? ` • IPK: ${ed.gpa}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <style jsx>{`
        .header { margin-bottom: 12px; text-align: center; }
        .name { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 4px; }
        .headline { color: var(--cv-accent); font-weight: 700; margin: 0; }

        .grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 900px) {
          .grid { grid-template-columns: 280px minmax(0,1fr); }
        }

        .sidebar { display: grid; gap: 12px; }
        .card {
          border: 1px solid var(--cv-border);
          border-radius: 10px;
          padding: 12px;
          background: #fff;
        }
        .card-title {
          font-size: 13px; font-weight: 800; letter-spacing: .08em;
          text-transform: uppercase; color: var(--cv-accent);
          border-bottom: 2px solid var(--cv-border); padding-bottom: 6px; margin-bottom: 10px;
        }
        .list { display: grid; gap: 6px; font-size: 14px; }
        .muted { color: var(--cv-muted); }

        .pill-wrap { display:flex; flex-wrap:wrap; gap:8px; }
        .pill {
          background: var(--cv-pill); border: 1px solid var(--cv-border);
          padding: 6px 10px; border-radius: 999px; font-size: 12px; color: #0f172a;
        }

        .block { margin-top: 8px; }
        .block-title {
          font-size: 13px; font-weight: 800; letter-spacing: .08em;
          text-transform: uppercase; color: var(--cv-accent);
          border-bottom: 2px solid var(--cv-border); padding-bottom: 6px; margin-bottom: 10px;
        }
        .summary { font-size: 14px; color: #1f2937; line-height: 1.6; }

        .stack { display: grid; gap: 12px; }
        .row { display:flex; justify-content: space-between; gap: 16px; }
        .row.small { font-size: 12px; }
        .left { font-weight: 600; color: #111827; }
        .right { color: var(--cv-muted); white-space: nowrap; }
        .bullets { margin: 6px 0 0 18px; color: #1f2937; }
        .bullets li { line-height: 1.5; margin-bottom: 4px; }
      `}</style>
    </div>
  );
}
