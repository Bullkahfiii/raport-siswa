import React, { useState } from 'react';
import { useDataStore } from '../hooks/useDataStore';
import { Student } from '../types';
import { Check, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export const InputSiswa: React.FC = () => {
  const { addStudent, kelompokKelas } = useDataStore();
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    nama: '',
    nomorInduk: '',
    kelompokKelas: '',
    asalSekolah: '',
    nomorWhatsapp: '',
    email: '',
    tanggalLahir: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nama.trim()) newErrors.nama = 'Nama siswa harus diisi';
    if (!formData.nomorInduk.trim()) newErrors.nomorInduk = 'Nomor induk harus diisi';
    if (!formData.kelompokKelas) newErrors.kelompokKelas = 'Kelompok kelas harus dipilih';
    if (!formData.asalSekolah.trim()) newErrors.asalSekolah = 'Asal sekolah harus diisi';
    if (!formData.nomorWhatsapp.trim()) newErrors.nomorWhatsapp = 'Nomor WhatsApp harus diisi';
    if (!/^\d+$/.test(formData.nomorWhatsapp)) newErrors.nomorWhatsapp = 'Nomor WhatsApp hanya boleh berisi angka';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.tanggalLahir) newErrors.tanggalLahir = 'Tanggal lahir harus diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
      setIsSubmitting(true);
      
      try {
        addStudent(formData);
        
        // Reset form
        setFormData({
          nama: '',
          nomorInduk: '',
          kelompokKelas: '',
          asalSekolah: '',
          nomorWhatsapp: '',
          email: '',
          tanggalLahir: '',
        });
        
        toast.success('Data siswa berhasil ditambahkan!');
      } catch (error) {
        toast.error('Terjadi kesalahan saat menambahkan data siswa');
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error('Mohon periksa kembali form Anda');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Input Siswa</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Siswa <span className="text-red-500">*</span>
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
                  placeholder="Masukkan nama lengkap siswa"
                />
                {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
              </div>

              <div>
                <label htmlFor="nomorInduk" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Induk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nomorInduk"
                  name="nomorInduk"
                  value={formData.nomorInduk}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors.nomorInduk ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nomor induk siswa"
                />
                {errors.nomorInduk && <p className="mt-1 text-sm text-red-500">{errors.nomorInduk}</p>}
              </div>

              <div>
                <label htmlFor="kelompokKelas" className="block text-sm font-medium text-gray-700 mb-1">
                  Kelompok Kelas <span className="text-red-500">*</span>
                </label>
                <select
                  id="kelompokKelas"
                  name="kelompokKelas"
                  value={formData.kelompokKelas}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors.kelompokKelas ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Pilih Kelompok Kelas --</option>
                  {kelompokKelas.map((kelas) => (
                    <option key={kelas.id} value={kelas.nama}>
                      {kelas.nama}
                    </option>
                  ))}
                </select>
                {errors.kelompokKelas && <p className="mt-1 text-sm text-red-500">{errors.kelompokKelas}</p>}
              </div>

              <div>
                <label htmlFor="asalSekolah" className="block text-sm font-medium text-gray-700 mb-1">
                  Asal Sekolah <span className="text-red-500">*</span>
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

              <div>
                <label htmlFor="nomorWhatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nomorWhatsapp"
                  name="nomorWhatsapp"
                  value={formData.nomorWhatsapp}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors.nomorWhatsapp ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nomor WhatsApp"
                />
                {errors.nomorWhatsapp && <p className="mt-1 text-sm text-red-500">{errors.nomorWhatsapp}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan alamat email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="tanggalLahir"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors.tanggalLahir ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.tanggalLahir && <p className="mt-1 text-sm text-red-500">{errors.tanggalLahir}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">●</span>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    <span>Simpan Data Siswa</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputSiswa;
