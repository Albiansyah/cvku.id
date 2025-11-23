"use client";

import { useState, useEffect, useRef } from 'react'; 
import { useRouter } from 'next/navigation';
import { createRoot } from 'react-dom/client'; 
import ProtectedPage from '../../components/ProtectedPage';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../hooks/useAuth';
import ResumeViewer from '../../components/resume/ResumeViewer'; 
import ConfirmModal from '../../components/common/ConfirmModal'; 
import { 
  Briefcase, FileText, GraduationCap, Eye, Upload, Search, BookOpen, Settings, 
  Clock, CheckCircle, AlertCircle, Sparkles, Zap, Edit, Download as DownloadIcon, 
  PlusCircle, Trash2, Info 
} from 'lucide-react';

export default function UserDashboardPage() {
  const { currentUser, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true); 
  const [stats, setStats] = useState({ cvUploaded: 0, jobsApplied: 0, coursesEnrolled: 0, profileViews: 0 });
  const [subscriptionData, setSubscriptionData] = useState({ tier: 'free', expiryDate: null, isActive: false });
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info'); 

  const [myCvs, setMyCvs] = useState([]); 

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cvToDelete, setCvToDelete] = useState(null); 

  const isInitialLoad = useRef(true); 

  // --- Fungsi Utility ---
  const parseSupabaseDate = (val) => {
    if (!val) return null;
    if (val instanceof Date) return val;
    if (typeof val === 'string' && !/Z$/.test(val) && !/([+-]\d{2}:\d{2})$/.test(val)) return new Date(val + 'Z');
    return new Date(val);
  };

  const formatTimeAgo = (d) => {
    const date = new Date(d), now = new Date();
    const s = Math.floor((+now - +date) / 1000);
    if (s < 60) return 'Baru saja';
    if (s < 3600) return `${Math.floor(s / 60)}m lalu`;
    if (s < 86400) return `${Math.floor(s / 3600)}j lalu`; 
    return `${Math.floor(s / 86400)}h lalu`; 
  };
  
  const formatExpiryDate = (date) => !date ? 'N/A' : date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  const getDaysUntilExpiry = (date) => !date ? null : Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const getTierConfig = (tier) => {
    const configs = {
      free: { name: 'Gratis', color: '#6b7280', bgColor: '#f3f4f6', icon: '🆓' },
      premium: { name: 'Premium', color: '#8b5cf6', bgColor: '#f3e8ff', icon: '⭐' },
      pro: { name: 'Pro', color: '#f59e0b', bgColor: '#fef3c7', icon: '👑' },
    };
    return configs[tier?.toLowerCase?.()] || configs.free;
  };

  // --- Fungsi Notifikasi ---
  const showToastNotification = (message, type = 'info') => { 
    if (showToastNotification.timerId) clearTimeout(showToastNotification.timerId);
    setToastMessage(message); 
    setToastType(type); 
    setShowToast(true); 
    showToastNotification.timerId = setTimeout(() => setShowToast(false), 3000); 
  };
  showToastNotification.timerId = null; 

  const getToastIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle style={{...styles.toastIcon, color: '#10b981'}} />;
      case 'error': return <AlertCircle style={{...styles.toastIcon, color: '#ef4444'}} />;
      case 'warning': return <AlertCircle style={{...styles.toastIcon, color: '#f59e0b'}} />;
      case 'info': 
      default: return <Info style={{...styles.toastIcon, color: '#3b82f6'}} />;
    }
  }

  // --- Fungsi Aksi ---
  const handleQuickAction = (path) => router.push(path);

  // --- Fungsi Download CV ---
  const handleDownloadCv = async (cvId, cvTitle) => {
    showToastNotification(`Menyiapkan unduhan untuk "${cvTitle || 'CV Tanpa Judul'}"...`, 'info');
    let pdfRenderTarget = document.getElementById('pdf-render-target');
    let root = null;
    // Ambil fungsi generatePdf dinamis (jika belum ada)
    const { generatePdfFromElement } = await import('../editor/utils/generatePdf'); 

    try {
      const { data: cvDataFull, error: fetchError } = await supabase
        .from('cvs')
        .select('cv_data') 
        .eq('id', cvId)
        .eq('user_id', currentUser.id) 
        .single();

      if (fetchError) throw fetchError;
      if (!cvDataFull || !cvDataFull.cv_data) throw new Error("Data CV tidak ditemukan.");

      const cvContent = cvDataFull.cv_data;
      const templateId = cvContent.templateId || 'default'; 

      if (!pdfRenderTarget) {
         pdfRenderTarget = document.createElement('div');
         pdfRenderTarget.id = 'pdf-render-target';
         Object.assign(pdfRenderTarget.style, styles.pdfRenderTarget); 
         document.body.appendChild(pdfRenderTarget);
      }
      
      root = createRoot(pdfRenderTarget); 
      await new Promise(resolve => {
         let resolved = false; // Flag biar resolve cuma dipanggil sekali
         const handleRenderComplete = () => {
           if (!resolved) {
             resolved = true;
             resolve();
           }
         };
         root.render(
            <ResumeViewer data={cvContent} templateId={templateId} onRenderComplete={handleRenderComplete} /> 
         );
         // Fallback timeout jika onRenderComplete tidak dipanggil dalam 1 detik
         setTimeout(() => {
           if (!resolved) {
             console.warn("onRenderComplete fallback timeout triggered.");
             resolved = true;
             resolve();
           }
         }, 1000); 
      });

      const safeTitle = (cvTitle || "CV Saya").replace(/[^\w\d\- ]+/g, "").trim().replace(/\s+/g, "-");
      const filename = `${safeTitle}.pdf`;
      
      await generatePdfFromElement({
        elementId: 'pdf-render-target',
        filename: filename,
        withWatermark: false, 
        quality: 2.2 
      });

      showToastNotification('Unduhan CV siap!', 'success');

    } catch (e) {
      console.error('Gagal mengunduh CV:', e);
      showToastNotification(`Gagal mengunduh CV: ${e.message}`, 'error');
    } finally {
      if (root) root.unmount();
      // Jangan hapus elemen #pdf-render-target biar bisa dipakai lagi
      if (pdfRenderTarget) pdfRenderTarget.innerHTML = ''; 
    }
  };


  // --- Fungsi Delete ---
  const handleDeleteCv = (cvId, cvTitle) => {
    setCvToDelete({ id: cvId, title: cvTitle }); 
    setShowConfirmModal(true); 
  };

  const executeDelete = async () => {
    if (!cvToDelete) return;
    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvToDelete.id)
        .eq('user_id', currentUser.id); 
      if (error) throw error;
      showToastNotification('CV berhasil dihapus!', 'success');
    } catch (e) {
      console.error('Error deleting CV:', e);
      showToastNotification(`Gagal menghapus CV: ${e.message}`, 'error');
    } finally {
      setShowConfirmModal(false);
      setCvToDelete(null);
    }
  };

  // --- Fetch Data Utama & Realtime Listener ---
  useEffect(() => {
    if (currentUser && profile && !authLoading) {
      if (isInitialLoad.current) {
         fetchDashboardData();
      }

      const ch = supabase
        .channel('dashboard_listener') 
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${currentUser.id}` },
          (payload) => {
            console.log('Profile updated, refetching...', payload);
            fetchDashboardData(false); 
            showToastNotification('Langganan diperbarui', 'info'); 
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'cvs', filter: `user_id=eq.${currentUser.id}` },
          (payload) => {
            console.log('CVs table changed, refetching...', payload);
            fetchDashboardData(false); 
            
            if (payload.eventType === 'INSERT') {
              showToastNotification('CV baru berhasil dibuat!', 'success'); 
            } else if (payload.eventType === 'UPDATE') {
              showToastNotification('CV berhasil diperbarui!', 'info'); 
            } 
          }
        )
        .subscribe();

      return () => { try { supabase.removeChannel(ch); } catch {} };
    }
  }, [currentUser, profile, authLoading]);

  const fetchDashboardData = async (initial = true) => {
    if (!currentUser?.id) return;
    try {
      if (initial) setLoading(true);

      // Fetch profileData
      const { data: profileData } = await supabase.from('profiles').select('active_plan, plan_expires_at, role').eq('id', currentUser.id).single();
      if (profileData) {
        const expiryDate = parseSupabaseDate(profileData.plan_expires_at);
        const isExpired = expiryDate ? expiryDate.getTime() < Date.now() : false;
        const plan = (profileData.active_plan || '').toString().trim().toLowerCase();
        let tier = 'free';
        if (plan && !isExpired) {
          if (plan === 'premium_7_days' || plan === 'premium_14_days') tier = 'trial';
          else if (plan === 'premium_monthly' || plan === 'premium_yearly') tier = 'premium';
          else if (plan === 'free') tier = 'free';
        }
        setSubscriptionData({ tier, expiryDate, isActive: !isExpired && !!plan && plan !== 'free' });
      } else {
        setSubscriptionData({ tier: 'free', expiryDate: null, isActive: false });
      }

      // Fetch CVs
      const { data: cvs } = await supabase.from('cvs').select('id, created_at, title').eq('user_id', currentUser.id).order('created_at', { ascending: false }); 
      setMyCvs(cvs || []); 

      // Fetch applications, courses, views
      const { data: applications } = await supabase.from('job_applications').select('id, created_at, job:jobs(title, company)').eq('user_id', currentUser.id).order('created_at', { ascending: false }).limit(5);
      const { data: courses } = await supabase.from('user_courses').select('id, enrolled_at, course:courses(title)').eq('user_id', currentUser.id);
      const { data: views } = await supabase.from('profile_views').select('id').eq('profile_user_id', currentUser.id);

      // Set stats
      setStats({
        cvUploaded: cvs?.length || 0,
        jobsApplied: applications?.length || 0,
        coursesEnrolled: courses?.length || 0,
        profileViews: views?.length || 0
      });

      // Set recent activity
      const activities = [];
      if (applications?.length) {
        applications.slice(0, 3).forEach(app => {
          activities.push({ type: 'application', title: `Melamar ke ${app.job?.title || 'sebuah pekerjaan'}`, subtitle: app.job?.company || '', time: formatTimeAgo(app.created_at), icon: 'briefcase' });
        });
      }
      if (cvs?.length) activities.push({ type: 'cv', title: `CV '${cvs[0].title || 'Tanpa Judul'}' disimpan`, subtitle: 'Profil Anda semakin kuat', time: formatTimeAgo(cvs[0].created_at), icon: 'file' });
      setRecentActivity(activities.slice(0, 5));

      calculateProfileCompletion();
      await fetchRecommendations(); 

      if (initial) isInitialLoad.current = false;

    } catch (e) {
      console.error(e);
      showToastNotification('Gagal memuat data dasbor', 'error'); 
    } finally { 
      if (initial) setLoading(false); 
    }
  };

  // ... (calculateProfileCompletion, fetchRecommendations, helper lainnya SAMA) ...
   const calculateProfileCompletion = () => {
    let completion = 0;
    const fields = [currentUser?.user_metadata?.full_name, currentUser?.email, profile?.phone, profile?.bio, profile?.skills, profile?.location];
    fields.forEach((f) => { if (f) completion += 100 / fields.length; });
    setProfileCompletion(Math.round(completion));
  };

  const fetchRecommendations = async () => {
    try {
      const { data: jobs } = await supabase.from('jobs').select('id, title, company, location, salary_range').eq('status', 'active').limit(3);
      setRecommendations(jobs || []);
    } catch (e) { console.error(e); }
  };
   const getActivityIcon = (type) => {
    switch (type) {
      case 'briefcase': return <Briefcase className="w-5 h-5" />;
      case 'file': return <FileText className="w-5 h-5" />;
      case 'graduation': return <GraduationCap className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };
  const getProfileDots = () => '●'.repeat(Math.round(profileCompletion / 20)) + '○'.repeat(5 - Math.round(profileCompletion / 20));


  // --- Kondisi Loading Awal ---
  if (loading) { 
    return (
      <ProtectedPage allowedRoles={['user']}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Memuat dasbor Anda...</p> 
        </div>
      </ProtectedPage>
    );
  }
  
  if (!currentUser || !profile) {
     console.error("User or profile data missing after initial load.");
     return <div>Kesalahan memuat data atau Anda belum login.</div>; 
  }

  // --- Persiapan Data untuk Render ---
  const tierConfig = getTierConfig(subscriptionData.tier);
  const daysUntilExpiry = getDaysUntilExpiry(subscriptionData.expiryDate);
  const firstName = currentUser?.user_metadata?.full_name?.split(' ')[0] || 'Pengguna'; 

  // --- Render Utama ---
  return (
    <ProtectedPage allowedRoles={['user']}>
      {/* Target Render PDF Tersembunyi */}
      <div id="pdf-render-target" style={styles.pdfRenderTarget}></div>

      {/* Modal Konfirmasi Delete */}
      {showConfirmModal && cvToDelete && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setCvToDelete(null);
          }}
          onConfirm={executeDelete} 
          title="Konfirmasi Hapus" 
          message={`Apakah Anda yakin ingin menghapus "${cvToDelete.title || 'CV Tanpa Judul'}"? Tindakan ini tidak dapat dibatalkan.`} 
          confirmText="Hapus" 
          cancelText="Batal"
          confirmButtonVariant="danger" 
        />
      )}

      <div style={styles.container}>
        {/* Toast Notifikasi */}
        {showToast && (
          <div style={{...styles.toast, ...styles.toastThemes[toastType]}}> 
            {getToastIcon(toastType)}
            <p style={styles.toastText}>{toastMessage}</p>
          </div>
        )}

        <div style={styles.content}>
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerMain}>
              <div style={styles.headerLeft}>
                <div style={styles.headerTop}>
                  <h1 style={styles.headerTitle}>
                    👋 Selamat datang kembali, {firstName}! 
                  </h1>
                  <div style={{...styles.tierBadge, background: tierConfig.bgColor, color: tierConfig.color}}>
                    <span style={styles.tierIcon}>{tierConfig.icon}</span>
                    <span style={styles.tierName}>{tierConfig.name}</span> 
                  </div>
                </div>
                <div style={styles.headerMeta}>
                  <span style={styles.profileProgress}>
                    Profil: {getProfileDots()} {profileCompletion}% 
                  </span>
                  {profileCompletion < 100 && (
                    <button onClick={() => handleQuickAction('/profile')} style={styles.completeLink}>
                      Lengkapi sekarang → 
                    </button>
                  )}
                </div>
                {subscriptionData.isActive && (
                  <div style={styles.expiryRow}>
                    <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                      <Clock style={{ width: '1rem', height: '1rem', opacity: 0.9 }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        Aktif hingga {formatExpiryDate(subscriptionData.expiryDate)} 
                        {(() => {
                          const d = getDaysUntilExpiry(subscriptionData.expiryDate);
                          return (d !== null) ? ` (${d}h)` : ''; 
                        })()}
                      </span>
                    </div>
                    <button onClick={() => handleQuickAction('/pricing')} style={styles.expiryBtn}>
                      Kelola 
                    </button>
                  </div>
                )}
              </div>
              <div style={styles.headerRight} />
            </div>
            {subscriptionData.tier !== 'free' && subscriptionData.isActive && daysUntilExpiry !== null && daysUntilExpiry <= 7 && (
              <div style={styles.urgentBanner}>
                <span style={styles.urgentText}>
                  ⏰ Premium berakhir dalam <strong>{daysUntilExpiry} hari</strong> ({formatExpiryDate(subscriptionData.expiryDate)})
                </span>
                <button onClick={() => handleQuickAction('/pricing')} style={styles.urgentBtn}>
                  Perpanjang Sekarang 
                </button>
              </div>
            )}
            {subscriptionData.tier === 'free' && (
              <div style={styles.compactUpgradeCta}>
                <Zap style={{width: '1.25rem', height: '1.25rem', color: '#f59e0b'}} />
                <span style={styles.upgradeText}>Buka fitur tanpa batas dengan Premium</span> 
                <button onClick={() => handleQuickAction('/pricing')} style={styles.compactUpgradeBtn}>
                  Upgrade 
                </button>
              </div>
            )}
          </div>

          {/* STATS */}
          <div style={styles.statsGrid}>
              {[
                { title: 'CV Diunggah', value: stats.cvUploaded, icon: FileText, color: '#3b82f6', bg: '#eff6ff' },
                { title: 'Lamaran Terkirim', value: stats.jobsApplied, icon: Briefcase, color: '#8b5cf6', bg: '#f3e8ff' },
                { title: 'Kursus Diikuti', value: stats.coursesEnrolled, icon: GraduationCap, color: '#ec4899', bg: '#fce7f3' },
                { title: 'Profil Dilihat', value: stats.profileViews, icon: Eye, color: '#6366f1', bg: '#eef2ff' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} style={styles.statCard}>
                    <div style={{...styles.statIconWrapper, background: stat.bg}}>
                      <Icon style={{...styles.statIcon, color: stat.color}} />
                    </div>
                    <div style={{...styles.statValue, color: stat.color}}>{stat.value}</div>
                    <div style={styles.statTitle}>{stat.title}</div>
                  </div>
                );
              })}
          </div>

          {/* GRID UTAMA (Kiri & Kanan) */}
          <div style={styles.dashboardGrid}> 
            {/* KIRI */}
            <div style={styles.dashboardMain}>
              {/* Recent Activity */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}><Clock style={styles.cardTitleIcon} />Aktivitas Terbaru</h2> 
                </div>
                {recentActivity.length > 0 ? (
                  <div>
                    {recentActivity.map((activity, i) => (
                      <div key={i} style={styles.activityItem}>
                        <div style={styles.activityIcon}>{getActivityIcon(activity.icon)}</div>
                        <div style={styles.activityContent}>
                          <p style={styles.activityTitle}>{activity.title}</p>
                          {activity.subtitle && <p style={styles.activitySubtitle}>{activity.subtitle}</p>}
                        </div>
                        <span style={styles.activityTime}>{activity.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <AlertCircle style={styles.emptyIcon} />
                    <p style={styles.emptyText}>Belum ada aktivitas terbaru</p> 
                    <button onClick={() => handleQuickAction('/jobs')} style={styles.emptyCta}>Mulai cari pekerjaan →</button> 
                  </div>
                )}
              </div>

              {/* KARTU "MY CVs" */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}><FileText style={styles.cardTitleIcon} />CV Saya</h2>
                  <button onClick={() => handleQuickAction('/editor')} style={styles.viewAllBtn}>
                    <PlusCircle style={{ width: '1rem', height: '1rem' }} />
                    <span>Buat Baru</span> 
                  </button>
                </div>
                {myCvs.length > 0 ? (
                  <div>
                    {myCvs.slice(0, 5).map((cv, i) => ( 
                      <div key={i} style={styles.cvItem}>
                        <div style={styles.activityIcon}>{getActivityIcon('file')}</div>
                        <div style={styles.activityContent}>
                          <p style={styles.activityTitle}>{cv.title || 'CV Tanpa Judul'}</p>
                          <p style={styles.activitySubtitle}>Disimpan: {formatTimeAgo(cv.created_at)}</p> 
                        </div>
                        <div style={styles.cvActions}>
                          <button onClick={() => handleQuickAction(`/editor?cv_id=${cv.id}`)} style={styles.cvActionBtn} title="Edit"> 
                            <Edit style={{ width: '1rem', height: '1rem' }} />
                          </button>
                          <button onClick={() => handleDownloadCv(cv.id, cv.title)} style={styles.cvActionBtn} title="Unduh"> 
                            <DownloadIcon style={{ width: '1rem', height: '1rem' }} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCv(cv.id, cv.title)} 
                            style={{...styles.cvActionBtn, ...styles.cvActionBtnDelete}} 
                            title="Hapus" 
                          >
                            <Trash2 style={{ width: '1rem', height: '1rem' }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <AlertCircle style={styles.emptyIcon} />
                    <p style={styles.emptyText}>Anda belum membuat CV.</p> 
                    <button onClick={() => handleQuickAction('/editor')} style={styles.emptyCta}>Buat sekarang →</button> 
                  </div>
                )}
              </div>
              
              {/* Recommendations */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}><Sparkles style={styles.cardTitleIcon} />Rekomendasi Untuk Anda</h2>
                  <button onClick={() => handleQuickAction('/jobs')} style={styles.viewAllBtn}>Lihat semua</button> 
                </div>
                {recommendations.length > 0 ? (
                  <div>
                    {recommendations.map((job, i) => (
                      <div key={i} style={styles.recommendationCard} onClick={() => handleQuickAction(`/jobs/${job.id}`)}>
                        <h3 style={styles.recommendationTitle}>{job.title}</h3>
                        <p style={styles.recommendationCompany}>{job.company}</p>
                        <div style={styles.recommendationMeta}>
                          <span>📍 {job.location}</span>
                          {job.salary_range && <span>💰 {job.salary_range}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p style={styles.emptyRecommendations}>Belum ada rekomendasi</p>} 
              </div>
            </div>

            {/* KANAN */}
            <div style={styles.dashboardSidebar}>
              <div style={styles.card}>
                <h2 style={{...styles.cardTitle, marginBottom: '1.25rem'}}>Aksi Cepat</h2>
                <div style={styles.quickActions}>
                  {[
                    { label: 'Buat CV Baru', icon: Sparkles, href: '/editor', color: '#10b981' }, 
                    { label: 'Upgrade CV', icon: Upload, href: '/improveCv', color: '#3b82f6' },
                    { label: 'Cari Pekerjaan', icon: Search, href: '/jobs', color: '#8b5cf6' },
                    { label: 'Ambil Kursus', icon: BookOpen, href: '/courses', color: '#ec4899' },
                    { label: 'Edit Profil', icon: Settings, href: '/profile', color: '#6366f1' },
                  ].map((action, i) => {
                    const Icon = action.icon;
                    return (
                      <button key={i} onClick={() => handleQuickAction(action.href)} style={{...styles.quickActionBtn, background: action.color}}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <Icon style={styles.quickActionIcon} />
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={styles.tipsCard}>
                <div style={styles.tipsContent}>
                  <div style={styles.tipsIcon}>💡</div>
                  <div>
                    <h3 style={styles.tipsTitle}>Tips Pro</h3>
                    <p style={styles.tipsText}>Lengkapi profil Anda untuk meningkatkan visibilitas. Profil dengan kelengkapan 80%+ dilihat 3x lebih banyak!</p> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          /* ... (keyframes sama) ... */
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes slideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } } 
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
      </div>
    </ProtectedPage>
  );
}

// ==========================================================
// ==================== STYLES OBJECT =======================
// ==========================================================
const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)', paddingTop: '6rem', paddingBottom: '3rem', paddingLeft: '1rem', paddingRight: '1rem', fontFamily: "'Inter', 'Poppins', sans-serif" },
  content: { maxWidth: '1400px', margin: '0 auto' },
  loadingContainer: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' },
  loadingSpinner: { width: '4rem', height: '4rem', border: '4px solid #e5e7eb', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingText: { color: '#6b7280', fontSize: '0.9375rem', fontWeight: '500' },
  
  toast: { 
    position: 'fixed', 
    bottom: '1.5rem', 
    right: '1.5rem', 
    background: 'white', 
    borderRadius: '0.75rem', 
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)', 
    padding: '1rem 1.25rem', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.75rem', 
    zIndex: 9999, 
    animation: 'slideIn 0.3s ease-out',
    maxWidth: 'calc(100% - 3rem)', 
  },
  toastIcon: { width: '1.25rem', height: '1.25rem', flexShrink: 0 }, 
  toastText: { fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', margin: 0, wordBreak: 'break-word' }, 
  toastThemes: {
    success: { background: '#ecfdf5', border: '1px solid #a7f3d0' },
    error: { background: '#fef2f2', border: '1px solid #fecaca' },
    warning: { background: '#fffbeb', border: '1px solid #fde68a' },
    info: { background: '#eff6ff', border: '1px solid #bfdbfe' },
  },

  header: { background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', borderRadius: '1rem', padding: '1.5rem 2rem', color: 'white', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)' },
  headerMain: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }, 
  headerLeft: { flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, 
  headerTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }, 
  headerTitle: { fontSize: '1.5rem', fontWeight: '700', margin: 0, lineHeight: 1.2 },
  headerMeta: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  profileProgress: { fontSize: '0.875rem', opacity: 0.95, fontWeight: '500' },
  completeLink: { background: 'none', border: 'none', color: 'white', fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontFamily: 'inherit', opacity: 0.9 },

  tierBadge: { padding: '0.5rem 1rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.875rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', whiteSpace: 'nowrap' }, 
  tierIcon: { fontSize: '1.125rem' },
  tierName: { textTransform: 'uppercase', letterSpacing: '0.5px' },

  expiryRow: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.5rem' },
  expiryBtn: { background: 'white', color: '#8b5cf6', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '0.375rem', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' },

  urgentBanner: { marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(251, 191, 36, 0.15)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', border: '1px solid rgba(251, 191, 36, 0.3)' },
  urgentText: { fontSize: '0.875rem', color: '#fef3c7' },
  urgentBtn: { background: '#fbbf24', color: '#78350f', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit' },

  compactUpgradeCta: { marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.2)' },
  upgradeText: { flex: 1, fontSize: '0.875rem', fontWeight: '500' },
  compactUpgradeBtn: { background: 'white', color: '#8b5cf6', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit' },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }, 
  statCard: { background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease' }, 
  statIconWrapper: { width: '3rem', height: '3rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
  statIcon: { width: '1.5rem', height: '1.5rem' },
  statValue: { fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' },
  statTitle: { fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' },

  // === STYLE LAYOUT GRID DIKEMBALIKAN ===
  dashboardGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Default auto-fit
    gap: '1.5rem',
    '@media (min-width: 992px)': { // Di layar besar, paksa 2 kolom (misal 2fr 1fr)
      gridTemplateColumns: '2fr 1fr',
    }
  },
  // =====================================
  dashboardMain: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  dashboardSidebar: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },

  card: { background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(0, 0, 0, 0.05)' },
  cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }, 
  cardTitle: { fontSize: '1.125rem', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 },
  cardTitleIcon: { width: '1.125rem', height: '1.125rem', color: '#8b5cf6', flexShrink: 0 },

  activityItem: { display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.875rem 0', borderBottom: '1px solid #f3f4f6' }, 
  activityIcon: { width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', flexShrink: 0 },
  activityContent: { flex: 1, minWidth: 0 },
  activityTitle: { fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.25rem', lineHeight: 1.4 },
  activitySubtitle: { fontSize: '0.8125rem', color: '#6b7280', margin: 0, lineHeight: 1.4 },
  activityTime: { fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap', marginLeft: '1rem' }, 

  emptyState: { textAlign: 'center', padding: '2.5rem 1rem' },
  emptyIcon: { width: '3rem', height: '3rem', color: '#d1d5db', margin: '0 auto 0.75rem' },
  emptyText: { color: '#6b7280', marginBottom: '1rem', fontSize: '0.9375rem' },
  emptyCta: { background: 'none', border: 'none', color: '#8b5cf6', fontWeight: '600', cursor: 'pointer', fontSize: '0.9375rem', fontFamily: 'inherit' },

  recommendationCard: { padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', cursor: 'pointer', marginBottom: '0.875rem', transition: 'all 0.2s', '&:hover': { borderColor: '#d1d5db', background: '#f9fafb' } }, 
  recommendationTitle: { fontSize: '0.9375rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.25rem' },
  recommendationCompany: { fontSize: '0.8125rem', color: '#6b7280', margin: '0 0 0.5rem' },
  recommendationMeta: { display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#6b7280', flexWrap: 'wrap' }, 
  emptyRecommendations: { padding: '1rem', color: '#6b7280', fontSize: '0.875rem', textAlign: 'center' },

  quickActions: { display: 'flex', flexDirection: 'column', gap: '0.625rem' },
  quickActionBtn: { width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.125rem', border: 'none', borderRadius: '0.625rem', fontWeight: '600', fontSize: '0.875rem', color: 'white', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', fontFamily: 'inherit' },
  quickActionIcon: { width: '1.125rem', height: '1.125rem' },

  tipsCard: { background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #fcd34d' },
  tipsContent: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem' },
  tipsIcon: { fontSize: '1.75rem', lineHeight: 1 },
  tipsTitle: { fontSize: '0.9375rem', fontWeight: '700', color: '#1f2937', margin: '0 0 0.5rem' },
  tipsText: { fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5, margin: 0 },

  viewAllBtn: { background: 'none', border: '1px solid #e5e7eb', color: '#6b7280', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem', transition: 'background 0.2s', '&:hover': { background: '#f3f4f6' } }, 
  
  cvItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 0', borderBottom: '1px solid #f3f4f6' }, 
  cvActions: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexShrink: 0 }, 
  cvActionBtn: { background: '#f3f4f6', color: '#4b5563', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', '&:hover': { background: '#e5e7eb' } }, 
  cvActionBtnDelete: { background: '#fef2f2', color: '#ef4444', '&:hover': { background: '#fee2e2' } }, 
  
  pdfRenderTarget: {
    position: 'absolute',
    left: '-9999px', 
    top: '-9999px',
    width: '794px',   
    height: 'auto',  
    overflow: 'hidden', 
    zIndex: -1,       
    background: 'white' 
  },
};