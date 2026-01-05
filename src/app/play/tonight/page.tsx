'use client';
import { useState, useEffect } from 'react';

const towns = ['Ennis', 'Dublin', 'Limerick', 'Cork', 'Galway'];

export default function TonightGame() {
  const [data, setData] = useState<Record<string, number | null>>({});
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const maxGuesses = 5;

  useEffect(() => {
    const fetchData = async () => {
      const results: Record<string, number | null> = {};
      for (const town of towns) {
        try {
          const res = await fetch(`/api/air?location=${encodeURIComponent(town)}`);
          const json = await res.json();
          results[town] = json.pm25 ?? null;
        } catch {
          results[town] = null;
        }
      }
      setData(results);
    };
    fetchData();
  }, []);

  const handleGuess = () => {
    if (!guess || guesses.includes(guess)) return;

    const ennis = data['Ennis'];
    const chosen = data[guess];

    if (ennis == null || chosen == null) {
      setFeedback('Data missing for this comparison.');
    } else if (chosen > ennis) {
      setFeedback(`${guess} is worse than Ennis!`);
    } else {
      setFeedback(`${guess} is better than Ennis.`);
    }

    setGuesses([...guesses, guess]);
    setGuess('');
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tonight Mode</h1>
      <p className="mb-4">Can you find a town with worse air than Ennis tonight?</p>

      <select
        className="p-2 border rounded"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      >
        <option value="">Choose a town</option>
        {towns.map((t) => (
          <option key={t} value={t} disabled={guesses.includes(t)}>
            {t}
          </option>
        ))}
      </select>

      <button
        onClick={handleGuess}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-40"
        disabled={!guess || guesses.length >= maxGuesses}
      >
        Guess
      </button>

      {feedback && <p className="mt-4 text-lg">{feedback}</p>}

      {guesses.length >= maxGuesses && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Game Over</h2>
          <p>Tonight's PM2.5 scores:</p>
          <ul className="mt-2 space-y-1">
            {Object.entries(data).map(([town, val]) => (
              <li key={town}>
                {town}: {val !== null ? `${val} ug/m3` : 'No data'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
