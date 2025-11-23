"use client";

import { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  CheckCircle, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  Menu, 
  X, 
  Settings, 
  BookOpen, 
  MessageSquare, 
  Award, 
  Star, 
  Clock, 
  Download,
  Bookmark,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Volume2,
  Maximize,
  RotateCcw,
  SkipBack,
  SkipForward,
  Trophy,
  Zap,
  Target
} from 'lucide-react';

// --- DATA SIMULASI UNTUK SATU KURSUS ---
const courseData = {
  title: 'Web Development Bootcamp 2025',
  slug: 'web-development-bootcamp-2025',
  instructor: 'Andi Pratama',
  totalLessons: 16,
  totalDuration: '14j 30m',
  currentLesson: 'Dasar-dasar web',
  currentLessonIndex: 0,
  currentModuleIndex: 0,
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  syllabus: [
    { 
      title: 'Modul 1: Fondasi HTML, CSS, & JavaScript', 
      duration: '2j 30m', 
      difficulty: 'Beginner',
      objectives: ['Memahami struktur HTML', 'Menguasai CSS Flexbox & Grid', 'Dasar-dasar JavaScript'],
      lessons: [
        { name: 'Dasar-dasar web', duration: '25m', completed: false, current: true, resources: ['slide-html-basics.pdf', 'exercise-1.zip'] },
        { name: 'Flexbox & Grid', duration: '35m', completed: false, current: false, resources: ['flexbox-guide.pdf'] },
        { name: 'DOM Manipulation', duration: '40m', completed: false, current: false, resources: ['dom-examples.js'] },
        { name: 'ES6+ Concepts', duration: '50m', completed: false, current: false, resources: ['es6-cheatsheet.pdf'] }
      ]
    },
    { 
      title: 'Modul 2: Deep Dive ke React.js', 
      duration: '4j 15m', 
      difficulty: 'Intermediate',
      objectives: ['Membangun komponen React', 'State management', 'React Hooks'],
      lessons: [
        { name: 'Components & Props', duration: '45m', completed: false, current: false, locked: true, resources: [] },
        { name: 'State & Lifecycle', duration: '60m', completed: false, current: false, locked: true, resources: [] },
        { name: 'React Hooks', duration: '75m', completed: false, current: false, locked: true, resources: [] },
        { name: 'Advanced State Management', duration: '90m', completed: false, current: false, locked: true, resources: [] }
      ]
    },
    { 
      title: 'Modul 3: Backend dengan Node.js', 
      duration: '3j 45m', 
      difficulty: 'Intermediate',
      objectives: ['Membuat server dengan Express', 'REST API', 'Database integration'],
      lessons: [
        { name: 'Pengenalan Express.js', duration: '50m', completed: false, current: false, locked: true, resources: [] },
        { name: 'Membuat REST API', duration: '80m', completed: false, current: false, locked: true, resources: [] },
        { name: 'Middleware', duration: '45m', completed: false, current: false, locked: true, resources: [] },
        { name: 'Koneksi Database', duration: '70m', completed: false, current: false, locked: true, resources: [] }
      ]
    },
    { 
      title: 'Modul 4: Full-Stack dengan Next.js', 
      duration: '4j 0m', 
      difficulty: 'Advanced',
      objectives: ['Server & Client Components', 'Dynamic routing', 'Production deployment'],
      lessons: [
        { name: 'Server & Client Components', duration: '60m', completed: false, current: false, locked: true, resources: [] },
        { name: 'Routing Dinamis', duration: '55m', completed: false, current: false, locked: true, resources: [] },
        { name: 'API Routes', duration: '70m', completed: false, current: false, locked: true, resources: [] },
        { name: 'Deployment ke Vercel', duration: '55m', completed: false, current: false, locked: true, resources: [] }
      ]
    }
  ]
};

// Mock user progress
const userProgress = {
  completedLessons: 0,
  totalXP: 125,
  currentStreak: 3,
  badges: ['First Step', 'Week Warrior'],
  lastWatchPosition: 0,
  bookmarks: []
};

export default function CoursePlayerPage() {
  const [activeLesson, setActiveLesson] = useState(courseData.currentLesson);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [expandedModules, setExpandedModules] = useState([0]);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(15); // Mock progress

  // Calculate overall progress
  const totalLessons = courseData.syllabus.reduce((acc, module) => acc + module.lessons.length, 0);
  const overallProgress = Math.round((userProgress.completedLessons / totalLessons) * 100);

  const currentModule = courseData.syllabus[courseData.currentModuleIndex];
  const currentLessonData = currentModule.lessons[courseData.currentLessonIndex];

  const toggleModule = (moduleIndex) => {
    setExpandedModules(prev => 
      prev.includes(moduleIndex) 
        ? prev.filter(i => i !== moduleIndex)
        : [...prev, moduleIndex]
    );
  };

  const handleLessonChange = (lesson, moduleIndex, lessonIndex) => {
    if (courseData.syllabus[moduleIndex].lessons[lessonIndex].locked) return;
    setActiveLesson(lesson.name);
    setSidebarOpen(false);
  };

  const handlePrevNext = (direction) => {
    // Logic untuk previous/next lesson
    console.log(`Going ${direction}`);
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <>
      <div className="course-player">
        {/* Header dengan Progress dan Navigation */}
        <header className="player-header">
          <div className="header-left">
            <button className="back-btn">
              <ArrowLeft size={20} />
            </button>
            <div className="course-info">
              <h1>{courseData.title}</h1>
              <div className="breadcrumb">
                {currentModule.title} • {currentLessonData.name}
              </div>
            </div>
          </div>
          
          <div className="header-center">
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${overallProgress}%`}}></div>
              </div>
              <span className="progress-text">{userProgress.completedLessons}/{totalLessons} lessons</span>
            </div>
          </div>

          <div className="header-right">
            <div className="user-stats">
              <div className="stat">
                <Zap size={16} />
                <span>{userProgress.totalXP} XP</span>
              </div>
              <div className="stat">
                <Trophy size={16} />
                <span>{userProgress.currentStreak} day streak</span>
              </div>
            </div>
            <button 
              className="sidebar-toggle lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <div className="player-layout">
          {/* KOLOM KIRI: VIDEO PLAYER & KONTEN */}
          <div className="video-content-panel">
            {/* Video Player dengan Controls */}
            <div className="video-player-container">
              <div className="video-player-wrapper">
                <iframe
                  src={courseData.videoUrl}
                  title="Course video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen>
                </iframe>
                
                {/* Custom Video Controls Overlay */}
                <div className={`video-controls-overlay ${showControls ? 'show' : ''}`}>
                  <div className="video-progress">
                    <div className="progress-track">
                      <div className="progress-played" style={{width: `${progress}%`}}></div>
                      {/* Chapter markers */}
                      <div className="chapter-marker" style={{left: '25%'}}></div>
                      <div className="chapter-marker" style={{left: '60%'}}></div>
                    </div>
                  </div>
                  
                  <div className="video-controls">
                    <div className="controls-left">
                      <button className="control-btn">
                        <SkipBack size={20} />
                      </button>
                      <button className="control-btn play-pause">
                        {videoPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      <button className="control-btn">
                        <SkipForward size={20} />
                      </button>
                      <span className="time-display">2:45 / 25:30</span>
                    </div>
                    
                    <div className="controls-right">
                      <div className="speed-control">
                        <button 
                          className="control-btn"
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        >
                          {playbackSpeed}x
                        </button>
                        {showSpeedMenu && (
                          <div className="speed-menu">
                            {speedOptions.map(speed => (
                              <button 
                                key={speed}
                                className={speed === playbackSpeed ? 'active' : ''}
                                onClick={() => {
                                  setPlaybackSpeed(speed);
                                  setShowSpeedMenu(false);
                                }}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="control-btn">
                        <Volume2 size={20} />
                      </button>
                      <button className="control-btn">
                        <Settings size={20} />
                      </button>
                      <button className="control-btn">
                        <Maximize size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="lesson-navigation">
                <button className="nav-btn prev" onClick={() => handlePrevNext('prev')}>
                  <ArrowLeft size={20} />
                  <span>Previous Lesson</span>
                </button>
                <button className="nav-btn next" onClick={() => handlePrevNext('next')}>
                  <span>Next Lesson</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="content-tabs">
              <div className="tab-buttons">
                <button 
                  className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <BookOpen size={18} />
                  Overview
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
                  onClick={() => setActiveTab('resources')}
                >
                  <Download size={18} />
                  Resources
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'qa' ? 'active' : ''}`}
                  onClick={() => setActiveTab('qa')}
                >
                  <MessageSquare size={18} />
                  Q&A
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'overview' && (
                  <div className="overview-content">
                    <div className="lesson-info">
                      <h2>{currentLessonData.name}</h2>
                      <div className="lesson-meta">
                        <span className="duration">
                          <Clock size={16} />
                          {currentLessonData.duration}
                        </span>
                        <span className={`difficulty ${currentModule.difficulty.toLowerCase()}`}>
                          <Target size={16} />
                          {currentModule.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="learning-objectives">
                      <h3>Learning Objectives</h3>
                      <ul>
                        {currentModule.objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="lesson-description">
                      <h3>About This Lesson</h3>
                      <p>
                        Dalam lesson ini, kita akan mempelajari fondasi dari web development. 
                        Mulai dari struktur HTML yang semantic, styling dengan CSS yang modern, 
                        hingga interaktivitas dengan JavaScript.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="resources-content">
                    <h3>Downloadable Resources</h3>
                    <div className="resource-list">
                      {currentLessonData.resources.map((resource, index) => (
                        <div key={index} className="resource-item">
                          <div className="resource-icon">
                            <Download size={20} />
                          </div>
                          <div className="resource-info">
                            <span className="resource-name">{resource}</span>
                            <span className="resource-size">2.3 MB</span>
                          </div>
                          <button className="download-btn">Download</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div className="qa-content">
                    <div className="qa-header">
                      <h3>Questions & Answers</h3>
                      <button className="ask-question-btn">Ask Question</button>
                    </div>
                    <div className="qa-list">
                      <div className="qa-item">
                        <div className="question">
                          <h4>How do I center a div using Flexbox?</h4>
                          <span className="author">by Sarah M.</span>
                        </div>
                        <div className="answer">
                          <p>Use display: flex with justify-content: center and align-items: center...</p>
                          <span className="answerer">Answered by Instructor</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: DAFTAR MATERI (SILABUS) */}
          <aside className={`syllabus-panel ${sidebarOpen ? 'open' : ''}`}>
            {sidebarOpen && (
              <button 
                className="close-sidebar lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            )}
            
            <div className="syllabus-header">
              <h3>Course Content</h3>
              <div className="course-stats">
                <span>{totalLessons} lessons</span>
                <span>{courseData.totalDuration}</span>
              </div>
            </div>
            
            <div className="syllabus-modules">
              {courseData.syllabus.map((module, moduleIndex) => (
                <div key={moduleIndex} className="module-item">
                  <div 
                    className="module-header"
                    onClick={() => toggleModule(moduleIndex)}
                  >
                    <div className="module-info">
                      <h4>{module.title}</h4>
                      <div className="module-meta">
                        <span className={`difficulty ${module.difficulty.toLowerCase()}`}>
                          {module.difficulty}
                        </span>
                        <span className="duration">{module.duration}</span>
                      </div>
                    </div>
                    <button className="expand-btn">
                      {expandedModules.includes(moduleIndex) ? 
                        <ChevronUp size={20} /> : <ChevronDown size={20} />
                      }
                    </button>
                  </div>
                  
                  {expandedModules.includes(moduleIndex) && (
                    <ul className="lesson-list">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li 
                          key={lessonIndex} 
                          className={`
                            lesson-item 
                            ${lesson.current ? 'current' : ''} 
                            ${lesson.completed ? 'completed' : ''} 
                            ${lesson.locked ? 'locked' : ''}
                          `}
                          onClick={() => handleLessonChange(lesson, moduleIndex, lessonIndex)}
                        >
                          <div className="lesson-status">
                            {lesson.completed && <CheckCircle size={16} />}
                            {lesson.current && <PlayCircle size={16} />}
                            {lesson.locked && <Lock size={16} />}
                            {!lesson.completed && !lesson.current && !lesson.locked && <PlayCircle size={16} />}
                          </div>
                          <div className="lesson-info">
                            <span className="lesson-name">{lesson.name}</span>
                            <span className="lesson-duration">{lesson.duration}</span>
                          </div>
                          {lesson.current && (
                            <div className="current-indicator">
                              <div className="pulse"></div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Achievement Section */}
            <div className="achievements-section">
              <h4>Your Progress</h4>
              <div className="progress-stats">
                <div className="stat-item">
                  <Award size={20} />
                  <div>
                    <span className="stat-number">{userProgress.badges.length}</span>
                    <span className="stat-label">Badges</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Zap size={20} />
                  <div>
                    <span className="stat-number">{userProgress.totalXP}</span>
                    <span className="stat-label">XP Points</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="mobile-bottom-nav lg:hidden">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BookOpen size={20} />
            <span>Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            <Download size={20} />
            <span>Resources</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'qa' ? 'active' : ''}`}
            onClick={() => setActiveTab('qa')}
          >
            <MessageSquare size={20} />
            <span>Q&A</span>
          </button>
          <button 
            className="nav-item"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
            <span>Lessons</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .course-player {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .player-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 0;
          flex: 1;
        }
        .back-btn {
          padding: 0.5rem;
          border: none;
          background: #f8fafc;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .back-btn:hover {
          background: #e2e8f0;
        }
        .course-info h1 {
          font-size: 1.25rem;
          color: #0f172a;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .breadcrumb {
          font-size: 0.875rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .header-center {
          flex: 1;
          max-width: 400px;
        }
        .progress-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        .progress-text {
          font-size: 0.875rem;
          color: #64748b;
          white-space: nowrap;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-stats {
          display: flex;
          gap: 1rem;
        }
        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
        }
        .sidebar-toggle {
          padding: 0.5rem;
          border: none;
          background: #f8fafc;
          border-radius: 8px;
          cursor: pointer;
        }

        /* Main Layout */
        .player-layout {
          display: grid;
          grid-template-columns: 1fr;
          height: calc(100vh - 80px);
          flex: 1;
        }
        @media(min-width: 1024px) {
          .player-layout {
            grid-template-columns: 1fr 380px;
          }
        }

        /* Video Content Panel */
        .video-content-panel {
          display: flex;
          flex-direction: column;
          background: white;
        }
        .video-player-container {
          position: relative;
        }
        .video-player-wrapper {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          background-color: #000;
          overflow: hidden;
        }
        .video-player-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        /* Custom Video Controls */
        .video-controls-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          padding: 2rem 1rem 1rem;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .video-controls-overlay.show {
          opacity: 1;
        }
        .video-controls-overlay:hover {
          opacity: 1;
        }
        .video-progress {
          margin-bottom: 1rem;
        }
        .progress-track {
          position: relative;
          height: 4px;
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
          cursor: pointer;
        }
        .progress-played {
          height: 100%;
          background: #6366f1;
          border-radius: 2px;
          transition: width 0.1s;
        }
        .chapter-marker {
          position: absolute;
          top: -2px;
          width: 8px;
          height: 8px;
          background: #fbbf24;
          border-radius: 50%;
          transform: translateX(-50%);
          cursor: pointer;
        }
        .video-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .controls-left, .controls-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .control-btn {
          padding: 0.5rem;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .control-btn:hover {
          background: rgba(255,255,255,0.2);
        }
        .control-btn.play-pause {
          padding: 0.75rem;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
        }
        .time-display {
          color: white;
          font-size: 0.875rem;
          margin-left: 0.5rem;
        }
        .speed-control {
          position: relative;
        }
        .speed-menu {
          position: absolute;
          bottom: calc(100% + 0.5rem);
          right: 0;
          background: rgba(0,0,0,0.9);
          border-radius: 8px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 60px;
        }
        .speed-menu button {
          padding: 0.5rem;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 0.875rem;
          transition: background 0.2s;
        }
        .speed-menu button:hover,
        .speed-menu button.active {
          background: rgba(255,255,255,0.2);
        }

        /* Lesson Navigation */
        .lesson-navigation {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.925rem;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }
        .nav-btn.next {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
        }
        .nav-btn.next:hover {
          background: #5856eb;
        }

        /* Content Tabs */
        .content-tabs {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .tab-buttons {
          display: flex;
          border-bottom: 2px solid #e2e8f0;
          background: #f8fafc;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: #64748b;
          font-size: 0.925rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          color: #0f172a;
          background: rgba(255,255,255,0.5);
        }
        .tab-btn.active {
          color: #6366f1;
          border-bottom-color: #6366f1;
          background: white;
        }
        .tab-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        /* Overview Content */
        .lesson-info h2 {
          font-size: 1.5rem;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        .lesson-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .lesson-meta > span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .difficulty.beginner { background: #dcfce7; color: #16a34a; }
        .difficulty.intermediate { background: #fef3c7; color: #d97706; }
        .difficulty.advanced { background: #fee2e2; color: #dc2626; }
        .learning-objectives, .lesson-description {
          margin-bottom: 2rem;
        }
        .learning-objectives h3, .lesson-description h3 {
          font-size: 1.125rem;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        .learning-objectives ul {
          list-style: none;
          padding: 0;
        }
        .learning-objectives li {
          padding: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .learning-objectives li::before {
          content: '✓';
          color: #22c55e;
          font-weight: bold;
          font-size: 1.125rem;
        }

        /* Resources Content */
        .resources-content h3 {
          font-size: 1.125rem;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }
        .resource-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .resource-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }
        .resource-icon {
          padding: 0.75rem;
          background: #6366f1;
          color: white;
          border-radius: 8px;
        }
        .resource-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .resource-name {
          font-weight: 600;
          color: #0f172a;
        }
        .resource-size {
          font-size: 0.875rem;
          color: #64748b;
        }
        .download-btn {
          padding: 0.5rem 1rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .download-btn:hover {
          background: #5856eb;
        }

        /* Q&A Content */
        .qa-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .qa-header h3 {
          font-size: 1.125rem;
          color: #0f172a;
        }
        .ask-question-btn {
          padding: 0.5rem 1rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }
        .qa-item {
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          margin-bottom: 1rem;
        }
        .question h4 {
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .author, .answerer {
          font-size: 0.875rem;
          color: #64748b;
        }
        .answer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }
        .answer p {
          color: #475569;
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }

        /* Syllabus Panel */
        .syllabus-panel {
          display: flex;
          flex-direction: column;
          border-left: 1px solid #e2e8f0;
          background: white;
          position: fixed;
          top: 0;
          right: -380px;
          width: 380px;
          height: 100vh;
          z-index: 60;
          transition: right 0.3s ease;
          overflow: hidden;
        }
        .syllabus-panel.open {
          right: 0;
        }
        @media(min-width: 1024px) {
          .syllabus-panel {
            position: static;
            width: auto;
            height: auto;
            right: auto;
          }
        }
        .close-sidebar {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 70;
          padding: 0.5rem;
          background: #f8fafc;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .syllabus-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        .syllabus-header h3 {
          font-size: 1.125rem;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .course-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #64748b;
        }
        .syllabus-modules {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 1rem;
        }

        /* Module Items */
        .module-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: #f1f5f9;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid #e2e8f0;
        }
        .module-header:hover {
          background: #e2e8f0;
        }
        .module-info h4 {
          font-size: 0.925rem;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .module-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
        }
        .expand-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
        }

        /* Lesson List */
        .lesson-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .lesson-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s;
          position: relative;
        }
        .lesson-item:hover {
          background: #f8fafc;
        }
        .lesson-item.current {
          background: #eef2ff;
          color: #4338ca;
          font-weight: 600;
        }
        .lesson-item.completed {
          color: #16a34a;
        }
        .lesson-item.locked {
          color: #94a3b8;
          cursor: not-allowed;
        }
        .lesson-item.locked:hover {
          background: none;
        }
        .lesson-status {
          flex-shrink: 0;
        }
        .lesson-info {
          flex: 1;
          min-width: 0;
        }
        .lesson-name {
          display: block;
          font-size: 0.925rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.25rem;
        }
        .lesson-duration {
          font-size: 0.75rem;
          color: #64748b;
        }
        .current-indicator {
          position: absolute;
          right: 1rem;
        }
        .pulse {
          width: 8px;
          height: 8px;
          background: #4338ca;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Achievements Section */
        .achievements-section {
          padding: 1.5rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        .achievements-section h4 {
          font-size: 1rem;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        .progress-stats {
          display: flex;
          gap: 1rem;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }
        .stat-item svg {
          color: #6366f1;
        }
        .stat-number {
          display: block;
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
        }
        .stat-label {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
        }

        /* Mobile Bottom Navigation */
        .mobile-bottom-nav {
          display: flex;
          background: white;
          border-top: 1px solid #e2e8f0;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem 0.5rem;
          background: none;
          border: none;
          color: #64748b;
          font-size: 0.75rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-item.active {
          color: #6366f1;
        }

        /* Responsive Adjustments */
        @media (max-width: 1023px) {
          .player-header {
            padding: 1rem;
          }
          .header-center {
            display: none;
          }
          .user-stats {
            display: none;
          }
          .course-info h1 {
            font-size: 1.125rem;
          }
          .tab-content {
            padding-bottom: 6rem;
          }
          .video-controls-overlay {
            padding: 1rem 0.5rem 0.5rem;
          }
          .controls-left, .controls-right {
            gap: 0.25rem;
          }
          .lesson-navigation {
            padding: 1rem;
          }
        }

        @media (max-width: 640px) {
          .lesson-navigation {
            flex-direction: column;
            gap: 1rem;
          }
          .nav-btn {
            justify-content: center;
          }
          .tab-buttons {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .tab-buttons::-webkit-scrollbar {
            display: none;
          }
          .tab-btn {
            white-space: nowrap;
            min-width: max-content;
          }
        }
      `}</style>
    </>
  );
}
