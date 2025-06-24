import React from 'react';
import { Student } from '../types';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  student: Student;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  student,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all animate-fade-in">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <AlertTriangle size={24} />
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
          Hapus Data Siswa
        </h3>
        
        <p className="text-center text-gray-500 mb-6">
          Apakah Anda yakin ingin menghapus data siswa <span className="font-semibold">{student.nama}</span>? 
          Tindakan ini tidak dapat dibatalkan.
        </p>
        
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
