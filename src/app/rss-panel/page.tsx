'use client';

import { useEffect, useState } from 'react';
import db from '../../../lib/firebaseClient';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { XMLParser } from 'fast-xml-parser';

interface RSSItem {
  id: string;
  url: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

export default function RssPanel() {
  const [rssLinks, setRssLinks] = useState<RSSItem[]>([]);
  const [newLink, setNewLink] = useState('');
  const [loading, setLoading] = useState(false);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  const fetchLinks = async () => {
    const snapshot = await getDocs(collection(db, 'rss'));
    const items = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const id = docSnap.id;
        const url = docSnap.data().url;
        try {
          const res = await fetch(url);
          const text = await res.text();
          const json = parser.parse(text);
          const channel = json.rss?.channel || {};
          return {
            id,
            url,
            title: channel.title,
            description: channel.description,
            imageUrl: channel.image?.url || channel['itunes:image']?.href || null,
          };
        } catch  {
          console.error(`Error parseando ${url}`);
          return { id, url };
        }
      })
    );
    setRssLinks(items);
  };

  const addRssLink = async () => {
    if (!newLink.trim()) return;
    await addDoc(collection(db, 'rss'), { url: newLink.trim() });
    setNewLink('');
    fetchLinks();
  };

  const deleteRssLink = async (id: string) => {
    await deleteDoc(doc(db, 'rss', id));
    fetchLinks();
  };

  const reparseFeeds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/podcasts');
      if (!res.ok) throw new Error('Error al reparsear');
      alert('Feeds actualizados con éxito');
    } catch (e) {
      alert('Hubo un error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Podcasts RSS</h1>

      <div className="flex gap-2">
<Input
  placeholder="https://example.com/feed"
  value={newLink}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLink(e.target.value)}
/>

        <Button onClick={addRssLink}>Agregar</Button>
      </div>

      <div className="space-y-4">
        {rssLinks.map((rss) => (
          <div
            key={rss.id}
            className="flex gap-4 items-start bg-gray-100 p-4 rounded shadow"
          >
            {rss.imageUrl && (
              <img
                src={rss.imageUrl}
                alt={rss.title || 'Imagen del podcast'}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{rss.title || 'Sin título'}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">
                {rss.description || 'Sin descripción'}
              </p>
              <p className="text-xs text-blue-700 break-all mt-1">{rss.url}</p>
            </div>
            <Button onClick={() => deleteRssLink(rss.id)} className="mt-2">
              Eliminar
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button onClick={reparseFeeds} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar feeds RSS'}
        </Button>
      </div>
    </div>
  );
}
