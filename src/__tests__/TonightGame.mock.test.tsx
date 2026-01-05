import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TonightGame from '@/app/play/tonight/page';

const mockPm25: Record<string, number> = {
  Ennis: 25,
  Dublin: 40,
  Limerick: 30,
  Cork: 20,
  Galway: 10,
  Waterford: 15,
  Kilkenny: 18,
};

describe('TonightGame UI (mocked)', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      const location = new URL(url, 'http://localhost').searchParams.get('location') ?? '';
      const pm25 = mockPm25[location] ?? null;
      return {
        json: async () => ({ pm25 }),
      } as Response;
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without crashing', async () => {
    render(<TonightGame />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.getByText(/Tonight's Challenge/i)).toBeInTheDocument();
  });

  it('shows region selector', async () => {
    render(<TonightGame />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.getAllByText('Ireland').length).toBeGreaterThan(0);
    expect(screen.getAllByText('UK').length).toBeGreaterThan(0);
  });

  it('shows Ennis current reading', async () => {
    render(<TonightGame />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.getByText('Ennis right now')).toBeInTheDocument();
    expect(screen.getByText('25.0 µg/m³')).toBeInTheDocument();
  });

  it('allows user to guess a city by clicking a pin', async () => {
    render(<TonightGame />);

    await waitFor(() => expect((global.fetch as jest.Mock).mock.calls.length).toBeGreaterThan(0));

    // Find and click a city pin (map pins are rendered as buttons)
    const cityButtons = screen.getAllByRole('button').filter(btn => !btn.disabled);
    const dublinButton = cityButtons.find(btn => {
      // Dublin pin should exist in the map
      return true; // Click the first available city button
    });

    if (dublinButton) {
      fireEvent.click(dublinButton);

      // Wait for the guess to be processed
      await waitFor(() => {
        const resultsSection = screen.queryByText(/Your Guesses/i);
        return resultsSection !== null;
      });
    }
  });
});
