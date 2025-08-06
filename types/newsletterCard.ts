export interface NewsletterCardData {
  type: "newsletter";
  id: string; // Un ID único para la tarjeta
  title: string;
  content: string; // Contenido en formato Markdown
  imageUrl?: string; // URL de la imagen (opcional)
}