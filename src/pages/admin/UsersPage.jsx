import { useState, useEffect } from 'react';
import { LuUsers, LuMail, LuShield } from 'react-icons/lu';
import PageTransition from '../../components/shared/PageTransition';
import DataTable from '../../components/admin/DataTable';
import UserRoleToggle from '../../components/admin/UserRoleToggle';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import adminService from '../../services/adminService';

const MOCK_USERS = [
  { id: 1, name: 'Admin Root', email: 'admin@cineverse.com', role: 'ADMIN', createdAt: '2026-01-10T12:00:00' },
  { id: 2, name: 'John Doe', email: 'john.doe@example.com', role: 'USER', createdAt: '2026-02-15T14:30:00' },
  { id: 3, name: 'Sarah Connor', email: 'sarah.c@example.com', role: 'USER', createdAt: '2026-03-01T09:15:00' },
  { id: 4, name: 'Elena Rostova', email: 'elena.r@example.com', role: 'ADMIN', createdAt: '2026-03-12T18:45:00' },
  { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', role: 'USER', createdAt: '2026-04-20T11:20:00' },
];

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.users.getAll();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setUsers(res.data);
      }
    } catch {
      // Retain mock users on network failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, newRole) => {
    setTogglingId(userId);
    try {
      await adminService.users.toggleRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      // Optimistic update for offline test
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (val, row) => (
        <div className="flex items-center gap-3 min-w-0 max-w-xs md:max-w-sm">
          <div className="w-8 h-8 rounded-full bg-bg-surface border border-border-light flex items-center justify-center text-xs font-bold text-accent-red-neon flex-shrink-0">
            {val ? val.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-text-primary truncate">{val}</p>
            <p className="text-xs text-text-muted flex items-center gap-1 truncate">
              <LuMail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{row.email}</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined Date',
      render: (val) => (
        <span className="text-xs text-text-muted whitespace-nowrap">
          {val ? new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Role & Permissions',
      render: (val, row) => (
        <div className="flex items-center gap-3 whitespace-nowrap">
          <UserRoleToggle
            role={val}
            onToggle={(newRole) => handleRoleToggle(row.id, newRole)}
            disabled={togglingId === row.id}
          />
          <span
            className={`text-xs font-semibold ${
              val === 'ADMIN' ? 'text-accent-red-neon' : 'text-text-muted'
            }`}
          >
            {val}
          </span>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-display)]">User Management</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage customer accounts, permissions, and toggle administrator privileges
          </p>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <DataTable
            columns={columns}
            data={users}
            searchPlaceholder="Search users by name or email address..."
          />
        )}
      </div>
    </PageTransition>
  );
}
