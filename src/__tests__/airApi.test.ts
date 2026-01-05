import { GET } from '@/app/api/air/route';

describe('API /api/air (mocked upstream)', () => {
  const mockFetch = jest.fn() as jest.Mock;

  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        results: [
          {
            measurements: [{ parameter: 'pm25', value: 12.3 }],
          },
        ],
      }),
    });

    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('uses coordinates for known towns and returns pm25', async () => {
    const res = await GET(new Request('http://localhost/api/air?location=Ennis'));
    const json = await res.json();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('coordinates=52.8436%2C-8.9863'),
      expect.any(Object),
    );
    expect(res.status).toBe(200);
    expect(json.pm25).toBe(12.3);
  });

  it('returns upstream status when fetch is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => ({}),
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
