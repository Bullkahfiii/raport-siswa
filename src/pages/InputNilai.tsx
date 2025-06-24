import React, { useState, useEffect } from 'react';
import { useDataStore } from '../hooks/useDataStore';
import { GradeEntry } from '../types';
import { Book, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MATA_PELAJARAN = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'IPA',
  'IPS',
  'Fisika',
  'Kimia',
  'Biologi',
  'Sejarah',
  'Geografi',
  'Ekonomi',
];

const JENIS_TES = [
  'Ulangan Harian',
  'Ujian Tengah Semester',
  'Ujian Akhir Semester',
  'Tugas',
  'Proyek',
  'Praktikum',
];

export const InputNilai: React.FC = () => {
  const { students, addGrade, grades, deleteGrade } = useDataStore();
  const [formData, setFormData] = useState({
    studentId: '',
    jenisTes: '',
    mataPelajaran: '',
    nilai: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredGrades, setFilteredGrades] = useState<GradeEntry[]>([]);
  const [filterStudent, setFilterStudent] = useState<string>('');

  useEffect(() => {
    if (filterStudent) {
      setFilteredGrades(grades.filter(grade => grade.studentId === filterStudent));
    } else {
      setFilteredGrades(grades);
    }
  }, [grades, filterStudent]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.studentId) newErrors.studentId = 'Nama siswa harus dipilih';
    if (!formData.jenisTes) newErrors.jenisTes = 'Jenis tes harus dipilih';
    if (!formData.mataPelajaran) newErrors.mataPelajaran = 'Mata pelajaran harus dipilih';
    if (formData.nilai < 0 || formData.nilai > 100) newErrors.nilai = 'Nilai harus antara 0-100';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nilai' ? Number(value) : value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        addGrade(formData);
        
        // Reset form but keep the selected student
        setFormData({
          studentId: formData.studentId,
          jenisTes: '',
          mataPelajaran: '',
          nilai: 0,
        });
        
        toast.success('Nilai berhasil disimpan!');
      } catch (error) {
        toast.error('Terjadi kesalahan saat menyimpan nilai');
        console.error(error);
      }
    } else {
      toast.error('Mohon periksa kembali form Anda');
    }
  };

  const handleDeleteGrade = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus nilai ini?')) {
      deleteGrade(id);
      toast.success('Nilai berhasil dihapus');
    }
  };

  const getStudentName = (id: string) => {
    const student = students.find(s => s.id === id);
    return student ? student.nama : 'Unknown';
  };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Input Nilai</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Form Input Nilai</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Siswa <span className="text-red-500">*</span>
                </label>
                <select
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors.studentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Pilih Siswa --</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.nama} ({student.kelompokKelas})
                    </option>
                  ))}
                </select>
                {errors.studentId && <p className="mt-1 text-sm text-red-500">{errors.studentId}</p>}
              </div>

              <div>
                <label htmlFor="jenisTes" className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Tes <span className="text-red-500">*</span>
                </label>
                <select
                  id="jenisTes"
                  name="jenisTes"
                  value={formData.jenisTes}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors.jenisTes ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Pilih Jenis Tes --</option>
                  {JENIS_TES.map((jenis) => (
                    <option key={jenis} value={jenis}>
                      {jenis}
                    </option>
                  ))}
                </select>
                {errors.jenisTes && <p className="mt-1 text-sm text-red-500">{errors.jenisTes}</p>}
              </div>

              <div>
                <label htmlFor="mataPelajaran" className="block text-sm font-medium text-gray-700 mb-1">
                  Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <select
                  id="mataPelajaran"
                  name="mataPelajaran"
                  value={formData.mataPelajaran}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors.mataPelajaran ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Pilih Mata Pelajaran --</option>
                  {MATA_PELAJARAN.map((pelajaran) => (
                    <option key={pelajaran} value={pelajaran}>
                      {pelajaran}
                    </option>
                  ))}
                </select>
                {errors.mataPelajaran && <p className="mt-1 text-sm text-red-500">{errors.mataPelajaran}</p>}
              </div>

              <div>
                <label htmlFor="nilai" className="block text-sm font-medium text-gray-700 mb-1">
                  Nilai <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="nilai"
                  name="nilai"
                  min="0"
                  max="100"
                  value={formData.nilai}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors.nilai ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nilai (0-100)"
                />
                {errors.nilai && <p className="mt-1 text-sm text-red-500">{errors.nilai}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Book className="h-5 w-5 mr-2" />
                  <span>Simpan Nilai</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Daftar Nilai</h2>
              
              <select
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Semua Siswa</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.nama}
                  </option>
                ))}
              </select>
            </div>
            
            {filteredGrades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Siswa
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mata Pelajaran
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jenis Tes
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nilai
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGrades.map((grade) => (
                      <tr key={grade.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{getStudentName(grade.studentId)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{grade.mataPelajaran}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{grade.jenisTes}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 mr-2">{grade.nilai}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(grade.nilai)}`}>
                              {getGradeLabel(grade.nilai)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{grade.tanggal}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDeleteGrade(grade.id)}
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
                <Book className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Belum Ada Data Nilai</h3>
                <p className="text-gray-500 text-center">
                  {filterStudent 
                    ? "Siswa ini belum memiliki data nilai. Silakan tambahkan nilai melalui form."
                    : "Belum ada data nilai. Silakan tambahkan nilai melalui form di samping."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputNilai;
