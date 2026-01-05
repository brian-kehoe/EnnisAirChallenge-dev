'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Mock historic data - replace with real API data
const historicHighs = [
  { date: '2024-12-28', pm25: 89, rank: 1 },
  { date: '2024-12-15', pm25: 76, rank: 2 },
  { date: '2025-01-02', pm25: 72, rank: 3 },
  { date: '2024-11-30', pm25: 68, rank: 4 },
  { date: '2024-12-22', pm25: 65, rank: 5 },
];

function AirQualityBadge({ pm25, size = 'normal' }: { pm25: number | null; size?: 'normal' | 'large' }) {
  const getLevel = (val: number) => {
    if (val <= 12) return { label: 'Good', color: 'from-emerald-400 to-green-500', textColor: 'text-emerald-300' };
    if (val <= 35) return { label: 'Moderate', color: 'from-yellow-400 to-amber-500', textColor: 'text-yellow-300' };
    if (val <= 55) return { label: 'Unhealthy for Sensitive', color: 'from-orange-400 to-orange-600', textColor: 'text-orange-300' };
    if (val <= 150) return { label: 'Unhealthy', color: 'from-red-500 to-red-700', textColor: 'text-red-400' };
    return { label: 'Very Unhealthy', color: 'from-purple-600 to-purple-900', textColor: 'text-purple-400' };
  };

  if (pm25 === null) return null;
  const level = getLevel(pm25);
  const sizeClasses = size === 'large' ? 'w-32 h-32 text-4xl' : 'w-16 h-16 text-lg';

  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center font-bold shadow-lg shadow-black/30`}>
      {pm25.toFixed(0)}
    </div>
  );
}

function HeroSection({ currentPm25, isAlertActive }: { currentPm25: number | null; isAlertActive: boolean }) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Animated smoke background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="smoke-layer smoke-1"></div>
          <div className="smoke-layer smoke-2"></div>
          <div className="smoke-layer smoke-3"></div>
        </div>
      </div>
      
      {/* Alert overlay when air is bad */}
      {isAlertActive && (
        <div className="absolute inset-0 bg-red-900/20 animate-pulse-slow pointer-events-none"></div>
      )}

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Air Quality Awareness
          </span>
        </div>
        
        <h1 className="font-display text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-red-400">
            ENNIS
          </span>
          <br />
          <span className="text-4xl md:text-5xl font-light text-slate-300">AIR CHALLENGE</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-8 font-light max-w-2xl mx-auto">
          Can you find a city with worse air than a small Irish town?
          <br />
          <span className="text-slate-500 text-lg">You might be surprised.</span>
        </p>

        {currentPm25 !== null && (
          <div className="mb-10 flex flex-col items-center">
            <p className="text-sm uppercase tracking-widest text-slate-500 mb-3">Ennis Right Now</p>
            <AirQualityBadge pm25={currentPm25} size="large" />
            <p className="text-slate-400 mt-2">PM2.5 µg/m³</p>
            {isAlertActive && (
              <div className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg animate-pulse">
                <span className="text-red-400 font-semibold">⚠️ Poor Air Quality Alert</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/play/tonight" 
            className={`group relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              isAlertActive 
                ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg shadow-red-500/30' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isAlertActive && <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>}
              Play Tonight&apos;s Challenge
            </span>
          </Link>
          <Link 
            href="/play/historical" 
            className="px-8 py-4 bg-slate-800/50 border border-slate-700 rounded-xl font-semibold text-lg text-slate-300 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300"
          >
            View Historic Data
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

function HistoricHighsSection() {
  return (
    <section className="py-20 px-4 bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Shame</span>
          </h2>
          <p className="text-slate-400 text-lg">Ennis&apos;s worst air quality days this winter</p>
        </div>

        <div className="space-y-4">
          {historicHighs.map((day, index) => (
            <div 
              key={day.date}
              className="group relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-900' :
                  index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {day.rank}
                </div>
                
                <div className="flex-1">
                  <p className="text-slate-300 font-semibold">
                    {new Date(day.date).toLocaleDateString('en-IE', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <AirQualityBadge pm25={day.pm25} />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{day.pm25}</p>
                    <p className="text-xs text-slate-500">µg/m³</p>
                  </div>
                </div>
              </div>
              
              {/* Progress bar showing relative severity */}
              <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-1000"
                  style={{ width: `${(day.pm25 / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/play/historical"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            Explore all historical data
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function InfoSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900/50 to-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Why Ennis?</h3>
            <p className="text-slate-400">
              Ennis, Co. Clare regularly experiences poor winter air quality due to residential solid fuel burning. 
              On some nights, this small Irish town has worse air than major European capitals.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
            <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">PM2.5 Explained</h3>
            <p className="text-slate-400">
              PM2.5 are fine particles that penetrate deep into lungs and bloodstream. WHO guidelines recommend 
              staying below 15 µg/m³ daily average. Ennis regularly exceeds 50+ on winter evenings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [currentPm25, setCurrentPm25] = useState<number | null>(null);
  const [isAlertActive, setIsAlertActive] = useState(false);

  useEffect(() => {
    const fetchEnnis = async () => {
      try {
        const res = await fetch('/api/air?location=Ennis');
        const json = await res.json();
        if (json.pm25 !== null) {
          setCurrentPm25(json.pm25);
          setIsAlertActive(json.pm25 > 35);
        }
      } catch {
        // Fail silently, show without live data
      }
    };
    fetchEnnis();
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-lg text-white">
            <span className="text-amber-400">ENNIS</span> AIR
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/play/tonight" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              {isAlertActive && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
              Tonight
            </Link>
            <Link href="/play/historical" className="text-sm text-slate-400 hover:text-white transition-colors">
              Historical
            </Link>
            <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
              About
            </Link>
          </div>
        </div>
      </nav>

      <HeroSection currentPm25={currentPm25} isAlertActive={isAlertActive} />
      <HistoricHighsSection />
      <InfoSection />

      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center text-sm text-slate-500">
          <p>Data sourced from EPA Ireland, EEA, and OpenAQ</p>
          <p className="mt-2">Built to raise awareness about local air quality</p>
        </div>
      </footer>
    </main>
  );
}