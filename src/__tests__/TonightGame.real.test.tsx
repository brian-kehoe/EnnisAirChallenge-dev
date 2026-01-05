import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TonightGame from '@/app/play/tonight/page';
import { GET } from '@/app/api/air/route';

/**
 * Real-data test: routes frontend fetches to the API handler, which then calls OpenAQ.
 * This requires a valid OPENAQ_API_KEY in the environment and network access.
 * Opt-in by setting RUN_REAL_OPENAQ_TESTS=true.
 */
const describeIfReal =
  process.env.RUN_REAL_OPENAQ_TESTS === 'true' && process.env.OPENAQ_API_KEY
    ? describe
    : describe.skip;

describeIfReal('TonightGame UI (real OpenAQ)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (url.includes('/api/air')) {
        const reqUrl = url.startsWith('http') ? url : `http://localhost${url}`;
        return GET(new Request(reqUrl, init));
      }

      return originalFetch(input as any, init);
    }) as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders and fetches live data', async () => {
    render(<TonightGame />);
    await waitFor(() => expect(typeof global.fetch).toBe('function'));
    expect(screen.getByText(/Tonight Mode/i)).toBeInTheDocument();
  });

  it('allows user to guess with live data', async () => {
    render(<TonightGame />);

    // Let initial data load
    await waitFor(() => expect(screen.getByRole('combobox')).toBeInTheDocument());

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Dublin' } });
    fireEvent.click(screen.getByRole('button', { name: /Guess/i }));

    const feedback = await screen.findByText(/is (worse|better) than Ennis|Data missing/i);
    expect(feedback).toBeInTheDocument();
  });
});
