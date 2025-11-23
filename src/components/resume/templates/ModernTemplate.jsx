'use client';

import React from 'react';

export default function ModernTemplate({ data }) {
  const Row = ({ left, right }) => {
    if (!left && !right) return null;
    return (
      <div className="row">
        <span className="left">{left}</span>
        <span className="right">{right}</span>
      </div>
    );
  };

  return (
    <div className="modern">
      {/* Header */}
      <header className="header">
        <h1 className="name">{data.fullName}</h1>
        <p className="headline">{data.headline}</p>
        <div className="contacts">
          {data.location && <span>{data.location}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.email && <span>{data.email}</span>}
          {data.links?.map((l, i) => (l ? <span key={i}>{l}</span> : null))}
        </div>
      </header>

      {/* Summary */}
      <Section title="Ringkasan">
        <p className="summary">{data.summary}</p>
      </Section>

      {/* Experience */}
      {data.experiences?.length > 0 && (
        <Section title="Pengalaman">
          <div className="stack">
            {data.experiences.map((exp) => (
              <div className="item" key={exp.id}>
                <Row
                  left={exp.role}
                  right={[exp.company, exp.location].filter(Boolean).join(' • ')}
                />
                <Row left={`${exp.start} — ${exp.end}`} />
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
        <Section title="Pendidikan">
          <div className="stack">
            {data.educations.map((ed) => (
              <div className="item" key={ed.id}>
                <Row left={ed.school} right={ed.degree} />
                <Row
                  left={[ed.start, ed.end].filter(Boolean).join(' — ')}
                  right={ed.gpa ? `IPK: ${ed.gpa}` : null}
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <Section title="Keahlian">
          <div className="pill-wrap">
            {data.skills.map((s, i) => (s ? <span key={i} className="pill">{s}</span> : null))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <Section title="Sertifikasi">
          <div className="stack">
            {data.certifications.map((c) => (
              <div className="item" key={c.id}>
                <Row left={c.name} right={[c.issuer, c.year].filter(Boolean).join(' • ')} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Organizations */}
      {data.organizations?.length > 0 && (
        <Section title="Organisasi">
          <div className="stack">
            {data.organizations.map((o) => (
              <div className="item" key={o.id}>
                <Row left={o.name} right={[o.role, o.year].filter(Boolean).join(' • ')} />
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

      <style jsx>{`
        .header { margin-bottom: 16px; }
        .name { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 6px; }
        .headline { color: var(--cv-accent); font-weight: 700; margin: 0 0 10px; }
        .contacts { display: flex; flex-wrap: wrap; gap: 10px; color: var(--cv-muted); font-size: 13px; }

        .section { margin-top: 44px; }
        .title {
          font-size: 14px; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--cv-accent);
          border-bottom: 2px solid var(--cv-border); padding-bottom: 6px; margin-bottom: 10px;
        }
        .summary { font-size: 14px; color: #1f2937; line-height: 1.6; }

        .stack { display: grid; gap: 12px; }
        .row { display:flex; justify-content: space-between; gap: 16px; font-size: 14px; }
        .left { font-weight: 600; color: #111827; }
        .right { color: var(--cv-muted); white-space: nowrap; }
        .bullets { margin: 6px 0 0 18px; color: #1f2937; }
        .bullets li { line-height: 1.5; margin-bottom: 4px; }

        .pill-wrap { display:flex; flex-wrap:wrap; gap:8px; }
        .pill {
          background: var(--cv-pill); border: 1px solid var(--cv-border);
          padding: 6px 10px; border-radius: 999px; font-size: 12px; color: #0f172a;
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="section">
      <h2 className="title">{title}</h2>
      {children}
    </section>
  );
}
