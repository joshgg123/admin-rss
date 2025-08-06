import podcast from "./podcast";
export default interface channel {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    videoCount: number;
    author: string; // Author of the channel
    podcasts: podcast[]; // Array of podcasts associated with the channel
}