import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Componente que muestra un gráfico de barras usando Chart.js
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.valoraciones - Array de objetos con valoraciones que incluyen fecha
 * @param {string} props.mode - Modo de visualización: 'week' o 'month'
 */
const ChartJSBarChart = ({ valoraciones = [], mode = 'week' }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartMode, setChartMode] = useState(mode);
  
  // Procesar datos según el modo seleccionado
  useEffect(() => {
    if (chartMode === 'week') {
      // Agrupar valoraciones por día de la semana
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const daysCounts = Array(7).fill(0);
      
      valoraciones.forEach(val => {
        const date = new Date(val.fecha);
        const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
        daysCounts[dayOfWeek]++;
      });
      
      setChartData({
        labels: dayNames,
        datasets: [
          {
            label: 'Valoraciones',
            data: daysCounts,
            backgroundColor: 'rgba(53, 162, 235, 0.7)',
            borderColor: 'rgba(53, 162, 235, 1)',
            borderWidth: 1,
            borderRadius: 5,
            maxBarThickness: 35
          }
        ]
      });
    } else if (chartMode === 'month') {
      // Agrupar valoraciones por mes
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const monthsCounts = Array(12).fill(0);
      
      valoraciones.forEach(val => {
        const date = new Date(val.fecha);
        const month = date.getMonth(); // 0 = Enero, 11 = Diciembre
        monthsCounts[month]++;
      });
      
      // Filtrar para mostrar solo los meses con valoraciones
      const filteredMonths = monthNames.filter((_, index) => monthsCounts[index] > 0);
      const filteredCounts = monthsCounts.filter(count => count > 0);
      
      setChartData({
        labels: filteredMonths.length > 0 ? filteredMonths : monthNames,
        datasets: [
          {
            label: 'Valoraciones',
            data: filteredMonths.length > 0 ? filteredCounts : monthsCounts,
            backgroundColor: 'rgba(53, 162, 235, 0.7)',
            borderColor: 'rgba(53, 162, 235, 1)',
            borderWidth: 1,
            borderRadius: 5,
            maxBarThickness: 35
          }
        ]
      });
    }
  }, [valoraciones, chartMode]);
  
  // Opciones del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} valoraciones`;
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {chartMode === 'week' ? 'Valoraciones por Día' : 'Valoraciones por Mes'}
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total: <span className="font-bold">{valoraciones.length}</span> valoraciones
          </div>
          
          <div className="flex border rounded-md overflow-hidden">
            <button 
              onClick={() => setChartMode('week')} 
              className={`px-3 py-1 text-xs font-medium ${chartMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setChartMode('month')} 
              className={`px-3 py-1 text-xs font-medium ${chartMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Mes
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        {valoraciones.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500 font-medium">No hay datos disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartJSBarChart;
