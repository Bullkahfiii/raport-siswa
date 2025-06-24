import React, { useMemo } from 'react';
import { Student } from '../types';
import { Award, BookOpen, UserCheck, Users } from 'lucide-react';

interface DashboardStatsProps {
  students: Student[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ students }) => {
  const stats = useMemo(() => {
    if (students.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        topStudent: null,
        averageAttendance: 0,
      };
    }

    const totalStudents = students.length;
    const totalScore = students.reduce((sum, student) => sum + student.nilai, 0);
    const averageScore = Math.round((totalScore / totalStudents) * 10) / 10;
    
    const topStudent = [...students].sort((a, b) => b.nilai - a.nilai)[0];
    
    const totalAttendance = students.reduce((sum, student) => sum + student.jumlahKehadiran, 0);
    const averageAttendance = Math.round((totalAttendance / totalStudents) * 10) / 10;

    return {
      totalStudents,
      averageScore,
      topStudent,
      averageAttendance,
    };
  }, [students]);

  const statCards = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: 'Total Siswa',
      value: stats.totalStudents,
      color: 'bg-blue-100',
    },
    {
      icon: <Award className="h-6 w-6 text-green-600" />,
      title: 'Rata-rata Nilai',
      value: stats.averageScore,
      color: 'bg-green-100',
    },
    {
      icon: <BookOpen className="h-6 w-6 text-purple-600" />,
      title: 'Siswa Terbaik',
      value: stats.topStudent?.nama || '-',
      subtext: stats.topStudent ? `Nilai: ${stats.topStudent.nilai}` : '',
      color: 'bg-purple-100',
    },
    {
      icon: <UserCheck className="h-6 w-6 text-amber-600" />,
      title: 'Rata-rata Kehadiran',
      value: stats.averageAttendance,
      subtext: 'hari',
      color: 'bg-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div 
          key={index}
          className="bg-white rounded-lg shadow-md p-4 flex items-center transition-transform hover:scale-105"
        >
          <div className={`${card.color} rounded-full p-3 mr-4`}>
            {card.icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <div className="text-xl font-bold text-gray-800">{card.value}</div>
            {card.subtext && <div className="text-xs text-gray-500">{card.subtext}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};
