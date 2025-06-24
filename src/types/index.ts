export interface Student {
  id: string;
  nama: string;
  nomorInduk: string;
  kelompokKelas: string;
  asalSekolah: string;
  nomorWhatsapp: string;
  email: string;
  tanggalLahir: string;
}

export interface GradeEntry {
  id: string;
  studentId: string;
  jenisTes: string;
  mataPelajaran: string;
  nilai: number;
  tanggal: string;
}

export interface AttendanceRecord {
  id: string;
  tanggal: string;
  kelompokKelas: string;
  hadir: {
    studentId: string;
    nama: string;
  }[];
}

export interface KelompokKelas {
  id: string;
  nama: string;
}

export type NavSection = 'dashboard' | 'data-siswa' | 'input-siswa' | 'input-nilai' | 'input-kehadiran';
