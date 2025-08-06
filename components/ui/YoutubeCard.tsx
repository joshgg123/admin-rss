import React from 'react';
import { YoutubeCardData } from '../../types/youtubeCard'; // Ruta a tu tipo

interface YoutubeCardProps {
  card: YoutubeCardData;
}

export const YoutubeCard: React.FC<YoutubeCardProps> = ({ card }) => {
  const handleClick = () => {
    window.open(card.link, '_blank'); // Abrir en una nueva pestaña
  };

  return (
    <div
      className="youtube-card" // Aplica tus estilos CSS aquí
      style={{
        width: '280px',
        marginRight: '15px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'inline-block',
        verticalAlign: 'top',
        flexShrink: 0, // Evita que las tarjetas se encojan
      }}
      onClick={handleClick}
    >
      <img
        src={card.imageUrl}
        alt={card.title}
        className="youtube-image" // Aplica tus estilos CSS aquí
        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
      />
      <div
        className="youtube-text-container" // Aplica tus estilos CSS aquí
        style={{ padding: '10px' }}
      >
        <h3
          className="youtube-title" // Aplica tus estilos CSS aquí
          style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '5px', lineHeight: '1.4em' }}
        >
          {card.title}
        </h3>
        <p
          className="youtube-link-text" // Aplica tus estilos CSS aquí
          style={{ fontSize: '0.85em', color: '#007AFF' }}
        >
          Ver en YouTube
        </p>
      </div>
    </div>
  );
};