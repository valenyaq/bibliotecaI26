import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#a2822b] to-[#8a6d23] text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <FaBook className="h-8 w-8 mr-2 text-yellow-200" />
              <span className="text-xl font-bold">Biblioteca ISFDyT 26</span>
            </div>
            <p className="text-gray-200 text-sm mb-4">
              Tu acceso a una amplia colección de libros digitales para leer en cualquier momento y lugar.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300">
                <FaGithub className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300">
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-yellow-200">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition duration-300 flex items-center">
                  <span className="border-b border-transparent hover:border-white">Inicio</span>
                </Link>
              </li>
              <li>
                <Link to="/libros" className="text-gray-300 hover:text-white transition duration-300 flex items-center">
                  <span className="border-b border-transparent hover:border-white">Explorar Libros</span>
                </Link>
              </li>
              <li>
                <Link to="/acerca" className="text-gray-300 hover:text-white transition duration-300 flex items-center">
                  <span className="border-b border-transparent hover:border-white">Acerca de la Institución</span>
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 hover:text-white transition duration-300 flex items-center">
                  <span className="border-b border-transparent hover:border-white">Contacto</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition duration-300 flex items-center">
                  <span className="border-b border-transparent hover:border-white">Preguntas Frecuentes</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-yellow-200">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MdLocationOn className="h-5 w-5 mr-2 text-yellow-200" />
                <span className="text-gray-300">Buenos Aires, Argentina</span>
              </li>
              <li className="flex items-center">
                <MdPhone className="h-5 w-5 mr-2 text-yellow-200" />
                <span className="text-gray-300">+54 11 1234-5678</span>
              </li>
              <li className="flex items-center">
                <MdEmail className="h-5 w-5 mr-2 text-yellow-200" />
                <a href="mailto:contacto@bibliotecavirtual.com" className="text-gray-300 hover:text-white transition duration-300">
                  contacto@bibliotecavirtual.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-[#c09e41] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Biblioteca ISFDyT 26. Todos los derechos reservados.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <Link to="/terminos" className="text-sm text-gray-400 hover:text-white transition duration-300">
                    Términos de servicio
                  </Link>
                </li>
                <li>
                  <Link to="/privacidad" className="text-sm text-gray-400 hover:text-white transition duration-300">
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link to="/ayuda" className="text-sm text-gray-400 hover:text-white transition duration-300">
                    Ayuda
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 