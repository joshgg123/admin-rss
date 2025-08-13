import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import  db  from "./firebaseAdmin";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true,
});

export async function fetchAndParseRSS() {
  const snapshot = await db.collection("rssLinks").get();
  const links = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as { id: string, url: string }[];

  const parsedFeeds = await Promise.all(
    links.map(async ({ id, url }) => {
      try {
        const res = await axios.get(url);
        const json = parser.parse(res.data);

        const channel = json.rss?.channel;
        const episodes = Array.isArray(channel?.item) ? channel.item : [channel?.item];

        interface Episode {
          title: string;
          audioUrl: string;
          pubDate: string;
          description: string;
        }

        interface ParsedFeed {
          id: string;
          title: string;
          description: string;
          thumbnail: string;
          author: string;
          episodes: Episode[];
        }

                return {
                  id,
                  title: channel?.title || "Sin título",
                  description: channel?.description || "",
                  thumbnail: channel?.["itunes:image"]?.["@_href"] || "",
                  author: channel?.["itunes:author"] || "",
                  episodes: episodes.map((ep: any): Episode => ({
                    title: ep.title,
                    audioUrl: ep.enclosure?.["@_url"] || "",
                    pubDate: ep.pubDate,
                    description: ep.description,
                  })),
                } as ParsedFeed;
      } catch (error) {
        console.error(`Error parsing RSS (${url}):`, error);
        return null;
      }
    })
  );

  // Filtramos feeds válidos
  return parsedFeeds.filter(Boolean);
}
