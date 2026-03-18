'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  );
}
