'use client';

import { useState, useEffect } from "react";
import { 
  Search, Filter, Download, UserPlus, RefreshCw, Eye, Edit, Trash2,
  MoreVertical, Mail, Ban, CheckCircle, XCircle, Calendar, Crown,
  X, Check, AlertTriangle, Loader2, ChevronDown, ChevronUp, Menu,
  BarChart3, Users, FileText, TrendingUp, Settings, MessageSquare, Bell
} from "lucide-react";

export default function AdminUsers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dummy data - Replace dengan Supabase query
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setTimeout(() => {
      const dummyUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', verified: true, created_at: '2024-01-15', last_login: '2024-03-20', cvs_count: 5, online: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'active', verified: true, created_at: '2024-02-10', last_login: '2024-03-19', cvs_count: 12, online: false },
        { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'user', status: 'suspended', verified: false, created_at: '2024-03-01', last_login: '2024-03-10', cvs_count: 2, online: false },
        { id: 4, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'recruiter', status: 'active', verified: true, created_at: '2024-01-20', last_login: '2024-03-21', cvs_count: 8, online: true },
        { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'user', status: 'inactive', verified: true, created_at: '2023-12-05', last_login: '2024-01-15', cvs_count: 1, online: false },
      ];
      setUsers(dummyUsers);
      setFilteredUsers(dummyUsers);
      setLoading(false);
    }, 1000);
  };

  // Filter & Search
  useEffect(() => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedRole, selectedStatus, users, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  const handleBulkDelete = () => {
    setUsers(users.filter(u => !selectedUsers.includes(u.id)));
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  const handleBulkSuspend = () => {
    setUsers(users.map(u => 
      selectedUsers.includes(u.id) ? {...u, status: 'suspended'} : u
    ));
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  const exportToCSV = () => {
    const csv = [
      ['Name', 'Email', 'Role', 'Status', 'Created At'],
      ...filteredUsers.map(u => [u.name, u.email, u.role, u.status, u.created_at])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: '#ff9500',
      super_admin: '#ff3b30',
      recruiter: '#007aff',
      user: '#6B7280'
    };
    return colors[role] || colors.user;
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: '#10B981',
      inactive: '#6B7280',
      suspended: '#EF4444'
    };
    return colors[status] || colors.inactive;
  };

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
              <a href="/admin/dashboard" className="nav-item">
                <BarChart3 size={20} />
                <span>Dashboard</span>
              </a>
              <a href="/admin/users" className="nav-item active">
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
              <div className="search-box-topbar">
                <Search size={18} />
                <input type="text" placeholder="Search something..." />
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

          <div className="users-page">
            {/* Header */}
            <div className="page-header">
              <div>
                <h1>Users Management</h1>
                <p>Manage all users, roles, and permissions</p>
              </div>
              <div className="header-actions">
                <button onClick={fetchUsers} className="btn-icon-action" disabled={loading}>
                  <RefreshCw size={18} className={loading ? 'spin' : ''} />
                </button>
                <button onClick={exportToCSV} className="btn-secondary">
                  <Download size={18} />
                  Export CSV
                </button>
                <button className="btn-primary">
                  <UserPlus size={18} />
                  Add User
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-label">Total Users</span>
                <span className="stat-value">{users.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active</span>
                <span className="stat-value green">{users.filter(u => u.status === 'active').length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Online Now</span>
                <span className="stat-value blue">{users.filter(u => u.online).length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Suspended</span>
                <span className="stat-value red">{users.filter(u => u.status === 'suspended').length}</span>
              </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
              <div className="search-box-filter">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button onClick={() => setShowFilters(!showFilters)} className="btn-filter">
                <Filter size={18} />
                Filters
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showFilters && (
                <div className="filter-options">
                  <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              )}

              <div className="results-info">
                Showing {paginatedUsers.length} of {filteredUsers.length} users
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="bulk-actions">
                <span>{selectedUsers.length} selected</span>
                <button onClick={() => setShowBulkActions(true)} className="btn-bulk">
                  <Mail size={16} />
                  Send Email
                </button>
                <button onClick={handleBulkSuspend} className="btn-bulk">
                  <Ban size={16} />
                  Suspend
                </button>
                <button onClick={handleBulkDelete} className="btn-bulk danger">
                  <Trash2 size={16} />
                  Delete
                </button>
                <button onClick={() => setSelectedUsers([])} className="btn-bulk">
                  Clear
                </button>
              </div>
            )}

            {/* Table */}
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                      User {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Role</th>
                    <th>Status</th>
                    <th onClick={() => { setSortBy('created_at'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                      Joined {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>CVs</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>
                        <Loader2 size={32} className="spin" style={{margin: '0 auto'}} />
                      </td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>
                        <p style={{color: '#6B7280'}}>No users found</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                          />
                        </td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-table">
                              {user.online && <span className="online-dot" />}
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="user-name">{user.name}</div>
                              <div className="user-email">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{background: `${getRoleBadgeColor(user.role)}15`, color: getRoleBadgeColor(user.role)}}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{background: `${getStatusBadgeColor(user.status)}15`, color: getStatusBadgeColor(user.status)}}>
                            {user.verified ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            {user.status}
                          </span>
                        </td>
                        <td className="text-muted">{user.created_at}</td>
                        <td className="text-center">{user.cvs_count}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => handleView(user)} className="btn-action" title="View">
                              <Eye size={16} />
                            </button>
                            <button className="btn-action" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(user)} className="btn-action danger" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              <div className="pagination-controls">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn-page"
                >
                  Previous
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`btn-page ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn-page"
                >
                  Next
                </button>
              </div>
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="items-select">
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
              <div className="modal-backdrop" onClick={() => setShowUserModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>User Details</h3>
                    <button onClick={() => setShowUserModal(false)} className="btn-close">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="user-detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Name</span>
                        <span className="detail-value">{selectedUser.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">{selectedUser.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Role</span>
                        <span className="badge" style={{background: `${getRoleBadgeColor(selectedUser.role)}15`, color: getRoleBadgeColor(selectedUser.role)}}>
                          {selectedUser.role}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status</span>
                        <span className="badge" style={{background: `${getStatusBadgeColor(selectedUser.status)}15`, color: getStatusBadgeColor(selectedUser.status)}}>
                          {selectedUser.status}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Joined</span>
                        <span className="detail-value">{selectedUser.created_at}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Login</span>
                        <span className="detail-value">{selectedUser.last_login}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">CVs Created</span>
                        <span className="detail-value">{selectedUser.cvs_count}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Verified</span>
                        <span className="detail-value">{selectedUser.verified ? '✅ Yes' : '❌ No'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn-secondary">
                      <Mail size={16} />
                      Send Email
                    </button>
                    <button className="btn-danger">
                      <Ban size={16} />
                      Suspend User
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className="modal-backdrop" onClick={() => setShowDeleteConfirm(false)}>
                <div className="modal small" onClick={(e) => e.stopPropagation()}>
                  <AlertTriangle size={48} color="#EF4444" style={{margin: '0 auto 16px'}} />
                  <h3>Delete User?</h3>
                  <p>Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.</p>
                  <div className="modal-actions">
                    <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button onClick={confirmDelete} className="btn-danger">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .dashboard {
          min-height: 100vh;
          background: #F9FAFB;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #111827;
        }

        .layout { display: flex; position: relative; min-height: 100vh; }

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
        .sidebar.closed { transform: translateX(-100%); }
        .sidebar.open { transform: translateX(0); }

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
        .main-content.full { margin-left: 0; }

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

        .search-box-topbar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          padding: 10px 16px;
          width: 400px;
        }
        .search-box-topbar input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #111827;
          font-size: 14px;
        }
        .search-box-topbar input::placeholder {
          color: #9CA3AF;
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

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 30;
        }

        /* === USERS PAGE === */
        .users-page { 
          padding: 32px; 
          max-width: 1400px; 
          margin: 0 auto; 
        }
        
        .page-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          margin-bottom: 32px; 
        }
        .page-header h1 { 
          font-size: 28px; 
          font-weight: 700; 
          margin: 0 0 4px 0; 
          color: #111827; 
        }
        .page-header p { 
          color: #6B7280; 
          margin: 0; 
          font-size: 14px; 
        }
        .header-actions { 
          display: flex; 
          gap: 12px; 
        }
        
        .btn-primary, .btn-secondary, .btn-icon-action, .btn-filter, .btn-bulk, .btn-danger { 
          padding: 10px 16px; 
          border-radius: 8px; 
          font-weight: 600; 
          font-size: 14px; 
          cursor: pointer; 
          border: none; 
          transition: all 0.2s; 
          display: flex; 
          align-items: center; 
          gap: 8px; 
        }
        .btn-primary { 
          background: #6366F1; 
          color: white; 
        }
        .btn-primary:hover { 
          background: #4F46E5; 
        }
        .btn-secondary { 
          background: white; 
          color: #374151; 
          border: 1px solid #E5E7EB; 
        }
        .btn-secondary:hover { 
          background: #F9FAFB; 
        }
        .btn-icon-action { 
          background: white; 
          border: 1px solid #E5E7EB; 
          padding: 10px; 
        }
        .btn-icon-action:hover { 
          background: #F9FAFB; 
        }
        .btn-icon-action:disabled { 
          opacity: 0.5; 
          cursor: not-allowed; 
        }
        .spin { 
          animation: spin 1s linear infinite; 
        }
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
        
        .stats-row { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 16px; 
          margin-bottom: 24px; 
        }
        .stat-item { 
          background: white; 
          padding: 20px; 
          border-radius: 12px; 
          border: 1px solid #E5E7EB; 
        }
        .stat-label { 
          display: block; 
          font-size: 14px; 
          color: #6B7280; 
          margin-bottom: 8px; 
        }
        .stat-value { 
          display: block; 
          font-size: 28px; 
          font-weight: 700; 
          color: #111827; 
        }
        .stat-value.green { color: #10B981; }
        .stat-value.blue { color: #3B82F6; }
        .stat-value.red { color: #EF4444; }
        
        .filters-section { 
          background: white; 
          padding: 20px; 
          border-radius: 12px; 
          border: 1px solid #E5E7EB; 
          margin-bottom: 24px; 
          display: flex; 
          align-items: center; 
          gap: 16px; 
          flex-wrap: wrap; 
        }
        .search-box-filter { 
          flex: 1; 
          min-width: 300px; 
          position: relative; 
          display: flex; 
          align-items: center; 
          border: 1px solid #E5E7EB; 
          border-radius: 8px; 
          padding: 0 12px; 
        }
        .search-box-filter svg { color: #9CA3AF; }
        .search-box-filter input { 
          flex: 1; 
          border: none; 
          padding: 10px 12px; 
          font-size: 14px; 
          outline: none; 
        }
        .btn-filter { 
          background: white; 
          color: #374151; 
          border: 1px solid #E5E7EB; 
        }
        .filter-options { 
          display: flex; 
          gap: 12px; 
          width: 100%; 
        }
        .filter-options select { 
          padding: 10px 16px; 
          border: 1px solid #E5E7EB; 
          border-radius: 8px; 
          font-size: 14px; 
          outline: none; 
          background: white; 
          cursor: pointer; 
        }
        .results-info { 
          margin-left: auto; 
          color: #6B7280; 
          font-size: 14px; 
        }
        
        .bulk-actions { 
          background: #EEF2FF; 
          padding: 16px; 
          border-radius: 12px; 
          margin-bottom: 24px; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }
        .bulk-actions span { 
          font-weight: 600; 
          color: #6366F1; 
        }
        .btn-bulk { 
          background: white; 
          color: #374151; 
          border: 1px solid #E5E7EB; 
          padding: 8px 16px; 
        }
        .btn-bulk.danger { 
          color: #EF4444; 
          border-color: #FEE2E2; 
        }
        .btn-bulk.danger:hover { 
          background: #FEE2E2; 
        }
        
        .table-container { 
          background: white; 
          border-radius: 12px; 
          border: 1px solid #E5E7EB; 
          overflow: hidden; 
        }
        .users-table { 
          width: 100%; 
          border-collapse: collapse; 
        }
        .users-table thead { 
          background: #F9FAFB; 
        }
        .users-table th { 
          padding: 16px; 
          text-align: left; 
          font-weight: 600; 
          font-size: 14px; 
          color: #374151; 
          border-bottom: 1px solid #E5E7EB; 
          cursor: pointer; 
          user-select: none; 
        }
        .users-table th:hover { 
          background: #F3F4F6; 
        }
        .users-table td { 
          padding: 16px; 
          border-bottom: 1px solid #F3F4F6; 
          font-size: 14px; 
        }
        .users-table tbody tr:hover { 
          background: #F9FAFB; 
        }
        .user-cell { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }
        .user-avatar-table { 
          position: relative; 
          width: 40px; 
          height: 40px; 
          border-radius: 50%; 
          background: #6366F1; 
          color: white; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 600; 
        }
        .online-dot { 
          position: absolute; 
          top: 0; 
          right: 0; 
          width: 12px; 
          height: 12px; 
          background: #10B981; 
          border: 2px solid white; 
          border-radius: 50%; 
        }
        .user-name { 
          font-weight: 600; 
          color: #111827; 
          margin-bottom: 2px; 
        }
        .user-email { 
          font-size: 13px; 
          color: #6B7280; 
        }
        .badge { 
          display: inline-flex; 
          align-items: center; 
          gap: 4px; 
          padding: 4px 10px; 
          border-radius: 12px; 
          font-size: 12px; 
          font-weight: 600; 
          text-transform: capitalize; 
        }
        .text-muted { 
          color: #6B7280; 
        }
        .text-center { 
          text-align: center; 
        }
        .action-buttons { 
          display: flex; 
          gap: 8px; 
        }
        .btn-action { 
          padding: 8px; 
          border: none; 
          background: transparent; 
          border-radius: 6px; 
          cursor: pointer; 
          color: #6B7280; 
          transition: all 0.2s; 
        }
        .btn-action:hover { 
          background: #F3F4F6; 
          color: #111827; 
        }
        .btn-action.danger:hover { 
          background: #FEE2E2; 
          color: #EF4444; 
        }
        
        .pagination { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-top: 24px; 
        }
        .pagination-info { 
          color: #6B7280; 
          font-size: 14px; 
        }
        .pagination-controls { 
          display: flex; 
          gap: 8px; 
        }
        .btn-page { 
          padding: 8px 12px; 
          border: 1px solid #E5E7EB; 
          background: white; 
          border-radius: 6px; 
          font-size: 14px; 
          cursor: pointer; 
          transition: all 0.2s; 
        }
        .btn-page:hover:not(:disabled) { 
          background: #F3F4F6; 
        }
        .btn-page:disabled { 
          opacity: 0.5; 
          cursor: not-allowed; 
        }
        .btn-page.active { 
          background: #6366F1; 
          color: white; 
          border-color: #6366F1; 
        }
        .items-select { 
          padding: 8px 12px; 
          border: 1px solid #E5E7EB; 
          border-radius: 6px; 
          font-size: 14px; 
          background: white; 
          cursor: pointer; 
        }
        
        .modal-backdrop { 
          position: fixed; 
          inset: 0; 
          background: rgba(0, 0, 0, 0.5); 
          z-index: 1000; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 24px; 
        }
        .modal { 
          background: white; 
          border-radius: 16px; 
          width: 100%; 
          max-width: 600px; 
          max-height: 90vh; 
          overflow-y: auto; 
        }
        .modal.small { 
          max-width: 400px; 
          padding: 32px; 
          text-align: center; 
        }
        .modal h3 { 
          font-size: 20px; 
          font-weight: 700; 
          margin: 0 0 8px 0; 
        }
        .modal p { 
          color: #6B7280; 
          margin: 0 0 24px 0; 
        }
        .modal-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 24px; 
          border-bottom: 1px solid #E5E7EB; 
        }
        .modal-body { 
          padding: 24px; 
        }
        .modal-footer { 
          padding: 24px; 
          border-top: 1px solid #E5E7EB; 
          display: flex; 
          gap: 12px; 
          justify-content: flex-end; 
        }
        .btn-close { 
          padding: 8px; 
          border: none; 
          background: transparent; 
          cursor: pointer; 
          border-radius: 6px; 
          color: #6B7280; 
        }
        .btn-close:hover { 
          background: #F3F4F6; 
        }
        .user-detail-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 24px; 
        }
        .detail-item { 
          display: flex; 
          flex-direction: column; 
          gap: 8px; 
        }
        .detail-label { 
          font-size: 13px; 
          color: #6B7280; 
          font-weight: 500; 
        }
        .detail-value { 
          font-size: 15px; 
          color: #111827; 
          font-weight: 600; 
        }
        .modal-actions { 
          display: flex; 
          gap: 12px; 
          justify-content: center; 
        }
        .btn-danger { 
          background: #EF4444; 
          color: white; 
        }
        .btn-danger:hover { 
          background: #DC2626; 
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
          .stats-row { 
            grid-template-columns: repeat(2, 1fr); 
          }
          .user-detail-grid { 
            grid-template-columns: 1fr; 
          }
          .search-box-topbar { 
            width: 300px; 
          }
        }
        
        @media (max-width: 768px) {
          .users-page { 
            padding: 20px; 
          }
          .topbar { 
            padding: 0 20px; 
          }
          .page-header { 
            flex-direction: column; 
            align-items: flex-start; 
            gap: 16px; 
          }
          .header-actions { 
            width: 100%; 
            justify-content: flex-start; 
            flex-wrap: wrap; 
          }
          .stats-row { 
            grid-template-columns: 1fr; 
          }
          .filters-section { 
            flex-direction: column; 
            align-items: stretch; 
          }
          .search-box-filter { 
            min-width: 100%; 
          }
          .results-info { 
            margin-left: 0; 
          }
          .table-container { 
            overflow-x: auto; 
          }
          .users-table { 
            min-width: 800px; 
          }
          .pagination { 
            flex-direction: column; 
            gap: 16px; 
          }
          .pagination-controls { 
            width: 100%; 
            justify-content: center; 
          }
          .search-box-topbar { 
            width: 100%; 
          }
          .topbar-left { 
            flex-direction: column; 
            align-items: flex-start; 
            gap: 12px; 
            width: 100%; 
          }
        }
      `}</style>
    </div>
  );
}