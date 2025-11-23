'use client';

import Link from 'next/link';
import { CloudOff } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'], 
  subsets: ['latin'], 
  variable: '--font-poppins' 
});

export default function NotFound() {
  return (
    <main className={poppins.variable}>
      <div className="container">
        <div className="content">
          {/* Icon */}
          <div className="icon-wrapper">
            <CloudOff size={80} strokeWidth={1.5} />
          </div>

          {/* 404 */}
          <div className="error-text">404</div>

          {/* Text */}
          <h1>Halaman Tidak Ditemukan</h1>
          <p>Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.</p>


        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        main {
          font-family: var(--font-poppins), -apple-system, system-ui, sans-serif;
        }

        .container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          padding: 24px;
        }

        .content {
          max-width: 480px;
          width: 100%;
          text-align: center;
        }

        .icon-wrapper {
          color: #cbd5e1;
          margin-bottom: 24px;
          display: flex;
          justify-content: center;
        }

        .error-text {
          font-size: 96px;
          font-weight: 700;
          color: #e2e8f0;
          line-height: 1;
          margin-bottom: 24px;
          letter-spacing: -0.03em;
        }

        h1 {
          font-size: 28px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        p {
          font-size: 15px;
          line-height: 1.6;
          color: #64748b;
          font-weight: 400;
        }

        @media (max-width: 640px) {
          .container {
            padding: 20px;
          }

          .icon-wrapper {
            margin-bottom: 20px;
          }

          .icon-wrapper :global(svg) {
            width: 64px;
            height: 64px;
          }

          .error-text {
            font-size: 72px;
            margin-bottom: 20px;
          }

          h1 {
            font-size: 24px;
          }

          p {
            font-size: 14px;
          }
        }
      `}</style>
    </main>
  );
}