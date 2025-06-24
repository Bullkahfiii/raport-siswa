import React from 'react';
import { GraduationCap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCap className="text-white h-8 w-8" />
          <h1 className="text-2xl font-bold text-white">SiswaTrack</h1>
        </div>
        <div className="text-white text-sm md:text-base">
          Sistem Manajemen Data Siswa
        </div>
      </div>
    </header>
  );
};
