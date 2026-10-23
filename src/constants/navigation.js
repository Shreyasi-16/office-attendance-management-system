import { 
  LayoutDashboard,
  Users,
  ShieldCheck,
  QrCode,
  Building2,
  Clock,
  Timer,
  CalendarDays,
  ClipboardCheck,
  BarChart3,
  Bell,
  History,
  Settings
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employee-mgmt', label: 'Employee Management', icon: Users },
  { id: 'user-role-mgmt', label: 'User & Role Management', icon: ShieldCheck },
  { id: 'qr-code-mgmt', label: 'QR Code Management', icon: QrCode },
  { id: 'office-location-mgmt', label: 'Office & Location Management', icon: Building2 },
  { id: 'attendance-mgmt', label: 'Attendance Management', icon: Clock },
  { id: 'shift-working-hours', label: 'Shift & Working Hours', icon: Timer },
  { id: 'leave-holiday-mgmt', label: 'Leave & Holiday Management', icon: CalendarDays },
  { id: 'attendance-approvals', label: 'Attendance Approvals', icon: ClipboardCheck, badge: '4' },
  { id: 'reports-analytics', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '2' },
  { id: 'audit-logs', label: 'Audit Logs', icon: History },
  { id: 'system-settings', label: 'System Settings', icon: Settings },
];
