import React from 'react';

const PanoramaViewer = () => {
  return (
    <div style={{ width: '100%', height: '600px' }}>
    <iframe
      title="Tour Virtual Lapentor"
      src="https://app.lapentor.com/sphere/merkahorro?scene=67b3721363f95054550e07ea" // Reemplaza con el enlace de tu tour
      width="100%"
      height="100%"
      frameBorder="0"
      allowFullScreen
    ></iframe>
  </div>
  );
};

export { PanoramaViewer };
