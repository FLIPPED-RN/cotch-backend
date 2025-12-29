import { Injectable } from '@nestjs/common';

type Coords = { lat: number; lng: number };

@Injectable()
export class GeoService {
  async geocode(address: string): Promise<Coords | null> {
    const apikey = process.env.YMAPS_GEOCODER_KEY || process.env.YMAPS_API_KEY;

    if (!apikey) {
      console.log(
        '[GEO] ❌ No API key in env (YMAPS_GEOCODER_KEY or YMAPS_API_KEY)',
      );
      return null;
    }

    const query = address.toLowerCase().includes('калининград')
      ? address
      : `Калининград, ${address}`;

    const url =
      `https://geocode-maps.yandex.ru/1.x/` +
      `?format=json` +
      `&apikey=3f6bea6d-6cda-4baa-8e22-0d0c96202380` +
      `&geocode=${encodeURIComponent(query)}` +
      `&results=1`;

    console.log('[GEO] address:', query);
    console.log('[GEO] url:', url.replace(apikey, '***'));

    const res = await fetch(url);
    console.log('[GEO] status:', res.status);

    const text = await res.text();

    console.log('[GEO] raw:', text.slice(0, 400));

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.log('[GEO] ❌ JSON parse failed');
      return null;
    }

    const pos: string | undefined =
      data?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.Point
        ?.pos;

    if (!pos) {
      const msg =
        data?.message ||
        data?.error?.message ||
        data?.error ||
        'no featureMember/pos';
      console.log('[GEO] ❌ no pos, reason:', msg);
      return null;
    }

    const [lngStr, latStr] = pos.split(' ');
    const lng = Number(lngStr);
    const lat = Number(latStr);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      console.log('[GEO] ❌ invalid coords from pos:', pos);
      return null;
    }

    console.log('[GEO] ✅ coords:', { lat, lng });
    return { lat, lng };
  }
}
