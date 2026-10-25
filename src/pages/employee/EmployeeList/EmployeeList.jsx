import React, { useState, useMemo } from 'react';
import DataGrid from '../../../components/common/DataGrid';
import Toast from '../../../components/common/Toast';
import EmployeeModal from './components/EmployeeModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Users, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  MapPin,
  Mail,
  Phone,
  RotateCcw
} from 'lucide-react';
import './EmployeeList.css';

// Initial realistic employee records for the office
const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-1042',
    name: 'Shreyasi Sharma',
    email: 'shreyasi@quantumit.com',
    phone: '+91 98765 43210',
    department: 'Software Engineering',
    designation: 'Senior Frontend Architect',
    office: 'Noida HQ (Floor 3)',
    joiningDate: '2023-04-15',
    employmentType: 'Full-Time',
    geofenceRadius: '100 meters',
    status: 'Verified'
  },
  {
    id: 'EMP-1088',
    name: 'Rohit Verma',
    email: 'rohit.verma@quantumit.com',
    phone: '+91 98112 34567',
    department: 'Operations & Logistics',
    designation: 'Logistics Lead',
    office: 'Warehouse Plant B (Logistics)',
    joiningDate: '2023-08-01',
    employmentType: 'Full-Time',
    geofenceRadius: '200 meters',
    status: 'Verified'
  },
  {
    id: 'EMP-1102',
    name: 'Ananya Gupta',
    email: 'ananya.g@quantumit.com',
    phone: '+91 99887 65432',
    department: 'Human Resources',
    designation: 'HR Attendance Manager',
    office: 'Noida HQ (Floor 3)',
    joiningDate: '2022-11-10',
    employmentType: 'Full-Time',
    geofenceRadius: '100 meters',
    status: 'Verified'
  },
  {
    id: 'EMP-1115',
    name: 'Vikram Singh',
    email: 'vikram.singh@quantumit.com',
    phone: '+91 97654 32109',
    department: 'Finance & Accounts',
    designation: 'Senior Financial Analyst',
    office: 'Gurugram Tech Park (Block A)',
    joiningDate: '2024-01-08',
    employmentType: 'Full-Time',
    geofenceRadius: '100 meters',
    status: 'Verified'
  },
  {
    id: 'EMP-1140',
    name: 'Pooja Nair',
    email: 'pooja.nair@quantumit.com',
    phone: '+91 94567 89012',
    department: 'Product Design & UI/UX',
    designation: 'Staff Product Designer',
    office: 'Bengaluru Hub (Floor 5)',
    joiningDate: '2024-03-20',
    employmentType: 'Full-Time',
    geofenceRadius: '100 meters',
    status: 'Pending'
  },
  {
    id: 'EMP-1158',
    name: 'Sameer Khan',
    email: 'sameer.k@quantumit.com',
    phone: '+91 91234 56789',
    department: 'Quality Assurance (QA)',
    designation: 'QA Automation Engineer',
    office: 'Noida HQ (Floor 3)',
    joiningDate: '2024-06-01',
    employmentType: 'Full-Time',
    geofenceRadius: '100 meters',
    status: 'Verified'
  },
  {
    id: 'EMP-1175',
    name: 'Neha Kapoor',
    email: 'neha.kapoor@quantumit.com',
    phone: '+91 93456 78901',
    department: 'Marketing & Sales',
    designation: 'Enterprise Sales Manager',
    office: 'Mumbai Corporate Office',
    joiningDate: '2024-07-15',
    employmentType: 'Full-Time',
    geofenceRadius: '500 meters',
    status: 'Pending'
  }
];

export default function EmployeeList() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message, duration: 4500 }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Open Add Popup Modal
  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsFormModalOpen(true);
  };

  // 2. Open Edit Popup Modal with employee details
  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setIsFormModalOpen(true);
  };

  // 3. Save (Add or Edit) Employee
  const handleSaveEmployee = (empData) => {
    if (editingEmployee) {
      // Update existing
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === empData.id ? { ...empData } : emp))
      );
      addToast(
        'success',
        'Employee Profile Updated',
        `Details for ${empData.name} (${empData.id}) have been saved successfully.`
      );
    } else {
      // Add new
      // Check for duplicate ID
      if (employees.some((e) => e.id.toLowerCase() === empData.id.toLowerCase())) {
        addToast('error', 'Duplicate ID', `Employee ID ${empData.id} already exists in the system.`);
        return;
      }
      setEmployees((prev) => [empData, ...prev]);
      addToast(
        'success',
        'Employee Enrolled Successfully',
        `${empData.name} (${empData.id}) added to ${empData.office} office roster.`
      );
    }
    setIsFormModalOpen(false);
    setEditingEmployee(null);
  };

  // 4. Verify Employee QR / Geofence Access
  const handleVerifyEmployee = (emp) => {
    const newStatus = emp.status === 'Verified' ? 'Pending' : 'Verified';
    setEmployees((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, status: newStatus } : e))
    );

    if (newStatus === 'Verified') {
      addToast(
        'success',
        'Attendance Access Verified',
        `${emp.name}'s GPS Geofence and Dynamic QR scan eligibility is now ACTIVATED.`
      );
    } else {
      addToast(
        'warning',
        'Attendance Access Suspended',
        `${emp.name}'s status changed to Pending Verification.`
      );
    }
  };

  // 5. Open Delete Confirmation Modal
  const handleOpenDeleteModal = (emp) => {
    setDeletingEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  // 6. Confirm Deletion
  const handleConfirmDelete = (emp) => {
    setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
    setIsDeleteModalOpen(false);
    setDeletingEmployee(null);
    addToast(
      'info',
      'Employee Removed',
      `${emp.name} (${emp.id}) has been removed from office attendance records.`
    );
  };

  // Filtered employees dataset
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchOffice = selectedOffice === 'ALL' || emp.office === selectedOffice;
      const matchDept = selectedDept === 'ALL' || emp.department === selectedDept;
      const matchStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;
      return matchOffice && matchDept && matchStatus;
    });
  }, [employees, selectedOffice, selectedDept, selectedStatus]);

  // Compute live KPI metrics
  const totalCount = employees.length;
  const verifiedCount = employees.filter((e) => e.status === 'Verified').length;
  const pendingCount = employees.filter((e) => e.status === 'Pending').length;
  const uniqueOffices = new Set(employees.map((e) => e.office)).size;

  // DataGrid Columns Definition
  const columns = [
    {
      key: 'id',
      header: 'Emp ID',
      width: '110px',
      sortable: true,
      render: (val) => <span className="emp-id-badge">{val}</span>
    },
    {
      key: 'name',
      header: 'Employee Details',
      sortable: true,
      render: (_, row) => (
        <div className="emp-profile-cell">
          <div className="emp-avatar-initials">
            {row.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
          <div className="emp-profile-info">
            <div className="emp-name-text">{row.name}</div>
            <div className="emp-contact-text">
              <span className="contact-item"><Mail size={11} /> {row.email}</span>
              <span className="contact-item"><Phone size={11} /> {row.phone}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'department',
      header: 'Department & Role',
      sortable: true,
      render: (dept, row) => (
        <div>
          <span className="dept-tag">{dept}</span>
          <div className="designation-text">{row.designation}</div>
        </div>
      )
    },
    {
      key: 'office',
      header: 'Assigned Office Branch',
      sortable: true,
      render: (office, row) => (
        <div className="office-location-cell">
          <div className="office-name">
            <MapPin size={13} className="pin-icon" />
            <span>{office}</span>
          </div>
          <span className="geofence-pill">Geofence: {row.geofenceRadius}</span>
        </div>
      )
    },
    {
      key: 'joiningDate',
      header: 'Joining Date',
      sortable: true,
      width: '120px',
      render: (val) => <span className="date-text">{val}</span>
    },
    {
      key: 'status',
      header: 'Verification',
      sortable: true,
      width: '130px',
      render: (status) => (
        <span className={`status-pill ${status === 'Verified' ? 'status-verified' : 'status-pending'}`}>
          {status === 'Verified' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
          <span>{status}</span>
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '190px',
      align: 'right',
      render: (_, row) => (
        <div className="emp-actions-row">
          {/* Verify / Toggle Action */}
          <button
            type="button"
            className={`action-btn-verify ${row.status === 'Verified' ? 'active' : ''}`}
            onClick={() => handleVerifyEmployee(row)}
            title={row.status === 'Verified' ? 'Revoke QR Verification' : 'Verify for QR & Geofence Attendance'}
          >
            <ShieldCheck size={14} />
            <span>{row.status === 'Verified' ? 'Verified' : 'Verify'}</span>
          </button>

          {/* Edit Action (Opens popup with employee details) */}
          <button
            type="button"
            className="action-btn-edit"
            onClick={() => handleOpenEditModal(row)}
            title="Edit Employee Details"
          >
            <Edit3 size={14} />
          </button>

          {/* Delete Action */}
          <button
            type="button"
            className="action-btn-delete"
            onClick={() => handleOpenDeleteModal(row)}
            title="Delete Employee"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="employee-module-container">
      {/* Toast Portal */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Top Page Header Row with Add Employee Button */}
      <div className="emp-header-row">
        <div>
          <h1 className="emp-module-title">Employee Management</h1>
          <p className="emp-module-subtitle">
            Manage enrolled office personnel, verify attendance permissions, and configure geofence radius.
          </p>
        </div>

        {/* Header Top Button to Add Employee */}
        <button
          type="button"
          className="emp-add-btn"
          onClick={handleOpenAddModal}
          id="add-employee-btn"
        >
          <UserPlus size={17} strokeWidth={2.4} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* KPI Stats Metric Cards */}
      <div className="emp-kpi-grid">
        <div className="emp-kpi-card">
          <div>
            <div className="emp-kpi-label">Total Office Employees</div>
            <div className="emp-kpi-value">{totalCount}</div>
          </div>
          <div className="emp-kpi-icon-wrap" style={{ backgroundColor: 'rgba(10, 37, 64, 0.08)', color: 'var(--navy-primary)' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="emp-kpi-card">
          <div>
            <div className="emp-kpi-label">Verified For Attendance</div>
            <div className="emp-kpi-value" style={{ color: '#059669' }}>{verifiedCount}</div>
          </div>
          <div className="emp-kpi-icon-wrap" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}>
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="emp-kpi-card">
          <div>
            <div className="emp-kpi-label">Pending Verification</div>
            <div className="emp-kpi-value" style={{ color: '#D97706' }}>{pendingCount}</div>
          </div>
          <div className="emp-kpi-icon-wrap" style={{ backgroundColor: 'rgba(245, 158, 11, 0.14)', color: '#D97706' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="emp-kpi-card">
          <div>
            <div className="emp-kpi-label">Assigned Branches</div>
            <div className="emp-kpi-value" style={{ color: '#0284C7' }}>{uniqueOffices}</div>
          </div>
          <div className="emp-kpi-icon-wrap" style={{ backgroundColor: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
            <Building2 size={22} />
          </div>
        </div>
      </div>

      {/* Main Content & DataGrid Card */}
      <div className="emp-content-card">
        {/* Filter Controls Row */}
        <div className="emp-filter-bar">
          {/* Search Box */}
          <div className="emp-search-input-wrap">
            <Search size={15} className="emp-search-icon" />
            <input
              type="text"
              className="emp-search-field"
              placeholder="Search by Employee ID, Name, Email, or Role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Office Branch Dropdown */}
          <div className="emp-filter-select-wrap">
            <Filter size={14} className="filter-select-icon" />
            <select
              className="emp-filter-select"
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              aria-label="Filter by Office Branch"
            >
              <option value="ALL">All Office Branches</option>
              <option value="Noida HQ (Floor 3)">Noida HQ (Floor 3)</option>
              <option value="Gurugram Tech Park (Block A)">Gurugram Tech Park</option>
              <option value="Bengaluru Hub (Floor 5)">Bengaluru Hub</option>
              <option value="Mumbai Corporate Office">Mumbai Corporate Office</option>
              <option value="Warehouse Plant B (Logistics)">Warehouse Plant B</option>
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="emp-filter-select-wrap">
            <Building2 size={14} className="filter-select-icon" />
            <select
              className="emp-filter-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              aria-label="Filter by Department"
            >
              <option value="ALL">All Departments</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Operations & Logistics">Operations & Logistics</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
              <option value="Product Design & UI/UX">Product Design & UI/UX</option>
              <option value="Marketing & Sales">Marketing & Sales</option>
              <option value="Quality Assurance (QA)">Quality Assurance (QA)</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(searchQuery || selectedOffice !== 'ALL' || selectedDept !== 'ALL') && (
            <button
              type="button"
              className="emp-reset-filter-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedOffice('ALL');
                setSelectedDept('ALL');
                setSelectedStatus('ALL');
              }}
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Reusable DataGrid */}
        <DataGrid
          columns={columns}
          data={filteredEmployees}
          keyField="id"
          searchQuery={searchQuery}
          defaultPageSize={8}
          emptyTitle="No Employees Match Filters"
          emptySubtitle="Try adjusting your search criteria or add a new employee using the '+ Add Employee' button above."
        />
      </div>

      {/* Add / Edit Employee Popup Modal */}
      <EmployeeModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingEmployee(null);
        }}
        onConfirm={handleConfirmDelete}
        employee={deletingEmployee}
      />
    </div>
  );
}
