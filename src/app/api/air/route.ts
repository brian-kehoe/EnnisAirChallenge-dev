// src/app/api/air/route.ts
import { NextResponse } from 'next/server';

const TOWN_COORDINATES: Record<string, { lat: number; lon: number }> = {
  Ennis: { lat: 52.8436, lon: -8.9863 },
  Dublin: { lat: 53.3498, lon: -6.2603 },
  Limerick: { lat: 52.6638, lon: -8.6267 },
  Cork: { lat: 51.8985, lon: -8.4756 },
  Galway: { lat: 53.2707, lon: -9.0568 },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'Missing location' }, { status: 400 });
  }

  const apiKey = process.env.OPENAQ_API_KEY;
  const coordinates = TOWN_COORDINATES[location];
  const queryParams = new URLSearchParams();

  if (coordinates) {
    queryParams.set('coordinates', `${coordinates.lat},${coordinates.lon}`);
    queryParams.set('radius', '25000');
    queryParams.set('limit', '1');
  } else {
    queryParams.set('location', location);
  }

  const url = `https://api.openaq.org/v3/latest?${queryParams.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        'x-api-key': apiKey ?? '',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ pm25: null }, { status: res.status });
    }

    const json = await res.json();
    const pm25 =
      json?.results?.[0]?.measurements?.find((m: any) => m.parameter === 'pm25')?.value ?? null;

    return NextResponse.json({ pm25 });
  } catch {
    return NextResponse.json({ pm25: null }, { status: 500 });
  }
}
