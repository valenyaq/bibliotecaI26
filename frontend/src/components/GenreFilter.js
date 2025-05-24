import React from 'react';

const GenreFilter = ({ genres, selectedGenre, onSelectGenre }) => {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Filtrar por Género</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectGenre(null)}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedGenre === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos
        </button>
        
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onSelectGenre(genre.id)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedGenre === genre.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {genre.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter; 