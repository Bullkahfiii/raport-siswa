import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentFormProps {
  onSubmit: (student: Omit<Student, 'id'> | Student) => void;
  onCancel: () => void;
  initialData?: Student;
  isEdit?: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<Omit<Student, 'id'> | Student>({
    nama: '',
    kelas: '',
    asalSekolah: '',
    nilai: 0,
    jumlahKehadiran: 0,
    ...(initialData || {}),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama harus diisi';
    if (!formData.kelas.trim()) newErrors.kelas = 'Kelas harus diisi';
    if (!formData.asalSekolah.trim()) newErrors.asalSekolah = 'Asal sekolah harus diisi';
    if (formData.nilai < 0 || formData.nilai > 100) newErrors.nilai = 'Nilai harus antara 0-100';
    if (formData.jumlahKehadiran < 0) newErrors.jumlahKehadiran = 'Jumlah kehadiran tidak valid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      toast.success(isEdit ? 'Data siswa berhasil diperbarui!' : 'Siswa baru berhasil ditambahkan!');
    } else {
      toast.error('Mohon periksa kembali form Anda');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                errors.nama ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama siswa"
            />
            {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
          </div>

          <div>
            <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-1">
              Kelas
            </label>
            <input
              type="text"
              id="kelas"
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                errors.kelas ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: 10A, 11B, 12C"
            />
            {errors.kelas && <p className="mt-1 text-sm text-red-500">{errors.kelas}</p>}
          </div>

          <div>
            <label htmlFor="asalSekolah" className="block text-sm font-medium text-gray-700 mb-1">
              Asal Sekolah
            </label>
            <input
              type="text"
              id="asalSekolah"
              name="asalSekolah"
              value={formData.asalSekolah}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                errors.asalSekolah ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan asal sekolah"
            />
            {errors.asalSekolah && <p className="mt-1 text-sm text-red-500">{errors.asalSekolah}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nilai" className="block text-sm font-medium text-gray-700 mb-1">
                Nilai
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
                placeholder="0-100"
              />
              {errors.nilai && <p className="mt-1 text-sm text-red-500">{errors.nilai}</p>}
            </div>

            <div>
              <label htmlFor="jumlahKehadiran" className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Kehadiran
              </label>
              <input
                type="number"
                id="jumlahKehadiran"
                name="jumlahKehadiran"
                min="0"
                value={formData.jumlahKehadiran}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                  errors.jumlahKehadiran ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan jumlah"
              />
              {errors.jumlahKehadiran && <p className="mt-1 text-sm text-red-500">{errors.jumlahKehadiran}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isEdit ? 'Perbarui' : 'Simpan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
