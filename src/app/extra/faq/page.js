"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Data FAQ, dikelompokkan berdasarkan kategori
const faqData = {
  "Akun & Pembayaran": [
    { q: "Apakah CVBuilder gratis digunakan?", a: "Ya, Anda bisa menggunakan fitur-fitur dasar secara gratis, termasuk 1 CV dan template dasar. Untuk membuka semua template premium dan fitur AI, Anda perlu upgrade ke paket Pro." },
    { q: "Metode pembayaran apa saja yang diterima?", a: "Kami menerima pembayaran melalui kartu kredit (Visa, MasterCard), transfer bank virtual account, dan e-wallet (GoPay, OVO)." },
    { q: "Bisakah saya membatalkan langganan saya kapan saja?", a: "Tentu. Anda bisa membatalkan langganan paket Pro Anda kapan saja melalui halaman pengaturan akun. Anda akan tetap memiliki akses Pro hingga akhir siklus tagihan Anda." },
  ],
  "Fitur Editor & Template": [
    { q: "Apakah template-nya ramah ATS (Applicant Tracking System)?", a: "Ya, semua template kami, terutama yang Premium, telah dirancang dan diuji untuk lolos sistem screening ATS yang digunakan oleh banyak perusahaan." },
    { q: "Bisakah saya mengganti template setelah mengisi data?", a: "Tentu saja. Anda bisa mengganti template kapan pun tanpa kehilangan data yang sudah Anda masukkan. Sistem kami akan secara otomatis menyesuaikan konten Anda." },
    { q: "Dalam format apa saya bisa mengunduh CV saya?", a: "Semua CV dapat diunduh dalam format PDF berkualitas tinggi yang siap untuk Anda kirimkan." },
  ]
};

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState(null); // Melacak FAQ yang sedang terbuka

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      <div className="faq-page">
        <header className="faq-header">
          <div className="container">
            <h1>Ada Pertanyaan?</h1>
            <p>Kami telah mengumpulkan pertanyaan yang paling sering diajukan untuk membantu Anda.</p>
          </div>
        </header>

        <section className="faq-content">
          <div className="container">
            {Object.keys(faqData).map(category => (
              <div key={category} className="faq-category">
                <h2>{category}</h2>
                <div className="faq-list">
                  {faqData[category].map((faq, index) => {
                    const id = `${category}-${index}`;
                    const isOpen = openFAQ === id;
                    return (
                      <div key={id} className="faq-item">
                        <button className="faq-question" onClick={() => toggleFAQ(id)}>
                          <span>{faq.q}</span>
                          <ChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} size={24} />
                        </button>
                        <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                          <p>{faq.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section">
            <div className="container">
                <h3>Tidak menemukan jawaban yang Anda cari?</h3>
                <p>Tim support kami siap membantu Anda. Hubungi kami melalui halaman kontak.</p>
                <a href="/contact" className="contact-button">Hubungi Kami</a>
            </div>
        </section>
      </div>

      <style jsx global>{`
        .faq-page { font-family: 'Inter', sans-serif; }
        .container { max-width: 800px; margin: 0 auto; padding: 0 2rem; }

        /* Header */
        .faq-header { padding: 4rem 0; background-color: #f7fafc; text-align: center; }
        .faq-header h1 { font-size: 2.5rem; color: #1a202c; margin-bottom: 1rem; }
        .faq-header p { font-size: 1.1rem; color: #718096; }
        
        /* Konten FAQ */
        .faq-content { padding: 4rem 0; }
        .faq-category { margin-bottom: 3rem; }
        .faq-category h2 { font-size: 1.5rem; color: #1a202c; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.75rem; }
        .faq-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .faq-item { border-bottom: 1px solid #e2e8f0; }
        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 0;
          background: none;
          border: none;
          text-align: left;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
          cursor: pointer;
        }
        .chevron-icon { color: #9ca3af; transition: transform 0.3s ease; }
        .chevron-icon.open { transform: rotate(180deg); }
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease-in-out;
        }
        .faq-answer.open {
          max-height: 200px; /* Sesuaikan jika jawaban sangat panjang */
        }
        .faq-answer p {
          padding-bottom: 1.25rem;
          margin: 0;
          color: #4a5568;
          line-height: 1.7;
        }

        /* Seksi Kontak */
        .contact-section { padding: 4rem 0; background-color: #f7fafc; text-align: center; }
        .contact-section h3 { font-size: 1.5rem; color: #1a202c; margin-bottom: 0.5rem; }
        .contact-section p { color: #718096; margin-bottom: 1.5rem; }
        .contact-button { display: inline-block; background-color: #111827; color: white; padding: 0.75rem 1.5rem; font-weight: 600; border-radius: 8px; text-decoration: none; transition: all 0.2s; }
        .contact-button:hover { background-color: #374151; }
      `}</style>
    </>
  );
}