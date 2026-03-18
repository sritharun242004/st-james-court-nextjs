'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRedirectProps {
  children: React.ReactNode;
}

const AdminRedirect: React.FC<AdminRedirectProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.is_admin) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  if (user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRedirect;