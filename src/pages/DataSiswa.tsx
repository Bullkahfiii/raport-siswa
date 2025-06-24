import React, { useState } from 'react';
import { useDataStore } from '../hooks/useDataStore';
import { Student } from '../types';
import { Calendar, Eye, Mail, Pencil, Phone, School, Search, Trash2, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';

export const DataSiswa: React.FC = () => {
  const { students, deleteStudent } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const filteredStudents = students.filter(student => 
    student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nomorInduk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.kelompokKelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.asalSekolah.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (student: Student) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data siswa ${student.nama}?`)) {
      deleteStudent(student.id);
      toast.success('Data siswa berhasil dihapus');
    }
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Data Siswa</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Cari siswa berdasarkan nama, NIS, kelas, atau sekolah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredStudents.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIS
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelompok Kelas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asal Sekolah
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{student.nama}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.nomorInduk}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.kelompokKelas}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.asalSekolah}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <UserCog className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada data siswa</h3>
              <p className="text-gray-500 text-center">
                {searchTerm 
                  ? "Tidak ada siswa yang sesuai dengan pencarian Anda."
                  : "Belum ada data siswa. Silakan tambahkan siswa baru melalui menu Input Siswa."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Detail Siswa</h3>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedStudent.nama.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedStudent.nama}</h4>
                  <p className="text-sm text-gray-600">{selectedStudent.nomorInduk}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start">
                  <School className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Asal Sekolah</p>
                    <p className="text-gray-900">{selectedStudent.asalSekolah}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <UserCog className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Kelompok Kelas</p>
                    <p className="text-gray-900">{selectedStudent.kelompokKelas}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nomor WhatsApp</p>
                    <p className="text-gray-900">{selectedStudent.nomorWhatsapp}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedStudent.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tanggal Lahir</p>
                    <p className="text-gray-900">
                      {new Date(selectedStudent.tanggalLahir).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSiswa;
