import React from 'react';
import { CarouselData, CardData, YoutubeCardData, NewsletterCardData } from '../../types/carrusel';
import { YoutubeCard } from './YoutubeCard';
import { NewsletterCard } from './NewsletterCard';

interface CarouselContainerProps {
  carousel: CarouselData;
  onNewsletterCardClick?: (card: NewsletterCardData) => void;
}

export const CarouselContainer: React.FC<CarouselContainerProps> = ({ carousel, onNewsletterCardClick }) => {
  return (
    <div
      className="carousel-container-wrapper"
      style={{ marginBottom: '40px' }}
    >
      <h2
        className="carousel-title"
        style={{ fontSize: '1.8em', fontWeight: 'bold', marginBottom: '20px', marginLeft: '20px', color: '#333' }}
      >
        {carousel.title}
      </h2>
      <div
        className="carousel-cards-container"
        style={{
          display: 'flex',
          overflowX: 'scroll',
          paddingLeft: '20px',
          paddingBottom: '15px',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .carousel-cards-container::-webkit-scrollbar {
            display: none;
          }
        `}} />

        {carousel.cards.map((card: CardData) => {
          if (card.type === 'youtube') {
            const youtubeCard = card as YoutubeCardData;
            return <YoutubeCard key={youtubeCard.id} card={youtubeCard} />;
          } else if (card.type === 'newsletter') {
            const newsletterCard = card as NewsletterCardData;
            return (
              <NewsletterCard
                key={newsletterCard.id}
                card={newsletterCard}
                onClick={() => onNewsletterCardClick && onNewsletterCardClick(newsletterCard)}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};