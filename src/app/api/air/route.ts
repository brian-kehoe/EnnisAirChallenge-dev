// src/app/api/air/route.ts
import { NextResponse } from 'next/server';

const TOWN_COORDINATES: Record<string, { lat: number; lon: number }> = {
  // Ireland
  Ennis: { lat: 52.8436, lon: -8.9863 },
  Dublin: { lat: 53.3498, lon: -6.2603 },
  Limerick: { lat: 52.6638, lon: -8.6267 },
  Cork: { lat: 51.8985, lon: -8.4756 },
  Galway: { lat: 53.2707, lon: -9.0568 },
  Waterford: { lat: 52.2593, lon: -7.1101 },
  Kilkenny: { lat: 52.6541, lon: -7.2448 },
  // UK
  London: { lat: 51.5074, lon: -0.1278 },
  Manchester: { lat: 53.4808, lon: -2.2426 },
  Birmingham: { lat: 52.4862, lon: -1.8904 },
  Edinburgh: { lat: 55.9533, lon: -3.1883 },
  Glasgow: { lat: 55.8642, lon: -4.2518 },
  Belfast: { lat: 54.5973, lon: -5.9301 },
  // Europe
  Paris: { lat: 48.8566, lon: 2.3522 },
  Berlin: { lat: 52.52, lon: 13.405 },
  Madrid: { lat: 40.4168, lon: -3.7038 },
  Rome: { lat: 41.9028, lon: 12.4964 },
  Amsterdam: { lat: 52.3676, lon: 4.9041 },
  Brussels: { lat: 50.8503, lon: 4.3517 },
  Vienna: { lat: 48.2082, lon: 16.3738 },
  Prague: { lat: 50.0755, lon: 14.4378 },
  Warsaw: { lat: 52.2297, lon: 21.0122 },
  Copenhagen: { lat: 55.6761, lon: 12.5683 },
  // World
  'New York': { lat: 40.7128, lon: -74.006 },
  'Los Angeles': { lat: 34.0522, lon: -118.2437 },
  Tokyo: { lat: 35.6762, lon: 139.6503 },
  Beijing: { lat: 39.9042, lon: 116.4074 },
  Delhi: { lat: 28.6139, lon: 77.209 },
  Sydney: { lat: -33.8688, lon: 151.2093 },
  'São Paulo': { lat: -23.5505, lon: -46.6333 },
  Cairo: { lat: 30.0444, lon: 31.2357 },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'Missing location' }, { status: 400 });
  }

  const apiKey = process.env.OPENAQ_API_KEY;
  const coordinates = TOWN_COORDINATES[location];

  if (!coordinates) {
    return NextResponse.json({ error: 'Unknown location' }, { status: 400 });
  }

  try {
    // Step 1: Find locations with PM2.5 sensors near the coordinates
    const locationsParams = new URLSearchParams({
      coordinates: `${coordinates.lat},${coordinates.lon}`,
      radius: '25000',
      limit: '5',
      parameters_id: '2', // PM2.5 parameter ID
    });

    const locationsUrl = `https://api.openaq.org/v3/locations?${locationsParams.toString()}`;

    const locationsRes = await fetch(locationsUrl, {
      headers: {
        'x-api-key': apiKey ?? '',
      },
    });

    if (!locationsRes.ok) {
      return NextResponse.json({ pm25: null }, { status: locationsRes.status });
    }

    const locationsData = await locationsRes.json();

    if (!locationsData.results || locationsData.results.length === 0) {
      return NextResponse.json({ pm25: null }, { status: 404 });
    }

    // Step 2: Find a PM2.5 sensor from any of the returned locations
    let pm25Sensor = null;
    for (const locationResult of locationsData.results) {
      pm25Sensor = locationResult.sensors?.find(
        (sensor: { parameter?: { name?: string } }) => sensor.parameter?.name === 'pm25',
      );
      if (pm25Sensor) break;
    }

    if (!pm25Sensor) {
      return NextResponse.json({ pm25: null }, { status: 404 });
    }

    // Step 3: Get the latest measurement from this sensor with explicit ordering
    const measurementsParams = new URLSearchParams({
      limit: '1',
      order_by: 'datetime',
      sort: 'desc',
    });
    const measurementsUrl = `https://api.openaq.org/v3/sensors/${pm25Sensor.id}/measurements?${measurementsParams.toString()}`;

    const measurementsRes = await fetch(measurementsUrl, {
      headers: {
        'x-api-key': apiKey ?? '',
      },
    });

    if (!measurementsRes.ok) {
      return NextResponse.json({ pm25: null }, { status: measurementsRes.status });
    }

    const measurementsData = await measurementsRes.json();

    const pm25 = measurementsData.results?.[0]?.value ?? null;

    return NextResponse.json({ pm25 });
  } catch {
    return NextResponse.json({ pm25: null }, { status: 500 });
  }
}