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
