"use client";

import useCvStore from '../store/useCvStore';
import { shallow } from 'zustand/shallow';

export default function CVPreview() {
  const cv = useCvStore((state) => state.cv, shallow);

  if (!cv) {
    return <div className="cv-paper-classic"><p>Memuat data CV...</p></div>;
  }

  const { personal, summary, experience, education, skills, projects, languages, certifications, organizations } = cv;
  const contactLine = [personal?.address, personal?.email, personal?.phone].filter(Boolean).join('  •  ');

  return (
    <>
      <div className="cv-paper-classic">
        
        <header className="classic-header">
          <h1 className="classic-name">{personal?.name || 'NAMA LENGKAP'}</h1>
          <p className="classic-contact">{contactLine || 'Alamat  •  email@contoh.com  •  Nomor Telepon'}</p>
        </header>

        <main className="classic-body">
            {summary && (
              <section className="classic-section no-title">
                <p className="summary-text">{summary}</p>
              </section>
            )}
            
            {experience?.length > 0 && (experience[0]?.position || experience[0]?.company) && (
              <section className="classic-section">
                <hr className="section-divider" />
                <h2 className="section-title">PENGALAMAN KERJA</h2>
                {experience.map(exp => (
                  <div key={exp.id} className="entry">
                    <div className="entry-heading">
                      <div className="entry-main-info">
                        <h3 className="entry-title">{exp.position}</h3>
                        <p className="entry-subtitle">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                      </div>
                      <div className="entry-side-info">
                        <p className="entry-date">{exp.startDate} - {exp.endDate}</p>
                      </div>
                    </div>
                    <ul className="entry-description">
                      {exp.description?.split('\n').filter(item => item).map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </section>
            )}
            
            {organizations?.length > 0 && organizations[0]?.name && (
              <section className="classic-section">
                <hr className="section-divider" />
                <h2 className="section-title">PENGALAMAN ORGANISASI</h2>
                {organizations.map(org => (
                  <div key={org.id} className="entry">
                    <div className="entry-heading">
                      <div className="entry-main-info">
                        <h3 className="entry-title">{org.position}</h3>
                        <p className="entry-subtitle">{org.name}</p>
                      </div>
                      <div className="entry-side-info">
                        <p className="entry-date">{org.startDate} - {org.endDate}</p>
                      </div>
                    </div>
                    <ul className="entry-description">
                      {org.description?.split('\n').filter(item => item).map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {education?.length > 0 && (education[0]?.degree || education[0]?.institution) && (
              <section className="classic-section">
                <hr className="section-divider" />
                <h2 className="section-title">PENDIDIKAN</h2>
                {education.map(edu => (
                  <div key={edu.id} className="entry">
                    <div className="entry-heading">
                      <div className="entry-main-info">
                        <h3 className="entry-title">{edu.degree}</h3>
                        <p className="entry-subtitle">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                      </div>
                      <div className="entry-side-info">
                        <p className="entry-date">{edu.startDate} - {edu.endDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {certifications?.length > 0 && certifications[0]?.name && (
              <section className="classic-section">
                <hr className="section-divider" />
                <h2 className="section-title">SERTIFIKASI</h2>
                {certifications.map(cert => (
                  <div key={cert.id} className="entry">
                    <div className="entry-heading">
                      <div className="entry-main-info">
                        <h3 className="entry-title">{cert.name}</h3>
                        <p className="entry-subtitle">{cert.issuer}</p>
                      </div>
                      <div className="entry-side-info">
                        <p className="entry-date">{cert.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {skills?.length > 0 && (
              <section className="classic-section">
                <hr className="section-divider" />
                <h2 className="section-title">KEAHLIAN</h2>
                <ul className="skills-list-columns">
                  {skills.map((skill, index) => <li key={index}>{skill}</li>)}
                </ul>
              </section>
            )}

        </main>
      </div>

      <style jsx>{`
        .cv-paper-classic {
          background: white;
          width: 100%;
          max-width: 8.5in;
          padding: 1.5cm 2cm;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          border: 1px solid #eee;
          font-family: 'Garamond', 'Times New Roman', serif;
          font-size: 11pt;
          color: #000;
          box-sizing: border-box;
          overflow-y: auto;
          max-height: 100vh;
        }

        .classic-header { text-align: center; margin-bottom: 1rem; border-bottom: 1.5px solid black; padding-bottom: 0.8rem; }
        .classic-name { font-size: 22pt; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 0; }
        .classic-contact { font-size: 10pt; margin: 0.5rem 0 0 0; }

        .classic-body { margin-top: 1.5rem; }

        .classic-section { margin-bottom: 1rem; }
        .classic-section.no-title { margin-top: -1rem; }
        .section-divider { border: none; border-top: 1px solid black; margin: 0 0 0.5rem 0; }
        .section-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 0.8rem 0; }

        .summary-text { font-size: 11pt; line-height: 1.5; text-align: justify; margin: 0; }

        .entry { margin-bottom: 0.4rem; page-break-inside: avoid; } /* Reduced gap from 0.8rem to 0.4rem */

        .entry-heading {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1.5rem;
          margin-bottom: 0.2rem;
          align-items: baseline;
        }
        .entry-main-info { min-width: 0; }
        .entry-side-info { text-align: right; }

        .entry-title { font-size: 11pt; font-weight: 700; margin: 0; }
        .entry-subtitle { font-size: 11pt; margin: 0 0 0.5rem 0; font-style: italic; }
        .entry-date { font-size: 11pt; white-space: nowrap; }

        .entry-description { padding-left: 1.25rem; margin: 0; font-size: 11pt; line-height: 1.6; }
        .entry-description li { margin-bottom: 0.2rem; } /* Reduced gap from 0.3rem to 0.2rem */

        .skills-list-columns {
          padding-left: 1.25rem;
          margin: 0;
          font-size: 11pt;
          line-height: 1.6;
          column-count: 3;
          column-gap: 2rem;
        }
        .skills-list-columns li { margin-bottom: 0.2rem; break-inside: avoid; } /* Reduced gap from 0.3rem to 0.2rem */

        @media (max-width: 600px) {
          .cv-paper-classic { font-size: 10pt; padding: 1.5cm 1cm; }
          .classic-name { font-size: 18pt; }
          .skills-list-columns { column-count: 2; }
          .entry-heading { grid-template-columns: 1fr; gap: 0; }
          .entry-side-info { text-align: left; margin-top: 0.2rem; }
          .entry-date { font-size: 10pt; font-style: italic; }
        }

        @media print {
          .cv-paper-classic {
            box-shadow: none;
            border: none;
            max-height: none;
            overflow-y: visible;
          }
          .entry { page-break-inside: avoid; }
        }
      `}</style>
    </>
  );
}