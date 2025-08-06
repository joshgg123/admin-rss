import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { NewsletterCardData } from '../../types/carrusel'; // Asegúrate de que el tipo esté en un archivo accesible

interface NewsletterCardProps {
  card: NewsletterCardData;
  // El onClick debería ser más específico para el tipo de tarjeta
  onClick: (card: NewsletterCardData) => void;
}

export const NewsletterCard: React.FC<NewsletterCardProps> = ({ card, onClick }) => {
  return (
    <div
      className="newsletter-card"
      style={{
        width: '320px',
        marginRight: '15px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'inline-block',
        verticalAlign: 'top',
        flexShrink: 0,
      }}
      onClick={() => onClick(card)}
    >
      {card.imageUrl && (
        <img
          src={card.imageUrl}
          alt={card.title}
          className="newsletter-image"
          style={{ width: '100%', height: '180px', objectFit: 'cover', marginBottom: '10px' }}
        />
      )}
      <div
        className="newsletter-text-container"
        style={{ padding: '10px' }}
      >
        <h3
          className="newsletter-title"
          style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px', lineHeight: '1.4em' }}
        >
          {card.title}
        </h3>
        <div
          className="newsletter-content-preview"
          style={{
            fontSize: '0.9em',
            color: '#333',
            maxHeight: '70px',
            overflow: 'hidden',
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {card.content}
          </ReactMarkdown>
        </div>
        <p
          className="newsletter-read-more"
          style={{ fontSize: '0.8em', color: '#007AFF', marginTop: '10px', textAlign: 'right' }}
        >
          Leer más
        </p>
      </div>
    </div>
  );
};