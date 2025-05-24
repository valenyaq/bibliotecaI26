import React, { useState } from 'react';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';
import MapaContacto from '../components/MapaContacto';

const ContactoPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [error, setError] = useState(null);
  const [mapaError, setMapaError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    // Aquí iría la lógica para enviar el formulario a un backend
    // Simulamos una petición con un timeout
    setTimeout(() => {
      setEnviando(false);
      setMensajeEnviado(true);
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#a2822b] text-center mb-8">Contacto</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Información de contacto */}
            <div className="bg-gradient-to-b from-[#a2822b] to-[#8a6d23] p-8 text-white">
              <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MdLocationOn className="h-6 w-6 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Dirección</h3>
                    <p className="mt-1">Calle Falsa 123, Buenos Aires, Argentina</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MdPhone className="h-6 w-6 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Teléfono</h3>
                    <p className="mt-1">+54 11 1234-5678</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MdEmail className="h-6 w-6 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="mt-1">contacto@isfdt26.edu.ar</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="font-medium mb-3">Horarios de Atención</h3>
                <div className="text-sm">
                  <p className="mb-1">Lunes a Viernes: 8:00 - 20:00</p>
                  <p>Sábados: 9:00 - 13:00</p>
                </div>
              </div>
            </div>
            
            {/* Formulario de contacto */}
            <div className="col-span-2 p-8">
              <h2 className="text-2xl font-semibold text-[#a2822b] mb-6">Envíanos un mensaje</h2>
              
              {mensajeEnviado ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
                  <h3 className="text-lg font-medium">¡Mensaje enviado con éxito!</h3>
                  <p className="mt-2">Gracias por contactarnos. Te responderemos a la brevedad.</p>
                  <button 
                    onClick={() => setMensajeEnviado(false)} 
                    className="mt-3 px-4 py-2 bg-green-100 hover:bg-green-200 rounded-md transition duration-300"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a2822b] focus:border-[#a2822b]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a2822b] focus:border-[#a2822b]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">
                      Asunto
                    </label>
                    <input
                      type="text"
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a2822b] focus:border-[#a2822b]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      rows="5"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a2822b] focus:border-[#a2822b]"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={enviando}
                      className={`px-6 py-3 bg-[#a2822b] text-white rounded-md font-medium hover:bg-[#8a6d23] transition duration-300 ${
                        enviando ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {enviando ? 'Enviando...' : 'Enviar mensaje'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Mapa con Leaflet */}
        <div className="mt-10 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-[#a2822b] mb-4">Nuestra ubicación</h2>
          
          {mapaError ? (
            <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No se pudo cargar el mapa. Inténtalo nuevamente más tarde.</p>
            </div>
          ) : (
            <div className="h-80 rounded-lg relative">
              <MapaContacto />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactoPage; 