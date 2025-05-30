import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

/**
 * Componente que muestra un gráfico circular usando Chart.js
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Array de objetos con datos para el gráfico
 */
const ChartJSPieChart = ({ data = [] }) => {
  // Colores predefinidos para el gráfico
  const backgroundColors = [
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(199, 199, 199, 0.7)',
    'rgba(83, 102, 255, 0.7)',
    'rgba(40, 159, 64, 0.7)',
    'rgba(210, 199, 199, 0.7)',
  ];
  
  const borderColors = [
    'rgba(54, 162, 235, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
    'rgba(83, 102, 255, 1)',
    'rgba(40, 159, 64, 1)',
    'rgba(210, 199, 199, 1)',
  ];
  
  // Preparar datos para el gráfico
  const chartData = {
    labels: data.map(item => item.nombre),
    datasets: [
      {
        data: data.map(item => item.libros_count),
        backgroundColor: backgroundColors.slice(0, data.length),
        borderColor: borderColors.slice(0, data.length),
        borderWidth: 1,
      },
    ],
  };
  
  // Opciones del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} libros (${percentage}%)`;
          }
        }
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Géneros Populares</h2>
      
      <div className="h-64">
        {data.length > 0 ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <p className="text-gray-500 font-medium">No hay géneros disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartJSPieChart;
