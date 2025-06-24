import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ClipboardList, GraduationCap, LayoutDashboard, UserPlus, Users } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          <span className="font-medium">{label}</span>
        </div>
        {isActive && <ChevronRight size={16} />}
      </div>
    </Link>
  );
};

export const SideNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      to: '/',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
    },
    {
      to: '/data-siswa',
      icon: <Users size={20} />,
      label: 'Data Siswa',
    },
    {
      to: '/input-siswa',
      icon: <UserPlus size={20} />,
      label: 'Input Siswa',
    },
    {
      to: '/input-nilai',
      icon: <GraduationCap size={20} />,
      label: 'Input Nilai',
    },
    {
      to: '/input-kehadiran',
      icon: <ClipboardList size={20} />,
      label: 'Input Kehadiran',
    },
  ];

  return (
    <div className="h-screen bg-white border-r shadow-sm py-6 w-64 flex flex-col">
      <div className="px-6 mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-2">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">SiswaTrack</h1>
            <p className="text-xs text-gray-500">Sistem Manajemen Siswa</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-3 overflow-y-auto">
        <div className="mb-2 px-4">
          <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Menu Utama</p>
        </div>
        
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={currentPath === item.to}
          />
        ))}
      </div>
      
      <div className="px-4 py-4 mt-auto border-t">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 mr-3">
            <span className="font-medium text-sm">A</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">admin@siswatrack.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
