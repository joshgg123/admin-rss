export interface YoutubeCardData {
  type: "youtube";
  id: string; // Un ID único para la tarjeta
  title: string;
  imageUrl: string; // URL de la miniatura del video
  link: string; // URL al video de YouTube
}