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
  content?: string; // Hacemos content opcional para el formulario
  link?: string;
}

// Discriminado union para todas las tarjetas posibles
export type CardData = YoutubeCardData | NewsletterCardData;

export interface CarouselData {
  id: string;
  title: string;
  cards: CardData[];
}

// Nuevo tipo para los datos que se guardan desde el formulario
// donde el id es opcional, ya que Firestore lo genera en la creación.
export interface CarouselSaveData {
  id?: string;
  title: string;
  cards: CardData[];
}