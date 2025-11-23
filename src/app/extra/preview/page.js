'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Edit, Eye, Star, Heart, Search, Grid, List } from 'lucide-react';

// ---- Data (dengan 'slug' untuk URL) ----
const cvTemplates = [
  { id: 1, slug: 'modern-professional', name: 'Modern Professional', category: 'Professional', industry: 'Technology', preview: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.idntimes.com%2Flife%2Fcareer%2Fcontoh-cv-ats-fresh-graduate-01-1rwjl-g35xgp&psig=AOvVaw10WKQk1edP4HdAXmC4FzXu&ust=1760990954242000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJCNnN6IsZADFQAAAAAdAAAAABAE', rating: 4.8, downloads: 12540, description: 'Template modern dan clean untuk profesional IT', tags: ['ATS-Friendly', 'Modern', 'Tech'], price: 'Free', featured: true },
  { id: 2, slug: 'creative-designer', name: 'Creative Designer', category: 'Creative', industry: 'Design', preview: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=850&fit=crop&crop=center&auto=format', rating: 4.9, downloads: 8320, description: 'Template kreatif untuk designer dan creative professional', tags: ['Creative', 'Colorful', 'Portfolio'], price: 'Free' },
  { id: 3, slug: 'executive-classic', name: 'Executive Classic', category: 'Executive', industry: 'Business', preview: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=850&fit=crop&crop=center&auto=format', rating: 4.7, downloads: 15760, description: 'Template klasik untuk executive dan management', tags: ['Executive', 'Premium', 'Leadership'], price: 'Pro' },
  { id: 4, slug: 'fresh-graduate', name: 'Fresh Graduate', category: 'Entry Level', industry: 'General', preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=850&fit=crop&crop=center&auto=format', rating: 4.6, downloads: 9890, description: 'Perfect untuk fresh graduate dan entry level', tags: ['Student', 'Simple', 'Clean'], price: 'Free' },
  { id: 5, slug: 'tech-innovator', name: 'Tech Innovator', category: 'Technology', industry: 'Tech', preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=850&fit=crop&crop=center&auto=format', rating: 4.8, downloads: 11200, description: 'Template futuristik untuk developer dan tech lead', tags: ['Futuristic', 'Developer', 'Innovation'], price: 'Free', featured: true },
  { id: 6, slug: 'healthcare-pro', name: 'Healthcare Pro', category: 'Healthcare', industry: 'Medical', preview: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=850&fit=crop&crop=center&auto=format', rating: 4.7, downloads: 6540, description: 'Template khusus untuk profesional kesehatan', tags: ['Medical', 'Professional', 'Clean'], price: 'Free' },
  { id: 7, slug: 'marketing-guru', name: 'Marketing Guru', category: 'Marketing', industry: 'Marketing', preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=850&fit=crop&crop=center&auto=format', rating: 4.9, downloads: 7830, description: 'Template dinamis untuk marketing professional', tags: ['Dynamic', 'Marketing', 'Creative'], price: 'Free' },
  { id: 8, slug: 'finance-expert', name: 'Finance Expert', category: 'Finance', industry: 'Finance', preview: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&h=850&fit=crop&crop=center&auto=format', rating: 4.6, downloads: 5420, description: 'Template professional untuk finance dan accounting', tags: ['Finance', 'Corporate', 'Traditional'], price: 'Pro' },
  { id: 9, slug: 'startup-founder', name: 'Startup Founder', category: 'Entrepreneur', industry: 'Startup', preview: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=850&fit=crop&crop=crop&auto=format', rating: 5.0, downloads: 4210, description: 'Template bold untuk entrepreneur dan startup founder', tags: ['Bold', 'Entrepreneur', 'Vision'], price: 'Pro', featured: true }
];

const categories = ['All', 'Professional', 'Creative', 'Executive', 'Entry Level', 'Technology', 'Healthcare', 'Marketing', 'Finance', 'Entrepreneur'];

export default function PreviewPage() {
  const router = useRouter();

  // ---- State (tanpa TypeScript) ----
  const [hovered, setHovered] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [favorites, setFavorites] = useState([]);   // array of ids (number)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cv:favorites');
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem('cv:favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const filteredTemplates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return cvTemplates.filter((t) => {
      const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
      const matchesSearch = !term
        ? true
        : t.name.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term) ||
          t.tags.some((tag) => tag.toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [filterCategory, searchTerm]);

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Navigasi ke halaman editor dengan query 'templateId' (slug)
  const handleUseTemplate = (t, e) => {
    if (e) e.stopPropagation();
    router.push(`/editor?templateId=${t.slug}`);
  };

  const handlePreviewTemplate = (t) => {
    alert(`Preview template: ${t.name}`);
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .page-container { min-height: 100vh; background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%); }

        /* Header Styles */
        .header { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0, 0, 0, 0.06); position: sticky; top: 0; z-index: 50; }
        .header-content { max-width: 1280px; margin: 0 auto; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; }
        .header-left { display: flex; align-items: center; gap: 16px; }
        .back-btn { background: none; border: none; color: #64748b; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); padding: 8px; display: flex; align-items: center; border-radius: 8px; }
        .back-btn:hover { color: #0f172a; background: #f8fafc; transform: translateX(-2px); }
        .header-title { font-size: 22px; font-weight: 600; color: #0f172a; letter-spacing: -0.02em; }
        .header-right { display: flex; align-items: center; gap: 12px; }
        .view-toggle-btn { background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); padding: 8px; display: flex; align-items: center; border-radius: 8px; }
        .view-toggle-btn:hover { color: #0f172a; border-color: #cbd5e1; transform: translateY(-1px); }

        /* Search & Filter Section */
        .search-filter-section { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(0, 0, 0, 0.06); }
        .search-filter-content { max-width: 1280px; margin: 0 auto; padding: 24px; }
        .search-container { position: relative; margin-bottom: 24px; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; transition: color 0.3s; }
        .search-input { width: 100%; border: 1px solid #e2e8f0; background: #ffffff; border-radius: 12px; padding: 12px 16px 12px 44px; color: #0f172a; font-size: 15px; outline: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .search-input::placeholder { color: #cbd5e1; }
        .search-input:focus { border-color: #94a3b8; box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1); }
        .search-input:focus + .search-icon { color: #64748b; }

        /* Category Pills */
        .category-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .category-btn { background: #ffffff; border: 1px solid #e2e8f0; padding: 8px 16px; font-size: 14px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); color: #64748b; border-radius: 20px; font-weight: 500; }
        .category-btn:hover { color: #0f172a; border-color: #cbd5e1; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04); }
        .category-btn.active { color: #ffffff; background: #0f172a; border-color: #0f172a; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2); }

        /* Main Content */
        .main-content { max-width: 1280px; margin: 0 auto; padding: 48px 24px; }

        /* Empty State */
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 40vh; animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .empty-icon { margin-bottom: 16px; color: #e2e8f0; }
        .empty-text { color: #94a3b8; margin-bottom: 16px; font-size: 15px; }
        .reset-btn { background: none; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 8px; font-size: 14px; color: #0f172a; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .reset-btn:hover { background: #f8fafc; transform: translateY(-1px); }

        /* Layouts */
        .grid-layout { display: grid; grid-template-columns: 1fr; gap: 32px; animation: fadeIn 0.6s ease-out; }
        @media (min-width: 640px) { .grid-layout { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .grid-layout { grid-template-columns: repeat(3, 1fr); } }
        .list-layout { display: flex; flex-direction: column; gap: 24px; }

        /* Template Card */
        .template-card { cursor: pointer; animation: slideUp 0.5s ease-out backwards; }
        .template-card:nth-child(1) { animation-delay: 0.05s; }
        .template-card:nth-child(2) { animation-delay: 0.1s; }
        .template-card:nth-child(3) { animation-delay: 0.15s; }
        .template-card:nth-child(4) { animation-delay: 0.2s; }
        .template-card:nth-child(5) { animation-delay: 0.25s; }
        .template-card:nth-child(6) { animation-delay: 0.3s; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .template-image-container { position: relative; aspect-ratio: 3/4; overflow: hidden; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); margin-bottom: 16px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .template-card:hover .template-image-container { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); transform: translateY(-4px); }
        .template-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .template-card:hover .template-image { transform: scale(1.08); }

        /* Hover Overlay */
        .hover-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 10px; background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(8px); opacity: 0; transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .template-card:hover .hover-overlay { opacity: 1; }

        .btn-preview, .btn-use { display: flex; align-items: center; gap: 8px; padding: 10px 18px; font-size: 14px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: none; border-radius: 10px; font-weight: 500; }
        .btn-preview { border: 1.5px solid #e2e8f0; background: #ffffff; color: #0f172a; }
        .btn-preview:hover { background: #f8fafc; border-color: #cbd5e1; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
        .btn-use { background: #0f172a; color: #ffffff; }
        .btn-use:hover { background: #000000; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(15, 23, 42, 0.3); }

        /* Favorite Button */
        .favorite-btn { position: absolute; right: 12px; top: 12px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border: 1px solid rgba(0, 0, 0, 0.06); border-radius: 10px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 10; }
        .favorite-btn:hover { background: #ffffff; transform: scale(1.1); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        .favorite-icon { color: #cbd5e1; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .favorite-btn:hover .favorite-icon { color: #ef4444; }
        .favorite-icon.active { color: #ef4444; fill: #ef4444; }

        /* Price Badge */
        .price-badge { position: absolute; left: 12px; top: 12px; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); color: #ffffff; padding: 6px 12px; font-size: 12px; border-radius: 8px; font-weight: 600; letter-spacing: 0.02em; }

        /* Template Info */
        .template-info { display: flex; flex-direction: column; gap: 6px; }
        .template-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
        .template-name { font-weight: 600; color: #0f172a; font-size: 17px; letter-spacing: -0.01em; transition: color 0.3s; }
        .template-card:hover .template-name { color: #1e293b; }
        .template-rating { display: flex; align-items: center; gap: 4px; color: #fbbf24; flex-shrink: 0; }
        .rating-star { fill: #fbbf24; }
        .rating-value { font-size: 13px; font-weight: 600; color: #64748b; }
        .template-description { font-size: 14px; color: #64748b; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .template-meta { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #f1f5f9; margin-top: 4px; }
        .template-category { font-size: 12px; color: #94a3b8; font-weight: 500; padding: 4px 10px; background: #f8fafc; border-radius: 6px; }
        .template-downloads { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #94a3b8; font-weight: 500; }
      `}</style>

      <div className="page-container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <button className="back-btn" onClick={() => window.history.back()}>
                <ArrowLeft size={20} />
              </button>
              <h1 className="header-title">Template CV</h1>
            </div>
            <div className="header-right">
              <button
                className="view-toggle-btn"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Search & Filter */}
        <div className="search-filter-section">
          <div className="search-filter-content">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Cari template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="category-pills">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`category-btn ${filterCategory === c ? 'active' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="main-content">
          {filteredTemplates.length === 0 ? (
            <div className="empty-state">
              <Search size={40} className="empty-icon" />
              <p className="empty-text">Tidak ada template ditemukan</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('All');
                }}
                className="reset-btn"
              >
                Reset pencarian
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid-layout' : 'list-layout'}>
              {filteredTemplates.map((t) => (
                <article
                  key={t.id}
                  className="template-card"
                  onMouseEnter={() => setHovered(t.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handlePreviewTemplate(t)}
                >
                  <div className="template-image-container">
                    <img src={t.preview} alt={t.name} className="template-image" />

                    <div className="hover-overlay">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewTemplate(t);
                        }}
                        className="btn-preview"
                      >
                        <Eye size={16} /> Preview
                      </button>
                      <button onClick={(e) => handleUseTemplate(t, e)} className="btn-use">
                        <Edit size={16} /> Gunakan
                      </button>
                    </div>

                    <button onClick={(e) => toggleFavorite(t.id, e)} className="favorite-btn">
                      <Heart
                        size={16}
                        className={`favorite-icon ${favorites.includes(t.id) ? 'active' : ''}`}
                      />
                    </button>

                    {t.price === 'Pro' && <span className="price-badge">PRO</span>}
                  </div>

                  <div className="template-info">
                    <div className="template-header">
                      <h3 className="template-name">{t.name}</h3>
                      <div className="template-rating">
                        <Star size={14} className="rating-star" />
                        <span className="rating-value">{t.rating}</span>
                      </div>
                    </div>

                    <p className="template-description">{t.description}</p>

                    <div className="template-meta">
                      <span className="template-category">{t.category}</span>
                      <span className="template-downloads">
                        <Download size={13} />
                        {(t.downloads / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
