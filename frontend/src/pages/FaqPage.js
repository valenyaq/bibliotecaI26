import React, { useState } from 'react';

const FaqPage = () => {
  // Estado para controlar qué preguntas están expandidas
  const [expandedId, setExpandedId] = useState(null);

  // Función para alternar la expansión de una pregunta
  const toggleQuestion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Datos de preguntas frecuentes
  const faqData = [
    {
      id: 1,
      question: '¿Cómo puedo acceder a los libros de la biblioteca virtual?',
      answer: 'Puedes acceder a todos los libros disponibles navegando a la sección "Libros" en el menú principal. Allí encontrarás opciones para filtrar por género, autor o título. Una vez que encuentres el libro deseado, haz clic en él para acceder a su contenido digital.'
    },
    {
      id: 2,
      question: '¿Necesito registrarme para leer los libros?',
      answer: 'No, la mayoría de los libros están disponibles para su lectura sin necesidad de registro. Sin embargo, algunas funcionalidades como guardar favoritos o marcar progreso de lectura podrían requerir iniciar sesión.'
    },
    {
      id: 3,
      question: '¿Cómo puedo realizar una búsqueda específica?',
      answer: 'Utiliza la barra de búsqueda ubicada en la parte superior de la página. Puedes buscar por título, autor, género o palabras clave relacionadas con el contenido que te interesa.'
    },
    {
      id: 4,
      question: '¿Puedo descargar los libros para leerlos sin conexión?',
      answer: 'Actualmente la mayoría de los libros están disponibles solo para lectura online. Sin embargo, estamos trabajando para implementar la funcionalidad de descarga en el futuro.'
    },
    {
      id: 5,
      question: '¿Cómo puedo sugerir nuevos libros para la biblioteca?',
      answer: 'Puedes enviarnos tus sugerencias a través del formulario de contacto. Valoramos las recomendaciones de nuestra comunidad y tratamos de incorporar nuevo material regularmente.'
    },
    {
      id: 6,
      question: '¿Los libros tienen restricciones de acceso según mi ubicación?',
      answer: 'Nuestra biblioteca virtual está principalmente orientada a la comunidad educativa del ISFDyT 26. Algunos materiales pueden tener restricciones debido a derechos de autor o acuerdos con editoriales.'
    },
    {
      id: 7,
      question: '¿Qué debo hacer si encuentro problemas técnicos?',
      answer: 'Si experimentas dificultades técnicas al utilizar la plataforma, por favor contáctanos a través del formulario en la sección de contacto, especificando el problema encontrado, el dispositivo que utilizas y, si es posible, adjunta capturas de pantalla.'
    },
    {
      id: 8,
      question: '¿Cómo puedo colaborar con la biblioteca virtual?',
      answer: 'Valoramos cualquier tipo de colaboración. Si eres autor o tienes derechos sobre material que desees compartir, o si quieres participar como voluntario en la digitalización o catalogación, contáctanos a través del formulario en la sección de contacto.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#a2822b] py-6 px-6">
            <h1 className="text-3xl font-bold text-white text-center">Preguntas Frecuentes</h1>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-8 text-center">
              Encuentra respuestas a las preguntas más comunes sobre nuestra biblioteca virtual. 
              Si no encuentras lo que buscas, no dudes en contactarnos.
            </p>
            
            <div className="space-y-4">
              {faqData.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(faq.id)}
                    className={`w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none ${
                      expandedId === faq.id ? 'bg-[#f5efd7]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <h3 className={`font-semibold ${expandedId === faq.id ? 'text-[#a2822b]' : 'text-gray-800'}`}>
                      {faq.question}
                    </h3>
                    <svg
                      className={`h-5 w-5 transition-transform duration-300 ${
                        expandedId === faq.id ? 'transform rotate-180 text-[#a2822b]' : 'text-gray-400'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  
                  {expandedId === faq.id && (
                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-[#a2822b] mb-4">¿No encontraste lo que buscabas?</h2>
              <p className="text-gray-600 mb-4">
                Si tienes alguna pregunta que no ha sido respondida aquí, no dudes en ponerte en contacto con nosotros.
              </p>
              <a
                href="/contacto"
                className="inline-block px-5 py-2 bg-[#a2822b] text-white font-medium rounded-md hover:bg-[#8a6d23] transition-colors duration-300"
              >
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage; 