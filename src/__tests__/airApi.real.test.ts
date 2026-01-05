import { GET } from '@/app/api/air/route';

/**
 * Real-data test for the API handler. Requires RUN_REAL_OPENAQ_TESTS=true and OPENAQ_API_KEY.
 */
const describeIfReal = process.env.RUN_REAL_OPENAQ_TESTS === 'true' ? describe : describe.skip;

describeIfReal('API /api/air (real OpenAQ)', () => {
  beforeAll(() => {
    // jsdom lacks this; undici expects it when reporting timings.
    (global.performance as any).markResourceTiming = (global.performance as any).markResourceTiming ?? (() => {});
  });

  it('returns a pm25 payload for a known location', async () => {
    const res = await GET(new Request('http://localhost/api/air?location=Dublin'));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty('pm25');
  });
});
