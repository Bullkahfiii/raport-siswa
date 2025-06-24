import React, { useState, useMemo } from 'react';
import { useDataStore } from '../hooks/useDataStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Book, Calendar, GraduationCap, School, User } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { students, grades, getGradesByStudentId, getAttendanceByStudentId } = useDataStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const selectedStudent = useMemo(() => {
    return students.find(student => student.id === selectedStudentId);
  }, [students, selectedStudentId]);

  const studentGrades = useMemo(() => {
    if (!selectedStudentId) return [];
    return getGradesByStudentId(selectedStudentId);
  }, [selectedStudentId, getGradesByStudentId]);

  const attendanceData = useMemo(() => {
    if (!selectedStudentId) return [];
    
    const records = getAttendanceByStudentId(selectedStudentId);
    const months: Record<string, { month: string, present: number, absent: number }> = {};
    
    records.forEach(record => {
      const month = record.date.split('-')[1];
      const monthName = new Date(`2023-${month}-01`).toLocaleString('id-ID', { month: 'long' });
      
      if (!months[month]) {
        months[month] = { month: monthName, present: 0, absent: 0 };
      }
      
      if (record.present) {
        months[month].present += 1;
      } else {
        months[month].absent += 1;
      }
    });
    
    return Object.values(months);
  }, [selectedStudentId, getAttendanceByStudentId]);

  const gradeData = useMemo(() => {
    if (!studentGrades.length) return [];
    
    const subjects: Record<string, { subject: string, nilai: number[] }> = {};
    
    studentGrades.forEach(grade => {
      if (!subjects[grade.mataPelajaran]) {
        subjects[grade.mataPelajaran] = { subject: grade.mataPelajaran, nilai: [] };
      }
      
      subjects[grade.mataPelajaran].nilai.push(grade.nilai);
    });
    
    // Calculate average for each subject
    return Object.values(subjects).map(item => ({
      subject: item.subject,
      nilai: item.nilai.reduce((a, b) => a + b, 0) / item.nilai.length
    }));
  }, [studentGrades]);

  // Generate grade progress data - show grade evolution over time
  const gradeProgressData = useMemo(() => {
    if (!studentGrades.length) return [];
    
    // Sort grades by date
    const sortedGrades = [...studentGrades].sort((a, b) => {
      return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
    });
    
    // Group by subject and date
    const result: any[] = [];
    
    sortedGrades.forEach((grade, index) => {
      result.push({
        id: index + 1,
        tanggal: grade.tanggal,
        mataPelajaran: grade.mataPelajaran,
        nilai: grade.nilai,
        jenisTes: grade.jenisTes
      });
    });
    
    return result;
  }, [studentGrades]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="mb-4">
          <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Siswa
          </label>
          <select
            id="student-select"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Pilih Siswa --</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.nama} ({student.kelompokKelas})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-md mr-3">
                    <User className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Siswa</h3>
                    <p className="text-lg font-semibold text-gray-800">{selectedStudent.nama}</p>
                    <p className="text-xs text-gray-500">NIS: {selectedStudent.nomorInduk}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="p-2 bg-purple-100 rounded-md mr-3">
                    <School className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Asal Sekolah</h3>
                    <p className="text-lg font-semibold text-gray-800">{selectedStudent.asalSekolah}</p>
                    <p className="text-xs text-gray-500">Kelas: {selectedStudent.kelompokKelas}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="p-2 bg-amber-100 rounded-md mr-3">
                    <Calendar className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tanggal Lahir</h3>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(selectedStudent.tanggalLahir).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Grafik Nilai</h3>
                </div>
                
                {gradeData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={gradeData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="nilai" fill="#3B82F6" name="Rata-rata Nilai" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500 text-center">
                    <div>
                      <Book className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p>Belum ada data nilai untuk siswa ini</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  <Book className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Progres Nilai</h3>
                </div>
                
                {gradeProgressData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={gradeProgressData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="id" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${value}`,
                            props.payload.mataPelajaran
                          ]}
                          labelFormatter={(value) => `Tes ke-${value}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="nilai" 
                          stroke="#3B82F6" 
                          name="Nilai" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500 text-center">
                    <div>
                      <Book className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p>Belum ada data nilai untuk siswa ini</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Rekap Kehadiran</h3>
              </div>
              
              {attendanceData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={attendanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#10B981" name="Hadir" />
                      <Bar dataKey="absent" fill="#EF4444" name="Tidak Hadir" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500 text-center">
                  <div>
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>Belum ada data kehadiran untuk siswa ini</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-blue-100 rounded-full p-6 mb-4">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Pilih Siswa</h2>
            <p className="text-gray-500 text-center max-w-md">
              Silakan pilih siswa dari dropdown di atas untuk melihat data lengkap siswa, 
              nilai, dan kehadiran.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
