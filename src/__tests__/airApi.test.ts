import { GET } from '@/app/api/air/route';

const mockFetch = jest.fn(async () => ({
  json: async () => ({
    results: [
      {
        measurements: [{ parameter: 'pm25', value: 12.3 }],
      },
    ],
  }),
})) as jest.Mock;

describe('API /api/air', () => {
  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns pm25 for known location', async () => {
    const res = await GET(new Request('http://localhost/api/air?location=Ennis'));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.pm25).toBe(12.3);
  });

  it('fails gracefully on missing param', async () => {
    const res = await GET(new Request('http://localhost/api/air'));
    expect(res.status).toBe(400);
  });
});
