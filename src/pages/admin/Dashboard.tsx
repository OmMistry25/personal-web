import React from 'react';
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Briefcase, User, Clock, 
  Mail, LogOut, Menu, X 
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProjectsAdmin from './ProjectsAdmin';
import WritingAdmin from './WritingAdmin';
import WorkAdmin from './WorkAdmin';
import AboutAdmin from './AboutAdmin';
import NowAdmin from './NowAdmin';
import ContactAdmin from './ContactAdmin';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: FileText, label: 'Projects', path: '/admin/projects' },
    { icon: FileText, label: 'Writing', path: '/admin/writing' },
    { icon: Briefcase, label: 'Work', path: '/admin/work' },
    { icon: User, label: 'About', path: '/admin/about' },
    { icon: Clock, label: 'Now', path: '/admin/now' },
    { icon: Mail, label: 'Contact', path: '/admin/contact' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-sm"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        </div>
        
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${
                location.pathname === item.path ? 'bg-gray-50 text-gray-900' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
          
          <button 
            onClick={handleLogout}
            className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`
        min-h-screen transition-all duration-300 pt-16 lg:pt-0
        ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
      `}>
        <div className="p-6">
          <Routes>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Welcome to the Admin Dashboard</h2>
                <p className="text-gray-600">Select a section from the sidebar to manage your content.</p>
              </div>
            } />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="writing" element={<WritingAdmin />} />
            <Route path="work" element={<WorkAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="now" element={<NowAdmin />} />
            <Route path="contact" element={<ContactAdmin />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;