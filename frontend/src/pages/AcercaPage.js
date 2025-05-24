import React from 'react';

const AcercaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#a2822b] py-6 px-6">
          <h1 className="text-3xl font-bold text-white text-center">Acerca de la Institución</h1>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
              <img 
                src="/logo-isfdt26.png" 
                alt="Logo ISFDyT 26" 
                className="h-48 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24"><path fill="%23a2822b" d="M12 3L1 9l11 6l9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>';
                }}
              />
            </div>
            <div className="md:w-2/3 md:pl-8">
              <h2 className="text-2xl font-bold text-[#a2822b] mb-4">ISFDyT N° 26</h2>
              <p className="text-gray-700 mb-4">
                El Instituto Superior de Formación Docente y Técnica N° 26 es una institución educativa dedicada a la formación de profesionales en el ámbito de la educación y la tecnología, comprometida con la excelencia académica y el desarrollo integral de sus estudiantes.
              </p>
              <p className="text-gray-700">
                Nuestra biblioteca virtual es un proyecto que busca facilitar el acceso al conocimiento para toda nuestra comunidad educativa, ofreciendo recursos digitales de calidad que apoyen el proceso de enseñanza-aprendizaje.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-xl font-bold text-[#a2822b] mb-4">Historia</h3>
            <p className="text-gray-700 mb-4">
              Fundado en [año de fundación], el ISFDyT N° 26 ha sido pionero en la implementación de programas educativos innovadores que combinan la formación docente tradicional con las nuevas tecnologías y métodos pedagógicos.
            </p>
            <p className="text-gray-700 mb-4">
              A lo largo de nuestra historia, hemos formado a generaciones de profesionales que hoy se desempeñan con éxito en instituciones educativas de todo el país, llevando consigo los valores y la excelencia que caracterizan a nuestra institución.
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-xl font-bold text-[#a2822b] mb-4">Misión y Visión</h3>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Misión</h4>
            <p className="text-gray-700 mb-4">
              Formar profesionales de la educación y la tecnología con un alto nivel académico, sentido ético y compromiso social, capaces de responder a los desafíos educativos del siglo XXI y contribuir al desarrollo de una sociedad más justa y equitativa.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Visión</h4>
            <p className="text-gray-700 mb-4">
              Ser reconocidos como una institución de referencia en la formación docente y técnica, destacando por la calidad de nuestros egresados, la innovación pedagógica y el impacto positivo en la comunidad.
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-xl font-bold text-[#a2822b] mb-4">Carreras</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Profesorado de Educación Primaria</li>
              <li>Profesorado de Educación Inicial</li>
              <li>Profesorado de Educación Especial</li>
              <li>Técnico Superior en Informática</li>
              <li>Técnico Superior en Administración de Empresas</li>
              <li>Técnico Superior en Gestión Ambiental</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcercaPage; 