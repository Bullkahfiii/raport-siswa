import React, { useState } from 'react';
import { Student } from '../types';
import { AlertTriangle, Award, Pencil, Search, Trash2 } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter((student) =>
    student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.asalSekolah.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGradeColor = (nilai: number) => {
    if (nilai >= 90) return 'text-green-600 bg-green-100';
    if (nilai >= 80) return 'text-blue-600 bg-blue-100';
    if (nilai >= 70) return 'text-yellow-600 bg-yellow-100';
    if (nilai >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeLabel = (nilai: number) => {
    if (nilai >= 90) return 'A';
    if (nilai >= 80) return 'B';
    if (nilai >= 70) return 'C';
    if (nilai >= 60) return 'D';
    return 'E';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cari siswa berdasarkan nama, kelas, atau sekolah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Tidak ada data siswa</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Tidak ada hasil yang cocok dengan pencarian Anda.' 
              : 'Silakan tambahkan data siswa baru.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asal Sekolah
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nilai
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kehadiran
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr 
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{student.nama}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.kelas}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.asalSekolah}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">{student.nilai}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(student.nilai)}`}>
                        {getGradeLabel(student.nilai)}
                      </span>
                      {student.nilai >= 90 && (
                        <Award className="h-4 w-4 text-yellow-500 ml-1" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.jumlahKehadiran} hari</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(student)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
