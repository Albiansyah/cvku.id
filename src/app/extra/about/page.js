"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  Users, 
  Lightbulb, 
  Target, 
  Cpu, 
  Accessibility, 
  Linkedin, 
  Twitter, 
  Github,
  Mail,
  ArrowRight,
  Play,
  Award,
  Heart,
  Zap,
  Globe,
  Star,
  Quote,
  Calendar,
  TrendingUp,
  Shield,
  Clock,
  MapPin,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

const teamMembers = [
  { 
    id: 1,
    name: 'Albiansyah', 
    role: 'Founder & CEO', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&q=80',
    bio: 'Visioner di balik CVBuilder dengan 8+ tahun pengalaman di tech startup. Percaya bahwa teknologi harus memberdayakan, bukan mempersulit.',
    achievements: ['Forbes 30 Under 30', 'Tech Leader of the Year 2024'],
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  },
  { 
    id: 2,
    name: 'Rina Wijaya', 
    role: 'Head of Product', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80',
    bio: 'Product strategist yang obsessed dengan user experience. Mantan designer di Gojek dan Tokopedia, kini fokus membangun produk yang user-centric.',
    achievements: ['Product Manager of the Year', 'UX Excellence Award'],
    social: {
      linkedin: '#',
      twitter: '#'
    }
  },
  { 
    id: 3,
    name: 'Andi Pratama', 
    role: 'Lead Engineer', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80',
    bio: 'Full-stack engineer yang passionate tentang clean code dan scalable architecture. Spesialis dalam AI/ML integration untuk recruitment tech.',
    achievements: ['Google Developer Expert', 'Open Source Contributor'],
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#'
    }
  },
  { 
    id: 4,
    name: 'Sarah Chen', 
    role: 'Head of AI', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&q=80',
    bio: 'AI researcher dengan PhD dari Stanford. Memimpin pengembangan AI yang ethical dan bias-free untuk recruitment industry.',
    achievements: ['AI Innovation Award', 'PhD Computer Science Stanford'],
    social: {
      linkedin: '#',
      twitter: '#'
    }
  }
];

const values = [
  { 
    icon: <Target size={32} />, 
    title: 'Human-Centered Design', 
    description: 'Setiap fitur dimulai dari empati mendalam terhadap user. Kami tidak hanya membangun produk, tapi memecahkan masalah nyata yang dialami job seekers.',
    color: '#3b82f6'
  },
  { 
    icon: <Cpu size={32} />, 
    title: 'AI yang Bertanggung Jawab', 
    description: 'AI kami dirancang untuk memperkuat, bukan menggantikan kreativitas manusia. Transparan, fair, dan selalu dalam kontrol user.',
    color: '#8b5cf6'
  },
  { 
    icon: <Accessibility size={32} />, 
    title: 'Equal Opportunity', 
    description: 'Kesempatan karir terbaik tidak boleh dibatasi background ekonomi. Kami berkomitmen menyediakan tools kelas dunia yang accessible untuk semua.',
    color: '#10b981'
  },
  { 
    icon: <Heart size={32} />, 
    title: 'Empathy First', 
    description: 'Job hunting itu stressful. Kami memahami pressure dan anxiety yang dirasakan. Setiap interaksi dirancang untuk memberikan confidence, bukan intimidasi.',
    color: '#f59e0b'
  }
];

const milestones = [
  { year: '2025', title: 'The Beginning', description: 'CVBuilder didirikan dari garage di Jakarta dengan misi sederhana: democratize professional opportunities.' },
  { year: '2027', title: '100K Users', description: 'Mencapai 100,000 pengguna dalam 12 bulan pertama. Bukti bahwa solusi kami dibutuhkan.' },
  { year: '2024', title: 'AI Integration', description: 'Meluncurkan AI-powered resume optimization yang pertama di Indonesia.' },
  { year: '2025', title: 'Global Expansion', description: 'Ekspansi ke 5 negara ASEAN dengan 1M+ pengguna aktif.' }
];

const testimonials = [
  {
    name: 'Dimas Pratama',
    role: 'Software Engineer at Gojek',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    content: 'CVBuilder helped me land my dream job at Gojek. The ATS optimization feature is a game-changer!',
    rating: 5
  },
  {
    name: 'Sari Indah',
    role: 'Product Manager at Tokopedia',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80',
    content: 'As a career changer, CVBuilder made it easy to highlight transferable skills. Got 3 interviews in the first week!',
    rating: 5
  },
  {
    name: 'Ahmad Rizki',
    role: 'Data Scientist at Traveloka',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    content: 'The AI suggestions were spot-on. It felt like having a personal career coach guiding every word.',
    rating: 5
  }
];

export default function AboutPage() {
  const [activeTeamMember, setActiveTeamMember] = useState(null);
  const [visibleStats, setVisibleStats] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const statsRef = useRef(null);
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    satisfaction: 0,
    companies: 0
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleStats(true);
          animateStats();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const targets = { users: 1000000, satisfaction: 98, companies: 2500 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedStats({
        users: Math.floor(targets.users * easeOutQuart),
        satisfaction: Math.floor(targets.satisfaction * easeOutQuart),
        companies: Math.floor(targets.companies * easeOutQuart)
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats(targets);
      }
    }, stepDuration);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
  };

  return (
    <>
      <div className="about-page-wrapper">
        {/* Enhanced Hero Section - STATIC VERSION */}
        <header className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={16} />
              <span>Trusted by 1M+ professionals</span>
            </div>
            <h1>We believe everyone deserves their dream career.</h1>
            <p>CVBuilder is the bridge between your potential and global opportunities. We're not just building resumes—we're building futures.</p>
            <div className="hero-actions">
              <Link href="/editor" className="cta-primary">
                Start Your Journey
                <ArrowRight size={18} />
              </Link>
              <button className="cta-secondary">
                <Play size={18} />
                Watch Our Story
              </button>
            </div>
          </div>
          <div className="hero-scroll-indicator">
            <ChevronDown size={24} />
          </div>
        </header>

        {/* Enhanced Story Section */}
        <section className="story-section">
          <div className="container">
            <div className="story-content">
              <div className="story-text">
                <div className="section-badge">
                  <Heart size={16} />
                  <span>Our Story</span>
                </div>
                <h2>From Frustration to Innovation</h2>
                <p className="lead">It started with a simple problem that our founders experienced firsthand: creating a professional resume was difficult, time-consuming, and often confusing.</p>
                <p>Too many unwritten rules, boring formats, and fears about applicant tracking systems (ATS). We decided to change that.</p>
                <p>We envisioned a platform where anyone could pour their experience into a beautiful and effective document in just minutes. That was the beginning of CVBuilder.</p>
                <div className="story-highlights">
                  <div className="highlight">
                    <CheckCircle size={20} />
                    <span>User-first approach since day one</span>
                  </div>
                  <div className="highlight">
                    <CheckCircle size={20} />
                    <span>AI-powered, human-centered design</span>
                  </div>
                  <div className="highlight">
                    <CheckCircle size={20} />
                    <span>Accessible to everyone, everywhere</span>
                  </div>
                </div>
              </div>
              <div className="story-visual">
                <div className="story-image-stack">
                  <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80" alt="Team brainstorming" className="story-img-1" />
                  <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80" alt="Office workspace" className="story-img-2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Values Section */}
        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <Target size={16} />
                <span>Our Values</span>
              </div>
              <h2>What Drives Us Every Day</h2>
              <p>These aren't just words on a wall—they're the principles that guide every decision we make.</p>
            </div>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card" style={{ '--accent-color': value.color }}>
                  <div className="value-icon" style={{ backgroundColor: `${value.color}15`, color: value.color }}>
                    {value.icon}
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                  <div className="value-accent"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline-section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <Calendar size={16} />
                <span>Our Journey</span>
              </div>
              <h2>Milestones That Matter</h2>
            </div>
            <div className="timeline">
              {milestones.map((milestone, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker">
                    <span>{milestone.year}</span>
                  </div>
                  <div className="timeline-content">
                    <h3>{milestone.title}</h3>
                    <p>{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="stats-section" ref={statsRef}>
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <Users size={32} />
                </div>
                <span className="stat-number">{formatNumber(animatedStats.users)}</span>
                <span className="stat-label">Professionals Empowered</span>
                <span className="stat-sublabel">Across 15+ countries</span>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Heart size={32} />
                </div>
                <span className="stat-number">{animatedStats.satisfaction}%</span>
                <span className="stat-label">Satisfaction Rate</span>
                <span className="stat-sublabel">Based on user surveys</span>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Globe size={32} />
                </div>
                <span className="stat-number">{formatNumber(animatedStats.companies)}</span>
                <span className="stat-label">Partner Companies</span>
                <span className="stat-sublabel">Fortune 500 & startups</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <Quote size={16} />
                <span>Success Stories</span>
              </div>
              <h2>Real People, Real Results</h2>
            </div>
            <div className="testimonial-carousel">
              <div className="testimonial-card active">
                <div className="testimonial-content">
                  <div className="stars">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote>"{testimonials[currentTestimonial].content}"</blockquote>
                  <div className="testimonial-author">
                    <img src={testimonials[currentTestimonial].avatar} alt={testimonials[currentTestimonial].name} />
                    <div>
                      <cite>{testimonials[currentTestimonial].name}</cite>
                      <span>{testimonials[currentTestimonial].role}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="testimonial-indicators">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={index === currentTestimonial ? 'active' : ''}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <Users size={16} />
                <span>Our Team</span>
              </div>
              <h2>The Humans Behind the Magic</h2>
              <p>We're a diverse team of dreamers, builders, and problem-solvers united by one mission: empowering your career success.</p>
            </div>
            <div className="team-grid">
              {teamMembers.map((member) => (
                <div 
                  key={member.id} 
                  className={`team-card ${activeTeamMember === member.id ? 'expanded' : ''}`}
                  onClick={() => setActiveTeamMember(activeTeamMember === member.id ? null : member.id)}
                >
                  <div className="team-card-front">
                    <img src={member.avatar} alt={member.name} className="team-avatar" />
                    <div className="team-info">
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                      <div className="social-links">
                        {member.social.linkedin && <a href={member.social.linkedin} onClick={(e) => e.stopPropagation()}><Linkedin size={18} /></a>}
                        {member.social.twitter && <a href={member.social.twitter} onClick={(e) => e.stopPropagation()}><Twitter size={18} /></a>}
                        {member.social.github && <a href={member.social.github} onClick={(e) => e.stopPropagation()}><Github size={18} /></a>}
                      </div>
                    </div>
                    <ChevronRight className="expand-icon" size={20} />
                  </div>
                  {activeTeamMember === member.id && (
                    <div className="team-card-back">
                      <div className="member-bio">
                        <p>{member.bio}</p>
                        <div className="achievements">
                          <h4>Achievements</h4>
                          <ul>
                            {member.achievements.map((achievement, index) => (
                              <li key={index}>
                                <Award size={14} />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="final-cta-section">
          <div className="container">
            <div className="cta-content">
              <div className="cta-text">
                <h2>Ready to Write Your Success Story?</h2>
                <p>Join over 1 million professionals who've transformed their careers with CVBuilder. Your dream job is just one great resume away.</p>
                <div className="cta-features">
                  <div className="feature">
                    <Shield size={16} />
                    <span>Free forever plan</span>
                  </div>
                  <div className="feature">
                    <Zap size={16} />
                    <span>AI-powered optimization</span>
                  </div>
                  <div className="feature">
                    <Clock size={16} />
                    <span>5-minute setup</span>
                  </div>
                </div>
              </div>
              <div className="cta-actions">
                <Link href="/editor" className="cta-button primary">
                  Start Building Free
                  <ArrowRight size={18} />
                </Link>
                <Link href="/templates" className="cta-button secondary">
                  Browse Templates
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .about-page-wrapper { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
          background: #ffffff;
          padding-top: 80px; /* FIXED: Navbar compensation */
        }
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 2rem; 
        }

        /* Enhanced Hero Section - STATIC VERSION */
        .hero-section {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80');
          background-size: cover;
          background-position: center;
          opacity: 0.2;
          z-index: 1;
        }
        .hero-overlay { 
          position: absolute; 
          inset: 0; 
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.9) 100%);
          z-index: 2;
        }
        .hero-content { 
          position: relative; 
          z-index: 3; 
          max-width: 900px;
          animation: fadeInUp 1s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }
        .hero-content h1 { 
          font-size: clamp(2.5rem, 6vw, 4rem); 
          font-weight: 800;
          line-height: 1.1; 
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-content p { 
          font-size: 1.25rem; 
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-primary, .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .cta-primary {
          background: white;
          color: #4f46e5;
        }
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
        }
        .cta-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }
        .hero-scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          opacity: 0.7;
          animation: bounce 2s infinite;
          z-index: 3;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }

        /* Section Badges */
        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f0f9ff;
          color: #0369a1;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        /* Enhanced Story Section */
        .story-section { 
          padding: 8rem 0; 
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        .story-content { 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 4rem; 
          align-items: center; 
        }
        @media(min-width: 1024px) { 
          .story-content { 
            grid-template-columns: 1.2fr 1fr; 
          } 
        }
        .story-text h2 { 
          font-size: 3rem; 
          font-weight: 800;
          color: #0f172a; 
          margin-bottom: 2rem;
          line-height: 1.1;
        }
        .story-text .lead {
          font-size: 1.25rem;
          color: #374151;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }
        .story-text p { 
          color: #4b5563; 
          font-size: 1.1rem;
          line-height: 1.7; 
          margin-bottom: 1.5rem; 
        }
        .story-highlights {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
        }
        .highlight {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #059669;
          font-weight: 500;
        }
        .story-visual {
          position: relative;
        }
        .story-image-stack {
          position: relative;
          height: 400px;
        }
        .story-img-1, .story-img-2 {
          position: absolute;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .story-img-1 {
          width: 70%;
          height: 80%;
          top: 0;
          left: 0;
          z-index: 2;
        }
        .story-img-2 {
          width: 60%;
          height: 70%;
          bottom: 0;
          right: 0;
          z-index: 1;
        }

        /* Enhanced Values Section */
        .values-section { 
          padding: 8rem 0; 
          background: white;
        }
        .section-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem;
        }
        .section-header h2 {
          font-size: 3rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .section-header p {
          font-size: 1.2rem;
          color: #6b7280;
          line-height: 1.6;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .value-card {
          padding: 2.5rem;
          background: white;
          border-radius: 20px;
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: var(--accent-color);
        }
        .value-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .value-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        .value-card p {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 0;
        }
        .value-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--accent-color);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .value-card:hover .value-accent {
          transform: scaleX(1);
        }

        /* Timeline Section */
        .timeline-section {
          padding: 8rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        .timeline {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 2rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #3b82f6, #8b5cf6);
        }
        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 3rem;
          position: relative;
        }
        .timeline-marker {
          flex-shrink: 0;
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          position: relative;
          z-index: 2;
        }
        .timeline-content {
          flex: 1;
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
        }
        .timeline-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .timeline-content p {
          color: #6b7280;
          line-height: 1.6;
        }

        /* Enhanced Stats Section */
        .stats-section { 
          padding: 8rem 0; 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        .stats-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
        }
        .stats-grid { 
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          position: relative;
          z-index: 2;
        }
        .stat-item { 
          text-align: center;
          padding: 2rem;
        }
        .stat-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #60a5fa;
        }
        .stat-number { 
          display: block; 
          font-size: 3.5rem; 
          font-weight: 800; 
          color: white;
          margin-bottom: 0.5rem;
        }
        .stat-label { 
          display: block;
          font-size: 1.2rem; 
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 0.25rem;
        }
        .stat-sublabel {
          display: block;
          font-size: 0.875rem;
          color: #94a3b8;
        }

        /* Testimonials Section */
        .testimonials-section {
          padding: 8rem 0;
          background: white;
        }
        .testimonial-carousel {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        .testimonial-card {
          opacity: 1;
          transition: all 0.5s ease;
        }
        .testimonial-content {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 3rem;
          border-radius: 20px;
          position: relative;
        }
        .stars {
          display: flex;
          justify-content: center;
          gap: 0.25rem;
          color: #fbbf24;
          margin-bottom: 1.5rem;
        }
        .testimonial-content blockquote {
          font-size: 1.5rem;
          font-weight: 500;
          color: #0f172a;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-style: italic;
        }
        .testimonial-author {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        .testimonial-author img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }
        .testimonial-author div {
          text-align: left;
        }
        .testimonial-author cite {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #0f172a;
          font-style: normal;
        }
        .testimonial-author span {
          font-size: 0.9rem;
          color: #6b7280;
        }
        .testimonial-indicators {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }
        .testimonial-indicators button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .testimonial-indicators button.active {
          background: #3b82f6;
          transform: scale(1.2);
        }

        /* Enhanced Team Section */
        .team-section { 
          padding: 8rem 0; 
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        .team-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 2rem;
        }
        .team-card { 
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid transparent;
        }
        .team-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
          border-color: #e0e7ff;
        }
        .team-card.expanded {
          border-color: #3b82f6;
        }
        .team-card-front {
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          position: relative;
        }
        .team-avatar { 
          width: 80px; 
          height: 80px; 
          border-radius: 50%; 
          object-fit: cover;
          flex-shrink: 0;
        }
        .team-info {
          flex: 1;
        }
        .team-info h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }
        .team-info p {
          color: #6b7280;
          margin-bottom: 1rem;
        }
        .social-links { 
          display: flex; 
          gap: 0.75rem; 
        }
        .social-links a { 
          color: #9ca3af; 
          transition: color 0.2s;
          padding: 0.5rem;
          border-radius: 8px;
          background: #f9fafb;
        }
        .social-links a:hover { 
          color: #3b82f6;
          background: #eff6ff;
        }
        .expand-icon {
          color: #9ca3af;
          transition: all 0.3s ease;
        }
        .team-card.expanded .expand-icon {
          transform: rotate(90deg);
          color: #3b82f6;
        }
        .team-card-back {
          padding: 0 2rem 2rem;
          border-top: 1px solid #f1f5f9;
          animation: expandDown 0.3s ease;
        }
        @keyframes expandDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .member-bio p {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .achievements h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }
        .achievements ul {
          list-style: none;
        }
        .achievements li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #059669;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        /* Enhanced Final CTA Section */
        .final-cta-section { 
          padding: 8rem 0; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        .final-cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        }
        .cta-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        @media(min-width: 1024px) {
          .cta-content {
            grid-template-columns: 1.5fr 1fr;
            text-align: left;
          }
        }
        .cta-text h2 { 
          font-size: 3rem; 
          font-weight: 800;
          color: white; 
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        .cta-text p { 
          font-size: 1.2rem; 
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .cta-features {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
        }
        @media(min-width: 1024px) {
          .cta-features {
            justify-content: flex-start;
          }
        }
        .feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }
        .cta-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
        @media(min-width: 1024px) {
          .cta-actions {
            align-items: flex-start;
          }
        }
        .cta-button { 
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem; 
          font-size: 1.1rem; 
          font-weight: 600; 
          border-radius: 12px; 
          text-decoration: none; 
          transition: all 0.3s ease;
          border: 2px solid transparent;
          min-width: 200px;
          justify-content: center;
        }
        .cta-button.primary {
          background: white;
          color: #4f46e5;
        }
        .cta-button.primary:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
        }
        .cta-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        .cta-button.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        /* Responsive Design */
        @media (max-width: 1023px) {
          .about-page-wrapper {
            padding-top: 70px;
          }
          .hero-content h1 {
            font-size: 2.5rem;
          }
          .story-text h2,
          .section-header h2,
          .cta-text h2 {
            font-size: 2.25rem;
          }
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }
          .cta-primary, .cta-secondary {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }

        @media (max-width: 767px) {
          .container {
            padding: 0 1rem;
          }
          .story-section,
          .values-section,
          .timeline-section,
          .stats-section,
          .testimonials-section,
          .team-section,
          .final-cta-section {
            padding: 4rem 0;
          }
          .hero-content h1 {
            font-size: 2rem;
          }
          .hero-content p {
            font-size: 1.1rem;
          }
          .story-text h2,
          .section-header h2,
          .cta-text h2 {
            font-size: 1.875rem;
          }
          .timeline::before {
            left: 1rem;
          }
          .timeline-marker {
            width: 2rem;
            height: 2rem;
          }
          .team-card-front {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          .expand-icon {
            position: absolute;
            top: 1rem;
            right: 1rem;
          }
          .values-grid {
            grid-template-columns: 1fr;
          }
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </>
  );
}
