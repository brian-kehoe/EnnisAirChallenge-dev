'use client';
import Link from 'next/link';
import ModeCard from '@/components/ModeCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-10">
          <h1 className="text-4xl font-bold tracking-tight">Ennis Air Challenge</h1>
          <p className="text-lg mt-4 text-gray-600">Can you find a town with worse air than Ennis?</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModeCard
            title="Historical"
            description="Guess towns that had worse average air over a night, month or winter."
            href="/play/historical"
            color="blue"
          />
          <ModeCard
            title="Tonight"
            description="Guess towns that are currently worse than Ennis."
            href="/play/tonight"
            color="green"
          />
        </section>

        <footer className="text-center text-sm text-gray-500 mt-12">
          Data from EPA Ireland, EEA, and OpenAQ.
        </footer>
      </div>
    </main>
  );
}
