// 📁 MazeScriptLoader.tsx

import React, { useEffect } from 'react';

const MAZE_SNIPPET = `
(function (m, a, z, e) {
  var s, t;
  try {
    t = m.sessionStorage.getItem('maze-us');
  } catch (err) {}

  if (!t) {
    t = new Date().getTime();
    try {
      m.sessionStorage.setItem('maze-us', t);
    } catch (err) {}
  }

  s = a.createElement('script');
  s.src = z + '?apiKey=' + e;
  s.async = true;
  a.getElementsByTagName('head')[0].appendChild(s);
  m.mazeUniversalSnippetApiKey = e;
})(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'ba00b25c-959e-4e39-9344-091fc5fddd31');
`;

const MazeScriptLoader: React.FC = () => {
  useEffect(() => {
    // --- 1. Crear el elemento script ---
    const script = document.createElement('script');
    
    // --- 2. Insertar el código JavaScript inline de Maze ---
    script.text = MAZE_SNIPPET;
    
    // --- 3. Añadir el script al <head> de la página ---
    // El script original de Maze busca el <head>, así que lo hacemos igual.
    document.getElementsByTagName('head')[0].appendChild(script);

    // --- 4. Limpieza (Opcional) ---
    // Si la herramienta necesita ser detenida al cambiar de página, la eliminamos.
    return () => {
      // Intentamos eliminar el script inyectado al desmontar el componente
      document.getElementsByTagName('head')[0].removeChild(script);
    };
  }, []); 

  return null;
};

export default MazeScriptLoader;