import React, { useState } from 'react';
import { 
  ExternalLink, 
  Search, 
  Home as HomeIcon, 
  Eye,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { NAVIGATION_ITEMS } from '../constants/navigation';
import EmployeeList from '../pages/employee/EmployeeList/EmployeeList';

export default function MainContent({ activeItemId, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchFilter, setSearchFilter] = useState('');

  // If viewing Employee Management module
  if (activeItemId === 'employee-mgmt') {
    return (
      <main className="content-area">
        <div className="breadcrumb-container">
          <button 
            type="button" 
            className="breadcrumb-pill"
            onClick={() => onNavigate && onNavigate('dashboard')}
            style={{ cursor: 'pointer' }}
          >
            <HomeIcon size={13} />
            Home
          </button>
          <span className="breadcrumb-pill active">
            ● Employee Management
          </span>
        </div>

        <EmployeeList />

        <footer className="page-bottom-footer">
          <div>
            © 2026 Office Attendance Management. All rights reserved. | Nurturing Trust, Delivering Value
          </div>
          <div>
            Version 1.0.0
          </div>
        </footer>
      </main>
    );
  }
  
  // Find current active item title
  const currentItem = NAVIGATION_ITEMS.find((item) => item.id === activeItemId) || NAVIGATION_ITEMS[0];

  // Sample data to make the layout feel complete and responsive
  const sampleRecords = [
    {
      id: 'EMP-1042',
      employee: 'Shreyasi Sharma',
      department: 'Software Engineering',
      location: 'Noida HQ (Floor 3)',
      date: '2026-10-23',
      punchIn: '09:05 AM',
      punchOut: '06:15 PM',
      hours: '8h 40m',
      status: 'Present',
      statusType: 'status-present'
    },
    {
      id: 'EMP-1088',
      employee: 'Rohit Verma',
      department: 'Operations & Logistics',
      location: 'Warehouse Plant B',
      date: '2026-10-23',
      punchIn: '09:48 AM',
      punchOut: '--:--',
      hours: 'In Progress',
      status: 'Late Punch',
      statusType: 'status-late'
    },
    {
      id: 'EMP-1102',
      employee: 'Ananya Gupta',
      department: 'Human Resources',
      location: 'Noida HQ (Floor 2)',
      date: '2026-10-23',
      punchIn: '--:--',
      punchOut: '--:--',
      hours: '0h 0m',
      status: 'On Leave',
      statusType: 'status-leave'
    },
    {
      id: 'EMP-1115',
      employee: 'Vikram Singh',
      department: 'Finance & Accounts',
      location: 'Gurugram Branch',
      date: '2026-10-23',
      punchIn: '08:58 AM',
      punchOut: '05:30 PM',
      hours: '8h 32m',
      status: 'Present',
      statusType: 'status-present'
    }
  ];

  return (
    <main className="content-area">
      {/* Breadcrumb Navigation Pills */}
      <div className="breadcrumb-container">
        <span className="breadcrumb-pill">
          <HomeIcon size={13} />
          Home
        </span>
        <span className="breadcrumb-pill">
          {currentItem.label}
        </span>
        <span className="breadcrumb-pill active">
          ● {activeTab === 'overview' ? 'Overview' : 'History / Records'}
        </span>
      </div>

      {/* Page Title & Action Switchers */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">{currentItem.label}</h1>
          <p className="page-subtitle">
            Manage and monitor {currentItem.label.toLowerCase()} across all office branches and departments.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="page-actions-group">
          <button
            type="button"
            className={`action-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`action-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History & Logs
          </button>
        </div>
      </div>

      {/* Dashboard KPI Stats Row */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-label">Total Employees</div>
            <div className="kpi-value">148</div>
          </div>
          <div className="kpi-icon-wrap" style={{ backgroundColor: 'rgba(13, 27, 61, 0.08)', color: 'var(--navy-primary)' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Today's Present</div>
            <div className="kpi-value" style={{ color: '#059669' }}>132</div>
          </div>
          <div className="kpi-icon-wrap" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Late Punches</div>
            <div className="kpi-value" style={{ color: '#D97706' }}>8</div>
          </div>
          <div className="kpi-icon-wrap" style={{ backgroundColor: 'rgba(245, 158, 11, 0.14)', color: '#D97706' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Pending Approvals</div>
            <div className="kpi-value" style={{ color: '#E11D48' }}>4</div>
          </div>
          <div className="kpi-icon-wrap" style={{ backgroundColor: 'rgba(225, 29, 72, 0.12)', color: '#E11D48' }}>
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Main Filter & Form Card */}
      <div className="content-card">
        <label className="filter-section-title" htmlFor="search-filter-input">
          Search Employee / Attendance Record
        </label>
        <div className="filter-input-row">
          <div className="input-with-icon-wrapper">
            <input
              id="search-filter-input"
              type="text"
              placeholder="Search by Employee ID, Name, Department or Location..."
              className="filter-text-input"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            <ExternalLink size={16} className="input-action-icon" />
          </div>

          <button 
            type="button" 
            className="filter-search-btn"
            onClick={() => alert(`Searching records for: ${searchFilter || 'All active records'}`)}
          >
            <Search size={15} />
            <span>SEARCH</span>
          </button>
        </div>

        {/* Data Table Preview */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Branch Location</th>
                <th>Punch In/Out</th>
                <th>Work Hours</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sampleRecords.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 600 }}>{row.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--navy-primary)' }}>{row.employee}</div>
                  </td>
                  <td>{row.department}</td>
                  <td>{row.location}</td>
                  <td>{row.punchIn} - {row.punchOut}</td>
                  <td>{row.hours}</td>
                  <td>
                    <span className={`status-badge ${row.statusType}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      type="button" 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 4, 
                        color: 'var(--navy-primary)',
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: '1px solid var(--border-light)'
                      }}
                      onClick={() => alert(`Viewing details for ${row.employee} (${row.id})`)}
                    >
                      <Eye size={13} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="page-bottom-footer">
        <div>
          © 2026 Office Attendance Management. All rights reserved. | Nurturing Trust, Delivering Value
        </div>
        <div>
          Version 1.0.0
        </div>
      </footer>
    </main>
  );
}
