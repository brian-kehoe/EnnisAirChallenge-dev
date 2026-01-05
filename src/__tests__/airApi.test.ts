import { GET } from '@/app/api/air/route';

describe('API /api/air (mocked upstream)', () => {
  const mockFetch = jest.fn() as jest.Mock;

  beforeEach(() => {
    // Mock responses for the two-step API call:
    // 1. /v3/locations call returns locations with sensors
    // 2. /v3/sensors/{id}/measurements call returns measurements
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/v3/locations')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            results: [
              {
                id: 123,
                name: 'Test Location',
                sensors: [
                  {
                    id: 456,
                    name: 'pm25 µg/m³',
                    parameter: { name: 'pm25', units: 'µg/m³' },
                  },
                ],
              },
            ],
          }),
        });
      } else if (url.includes('/v3/sensors/')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            results: [{ value: 12.3 }],
          }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('uses coordinates for known towns and returns pm25', async () => {
    const res = await GET(new Request('http://localhost/api/air?location=Ennis'));
    const json = await res.json();

    // Should call /v3/locations with coordinates
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('coordinates=52.8436%2C-8.9863'),
      expect.any(Object),
    );
    // Should call /v3/sensors/{id}/measurements
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/v3/sensors/456/measurements'),
      expect.any(Object),
    );
    expect(res.status).toBe(200);
    expect(json.pm25).toBe(12.3);
  });

  it('returns upstream status when fetch is not ok', async () => {
    mockFetch.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 502,
        json: async () => ({}),
      });
    });

    const res = await GET(new Request('http://localhost/api/air?location=Galway'));
    const json = await res.json();

    expect(res.status).toBe(502);
    expect(json.pm25).toBeNull();
  });

  it('fails gracefully on missing param', async () => {
    const res = await GET(new Request('http://localhost/api/air'));
    expect(res.status).toBe(400);
  });
});
