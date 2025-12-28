import { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Sidebar } from './Sidebar';
import { AdminApplications } from './admin/AdminApplications';
import { AdminUsers } from './admin/AdminUsers';
import { User } from '../utils/userStoreProduction';

interface AdminAppProps {
  currentUser: User;
}

export function AdminApp({ currentUser }: AdminAppProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  ];

  return (
    <Layout
      sidebar={
        <Sidebar
          userType="admin"
          userName={currentUser.name}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          navItems={navItems}
        />
      }
    >
      <div className="space-y-12">
        {/* Add Users Section */}
        <AdminUsers />
        
        {/* Advisor Applications Section */}
        <AdminApplications currentUser={currentUser} />
      </div>
    </Layout>
  );
}