import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LibrosPage from './pages/LibrosPage';
import DetalleLibroPage from './pages/DetalleLibroPage';
import LeerLibroPage from './pages/LeerLibroPage';
import GeneroPage from './pages/GeneroPage';
import SearchPage from './pages/SearchPage';
import AcercaPage from './pages/AcercaPage';
import ContactoPage from './pages/ContactoPage';
import FaqPage from './pages/FaqPage';
import DashboardPage from './pages/admin/DashboardPage';
import LibrosAdminPage from './pages/admin/LibrosAdminPage';
import GenerosAdminPage from './pages/admin/GenerosAdminPage';
import ProtectedRoute from './components/ProtectedRoute';

// Componente que decide qué Navbar mostrar según la ruta
const NavbarSelector = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return isAdminRoute ? <AdminNavbar /> : <Navbar />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="*" element={<NavbarSelector />} />
          </Routes>
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/libros" element={<LibrosPage />} />
              <Route path="/libro/:id" element={<DetalleLibroPage />} />
              <Route path="/leer/:id" element={<LeerLibroPage />} />
              <Route path="/genero/:id" element={<GeneroPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/acerca" element={<AcercaPage />} />
              <Route path="/contacto" element={<ContactoPage />} />
              <Route path="/faq" element={<FaqPage />} />
              
              {/* Rutas de administración (protegidas) */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/libros" 
                element={
                  <ProtectedRoute>
                    <LibrosAdminPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/generos" 
                element={
                  <ProtectedRoute>
                    <GenerosAdminPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Aquí se agregarán más rutas conforme se desarrollen las páginas */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
