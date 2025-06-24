import React from 'react';
import { Plus, UsersRound } from 'lucide-react';

interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg shadow-lg">
      <div className="bg-blue-100 rounded-full p-6 mb-4">
        <UsersRound className="h-12 w-12 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada Data Siswa</h2>
      <p className="text-gray-500 text-center max-w-md mb-8">
        Sistem manajemen data siswa ini membantu Anda mengelola informasi
        seperti nama, kelas, asal sekolah, nilai, dan kehadiran.
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Plus className="h-5 w-5 mr-2" />
        Tambah Siswa Pertama
      </button>
    </div>
  );
};
