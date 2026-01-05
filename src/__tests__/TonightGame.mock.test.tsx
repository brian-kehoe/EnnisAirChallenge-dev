import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TonightGame from '@/app/play/tonight/page';

const mockPm25: Record<string, number> = {
  Ennis: 25,
  Dublin: 40,
  Limerick: 30,
  Cork: 20,
  Galway: 10,
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
    expect(screen.getByText(/Tonight Mode/i)).toBeInTheDocument();
  });

  it('shows town options', async () => {
    render(<TonightGame />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.getByText('Choose a town')).toBeInTheDocument();
    expect(screen.getAllByRole('option', { name: /Ennis/i })).toHaveLength(1);
  });

  it('allows user to guess a town', async () => {
    render(<TonightGame />);

    await waitFor(() => expect((global.fetch as jest.Mock).mock.calls.length).toBeGreaterThan(0));

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Dublin' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));

    expect(await screen.findByText(/is (worse|better) than Ennis/)).toBeInTheDocument();
  });
});
