import { useState, useEffect } from 'react';
import { Student, GradeEntry, AttendanceRecord, KelompokKelas } from '../types';
import toast from 'react-hot-toast';

interface DataStore {
  students: Student[];
  grades: GradeEntry[];
  attendance: AttendanceRecord[];
  kelompokKelas: KelompokKelas[];
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (updatedStudent: Student) => void;
  deleteStudent: (id: string) => void;
  getStudentById: (id: string) => Student | undefined;
  addGrade: (grade: Omit<GradeEntry, 'id'>) => GradeEntry;
  updateGrade: (updatedGrade: GradeEntry) => void;
  deleteGrade: (id: string) => void;
  getGradesByStudentId: (studentId: string) => GradeEntry[];
  addAttendance: (record: Omit<AttendanceRecord, 'id'>) => AttendanceRecord;
  updateAttendance: (updatedRecord: AttendanceRecord) => void;
  deleteAttendance: (id: string) => void;
  getAttendanceByClass: (kelasId: string) => AttendanceRecord[];
  getAttendanceByStudentId: (studentId: string) => { date: string; present: boolean }[];
  addKelompokKelas: (kelas: Omit<KelompokKelas, 'id'>) => KelompokKelas;
  getStudentsByKelas: (kelasId: string) => Student[];
}

// Helper to get data from localStorage
const getStoredData = <T>(key: string, defaultValue: T): T => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

// Helper to save data to localStorage
const saveData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const useDataStore = (): DataStore => {
  // Initialize states from localStorage or with default values
  const [students, setStudents] = useState<Student[]>(() => 
    getStoredData('students', [])
  );
  
  const [grades, setGrades] = useState<GradeEntry[]>(() => 
    getStoredData('grades', [])
  );
  
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => 
    getStoredData('attendance', [])
  );
  
  const [kelompokKelas, setKelompokKelas] = useState<KelompokKelas[]>(() => 
    getStoredData('kelompokKelas', [
      { id: 'k1', nama: 'Kelas 10A' },
      { id: 'k2', nama: 'Kelas 10B' },
      { id: 'k3', nama: 'Kelas 11A' },
      { id: 'k4', nama: 'Kelas 11B' },
      { id: 'k5', nama: 'Kelas 12A' },
      { id: 'k6', nama: 'Kelas 12B' },
    ])
  );

  // Save to localStorage when state changes
  useEffect(() => {
    saveData('students', students);
  }, [students]);

  useEffect(() => {
    saveData('grades', grades);
  }, [grades]);

  useEffect(() => {
    saveData('attendance', attendance);
  }, [attendance]);

  useEffect(() => {
    saveData('kelompokKelas', kelompokKelas);
  }, [kelompokKelas]);

  // Student operations
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = {
      ...student,
      id: crypto.randomUUID(),
    };
    setStudents((prev) => [...prev, newStudent]);
    toast.success('Data siswa berhasil ditambahkan');
    return newStudent;
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((student) => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
    toast.success('Data siswa berhasil diperbarui');
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
    // Also delete related grades
    setGrades((prev) => prev.filter((grade) => grade.studentId !== id));
    toast.success('Data siswa berhasil dihapus');
  };

  const getStudentById = (id: string) => {
    return students.find((student) => student.id === id);
  };

  // Grade operations
  const addGrade = (grade: Omit<GradeEntry, 'id'>) => {
    const newGrade = {
      ...grade,
      id: crypto.randomUUID(),
      tanggal: new Date().toISOString().split('T')[0],
    };
    setGrades((prev) => [...prev, newGrade]);
    toast.success('Nilai berhasil ditambahkan');
    return newGrade;
  };

  const updateGrade = (updatedGrade: GradeEntry) => {
    setGrades((prev) =>
      prev.map((grade) => 
        grade.id === updatedGrade.id ? updatedGrade : grade
      )
    );
    toast.success('Nilai berhasil diperbarui');
  };

  const deleteGrade = (id: string) => {
    setGrades((prev) => prev.filter((grade) => grade.id !== id));
    toast.success('Nilai berhasil dihapus');
  };

  const getGradesByStudentId = (studentId: string) => {
    return grades.filter((grade) => grade.studentId === studentId);
  };

  // Attendance operations
  const addAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: crypto.randomUUID(),
    };
    setAttendance((prev) => [...prev, newRecord]);
    toast.success('Data kehadiran berhasil ditambahkan');
    return newRecord;
  };

  const updateAttendance = (updatedRecord: AttendanceRecord) => {
    setAttendance((prev) =>
      prev.map((record) => 
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
    toast.success('Data kehadiran berhasil diperbarui');
  };

  const deleteAttendance = (id: string) => {
    setAttendance((prev) => prev.filter((record) => record.id !== id));
    toast.success('Data kehadiran berhasil dihapus');
  };

  const getAttendanceByClass = (kelasId: string) => {
    return attendance.filter((record) => record.kelompokKelas === kelasId);
  };

  const getAttendanceByStudentId = (studentId: string) => {
    const result: { date: string; present: boolean }[] = [];
    
    attendance.forEach((record) => {
      const isPresent = record.hadir.some((student) => student.studentId === studentId);
      result.push({
        date: record.tanggal,
        present: isPresent,
      });
    });
    
    return result;
  };

  // Kelompok Kelas operations
  const addKelompokKelas = (kelas: Omit<KelompokKelas, 'id'>) => {
    const newKelas = {
      ...kelas,
      id: crypto.randomUUID(),
    };
    setKelompokKelas((prev) => [...prev, newKelas]);
    return newKelas;
  };

  const getStudentsByKelas = (kelasId: string) => {
    return students.filter((student) => student.kelompokKelas === kelasId);
  };

  return {
    students,
    grades,
    attendance,
    kelompokKelas,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    addGrade,
    updateGrade,
    deleteGrade,
    getGradesByStudentId,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceByClass,
    getAttendanceByStudentId,
    addKelompokKelas,
    getStudentsByKelas,
  };
};
