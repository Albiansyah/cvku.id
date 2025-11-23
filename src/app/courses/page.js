"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Play, 
  BookOpen, 
  Award, 
  ChevronDown,
  Grid,
  List,
  TrendingUp,
  Calendar,
  Tag,
  CheckCircle,
  PlayCircle,
  Lock,
  Zap,
  Target
} from 'lucide-react';

// --- MOCK DATA UNTUK SEMUA KURSUS ---
const allCourses = [
  {
    id: 1,
    title: 'Web Development Bootcamp 2025',
    slug: 'web-development-bootcamp-2025',
    instructor: 'Andi Pratama',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&q=80',
    category: 'Development',
    level: 'Beginner',
    rating: 4.8,
    reviewCount: 2847,
    students: 15420,
    duration: '14h 30m',
    lessonsCount: 16,
    price: 299000,
    originalPrice: 599000,
    description: 'Master modern web development with HTML, CSS, JavaScript, React, and Node.js',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    isEnrolled: false,
    progress: 0,
    lastUpdated: '2025-01-15',
    featured: true,
    bestseller: true
  },
  {
    id: 2,
    title: 'UI/UX Design Fundamental',
    slug: 'ui-ux-design-fundamental',
    instructor: 'Rina Wijaya',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&q=80',
    category: 'Design',
    level: 'Beginner',
    rating: 4.9,
    reviewCount: 1523,
    students: 8340,
    duration: '12h 15m',
    lessonsCount: 22,
    price: 249000,
    originalPrice: 499000,
    description: 'Learn user-centered design principles, wireframing, prototyping, and design systems',
    skills: ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research'],
    isEnrolled: true,
    progress: 65,
    lastUpdated: '2025-02-01',
    featured: false,
    bestseller: false
  },
  {
    id: 3,
    title: 'Python for Data Science',
    slug: 'python-data-science',
    instructor: 'Dr. Budi Santoso',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80',
    category: 'Data Science',
    level: 'Intermediate',
    rating: 4.7,
    reviewCount: 987,
    students: 5200,
    duration: '18h 45m',
    lessonsCount: 28,
    price: 399000,
    originalPrice: 799000,
    description: 'Complete Python data science course with pandas, numpy, matplotlib, and machine learning',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn'],
    isEnrolled: false,
    progress: 0,
    lastUpdated: '2025-01-28',
    featured: true,
    bestseller: false
  },
  {
    id: 4,
    title: 'Mobile App Development with Flutter',
    slug: 'flutter-mobile-development',
    instructor: 'Sarah Chen',
    instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80',
    category: 'Mobile Development',
    level: 'Intermediate',
    rating: 4.6,
    reviewCount: 756,
    students: 3890,
    duration: '16h 20m',
    lessonsCount: 24,
    price: 349000,
    originalPrice: 699000,
    description: 'Build cross-platform mobile apps with Flutter and Dart from scratch to deployment',
    skills: ['Flutter', 'Dart', 'Firebase', 'State Management', 'API Integration'],
    isEnrolled: true,
    progress: 25,
    lastUpdated: '2025-02-10',
    featured: false,
    bestseller: true
  },
  {
    id: 5,
    title: 'Digital Marketing Mastery',
    slug: 'digital-marketing-mastery',
    instructor: 'Ahmad Rizki',
    instructorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80',
    category: 'Marketing',
    level: 'Beginner',
    rating: 4.5,
    reviewCount: 1234,
    students: 9870,
    duration: '10h 30m',
    lessonsCount: 18,
    price: 199000,
    originalPrice: 399000,
    description: 'Complete digital marketing strategy including SEO, SEM, social media, and analytics',
    skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics', 'Content Strategy'],
    isEnrolled: false,
    progress: 0,
    lastUpdated: '2025-01-20',
    featured: false,
    bestseller: false
  },
  {
    id: 6,
    title: 'Cybersecurity Essentials',
    slug: 'cybersecurity-essentials',
    instructor: 'Maya Putri',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80',
    category: 'Security',
    level: 'Advanced',
    rating: 4.8,
    reviewCount: 445,
    students: 2340,
    duration: '20h 15m',
    lessonsCount: 32,
    price: 499000,
    originalPrice: 999000,
    description: 'Learn cybersecurity fundamentals, ethical hacking, and security best practices',
    skills: ['Network Security', 'Ethical Hacking', 'Penetration Testing', 'Risk Assessment'],
    isEnrolled: false,
    progress: 0,
    lastUpdated: '2025-02-05',
    featured: true,
    bestseller: false
  }
];

const categories = ['All', 'Development', 'Design', 'Data Science', 'Mobile Development', 'Marketing', 'Security'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' }
];

export default function CoursesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort courses
  const filteredCourses = allCourses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default: // popular
          return b.students - a.students;
      }
    });

  const enrolledCourses = allCourses.filter(course => course.isEnrolled);
  const featuredCourses = allCourses.filter(course => course.featured);

  const handleCourseClick = (courseSlug) => {
    router.push(`/courses/${courseSlug}`);
  };

  const handleEnroll = (courseId) => {
    console.log('Enrolling in course:', courseId);
    // Logic untuk enroll course
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <div className="courses-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Expand Your Skills</h1>
            <p>Choose from thousands of online courses from top instructors</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </section>

        {/* My Learning Section */}
        {enrolledCourses.length > 0 && (
          <section className="my-learning-section">
            <h2>Continue Learning</h2>
            <div className="enrolled-courses">
              {enrolledCourses.map(course => (
                <div key={course.id} className="enrolled-course-card" onClick={() => handleCourseClick(course.slug)}>
                  <div className="course-thumbnail">
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="progress-overlay">
                      <div className="progress-circle">
                        <svg viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeDasharray={`${course.progress}, 100`}
                          />
                        </svg>
                        <div className="progress-text">{course.progress}%</div>
                      </div>
                    </div>
                  </div>
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>by {course.instructor}</p>
                    <button className="continue-btn">
                      <PlayCircle size={16} />
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Courses */}
        <section className="featured-section">
          <h2>Featured Courses</h2>
          <div className="featured-courses">
            {featuredCourses.map(course => (
              <div key={course.id} className="featured-course-card" onClick={() => handleCourseClick(course.slug)}>
                <div className="featured-thumbnail">
                  <img src={course.thumbnail} alt={course.title} />
                  <div className="badges">
                    {course.bestseller && <span className="badge bestseller">Bestseller</span>}
                  </div>
                </div>
                <div className="featured-info">
                  <div className="category-level">
                    <span className="category">{course.category}</span>
                    <span className={`level ${course.level.toLowerCase()}`}>{course.level}</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p className="description">{course.description}</p>
                  <div className="instructor">
                    <img src={course.instructorAvatar} alt={course.instructor} />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="course-meta">
                    <div className="rating">
                      <Star size={14} fill="currentColor" />
                      <span>{course.rating}</span>
                      <span className="review-count">({course.reviewCount})</span>
                    </div>
                    <div className="stats">
                      <span><Users size={14} /> {course.students.toLocaleString()}</span>
                      <span><Clock size={14} /> {course.duration}</span>
                    </div>
                  </div>
                  <div className="pricing">
                    <span className="current-price">{formatPrice(course.price)}</span>
                    <span className="original-price">{formatPrice(course.originalPrice)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Courses Section */}
        <section className="all-courses-section">
          <div className="section-header">
            <h2>All Courses</h2>
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-bar">
              <Search size={20} />
              <input 
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filters">
              <button 
                className="filter-toggle lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Filters
                <ChevronDown size={16} />
              </button>

              <div className={`filter-options ${showFilters ? 'show' : ''}`}>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="filter-select"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>

                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="results-header">
            <span>{filteredCourses.length} courses found</span>
          </div>

          {/* Course Grid/List */}
          <div className={`courses-${viewMode}`}>
            {filteredCourses.map(course => (
              <div key={course.id} className="course-card" onClick={() => handleCourseClick(course.slug)}>
                <div className="course-thumbnail">
                  <img src={course.thumbnail} alt={course.title} />
                  <div className="badges">
                    {course.bestseller && <span className="badge bestseller">Bestseller</span>}
                    {course.isEnrolled && <span className="badge enrolled">Enrolled</span>}
                  </div>
                  <div className="play-overlay">
                    <Play size={24} />
                  </div>
                </div>

                <div className="course-content">
                  <div className="course-header">
                    <div className="category-level">
                      <span className="category">{course.category}</span>
                      <span className={`level ${course.level.toLowerCase()}`}>{course.level}</span>
                    </div>
                    <div className="rating">
                      <Star size={14} fill="currentColor" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>

                  <div className="instructor">
                    <img src={course.instructorAvatar} alt={course.instructor} />
                    <span>{course.instructor}</span>
                  </div>

                  <div className="skills">
                    {course.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                    {course.skills.length > 3 && (
                      <span className="skill-more">+{course.skills.length - 3} more</span>
                    )}
                  </div>

                  <div className="course-stats">
                    <span><Users size={14} /> {course.students.toLocaleString()}</span>
                    <span><BookOpen size={14} /> {course.lessonsCount} lessons</span>
                    <span><Clock size={14} /> {course.duration}</span>
                  </div>

                  <div className="course-footer">
                    <div className="pricing">
                      <span className="current-price">{formatPrice(course.price)}</span>
                      <span className="original-price">{formatPrice(course.originalPrice)}</span>
                    </div>
                    <button 
                      className="enroll-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (course.isEnrolled) {
                          handleCourseClick(course.slug);
                        } else {
                          handleEnroll(course.id);
                        }
                      }}
                    >
                      {course.isEnrolled ? 'Continue' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="empty-state">
              <BookOpen size={64} />
              <h3>No courses found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .courses-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Hero Section - PERBAIKAN */
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6rem 2rem 4rem 2rem; /* PERBAIKAN: Tambahkan padding-top lebih besar */
          text-align: center;
          margin-top: 80px; /* PERBAIKAN: Tambahkan margin-top untuk mengkompensasi navbar fixed */
        }
        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .hero-content p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.95;
        }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }
        .stat {
          text-align: center;
        }
        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .stat-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        /* My Learning Section */
        .my-learning-section {
          padding: 3rem 2rem;
          background: white;
        }
        .my-learning-section h2 {
          font-size: 2rem;
          color: #0f172a;
          margin-bottom: 2rem;
        }
        .enrolled-courses {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }
        .enrolled-course-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .enrolled-course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        .course-thumbnail {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .course-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .progress-overlay {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }
        .progress-circle {
          position: relative;
          width: 48px;
          height: 48px;
        }
        .progress-circle svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
        }
        .course-info {
          padding: 1.5rem;
        }
        .course-info h3 {
          font-size: 1.125rem;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .course-info p {
          color: #64748b;
          margin-bottom: 1rem;
        }
        .continue-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          width: 100%;
          justify-content: center;
        }
        .continue-btn:hover {
          background: #5856eb;
        }

        /* Featured Section */
        .featured-section {
          padding: 3rem 2rem;
          background: #f8fafc;
        }
        .featured-section h2 {
          font-size: 2rem;
          color: #0f172a;
          margin-bottom: 2rem;
          text-align: center;
        }
        .featured-courses {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .featured-course-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .featured-course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .featured-thumbnail {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .featured-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .featured-info {
          padding: 2rem;
        }
        .category-level {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .category {
          padding: 0.25rem 0.75rem;
          background: #e0e7ff;
          color: #5b21b6;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .level {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .level.beginner { background: #dcfce7; color: #16a34a; }
        .level.intermediate { background: #fef3c7; color: #d97706; }
        .level.advanced { background: #fee2e2; color: #dc2626; }
        .featured-info h3 {
          font-size: 1.375rem;
          color: #0f172a;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }
        .description {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .instructor {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .instructor img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .instructor span {
          font-weight: 500;
          color: #475569;
        }
        .course-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #f59e0b;
        }
        .review-count {
          color: #64748b;
          font-size: 0.875rem;
        }
        .stats {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #64748b;
        }
        .stats span {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        .pricing {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .current-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }
        .original-price {
          font-size: 1rem;
          color: #94a3b8;
          text-decoration: line-through;
        }

        /* All Courses Section */
        .all-courses-section {
          padding: 3rem 2rem;
          background: white;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .section-header h2 {
          font-size: 2rem;
          color: #0f172a;
        }
        .view-controls {
          display: flex;
          gap: 0.5rem;
          background: #f1f5f9;
          border-radius: 10px;
          padding: 0.25rem;
        }
        .view-btn {
          padding: 0.5rem;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }
        .view-btn.active {
          background: white;
          color: #6366f1;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Filters */
        .filters-section {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          max-width: 400px;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          transition: border-color 0.2s;
        }
        .search-bar:focus-within {
          border-color: #6366f1;
        }
        .search-bar input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 1rem;
        }
        .filters {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
        }
        .filter-options {
          display: flex;
          gap: 1rem;
        }
        .filter-options.show {
          display: flex;
        }
        .filter-select {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          font-size: 0.925rem;
          cursor: pointer;
          min-width: 140px;
        }
        .filter-select:focus {
          outline: none;
          border-color: #6366f1;
        }

        /* Results */
        .results-header {
          margin-bottom: 2rem;
          color: #64748b;
          font-size: 0.925rem;
        }

        /* Course Grid */
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }
        .courses-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Course Card */
        .course-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .course-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          border-color: #e0e7ff;
        }
        .courses-list .course-card {
          display: flex;
          align-items: center;
        }
        .courses-list .course-thumbnail {
          width: 200px;
          flex-shrink: 0;
        }
        .course-thumbnail {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .courses-list .course-thumbnail {
          height: 140px;
        }
        .course-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .course-card:hover .course-thumbnail img {
          transform: scale(1.05);
        }
        .badges {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .badge {
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        .badge.bestseller { background: #f59e0b; color: white; }
        .badge.enrolled { background: #10b981; color: white; }
        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 56px;
          height: 56px;
          background: rgba(0,0,0,0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .course-card:hover .play-overlay {
          opacity: 1;
        }

        /* Course Content */
        .course-content {
          padding: 1.5rem;
          flex: 1;
        }
        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .course-title {
          font-size: 1.125rem;
          color: #0f172a;
          margin-bottom: 0.75rem;
          font-weight: 600;
          line-height: 1.4;
        }
        .course-description {
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .skill-tag {
          padding: 0.25rem 0.625rem;
          background: #f1f5f9;
          color: #475569;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .skill-more {
          padding: 0.25rem 0.625rem;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .course-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          color: #64748b;
          flex-wrap: wrap;
        }
        .course-stats span {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        .course-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .enroll-btn {
          padding: 0.75rem 1.5rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .enroll-btn:hover {
          background: #5856eb;
          transform: translateY(-1px);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }
        .empty-state h3 {
          font-size: 1.25rem;
          color: #0f172a;
          margin: 1rem 0 0.5rem;
        }

        /* Responsive */
        @media (max-width: 1023px) {
          .filter-options {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            padding: 1rem;
            margin-top: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 10;
          }
          .filter-options.show {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .filters {
            position: relative;
            width: 100%;
          }
          .filter-toggle {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.25rem;
          }
          .hero-stats {
            gap: 2rem;
          }
          .my-learning-section,
          .featured-section,
          .all-courses-section {
            padding: 2rem 1rem;
          }
          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }
          .search-bar {
            max-width: none;
          }
          .courses-grid {
            grid-template-columns: 1fr;
          }
          .courses-list .course-card {
            flex-direction: column;
          }
          .courses-list .course-thumbnail {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </>
  );
}
