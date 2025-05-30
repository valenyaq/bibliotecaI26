import React, { useState, useEffect } from 'react';
import { getAllLibros } from '../../services/librosService';
import { getAllGeneros } from '../../services/generosService';
import { getAllValoraciones } from '../../services/valoracionesService';
import { Link } from 'react-router-dom';
import ChartJSBarChart from '../../components/ChartJSBarChart';
import ChartJSPieChart from '../../components/ChartJSPieChart';

// Componente para las tarjetas de información con animación
const StatCard = ({ title, value, icon, color, delay = 0 }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100 + delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color} transition-all duration-700 hover:scale-105 ${animate ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm uppercase font-semibold mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${color.replace('border-', 'bg-').replace('-600', '-100')} text-${color.replace('border-', '').replace('-600', '-500')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar los géneros más populares (reemplazado por PieChart)

// Componente para mostrar los libros recientes con animación
const RecentBooks = ({ libros }) => {
  const [animate, setAnimate] = useState(false);
  
  // Activar animación al montar el componente
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Ordenar libros por fecha (del más reciente al más antiguo)
  const sortedLibros = [...libros].sort((a, b) => new Date(b.fecha_subida) - new Date(a.fecha_subida));
  const recentLibros = sortedLibros.slice(0, 5); // Tomar los 5 más recientes

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Libros Recientes</h2>
        <Link 
          to="/admin/libros" 
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          Ver todos
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      {recentLibros.length > 0 ? (
        <div className="overflow-y-auto max-h-64 rounded-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentLibros.map((libro, index) => (
                <tr 
                  key={libro.id} 
                  className={`hover:bg-blue-50 transition-all duration-300 ${animate ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{libro.titulo}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600">{libro.autor}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600 bg-blue-50 rounded-full px-2 py-1 text-center">
                      {new Date(libro.fecha_subida).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-gray-500 font-medium">No hay libros disponibles</p>
        </div>
      )}
    </div>
  );
};

// Componente principal del Dashboard
const DashboardPage = () => {
  const [libros, setLibros] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener libros, géneros y valoraciones en paralelo
        const [librosData, generosData, valoracionesData] = await Promise.all([
          getAllLibros(),
          getAllGeneros(),
          getAllValoraciones()
        ]);
        
        setLibros(librosData);
        setValoraciones(valoracionesData);
        
        // Añadir conteo de libros a cada género
        const generosConConteo = generosData.map(genero => {
          const librosCount = librosData.filter(libro => libro.genero_id === genero.id).length;
          return { ...genero, libros_count: librosCount };
        });
        
        // Guardar las valoraciones para usarlas en los gráficos
        setGeneros(generosConConteo);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Error al cargar datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-300 border-t-black"></div>
        <p className="mt-4 text-gray-600 font-medium">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  // Calcular estadísticas para las tarjetas
  const totalLibros = libros.length;
  const totalGeneros = generos.length;
  
  // Calcular valoración promedio solo de los libros que tienen valoraciones
  let valoracionPromedio = 0;
  if (valoraciones.length > 0) {
    // Agrupar valoraciones por libro
    const valoracionesPorLibro = {};
    valoraciones.forEach(val => {
      if (!valoracionesPorLibro[val.libro_id]) {
        valoracionesPorLibro[val.libro_id] = [];
      }
      valoracionesPorLibro[val.libro_id].push(val.puntuacion);
    });
    
    // Calcular promedio por libro y luego promedio general
    let sumaPromedios = 0;
    let librosConValoraciones = 0;
    
    Object.keys(valoracionesPorLibro).forEach(libroId => {
      const valoracionesLibro = valoracionesPorLibro[libroId];
      if (valoracionesLibro.length > 0) {
        const promedioLibro = valoracionesLibro.reduce((sum, val) => sum + val, 0) / valoracionesLibro.length;
        sumaPromedios += promedioLibro;
        librosConValoraciones++;
      }
    });
    
    valoracionPromedio = librosConValoraciones > 0 ? (sumaPromedios / librosConValoraciones).toFixed(1) : 0;
  }
  
  // Encontrar el género más popular
  const generoMasPopular = generos.length > 0
    ? generos.reduce((max, genero) => genero.libros_count > max.libros_count ? genero : max, generos[0])
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard de Administración</h1>
      
      {/* Tarjetas de estadísticas con animación */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total de Libros" 
          value={totalLibros} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          color="border-blue-600"
          delay={0}
        />
        <StatCard 
          title="Total de Géneros" 
          value={totalGeneros} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
          color="border-green-600"
          delay={100}
        />
        <StatCard 
          title="Valoración Media" 
          value={valoracionPromedio} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          color="border-yellow-600"
          delay={200}
        />
        <StatCard 
          title="Género Popular" 
          value={generoMasPopular ? generoMasPopular.nombre : 'Ninguno'} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          }
          color="border-[#3b82f6]"
          delay={300}
        />
      </div>
      
      {/* Enlaces rápidos y estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/admin/libros" 
              className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-700 hover:bg-blue-100 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Gestionar Libros
            </Link>
            <Link 
              to="/admin/generos" 
              className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-100 text-green-700 hover:bg-green-100 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Gestionar Géneros
            </Link>
            <Link 
              to="/admin/libros" 
              state={{ showForm: true }}
              className="flex items-center justify-center p-4 bg-[#f5efd7] rounded-lg border border-[#e9deb5] text-[#8a6d23] hover:bg-[#e9deb5] transition duration-300 col-span-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Añadir Nuevo Libro
            </Link>
          </div>
        </div>
        
        {/* Gráfico de valoraciones */}
        <ChartJSBarChart valoraciones={valoraciones} mode="week" />
      </div>
      
      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ChartJSPieChart data={generos.slice(0, 5)} />
        <RecentBooks libros={libros} />
      </div>
    </div>
  );
};

export default DashboardPage;