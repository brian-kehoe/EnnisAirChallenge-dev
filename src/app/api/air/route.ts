// src/app/api/air/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'Missing location' }, { status: 400 });
  }

  const apiKey = process.env.OPENAQ_API_KEY;
  const url = `https://api.openaq.org/v3/latest?location=${encodeURIComponent(location)}`;

  try {
    const res = await fetch(url, {
      headers: {
        'x-api-key': apiKey ?? '',
      },
    });

    const json = await res.json();
    const pm25 =
      json?.results?.[0]?.measurements?.find((m: any) => m.parameter === 'pm25')?.value ?? null;

    return NextResponse.json({ pm25 });
  } catch {
    return NextResponse.json({ pm25: null }, { status: 500 });
  }
}
