import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/common/Modal';
import { User, Mail, Phone, Building2, Briefcase, Calendar, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import './EmployeeModal.css';

const DEPARTMENTS = [
  'Software Engineering',
  'Human Resources',
  'Operations & Logistics',
  'Finance & Accounts',
  'Product Design & UI/UX',
  'Marketing & Sales',
  'Quality Assurance (QA)'
];

const OFFICE_LOCATIONS = [
  'Noida HQ (Floor 3)',
  'Gurugram Tech Park (Block A)',
  'Bengaluru Hub (Floor 5)',
  'Mumbai Corporate Office',
  'Warehouse Plant B (Logistics)'
];

const GEOFENCE_LIMITS = ['50 meters', '100 meters', '200 meters', '500 meters'];

export default function EmployeeModal({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) {
  const isEditMode = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    department: 'Software Engineering',
    designation: '',
    office: 'Noida HQ (Floor 3)',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-Time',
    geofenceRadius: '100 meters',
    status: 'Verified'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department || 'Software Engineering',
        designation: initialData.designation || '',
        office: initialData.office || 'Noida HQ (Floor 3)',
        joiningDate: initialData.joiningDate || new Date().toISOString().split('T')[0],
        employmentType: initialData.employmentType || 'Full-Time',
        geofenceRadius: initialData.geofenceRadius || '100 meters',
        status: initialData.status || 'Verified'
      });
    } else {
      // Generate a new sequential/random Emp ID suggestion
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setFormData({
        id: `EMP-${randomNum}`,
        name: '',
        email: '',
        phone: '',
        department: 'Software Engineering',
        designation: '',
        office: 'Noida HQ (Floor 3)',
        joiningDate: new Date().toISOString().split('T')[0],
        employmentType: 'Full-Time',
        geofenceRadius: '100 meters',
        status: 'Verified'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.id.trim()) {
      newErrors.id = 'Employee ID is mandatory.';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is mandatory.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Official Email is mandatory.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid corporate email address.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is mandatory.';
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = 'Please enter a valid phone number (minimum 8 digits).';
    }
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation/Role is mandatory.';
    }
    if (!formData.office.trim()) {
      newErrors.office = 'Assigned Office Location is mandatory.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      id: formData.id.trim().toUpperCase(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      designation: formData.designation.trim()
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Employee Profile' : 'Add New Office Employee'}
      subtitle={
        isEditMode
          ? `Update official credentials and attendance permissions for ${formData.id}`
          : 'Enroll a new employee into the office attendance & geofence verification system'
      }
      icon={<Briefcase size={22} />}
      size="lg"
      footer={
        <>
          <button
            type="button"
            className="emp-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="emp-btn-submit"
            onClick={handleSubmit}
          >
            {isEditMode ? 'Save & Update Employee' : 'Enroll Employee'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="emp-form-grid" noValidate>
        {/* Row 1: ID and Full Name */}
        <div className="emp-form-field">
          <label className="emp-form-label" htmlFor="emp-id-input">
            Employee ID <span className="required-star">*</span>
          </label>
          <div className="emp-input-icon-wrap">
            <span className="field-icon"><Briefcase size={16} /></span>
            <input
              id="emp-id-input"
              type="text"
              placeholder="e.g. EMP-1045"
              className={`emp-text-input ${errors.id ? 'input-error' : ''}`}
              value={formData.id}
              onChange={(e) => handleChange('id', e.target.value)}
              disabled={isEditMode}
            />
          </div>
          {errors.id && <div className="emp-error-text"><AlertCircle size={12} /> {errors.id}</div>}
        </div>

        <div className="emp-form-field">
          <label className="emp-form-label" htmlFor="emp-name-input">
            Full Name <span className="required-star">*</span>
          </label>
          <div className="emp-input-icon-wrap">
            <span className="field-icon"><User size={16} /></span>
            <input
              id="emp-name-input"
              type="text"
              placeholder="e.g. Shreyasi Sharma"
              className={`emp-text-input ${errors.name ? 'input-error' : ''}`}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          {errors.name && <div className="emp-error-text"><AlertCircle size={12} /> {errors.name}</div>}
        </div>

        {/* Row 2: Email and Phone */}
        <div className="emp-form-field">
          <label className="emp-form-label" htmlFor="emp-email-input">
            Official Corporate Email <span className="required-star">*</span>
          </label>
          <div className="emp-input-icon-wrap">
            <span className="field-icon"><Mail size={16} /></span>
            <input
              id="emp-email-input"
              type="email"
              placeholder="e.g. shreyasi@quantumit.com"
              className={`emp-text-input ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          {errors.email && <div className="emp-error-text"><AlertCircle size={12} /> {errors.email}</div>}
        </div>

        <div className="emp-form-field">
          <label className="emp-form-label" htmlFor="emp-phone-input">
            Phone Number <span className="required-star">*</span>
          </label>
          <div className="emp-input-icon-wrap">
            <span className="field-icon"><Phone size={16} /></span>
            <input
              id="emp-phone-input"
              type="tel"
              placeholder="e.g. +91 98765 43210"
              className={`emp-text-input ${errors.phone ? 'input-error' : ''}`}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          {errors.phone && <div className="emp-error-text"><AlertCircle size={12} /> {errors.phone}</div>}
        </div>

        {/* Row 3: Department and Designation */}
        <div className="emp-form-field">
          <label className="emp-form-label" htmlFor="emp-dept-select">
            Department <span className="required-star">*</span>
          </label>
          <div className="emp-input-icon-wrap">
            <span className="field-icon"><Building2 size={16} /></span>
            <select
              id="emp-dept-select"
              className="emp-select-input"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="emp-form-field">
          <label className="emp-form-label" htmlFor="emp-desig-input">
            Designation / Role <span className="required-star">*</span>
          </label>
          <div className="emp-input-icon-wrap">
            <span className="field-icon"><Briefcase size={16} /></span>
            <input
              id="emp-desig-input"
              type="text"
              placeholder="e.g. Lead Frontend Architect"
              className={`emp-text-input ${errors.designation ? 'input-error' : ''}`}
              value={formData.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
            />
          </div>
          {errors.designation && <div className="emp-error-text"><AlertCircle size={12} /> {errors.designation}</div>}
        </div>

        {/* Row 4: Assigned Office Branch & Geofence Distance */}
        <div className="emp-form-field">
          <label className="emp-form-label" htmlFor="emp-office-select">
            Assigned Office Branch <span className="required-star">*</span>
          </label>
          <div className="emp-input-icon-wrap">
            <span className="field-icon"><MapPin size={16} /></span>
            <select
              id="emp-office-select"
              className="emp-select-input"
              value={formData.office}
              onChange={(e) => handleChange('office', e.target.value)}
            >
              {OFFICE_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="emp-form-field">
          <label className="emp-form-label" htmlFor="emp-geofence-select">
            Permitted Attendance Radius
          </label>
          <div className="emp-input-icon-wrap">
            <span className="field-icon"><MapPin size={16} /></span>
            <select
              id="emp-geofence-select"
              className="emp-select-input"
              value={formData.geofenceRadius}
              onChange={(e) => handleChange('geofenceRadius', e.target.value)}
            >
              {GEOFENCE_LIMITS.map((lim) => (
                <option key={lim} value={lim}>{lim}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 5: Joining Date and Verification Status */}
        <div className="emp-form-field">
          <label className="emp-form-label" htmlFor="emp-date-input">
            Joining Date
          </label>
          <div className="emp-input-icon-wrap">
            <span className="field-icon"><Calendar size={16} /></span>
            <input
              id="emp-date-input"
              type="date"
              className="emp-text-input"
              value={formData.joiningDate}
              onChange={(e) => handleChange('joiningDate', e.target.value)}
            />
          </div>
        </div>

        <div className="emp-form-field">
          <label className="emp-form-label" htmlFor="emp-status-select">
            QR & Geofence Verification Status
          </label>
          <div className="emp-input-icon-wrap">
            <span className="field-icon"><ShieldCheck size={16} /></span>
            <select
              id="emp-status-select"
              className="emp-select-input"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="Verified">Verified (Eligible to Punch Attendance)</option>
              <option value="Pending">Pending HR Verification</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}
