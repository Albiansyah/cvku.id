// src/app/payments/return/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, AlertTriangle, Loader2, Clock, Receipt, ArrowRight, RefreshCw, Home, Copy, Check, FileEdit, Mail, Printer, X } from 'lucide-react';

type VerifyResponse = {
  ok: boolean;
  status?: 'PAID' | 'UNPAID' | 'EXPIRED' | 'FAILED' | 'PENDING' | 'UNKNOWN';
  message?: string;
  data?: {
    amount?: number;
    method?: string;
    timestamp?: string;
    template_id?: string;
    format?: string;
  };
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{value}</div>
    </div>
  );
}

export default function PaymentReturnPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => (sp?.get(key) ?? '');

  const merchantRef = useMemo(() => getParam('ref'), [sp]);
  const tripayReference = useMemo(
    () => getParam('tripay_reference') || getParam('reference'),
    [sp]
  );
  const tripayMerchantRef = useMemo(() => getParam('tripay_merchant_ref'), [sp]);

  const [state, setState] = useState<'loading' | 'paid' | 'pending' | 'failed'>('loading');
  const [msg, setMsg] = useState<string>('');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [countdown, setCountdown] = useState(7);
  const [autoRedirect, setAutoRedirect] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const title = useMemo(() => {
    switch (state) {
      case 'paid': return 'Pembayaran Berhasil!';
      case 'pending': return 'Menunggu Konfirmasi';
      case 'failed': return 'Pembayaran Gagal';
      default: return 'Memverifikasi Pembayaran';
    }
  }, [state]);

  const subtitle = useMemo(() => {
    switch (state) {
      case 'paid': return 'Transaksi kamu sudah berhasil diproses';
      case 'pending': return 'Pembayaran sedang diverifikasi';
      case 'failed': return 'Terjadi kesalahan pada transaksi';
      default: return loadingStage === 0 ? 'Menghubungkan ke server...' : 
                      loadingStage === 1 ? 'Memverifikasi pembayaran...' : 'Hampir selesai...';
    }
  }, [state, loadingStage]);

  // Loading stages animation
  useEffect(() => {
    if (state === 'loading') {
      const timer1 = setTimeout(() => setLoadingStage(1), 800);
      const timer2 = setTimeout(() => setLoadingStage(2), 1600);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [state]);

  // Confetti effect for success
  useEffect(() => {
    if (state === 'paid') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Countdown for redirect to editor after payment success
  useEffect(() => {
    if (state === 'paid' && paymentData?.template_id && autoRedirect) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(`/editor?templateId=${paymentData.template_id}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state, paymentData, router, autoRedirect]);

  useEffect(() => {
    if (!tripayReference && !merchantRef && !tripayMerchantRef) {
      setState('failed');
      setMsg('Parameter transaksi tidak ditemukan.');
      return;
    }

    const run = async () => {
      try {
        const ref = tripayReference || merchantRef || tripayMerchantRef;
        const res = await fetch(`/api/payment/verify?reference=${encodeURIComponent(ref)}`, { cache: 'no-store' });
        const data: VerifyResponse = await res.json();

        if (!res.ok || !data.ok) {
          setState('pending');
          setMsg(data?.message || 'Menunggu konfirmasi pembayaran dari Tripay...');
          setPaymentData(data?.data || {});
          return;
        }

        setPaymentData(data?.data || {});

        switch (data.status) {
          case 'PAID':
            setState('paid');
            setMsg(data?.data?.template_id 
              ? 'Transaksi berhasil! Kamu akan diarahkan ke editor...' 
              : 'Transaksi sudah dibayar. Mengalihkan ke dashboard...'
            );
            break;
          case 'FAILED':
          case 'EXPIRED':
            setState('failed');
            setMsg('Transaksi tidak berhasil atau sudah kedaluwarsa.');
            break;
          case 'UNPAID':
          case 'PENDING':
          default:
            setState('pending');
            setMsg('Pembayaran belum terkonfirmasi. Cek kembali status pembayaran kamu.');
        }
      } catch (e: any) {
        setState('pending');
        setMsg('Tidak dapat menghubungi server. Menunggu konfirmasi...');
      }
    };

    run();
  }, [merchantRef, tripayReference, tripayMerchantRef, router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    switch (state) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBg = () => {
    switch (state) {
      case 'paid': return '#ecfdf5';
      case 'pending': return '#fffbeb';
      case 'failed': return '#fef2f2';
      default: return '#f9fafb';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const referenceNumber = tripayReference || merchantRef || tripayMerchantRef || '-';

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingTop: '100px',
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px',
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative'
    }}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 9999
        }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: '10px',
                height: '10px',
                background: ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
                animation: `confetti-fall ${2 + Math.random() * 2}s linear forwards`,
                opacity: 0.8,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      <div style={{
        maxWidth: 680,
        margin: '0 auto',
      }}>
        {/* Main Card */}
        <div style={{
          background: 'white',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          border: '1px solid #e5e7eb'
        }}>
          {/* Header with Icon */}
          <div style={{
            background: getStatusBg(),
            padding: '48px 32px 40px',
            textAlign: 'center',
            position: 'relative',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'white',
              marginBottom: 24,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: `3px solid ${getStatusColor()}`
            }}>
              {state === 'loading' && <Loader2 size={40} color={getStatusColor()} style={{ animation: 'spin 1s linear infinite' }} />}
              {state === 'pending' && <Clock size={40} color={getStatusColor()} />}
              {state === 'paid' && <CheckCircle2 size={40} color={getStatusColor()} />}
              {state === 'failed' && <AlertTriangle size={40} color={getStatusColor()} />}
            </div>

            <h1 style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#111827',
              margin: '0 0 12px 0',
              fontFamily: "'Poppins', sans-serif"
            }}>
              {title}
            </h1>
            
            <p style={{
              fontSize: 16,
              color: '#6b7280',
              margin: 0,
              fontWeight: 500,
              lineHeight: 1.6
            }}>
              {subtitle}
            </p>

            {/* Status Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              background: 'white',
              color: getStatusColor(),
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              marginTop: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: `2px solid ${getStatusColor()}`
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: getStatusColor(),
                animation: state === 'pending' || state === 'loading' ? 'pulse 2s ease-in-out infinite' : 'none'
              }} />
              {state === 'loading' ? 'VERIFYING' : state.toUpperCase()}
            </div>
          </div>

          {/* Reference Number Highlight */}
          {(state === 'paid' || state === 'pending' || state === 'failed') && (
            <div style={{
              padding: '24px 32px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>
                📋 Nomor Referensi Transaksi
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'white',
                padding: '14px 16px',
                borderRadius: 12,
                border: '2px solid #e5e7eb'
              }}>
                <code style={{
                  flex: 1,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#111827',
                  letterSpacing: 0.5,
                  wordBreak: 'break-all'
                }}>
                  {referenceNumber}
                </code>
                <button
                  onClick={() => copyToClipboard(referenceNumber)}
                  style={{
                    padding: '10px',
                    background: copied ? '#10b981' : '#f3f4f6',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: copied ? 'white' : '#6b7280',
                    transition: 'all 0.2s',
                    minWidth: 44,
                    minHeight: 44,
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                  onMouseEnter={e => !copied && (e.currentTarget.style.background = '#e5e7eb')}
                  onMouseLeave={e => !copied && (e.currentTarget.style.background = '#f3f4f6')}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <div style={{ 
                fontSize: 12, 
                color: '#9ca3af', 
                marginTop: 8,
                fontStyle: 'italic'
              }}>
                Simpan nomor ini untuk keperluan customer service
              </div>
            </div>
          )}

          {/* Message Box */}
          {msg && (
            <div style={{
              padding: '20px 32px',
              background: state === 'paid' ? '#ecfdf5' : state === 'pending' ? '#fffbeb' : '#fef2f2',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{
                fontSize: 14,
                color: state === 'paid' ? '#065f46' : state === 'pending' ? '#92400e' : '#991b1b',
                lineHeight: 1.6,
                fontWeight: 500
              }}>
                {msg}
              </div>

              {/* Email notification for paid state */}
              {state === 'paid' && (
                <div style={{
                  marginTop: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  color: '#059669',
                  fontWeight: 600
                }}>
                  <Mail size={16} />
                  <span>Bukti pembayaran telah dikirim ke email kamu</span>
                </div>
              )}

              {/* Pending state instructions */}
              {state === 'pending' && (
                <div style={{ marginTop: 16, fontSize: 13, color: '#92400e' }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>📌 Yang perlu kamu lakukan:</div>
                  <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
                    <li>Pembayaran diterima, menunggu konfirmasi bank (maks 2 jam)</li>
                    <li>Cek email untuk update status otomatis</li>
                    <li>Atau klik tombol "Cek Status" di bawah</li>
                  </ul>
                </div>
              )}

              {/* Failed state instructions */}
              {state === 'failed' && (
                <div style={{ marginTop: 16, fontSize: 13, color: '#991b1b' }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>💡 Solusi:</div>
                  <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
                    <li>Silakan buat transaksi baru jika ingin mencoba lagi</li>
                    <li>Jika dana sudah terdebit, hubungi customer service dengan nomor referensi di atas</li>
                    <li>Tim kami akan membantu proses refund dalam 1-3 hari kerja</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Countdown for paid state */}
          {state === 'paid' && paymentData?.template_id && countdown > 0 && autoRedirect && (
            <div style={{
              padding: '20px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 600
                }}>
                  <FileEdit size={20} />
                  <span>Mengarahkan ke editor dalam {countdown} detik...</span>
                </div>
                <button
                  onClick={() => setAutoRedirect(false)}
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.5)',
                    borderRadius: 10,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    minHeight: 44
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                >
                  <X size={16} />
                  Batalkan
                </button>
              </div>
            </div>
          )}

          {/* Receipt Details */}
          <div style={{ padding: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
              color: '#111827',
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
              <Receipt size={20} />
              <span>Detail Transaksi</span>
            </div>

            <div style={{
              background: '#f9fafb',
              borderRadius: 16,
              padding: '24px',
              marginBottom: 24,
              border: '1px solid #e5e7eb'
            }}>
              {/* Amount */}
              {paymentData?.amount && (
                <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '2px solid #e5e7eb' }}>
                  <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8, fontWeight: 600 }}>Total Pembayaran</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', fontFamily: "'Poppins', sans-serif" }}>
                    {formatCurrency(paymentData.amount)}
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <DetailRow label="Metode Pembayaran" value={paymentData?.method || 'Transfer Bank'} />
              
              {/* Format */}
              {paymentData?.format && (
                <DetailRow label="Format Export" value={paymentData.format.toUpperCase()} />
              )}
              
              {/* Timestamp */}
              <DetailRow label="Waktu Transaksi" value={formatDate(paymentData?.timestamp)} />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {state === 'paid' && paymentData?.template_id && (
                <>
                  <button
                    onClick={() => router.push(`/editor?templateId=${paymentData.template_id}`)}
                    style={{
                      padding: '16px 24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                      minHeight: 56
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
                    }}
                  >
                    <FileEdit size={20} />
                    Lanjut ke Editor
                    <ArrowRight size={20} />
                  </button>

                  {/* Secondary actions for paid state */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={handlePrint}
                      style={{
                        flex: 1,
                        padding: '14px 20px',
                        background: 'white',
                        color: '#6b7280',
                        border: '2px solid #e5e7eb',
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'all 0.2s',
                        minHeight: 48
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#9ca3af';
                        e.currentTarget.style.color = '#111827';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <Printer size={18} />
                      Print
                    </button>
                    <button
                      onClick={() => router.push('/dashboard')}
                      style={{
                        flex: 1,
                        padding: '14px 20px',
                        background: 'white',
                        color: '#6b7280',
                        border: '2px solid #e5e7eb',
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'all 0.2s',
                        minHeight: 48
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#9ca3af';
                        e.currentTarget.style.color = '#111827';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <Home size={18} />
                      Dashboard
                    </button>
                  </div>
                </>
              )}

              {state === 'paid' && !paymentData?.template_id && (
                <button
                  onClick={() => router.push('/dashboard')}
                  style={{
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                    minHeight: 56
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.5)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
                  }}
                >
                  <Home size={20} />
                  Ke Dashboard
                  <ArrowRight size={20} />
                </button>
              )}

              {state === 'pending' && (
                <>
                  <button
                    onClick={() => location.reload()}
                    style={{
                      padding: '16px 24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                      minHeight: 56
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
                    }}
                  >
                    <RefreshCw size={20} />
                    Cek Status Pembayaran
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    style={{
                      padding: '14px 20px',
                      background: 'white',
                      color: '#6b7280',
                      border: '2px solid #e5e7eb',
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      minHeight: 52
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#9ca3af';
                      e.currentTarget.style.color = '#111827';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    Kembali ke Dashboard
                  </button>
                </>
              )}

              {state === 'failed' && (
                <>
                  <button
                    onClick={() => router.push('/pricing')}
                    style={{
                      padding: '16px 24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                      minHeight: 56
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
                    }}
                  >
                    <RefreshCw size={20} />
                    Coba Lagi
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    style={{
                      padding: '14px 20px',
                      background: 'white',
                      color: '#6b7280',
                      border: '2px solid #e5e7eb',
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      minHeight: 52
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#9ca3af';
                      e.currentTarget.style.color = '#111827';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    Kembali ke Dashboard
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div style={{
          marginTop: 32,
          background: 'white',
          borderRadius: 16,
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                Butuh Bantuan?
              </h3>
              <p style={{
                fontSize: 14,
                color: '#6b7280',
                margin: 0,
                lineHeight: 1.6
              }}>
                Tim customer service kami siap membantu kamu 24/7
              </p>
            </div>
            <a
              href="/support"
              style={{
                padding: '12px 24px',
                background: '#f3f4f6',
                color: '#111827',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background 0.2s',
                minHeight: 44
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
              onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
            >
              💬 Hubungi Support
            </a>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{
          textAlign: 'center',
          marginTop: 32,
          padding: '20px',
          color: '#6b7280',
          fontSize: 13,
          lineHeight: 1.8
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>
            Transaksi aman dan terenkripsi
          </p>
          <p style={{ margin: 0, fontSize: 12 }}>
            Powered by <span style={{ fontWeight: 600, color: '#111827' }}>Tripay</span> • 
            Regulated Payment Gateway Indonesia
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap');
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          
          div[style*="maxWidth: 680"] {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          
          button, 
          div[style*="Mengarahkan ke editor"],
          a[href="/support"],
          div[style*="Help Section"] {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          div[style*="maxWidth: 680"] {
            max-width: 100% !important;
          }
          
          div[style*="padding: '48px 32px 40px'"] {
            padding: 32px 24px 28px !important;
          }
          
          div[style*="padding: '32px'"] {
            padding: 24px !important;
          }

          div[style*="padding: '24px 32px'"] {
            padding: 20px 24px !important;
          }

          div[style*="padding: '20px 32px'"] {
            padding: 16px 24px !important;
          }

          h1[style*="fontSize: 32"] {
            font-size: 24px !important;
          }

          div[style*="fontSize: 32"] {
            font-size: 24px !important;
          }

          div[style*="display: 'flex'"][style*="gap: 12"] button {
            flex: 1 1 100%;
          }

          div[style*="flexWrap: 'wrap'"] {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          div[style*="paddingTop: '100px'"] {
            padding-top: 80px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          div[style*="width: 96"] {
            width: 80px !important;
            height: 80px !important;
          }

          h1[style*="fontSize: 32"] {
            font-size: 22px !important;
          }

          div[style*="fontSize: 32"] {
            font-size: 22px !important;
          }

          button[style*="padding: '16px 24px'"] {
            padding: 14px 20px !important;
            font-size: 15px !important;
          }

          div[style*="display: 'flex'"][style*="gap: 12"] {
            flex-direction: column;
            gap: 12px;
          }

          button[style*="flex: 1"] {
            width: 100% !important;
            flex: none !important;
          }
        }
      `}</style>
    </div>
  );
}