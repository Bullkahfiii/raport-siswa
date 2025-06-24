import React, { useState, useEffect } from 'react';
import { useDataStore } from '../hooks/useDataStore';
import { Student } from '../types';
import { Calendar, Check, ClipboardCheck, List, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const InputKehadiran: React.FC = () => {
  const { kelompokKelas, getStudentsByKelas, addAttendance, attendance, deleteAttendance } = useDataStore();
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [checkedStudents, setCheckedStudents] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'input' | 'history'>('input');
  const [filterKelas, setFilterKelas] = useState('');

  useEffect(() => {
    if (selectedKelas) {
      const kelasStudents = getStudentsByKelas(selectedKelas);
      setStudents(kelasStudents);
      // Reset checked students when kelas changes
      setCheckedStudents(new Set());
    } else {
      setStudents([]);
    }
  }, [selectedKelas, getStudentsByKelas]);

  const filteredAttendance = filterKelas 
    ? attendance.filter(record => record.kelompokKelas === filterKelas)
    : attendance;

  const handleKelasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKelas(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleCheckboxChange = (studentId: string) => {
    const newCheckedStudents = new Set(checkedStudents);
    
    if (newCheckedStudents.has(studentId)) {
      newCheckedStudents.delete(studentId);
    } else {
      newCheckedStudents.add(studentId);
    }
    
    setCheckedStudents(newCheckedStudents);
  };

  const handleSubmitAttendance = () => {
    if (checkedStudents.size === 0) {
      toast.error('Pilih setidaknya satu siswa yang hadir');
      return;
    }
    
    // Check if there's already attendance for this date and class
    const existingRecord = attendance.find(
      record => record.tanggal === selectedDate && record.kelompokKelas === selectedKelas
    );
    
    if (existingRecord) {
      toast.error('Data kehadiran untuk kelas ini pada tanggal tersebut sudah ada');
      return;
    }
    
    const studentsThatAttended = students
      .filter(student => checkedStudents.has(student.id))
      .map(student => ({
        studentId: student.id,
        nama: student.nama
      }));
    
    const kelasNama = kelompokKelas.find(k => k.id === selectedKelas)?.nama || '';
    
    addAttendance({
      tanggal: selectedDate,
      kelompokKelas: selectedKelas,
      hadir: studentsThatAttended
    });
    
    // Reset selections
    setCheckedStudents(new Set());
    toast.success(`Berhasil mencatat kehadiran ${studentsThatAttended.length} siswa`);
  };

  const handleDeleteAttendance = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data kehadiran ini?')) {
      deleteAttendance(id);
      toast.success('Data kehadiran berhasil dihapus');
    }
  };

  const getKelasNama = (id: string) => {
    return kelompokKelas.find(k => k.id === id)?.nama || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Input Kehadiran</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('input')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'input'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Check className="h-5 w-5 inline mr-1" />
            Input
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <List className="h-5 w-5 inline mr-1" />
            Riwayat
          </button>
        </div>
      </div>
      
      {viewMode === 'input' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="kelas-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Pilih Kelompok Kelas <span className="text-red-500">*</span>
                </label>
                <select
                  id="kelas-select"
                  value={selectedKelas}
                  onChange={handleKelasChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Pilih Kelompok Kelas --</option>
                  {kelompokKelas.map((kelas) => (
                    <option key={kelas.id} value={kelas.id}>
                      {kelas.nama}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date-input"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          {selectedKelas ? (
            <>
              {students.length > 0 ? (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Daftar Kehadiran Siswa
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {students.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checkedStudents.has(student.id)}
                          onChange={() => handleCheckboxChange(student.id)}
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{student.nama}</p>
                          <p className="text-sm text-gray-500">{student.nomorInduk}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitAttendance}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <ClipboardCheck className="h-5 w-5 mr-2" />
                      <span>Simpan Kehadiran</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak Ada Siswa</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Belum ada siswa yang terdaftar dalam kelompok kelas ini.
                    Silakan tambahkan siswa terlebih dahulu.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Pilih Kelompok Kelas</h3>
              <p className="text-gray-500 text-center max-w-md">
                Silakan pilih kelompok kelas terlebih dahulu untuk melihat daftar siswa
                dan mencatat kehadiran.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Kelompok Kelas</option>
                {kelompokKelas.map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredAttendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kelompok Kelas
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah Siswa Hadir
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Daftar Siswa Hadir
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAttendance.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{record.tanggal}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getKelasNama(record.kelompokKelas)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.hadir.length} siswa</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {record.hadir.map(s => s.nama).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDeleteAttendance(record.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Belum Ada Data Kehadiran</h3>
              <p className="text-gray-500 text-center">
                {filterKelas 
                  ? "Belum ada data kehadiran untuk kelompok kelas ini."
                  : "Belum ada data kehadiran. Silakan tambahkan data kehadiran terlebih dahulu."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputKehadiran;
