import { NextResponse } from 'next/server';
import db from '../../../../lib/firebaseAdmin'; // Usamos el SDK de Admin
import { XMLParser } from 'fast-xml-parser';

export const GET = async () => {
  try {
    // --- 1. OBTENER FEEDS RSS ---
    // Usamos el patrón de colección del SDK de Admin
    const rssSnapshot = await db.collection('rss').get();
    const links: string[] = rssSnapshot.docs.map((doc) => doc.data().url);

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      parseAttributeValue: true,
      parseTagValue: true,
    });

    const allFeeds = [];
    for (const link of links) {
      const res = await fetch(link);
      const xml = await res.text();
      const json = parser.parse(xml);
      allFeeds.push({ url: link, feed: json });
    }

    // --- 2. OBTENER CARRUSELES DE FIREBASE ---
    // Usamos el patrón de colección del SDK de Admin
    const carouselsSnapshot = await db.collection('carousels').get();
    const allCarousels = carouselsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // --- 3. RESPUESTA COMBINADA CON CABECERAS CORS ---
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    return new NextResponse(JSON.stringify({
      feeds: allFeeds,
      carousels: allCarousels
    }), {
      status: 200,
      headers: headers,
    });

  } catch (error) {
    console.error('Error al obtener datos de la API:', error);

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    return new NextResponse(JSON.stringify({ error: 'No se pudieron obtener los datos' }), {
      status: 500,
      headers: headers,
    });
  }
};