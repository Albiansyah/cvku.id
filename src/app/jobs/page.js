"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  MapPin, Briefcase, DollarSign, Search, XCircle, Clock, ArrowLeft,
  Shield, Star, Bookmark, Zap, Filter, User, TrendingUp, 
  AlertTriangle, CheckCircle, Sparkles, Target, LayoutGrid, List
} from 'lucide-react';

// Data mock yang disempurnakan
const mockJobs = [
    { id: 1, title: 'Senior Frontend Developer (React)', company: 'PT Teknologi Maju', location: 'Jakarta', jobType: 'Full-time', experienceLevel: 'Senior Level', industry: 'Teknologi', salaryRange: 'Rp 15,000,000 - 25,000,000', salaryKey: '>15jt', postedDate: '1 jam lalu', applicants: 12, companyRating: 4.5, isVerified: true, isBookmarked: false, isNew: true, isHot: true, matchScore: 95, skills: ['React', 'TypeScript', 'Next.js', 'Redux'], benefits: ['Kerja Remote', 'Asuransi Kesehatan', 'Opsi Saham'], applicationUrl: '#', companyLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&q=80', responseTime: '2-3 hari', description: 'Kami mencari Frontend Developer berpengalaman untuk mengembangkan aplikasi web modern menggunakan React dan teknologi terdepan.' },
    { id: 2, title: 'UI/UX Designer', company: 'Creative Studio Indonesia', location: 'Bandung', jobType: 'Full-time', experienceLevel: 'Mid Level', industry: 'Design', salaryRange: 'Rp 8,000,000 - 15,000,000', salaryKey: '8-15jt', postedDate: '3 jam lalu', applicants: 25, companyRating: 4.2, isVerified: true, isBookmarked: true, isNew: true, isHot: false, matchScore: 87, skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'], benefits: ['Jam Fleksibel', 'Lingkungan Kreatif', 'Dana Belajar'], applicationUrl: '#', companyLogo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&q=80', responseTime: '1 minggu', description: 'Bergabunglah dengan tim kreatif kami untuk menciptakan pengalaman digital yang menakjubkan.' },
    { id: 3, title: 'Data Scientist (Entry Level)', company: 'Analytics Corp', location: 'Surabaya', jobType: 'Full-time', experienceLevel: 'Entry Level', industry: 'Data Science', salaryRange: 'Rp 7,000,000 - 12,000,000', salaryKey: '5-8jt', postedDate: '2 hari lalu', applicants: 8, companyRating: 4.7, isVerified: true, isBookmarked: false, isNew: false, isHot: true, matchScore: 78, skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'], benefits: ['Dana Riset', 'Tiket Konferensi', 'Remote Fleksibel'], applicationUrl: '#', companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&q=80', responseTime: '1-2 minggu', description: 'Manfaatkan data untuk menghasilkan insights yang dapat mengubah bisnis kami.' },
    { id: 4, title: 'Product Manager', company: 'Startup Unicorn', location: 'Jakarta', jobType: 'Full-time', experienceLevel: 'Mid Level', industry: 'Teknologi', salaryRange: 'Rp 12,000,000 - 20,000,000', salaryKey: '8-15jt', postedDate: '5 hari lalu', applicants: 45, companyRating: 4.3, isVerified: true, isBookmarked: false, isNew: false, isHot: false, matchScore: 82, skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'], benefits: ['Opsi Saham', 'Cuti Tak Terbatas', 'Asuransi Terbaik'], applicationUrl: '#', companyLogo: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=100&q=80', responseTime: '3-5 hari', description: 'Pimpin pengembangan produk yang akan digunakan oleh jutaan pengguna.' },
    { id: 5, title: 'DevOps Engineer', company: 'Cloud Solutions Ltd', location: 'Remote', jobType: 'Full-time', experienceLevel: 'Senior Level', industry: 'Teknologi', salaryRange: 'Rp 16,000,000 - 28,000,000', salaryKey: '>15jt', postedDate: '1 minggu lalu', applicants: 18, companyRating: 4.6, isVerified: true, isBookmarked: true, isNew: false, isHot: false, matchScore: 91, skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'], benefits: ['Full Remote', 'Cover Asuransi 100%', 'Tunjangan Teknologi'], applicationUrl: '#', companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&q=80', responseTime: '1 minggu', description: 'Bangun dan kelola infrastruktur cloud yang scalable untuk aplikasi global.' },
    { id: 6, title: 'Mobile Developer (Flutter)', company: 'Mobile First Corp', location: 'Yogyakarta', jobType: 'Full-time', experienceLevel: 'Entry Level', industry: 'Teknologi', salaryRange: 'Rp 6,000,000 - 10,000,000', salaryKey: '5-8jt', postedDate: '4 hari lalu', applicants: 22, companyRating: 4.4, isVerified: true, isBookmarked: false, isNew: false, isHot: true, matchScore: 88, skills: ['Flutter', 'Dart', 'Firebase', 'REST API'], benefits: ['Kerja Hybrid', 'Dana Pelatihan', 'Tunjangan Perangkat'], applicationUrl: '#', companyLogo: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&q=80', responseTime: '5-7 hari', description: 'Kembangkan aplikasi mobile cross-platform yang inovatif dengan Flutter.' }
];

const industries = ['Semua Industri', 'Teknologi', 'Design', 'Data Science', 'Marketing', 'Finance'];
const locations = ['Semua Lokasi', 'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Remote'];
const salaryRanges = ['Semua Gaji', '<5jt', '5-8jt', '8-15jt', '>15jt'];
const jobTypes = ['Semua Tipe', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const experienceLevels = ['Semua Level', 'Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

// --- Sub-Komponen ---

function MatchScoreCircle({ score }) {
  const getScoreColor = (s) => {
    if (s > 85) return { main: '#16a34a', bg: '#dcfce7' };
    if (s > 70) return { main: '#f59e0b', bg: '#fef3c7' };
    return { main: '#dc2626', bg: '#fee2e2' };
  };
  const color = getScoreColor(score);
  return (
    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: color.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ color: color.main, fontSize: '1.25rem', fontWeight: '700' }}>{score}</span>
      <span style={{ color: color.main, fontSize: '0.65rem', fontWeight: '500', textTransform: 'uppercase' }}>Match</span>
    </div>
  );
}

function MatchAnalysisCard({ job }) {
  const [hovered, setHovered] = useState(false);
  const analysis = {
    skills: { matched: 3, total: job.skills.length, icon: CheckCircle, color: '#16a34a', text: 'Keahlian Utama' },
    experience: { matched: 0, total: 1, icon: AlertTriangle, color: '#f59e0b', text: 'Pengalaman Relevan' },
    keywords: { matched: 5, total: 10, icon: Search, color: '#64748b', text: 'Kata Kunci' },
  };
  const AnalysisItem = ({ item }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <item.icon size={18} color={item.color} />
      <span style={{ flex: 1, color: '#374151', fontSize: '0.9rem' }}>{item.text}</span>
      <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.9rem' }}>{item.matched}/{item.total}</span>
    </div>
  );
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target size={20} /> Seberapa Cocok CV Anda?</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <AnalysisItem item={analysis.skills} />
        <AnalysisItem item={analysis.experience} />
        <AnalysisItem item={analysis.keywords} />
      </div>
      <button onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ width: '100%', padding: '0.75rem 1rem', background: hovered ? '#4f46e5' : '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s', transform: hovered ? 'translateY(-2px)' : 'translateY(0)', boxShadow: hovered ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none' }}>
        <Sparkles size={18} /> Tingkatkan CV untuk Posisi Ini
      </button>
    </div>
  );
}

function JobDetailsContent({ job }) {
  const [bookmarkHover, setBookmarkHover] = useState(false);
  const [applyHover, setApplyHover] = useState(false);
  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <img src={job.companyLogo} alt={job.company} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem', lineHeight: 1.3 }}>{job.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 500, color: '#374151' }}>{job.company}</span>
            {job.isVerified && <Shield size={16} color="#3b82f6" />}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.875rem' }}><Star size={14} fill="currentColor" /> {job.companyRating}</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><MapPin size={16} /> {job.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Briefcase size={16} /> {job.jobType}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={16} /> {job.postedDate}</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <button onMouseEnter={() => setApplyHover(true)} onMouseLeave={() => setApplyHover(false)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: applyHover ? '#2563eb' : '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
          <Zap size={18} /> Lamar Sekarang
        </button>
        <button onMouseEnter={() => setBookmarkHover(true)} onMouseLeave={() => setBookmarkHover(false)} style={{ padding: '0.875rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: bookmarkHover ? '#f1f5f9' : '#f8fafc' }}><Bookmark size={18} /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div><h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Gaji yang Ditawarkan</h3><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f0f9ff', borderRadius: '10px', color: '#0369a1', fontSize: '1.125rem', fontWeight: 600 }}><DollarSign size={20} /> <span>{job.salaryRange}/bulan</span></div></div>
        <div><h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Deskripsi Pekerjaan</h3><p style={{ color: '#4b5563', lineHeight: 1.6 }}>{job.description}</p></div>
        <MatchAnalysisCard job={job} />
        <div><h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Keahlian yang Dibutuhkan</h3><div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>{job.skills.map(skill => (<span key={skill} style={{ padding: '0.5rem 1rem', background: '#f1f5f9', color: '#475569', borderRadius: '20px', fontSize: '0.925rem', fontWeight: 500 }}>{skill}</span>))}</div></div>
        <div><h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Tunjangan & Keuntungan</h3><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>{job.benefits.map(benefit => (<div key={benefit} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px', color: '#16a34a', fontWeight: 500 }}><CheckCircle size={16} /> <span>{benefit}</span></div>))}</div></div>
      </div>
    </div>
  );
}

// --- Komponen Utama Halaman Jobs ---
export default function JobsPage() {
    const { currentUser } = useAuth();
    
    const [jobs] = useState(mockJobs);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState('Semua Industri');
    const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi');
    const [selectedSalary, setSelectedSalary] = useState('Semua Gaji');
    const [selectedJobType, setSelectedJobType] = useState('Semua Tipe');
    const [selectedExperience, setSelectedExperience] = useState('Semua Level');
    
    const userName = currentUser?.user_metadata?.full_name || "Pengguna";

    useEffect(() => {
        setIsLoading(true);
        const handler = setTimeout(() => {
            let tempJobs = [...jobs];

            if (searchTerm) {
                tempJobs = tempJobs.filter(job =>
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }
            if (selectedIndustry !== 'Semua Industri') tempJobs = tempJobs.filter(job => job.industry === selectedIndustry);
            if (selectedLocation !== 'Semua Lokasi') tempJobs = tempJobs.filter(job => job.location === selectedLocation);
            if (selectedSalary !== 'Semua Gaji') tempJobs = tempJobs.filter(job => job.salaryKey === selectedSalary);
            if (selectedJobType !== 'Semua Tipe') tempJobs = tempJobs.filter(job => job.jobType === selectedJobType);
            if (selectedExperience !== 'Semua Level') tempJobs = tempJobs.filter(job => job.experienceLevel === selectedExperience);

            setFilteredJobs(tempJobs);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm, selectedIndustry, selectedLocation, selectedSalary, selectedJobType, selectedExperience, jobs]);

    useEffect(() => {
        if (!isLoading && filteredJobs.length > 0 && !selectedJob) {
            setSelectedJob(filteredJobs[0]);
        } else if (!isLoading && filteredJobs.length === 0) {
            setSelectedJob(null);
        }
    }, [filteredJobs, isLoading, selectedJob]);

    const handleJobClick = (job) => setSelectedJob(job);
    
    const toggleBookmark = (jobId) => {
        const updateJobState = (prevJobs) => prevJobs.map(job => 
            job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
        );
        setJobs(updateJobState);
        if (selectedJob && selectedJob.id === jobId) {
            setSelectedJob(prev => ({ ...prev, isBookmarked: !prev.isBookmarked }));
        }
    };
    
    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedIndustry('Semua Industri');
        setSelectedLocation('Semua Lokasi');
        setSelectedSalary('Semua Gaji');
        setSelectedJobType('Semua Tipe');
        setSelectedExperience('Semua Level');
    };

    return (
        <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f8fafc', minHeight: '100vh', paddingTop: '80px' }}>
            
            <header style={{ background: 'white', padding: '1.5rem 2rem', position: 'sticky', top: '80px', zIndex: 40, borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>Hai {userName}, Waktunya Cari Peluang Baru!</h1>
                        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
                            {isLoading ? 'Mencari lowongan...' : `Kami menemukan ${filteredJobs.length} lowongan yang mungkin cocok untukmu.`}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                            <Search size={20} color="#9ca3af" />
                            <input type="text" placeholder="Posisi impianmu, misal: 'React Developer di Jakarta'" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: '1rem', marginLeft: '0.75rem' }}/>
                        </div>
                        <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
                            <Filter size={18} /> Filter Lanjutan
                        </button>
                    </div>
                    {showAdvancedFilters && (
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            <select value={selectedIndustry} onChange={e => setSelectedIndustry(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>{industries.map(i => <option key={i} value={i}>{i}</option>)}</select>
                            <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>{locations.map(l => <option key={l} value={l}>{l}</option>)}</select>
                            <select value={selectedSalary} onChange={e => setSelectedSalary(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>{salaryRanges.map(s => <option key={s} value={s}>{s}</option>)}</select>
                            <select value={selectedJobType} onChange={e => setSelectedJobType(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>{jobTypes.map(t => <option key={t} value={t}>{t}</option>)}</select>
                            <select value={selectedExperience} onChange={e => setSelectedExperience(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>{experienceLevels.map(e => <option key={e} value={e}>{e}</option>)}</select>
                            <button onClick={clearAllFilters} style={{ gridColumn: 'span 3 / span 3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}><XCircle size={16}/> Hapus Semua Filter</button>
                        </div>
                    )}
                </div>
            </header>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 450px', gap: '2rem', alignItems: 'start' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Rekomendasi Untukmu</h2>
                        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '0.25rem', gap: '0.25rem' }}>
                            <button onClick={() => setViewMode('grid')} style={{ padding: '0.5rem', background: viewMode === 'grid' ? 'white' : 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: viewMode === 'grid' ? '#3b82f6' : '#64748b' }}><LayoutGrid size={18} /></button>
                            <button onClick={() => setViewMode('list')} style={{ padding: '0.5rem', background: viewMode === 'list' ? 'white' : 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: viewMode === 'list' ? '#3b82f6' : '#64748b' }}><List size={18} /></button>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: viewMode === 'grid' ? 'repeat(2, 1fr)' : '1fr' }}>
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ background: '#e2e8f0', height: '220px', borderRadius: '12px' }}></div>)
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map(job => (
                                <div key={job.id} onClick={() => handleJobClick(job)} onMouseEnter={() => setHoveredCard(job.id)} onMouseLeave={() => setHoveredCard(null)} style={{ background: 'white', border: '1px solid', borderColor: selectedJob?.id === job.id ? '#6366f1' : '#e2e8f0', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease', transform: hoveredCard === job.id ? 'translateY(-4px)' : 'translateY(0)', boxShadow: selectedJob?.id === job.id ? '0 0 0 3px rgba(99, 102, 241, 0.2)' : hoveredCard === job.id ? '0 8px 25px rgba(0,0,0,0.08)' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <img src={job.companyLogo} alt={job.company} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                                            <div>
                                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>{job.title}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}><span>{job.company}</span> {job.isVerified && <Shield size={14} color="#3b82f6" />}</div>
                                            </div>
                                        </div>
                                        <MatchScoreCircle score={job.matchScore} />
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>{job.skills.slice(0, 3).map(skill => <span key={skill} style={{ padding: '0.25rem 0.6rem', background: '#f1f5f9', color: '#475569', borderRadius: '16px', fontSize: '0.75rem' }}>{skill}</span>)}</div>
                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}><div style={{ fontWeight: 600, color: '#10b981' }}>{job.salaryRange}</div><div style={{ fontSize: '0.8rem' }}>{job.applicants} pelamar • {job.location}</div></div>
                                        <button onClick={(e) => { e.stopPropagation(); toggleBookmark(job.id); }} style={{ padding: '0.5rem', background: job.isBookmarked ? '#dbeafe' : 'none', color: job.isBookmarked ? '#1d4ed8' : '#9ca3af', border: 'none', borderRadius: '50%', cursor: 'pointer' }}><Bookmark size={18} /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '12px' }}>
                                <Search size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '0.5rem' }}>Tidak Ada Lowongan Ditemukan</h3>
                                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Coba ubah kata kunci pencarian atau reset filter Anda.</p>
                                <button onClick={clearAllFilters} style={{ padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Reset Filter</button>
                            </div>
                        )}
                    </div>
                </div>

                <aside style={{ position: 'sticky', top: '200px' }}>
                    {selectedJob ? (
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                           <JobDetailsContent job={selectedJob} />
                        </div>
                    ) : (
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={48} color="#d1d5db" style={{ marginBottom: '1rem' }} />
                            <h3 style={{color: '#374151'}}>Detail Pekerjaan</h3>
                            <p style={{color: '#64748b', maxWidth: '200px' }}>Pilih lowongan di sebelah kiri untuk melihat detail lengkapnya di sini.</p>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
}