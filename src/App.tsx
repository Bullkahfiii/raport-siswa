import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataSiswa from './pages/DataSiswa';
import InputSiswa from './pages/InputSiswa';
import InputNilai from './pages/InputNilai';
import InputKehadiran from './pages/InputKehadiran';
import { Toaster } from 'react-hot-toast';
import './index.css';

export function App() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/data-siswa" element={<DataSiswa />} />
          <Route path="/input-siswa" element={<InputSiswa />} />
          <Route path="/input-nilai" element={<InputNilai />} />
          <Route path="/input-kehadiran" element={<InputKehadiran />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
