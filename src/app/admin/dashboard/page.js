'use client';

import { useState, useEffect } from "react";
import { 
  Menu, X, Calendar, TrendingUp, TrendingDown, Users, FileText, 
  Crown, ChevronDown, Zap, Download, BarChart3, Settings, 
  UserPlus, Plus, Mail, ChevronRight, Bell, MessageSquare, Search
} from "lucide-react";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = [
    { label: 'Total Users', value: '15.2K', change: 12.5, icon: Users, color: '#6366F1' },
    { label: 'Active Users', value: '9.8K', change: 8.2, icon: Zap, color: '#10B981' },
    { label: 'CVs Created', value: '28.7K', change: 15.7, icon: FileText, color: '#8B5CF6' },
    { label: 'Revenue', value: '$52.8K', change: -2.1, icon: Crown, color: '#F59E0B' }
  ];

  const performanceData = [
    { date: 'Jan', value: 56 },
    { date: 'Feb', value: 61 },
    { date: 'Mar', value: 67 },
    { date: 'Apr', value: 75 },
    { date: 'May', value: 84 },
    { date: 'Jun', value: 100 }
  ];

  const attendanceData = {
    present: 15200,
    onLeave: 120,
    onHoliday: 85,
    absent: 45
  };

  const activities = [
    { action: 'User Registration', detail: 'john.doe@email.com', time: '2 min ago', icon: Users, color: '#DBEAFE' },
    { action: 'Template Downloaded', detail: 'Modern Professional', time: '5 min ago', icon: FileText, color: '#D1FAE5' },
    { action: 'Premium Upgrade', detail: 'jane.smith@email.com', time: '10 min ago', icon: Crown, color: '#FEF3C7' },
    { action: 'CV Generated', detail: 'mike.wilson@email.com', time: '15 min ago', icon: Download, color: '#EDE9FE' }
  ];

  return (
    <div className="dashboard">
      <div className="layout">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="logo">
            <div className="logo-icon">✦</div>
            <span className="logo-text">CV Builder</span>
          </div>

          <div className="menu-section">
            <div className="menu-title">MAIN MENU</div>
            <nav>
              <a href="/admin/dashboard" className="nav-item active">
                <BarChart3 size={20} />
                <span>Dashboard</span>
              </a>
              <a href="/admin/users" className="nav-item">
                <Users size={20} />
                <span>Users</span>
                <span className="nav-badge">15.2K</span>
              </a>
              <a href="/admin/templates" className="nav-item">
                <FileText size={20} />
                <span>Templates</span>
                <span className="nav-badge">45</span>
              </a>
              <a href="/admin/analytics" className="nav-item">
                <TrendingUp size={20} />
                <span>Analytics</span>
              </a>
              <a href="/admin/revenue" className="nav-item">
                <Crown size={20} />
                <span>Revenue</span>
              </a>
            </nav>
          </div>

          <div className="menu-section">
            <div className="menu-title">ACTIONS</div>
            <nav>
              <a href="/admin/add-admin" className="nav-item">
                <UserPlus size={20} />
                <span>Add Admin</span>
              </a>
              <a href="/admin/newsletter" className="nav-item">
                <Mail size={20} />
                <span>Newsletter</span>
              </a>
            </nav>
          </div>

          <div className="menu-section">
            <nav>
              <a href="/admin/settings" className="nav-item">
                <Settings size={20} />
                <span>Settings</span>
              </a>
            </nav>
          </div>

          <div className="user-profile">
            <div className="user-avatar">AM</div>
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-email">admin@cvbuilder.com</div>
            </div>
            <ChevronDown size={16} />
          </div>
        </aside>

        {isMobile && isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)} />}

        {/* Main Content */}
        <main className={`main-content ${!isSidebarOpen ? 'full' : ''}`}>
          {/* Top Bar */}
          <div className="topbar">
            <div className="topbar-left">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="toggle-btn">
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="search-box">
                <Search size={18} />
                <input type="text" placeholder="Search something..." />
                <button className="search-btn">Search</button>
              </div>
            </div>
            <div className="topbar-right">
              <button className="icon-btn">
                <Bell size={20} />
              </button>
              <button className="icon-btn">
                <MessageSquare size={20} />
              </button>
            </div>
          </div>

          <div className="container">
            {/* Page Header */}
            <div className="page-header">
              <div>
                <h2>Dashboard Overview</h2>
                <p>Monitor your CV Builder platform performance</p>
              </div>
              <div className="header-actions">
                <button className="date-picker">
                  <Calendar size={16} />
                  Last 30 days
                </button>
                <button className="filter-btn">
                  Monthly
                  <ChevronDown size={16} />
                </button>
                <button className="filter-btn">
                  All Segment
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon" style={{ background: `${stat.color}15` }}>
                      <stat.icon size={24} color={stat.color} />
                    </div>
                    <button className="more-btn">⋯</button>
                  </div>
                  <div className="stat-body">
                    <p className="stat-label">{stat.label}</p>
                    <h3 className="stat-value">{stat.value}</h3>
                    <div className={`stat-change ${stat.change > 0 ? 'up' : 'down'}`}>
                      {stat.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {stat.change > 0 ? '+' : ''}{stat.change}% from last quarter
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="charts-row">
              {/* Performance Chart */}
              <div className="card chart-card">
                <div className="card-header">
                  <div>
                    <h3>User Growth</h3>
                    <div className="chart-subtitle">Monthly performance tracking</div>
                  </div>
                  <select className="dropdown">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Yearly</option>
                  </select>
                </div>
                <div className="bar-chart">
                  {performanceData.map((item, i) => (
                    <div key={i} className="bar-group">
                      <div className="bar" style={{ height: `${item.value}%` }}></div>
                      <span className="bar-label">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics Card */}
              <div className="card attendance-card">
                <div className="card-header">
                  <h3>Platform Statistics</h3>
                  <button className="date-badge">
                    <Calendar size={14} />
                    Today
                  </button>
                </div>
                <div className="attendance-chart">
                  <svg viewBox="0 0 200 200" className="donut-chart">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#F3F4F6" strokeWidth="25" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#6366F1" strokeWidth="25" strokeDasharray="440 502" strokeDashoffset="30" transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#F59E0B" strokeWidth="25" strokeDasharray="25 502" strokeDashoffset="-410" transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#10B981" strokeWidth="25" strokeDasharray="35 502" strokeDashoffset="-435" transform="rotate(-90 100 100)" />
                    <text x="100" y="95" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#111827">{attendanceData.present}</text>
                    <text x="100" y="115" textAnchor="middle" fontSize="14" fill="#6B7280">Total Users</text>
                  </svg>
                </div>
                <div className="attendance-stats">
                  <div className="attendance-item">
                    <span className="dot" style={{ background: '#6366F1' }}></span>
                    <span className="label">Active</span>
                    <span className="value">{attendanceData.present}</span>
                  </div>
                  <div className="attendance-item">
                    <span className="dot" style={{ background: '#F59E0B' }}></span>
                    <span className="label">Premium</span>
                    <span className="value">{attendanceData.onLeave}</span>
                  </div>
                  <div className="attendance-item">
                    <span className="dot" style={{ background: '#10B981' }}></span>
                    <span className="label">New Users</span>
                    <span className="value">{attendanceData.onHoliday}</span>
                  </div>
                  <div className="attendance-item">
                    <span className="dot" style={{ background: '#EF4444' }}></span>
                    <span className="label">Inactive</span>
                    <span className="value">{attendanceData.absent}</span>
                  </div>
                </div>
                <button className="view-details-btn">View Full Details</button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="card activities-card">
              <div className="card-header">
                <h3>Recent Activities</h3>
                <button className="link-btn">
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="activities">
                {activities.map((activity, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-icon" style={{ background: activity.color }}>
                      <activity.icon size={16} />
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">{activity.action}</p>
                      <p className="activity-detail">{activity.detail}</p>
                    </div>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }

        .dashboard {
          min-height: 100vh;
          background: #F9FAFB;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #111827;
        }

        .layout { 
          display: flex; 
          position: relative; 
          min-height: 100vh; 
        }

        /* === SIDEBAR === */
        .sidebar {
          position: absolute;
          top: 60px;
          left: 0;
          width: 260px;
          min-height: calc(100vh - 60px);
          background: white;
          border-right: 1px solid #E5E7EB;
          padding: 24px 16px;
          overflow-y: auto;
          transition: transform 0.3s ease;
          z-index: 40;
          display: flex;
          flex-direction: column;
        }
        .sidebar.closed { 
          transform: translateX(-100%); 
        }
        .sidebar.open { 
          transform: translateX(0); 
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          margin-bottom: 32px;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: bold;
        }
        .logo-text {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .menu-section {
          margin-bottom: 28px;
        }
        .menu-title {
          font-size: 11px;
          font-weight: 600;
          color: #9CA3AF;
          padding: 0 12px 10px;
          letter-spacing: 0.5px;
        }

        .sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          text-decoration: none;
          color: #6B7280;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .nav-item:hover {
          background: #F3F4F6;
          color: #111827;
        }
        .nav-item.active {
          background: #EEF2FF;
          color: #6366F1;
        }
        .nav-badge {
          margin-left: auto;
          background: #F3F4F6;
          color: #6B7280;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
        }
        .nav-item.active .nav-badge {
          background: #E0E7FF;
          color: #6366F1;
        }

        .user-profile {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .user-profile:hover {
          background: #F3F4F6;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }
        .user-info {
          flex: 1;
        }
        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }
        .user-email {
          font-size: 12px;
          color: #6B7280;
          margin-top: 2px;
        }

        /* === MAIN CONTENT === */
        .main-content {
          flex: 1;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
        }
        .main-content.full { 
          margin-left: 0; 
        }

        .topbar {
          height: 60px;
          background: white;
          border-bottom: 1px solid #E5E7EB;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .toggle-btn {
          padding: 10px;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          color: #6B7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }
        .toggle-btn:hover {
          background: #F9FAFB;
          border-color: #D1D5DB;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          padding: 10px 16px;
          width: 400px;
        }
        .search-box input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #111827;
          font-size: 14px;
        }
        .search-box input::placeholder {
          color: #9CA3AF;
        }
        .search-btn {
          padding: 6px 16px;
          background: #6366F1;
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .search-btn:hover {
          background: #4F46E5;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: white;
          border: 1px solid #E5E7EB;
          color: #6B7280;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .icon-btn:hover {
          background: #F9FAFB;
          border-color: #D1D5DB;
        }

        .container {
          padding: 32px;
          max-width: 1600px;
          margin: 0 auto;
        }

        /* Page Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        .page-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }
        .page-header p {
          color: #6B7280;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }
        .date-picker,
        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .date-picker:hover,
        .filter-btn:hover {
          border-color: #D1D5DB;
          background: #F9FAFB;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          border-color: #D1D5DB;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transform: translateY(-4px);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .stat-icon {
          padding: 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .more-btn {
          background: transparent;
          border: none;
          color: #9CA3AF;
          font-size: 20px;
          cursor: pointer;
          padding: 0 8px;
          line-height: 1;
        }
        .more-btn:hover {
          color: #6B7280;
        }

        .stat-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stat-label {
          font-size: 13px;
          color: #6B7280;
          font-weight: 500;
        }
        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          line-height: 1;
        }
        .stat-change {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        .stat-change.up {
          color: #10B981;
        }
        .stat-change.down {
          color: #EF4444;
        }

        /* Charts Row */
        .charts-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }
        .chart-subtitle {
          font-size: 13px;
          color: #6B7280;
        }

        .dropdown {
          padding: 8px 12px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          outline: none;
        }
        .dropdown:hover {
          border-color: #D1D5DB;
        }

        /* Bar Chart */
        .bar-chart {
          display: flex;
          align-items: flex-end;
          gap: 24px;
          height: 280px;
          padding: 20px 0;
        }
        .bar-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .bar {
          width: 100%;
          background: linear-gradient(180deg, #6366F1 0%, #8B5CF6 100%);
          border-radius: 6px 6px 0 0;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .bar:hover {
          opacity: 0.8;
          transform: scaleY(1.05);
        }
        .bar-label {
          font-size: 12px;
          color: #6B7280;
          font-weight: 500;
        }

        /* Attendance Card */
        .attendance-chart {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }
        .donut-chart {
          width: 200px;
          height: 200px;
        }

        .attendance-stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        .attendance-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .attendance-item .label {
          flex: 1;
          font-size: 14px;
          color: #6B7280;
        }
        .attendance-item .value {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .date-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          color: #6B7280;
          font-size: 12px;
          font-weight: 500;
          cursor: default;
        }

        .view-details-btn {
          width: 100%;
          padding: 12px;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .view-details-btn:hover {
          border-color: #D1D5DB;
          background: #F9FAFB;
        }

        /* Activities */
        .activities {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid #F3F4F6;
          transition: all 0.2s ease;
        }
        .activity-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .activity-item:hover {
          transform: translateX(4px);
        }
        .activity-icon {
          padding: 10px;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .activity-content {
          flex: 1;
        }
        .activity-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        .activity-detail {
          font-size: 14px;
          color: #6B7280;
        }
        .activity-time {
          font-size: 12px;
          color: #9CA3AF;
          white-space: nowrap;
        }

        .link-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0;
          border: none;
          background: transparent;
          color: #6366F1;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .link-btn:hover {
          color: #4F46E5;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 30;
        }

        /* Scrollbar */
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 3px;
        }
        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .main-content { 
            margin-left: 0; 
          }
          .charts-row { 
            grid-template-columns: 1fr; 
          }
          .stats-grid { 
            grid-template-columns: repeat(2, 1fr); 
          }
          .search-box { 
            width: 300px; 
          }
        }

        @media (max-width: 768px) {
          .container { 
            padding: 20px; 
          }
          .topbar { 
            padding: 0 20px; 
          }
          .page-header { 
            flex-direction: column; 
            gap: 16px; 
            align-items: flex-start; 
          }
          .header-actions { 
            flex-wrap: wrap; 
            width: 100%; 
          }
          .stats-grid { 
            grid-template-columns: 1fr; 
          }
          .search-box { 
            width: 100%; 
          }
          .topbar-left { 
            flex-direction: column; 
            align-items: flex-start; 
            gap: 12px; 
            width: 100%; 
          }
          .bar-chart {
            height: 200px;
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .stat-value {
            font-size: 28px;
          }
          .page-header h2 {
            font-size: 24px;
          }
          .container {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}