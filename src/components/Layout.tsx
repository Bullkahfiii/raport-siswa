import React from 'react';
import { SideNav } from './SideNav';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Toaster position="top-right" />
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};
