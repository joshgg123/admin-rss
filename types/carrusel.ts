// types/carrusel.ts
export interface BaseCardData {
  id: string;
  title: string;
  imageUrl: string;
}

export interface YoutubeCardData extends BaseCardData {
  type: 'youtube';
  link: string;
}

export interface NewsletterCardData extends BaseCardData {
  type: 'newsletter';
  content: string;
  link?: string; // Optional link
}

export type CardData = YoutubeCardData | NewsletterCardData;

export interface CarouselData {
  id: string;
  title: string;
  cards: CardData[];
}

// THIS IS THE NEW TYPE
export interface CarouselSaveData {
  id?: string; // ID is optional for new carousels
  title: string;
  cards: CardData[];
}