import { useState, useEffect } from 'react';
import { Student } from '../types';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = {
      ...student,
      id: crypto.randomUUID(),
    };
    setStudents((prev) => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((student) => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const getStudentById = (id: string) => {
    return students.find((student) => student.id === id);
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
  };
};
