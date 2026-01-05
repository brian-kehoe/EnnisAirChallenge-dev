'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
  region: 'ireland' | 'uk' | 'europe' | 'world';
}

const locations: LocationData[] = [
  // Ireland
  { name: 'Dublin', lat: 53.35, lon: -6.26, country: 'Ireland', region: 'ireland' },
  { name: 'Cork', lat: 51.90, lon: -8.48, country: 'Ireland', region: 'ireland' },
  { name: 'Galway', lat: 53.27, lon: -9.06, country: 'Ireland', region: 'ireland' },
  { name: 'Limerick', lat: 52.66, lon: -8.63, country: 'Ireland', region: 'ireland' },
  { name: 'Waterford', lat: 52.26, lon: -7.11, country: 'Ireland', region: 'ireland' },
  { name: 'Kilkenny', lat: 52.65, lon: -7.25, country: 'Ireland', region: 'ireland' },
  // UK
  { name: 'London', lat: 51.51, lon: -0.13, country: 'UK', region: 'uk' },
  { name: 'Manchester', lat: 53.48, lon: -2.24, country: 'UK', region: 'uk' },
  { name: 'Birmingham', lat: 52.49, lon: -1.89, country: 'UK', region: 'uk' },
  { name: 'Edinburgh', lat: 55.95, lon: -3.19, country: 'UK', region: 'uk' },
  { name: 'Glasgow', lat: 55.86, lon: -4.25, country: 'UK', region: 'uk' },
  { name: 'Belfast', lat: 54.60, lon: -5.93, country: 'UK', region: 'uk' },
  // Europe
  { name: 'Paris', lat: 48.86, lon: 2.35, country: 'France', region: 'europe' },
  { name: 'Berlin', lat: 52.52, lon: 13.41, country: 'Germany', region: 'europe' },
  { name: 'Madrid', lat: 40.42, lon: -3.70, country: 'Spain', region: 'europe' },
  { name: 'Rome', lat: 41.90, lon: 12.50, country: 'Italy', region: 'europe' },
  { name: 'Amsterdam', lat: 52.37, lon: 4.90, country: 'Netherlands', region: 'europe' },
  { name: 'Brussels', lat: 50.85, lon: 4.35, country: 'Belgium', region: 'europe' },
  { name: 'Vienna', lat: 48.21, lon: 16.37, country: 'Austria', region: 'europe' },
  { name: 'Prague', lat: 50.08, lon: 14.44, country: 'Czechia', region: 'europe' },
  { name: 'Warsaw', lat: 52.23, lon: 21.01, country: 'Poland', region: 'europe' },
  { name: 'Copenhagen', lat: 55.68, lon: 12.57, country: 'Denmark', region: 'europe' },
  // World
  { name: 'New York', lat: 40.71, lon: -74.01, country: 'USA', region: 'world' },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24, country: 'USA', region: 'world' },
  { name: 'Tokyo', lat: 35.68, lon: 139.69, country: 'Japan', region: 'world' },
  { name: 'Beijing', lat: 39.90, lon: 116.41, country: 'China', region: 'world' },
  { name: 'Delhi', lat: 28.61, lon: 77.21, country: 'India', region: 'world' },
  { name: 'Sydney', lat: -33.87, lon: 151.21, country: 'Australia', region: 'world' },
  { name: 'São Paulo', lat: -23.55, lon: -46.63, country: 'Brazil', region: 'world' },
  { name: 'Cairo', lat: 30.04, lon: 31.24, country: 'Egypt', region: 'world' },
];

type Region = 'ireland' | 'uk' | 'europe' | 'world';

interface GuessResult {
  location: string;
  pm25: number | null;
  isWorse: boolean | null;
}

function getAirQualityColor(pm25: number | null): string {
  if (pm25 === null) return 'bg-slate-600';
  if (pm25 <= 12) return 'bg-emerald-500';
  if (pm25 <= 35) return 'bg-yellow-500';
  if (pm25 <= 55) return 'bg-orange-500';
  if (pm25 <= 150) return 'bg-red-500';
  return 'bg-purple-600';
}

function getAirQualityLabel(pm25: number | null): string {
  if (pm25 === null) return 'No data';
  if (pm25 <= 12) return 'Good';
  if (pm25 <= 35) return 'Moderate';
  if (pm25 <= 55) return 'Unhealthy for Sensitive';
  if (pm25 <= 150) return 'Unhealthy';
  return 'Very Unhealthy';
}

function MapPin({ 
  location, 
  onClick, 
  disabled, 
  guessed,
  wasWorse 
}: { 
  location: LocationData;
  onClick: () => void;
  disabled: boolean;
  guessed: boolean;
  wasWorse: boolean | null;
}) {
  const baseClass = "absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300 group";
  const stateClass = guessed 
    ? wasWorse 
      ? 'opacity-100 scale-110' 
      : 'opacity-50 scale-90'
    : disabled 
      ? 'opacity-30 cursor-not-allowed' 
      : 'hover:scale-125 hover:z-10';

  // Position calculation based on region - these would be more precise with a real map
  const getPosition = (loc: LocationData) => {
    // Normalize to percentage positions on the map container
    // This is a simplified projection for demonstration
    switch (loc.region) {
      case 'ireland':
        return {
          left: `${50 + (loc.lon + 9) * 8}%`,
          top: `${50 - (loc.lat - 53) * 15}%`
        };
      case 'uk':
        return {
          left: `${50 + (loc.lon + 5) * 5}%`,
          top: `${50 - (loc.lat - 54) * 8}%`
        };
      case 'europe':
        return {
          left: `${50 + (loc.lon) * 2}%`,
          top: `${50 - (loc.lat - 50) * 4}%`
        };
      default:
        return {
          left: `${50 + (loc.lon) * 0.3}%`,
          top: `${50 - (loc.lat) * 0.8}%`
        };
    }
  };

  const pos = getPosition(location);

  return (
    <button
      onClick={onClick}
      disabled={disabled || guessed}
      className={`${baseClass} ${stateClass}`}
      style={{ left: pos.left, top: pos.top }}
    >
      <div className={`relative ${guessed && wasWorse ? 'animate-bounce-once' : ''}`}>
        <svg 
          className={`w-8 h-8 drop-shadow-lg ${
            guessed 
              ? wasWorse 
                ? 'text-red-500' 
                : 'text-slate-500'
              : 'text-amber-400 group-hover:text-amber-300'
          }`}
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-slate-800 px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-xl border border-slate-700">
            <p className="font-semibold text-white">{location.name}</p>
            <p className="text-xs text-slate-400">{location.country}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

function RegionSelector({ 
  currentRegion, 
  onSelect, 
  unlockedRegions 
}: { 
  currentRegion: Region;
  onSelect: (region: Region) => void;
  unlockedRegions: Region[];
}) {
  const regions: { id: Region; label: string; icon: string }[] = [
    { id: 'ireland', label: 'Ireland', icon: '🇮🇪' },
    { id: 'uk', label: 'UK', icon: '🇬🇧' },
    { id: 'europe', label: 'Europe', icon: '🇪🇺' },
    { id: 'world', label: 'World', icon: '🌍' },
  ];

  return (
    <div className="flex gap-2 justify-center">
      {regions.map((region) => {
        const isUnlocked = unlockedRegions.includes(region.id);
        const isCurrent = currentRegion === region.id;
        
        return (
          <button
            key={region.id}
            onClick={() => isUnlocked && onSelect(region.id)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              isCurrent 
                ? 'bg-amber-500 text-slate-900' 
                : isUnlocked
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
            }`}
            disabled={!isUnlocked}
          >
            <span className="mr-1">{region.icon}</span>
            {region.label}
            {!isUnlocked && <span className="ml-1">🔒</span>}
          </button>
        );
      })}
    </div>
  );
}

function ResultCard({ result, ennisPm25 }: { result: GuessResult; ennisPm25: number | null }) {
  return (
    <div className={`p-4 rounded-xl border ${
      result.isWorse 
        ? 'bg-red-500/10 border-red-500/30' 
        : result.isWorse === false
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-slate-700/50 border-slate-600'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-white">{result.location}</p>
          <p className={`text-sm ${
            result.isWorse 
              ? 'text-red-400' 
              : result.isWorse === false
                ? 'text-emerald-400'
                : 'text-slate-400'
          }`}>
            {result.pm25 !== null 
              ? `${result.pm25.toFixed(1)} µg/m³`
              : 'No data available'}
          </p>
        </div>
        <div className={`text-2xl ${
          result.isWorse 
            ? 'text-red-400' 
            : result.isWorse === false
              ? 'text-emerald-400'
              : 'text-slate-500'
        }`}>
          {result.isWorse 
            ? '💨' 
            : result.isWorse === false
              ? '✓'
              : '?'}
        </div>
      </div>
    </div>
  );
}

export default function TonightGame() {
  const [ennisPm25, setEnnisPm25] = useState<number | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region>('ireland');
  const [unlockedRegions, setUnlockedRegions] = useState<Region[]>(['ireland']);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [latestGuess, setLatestGuess] = useState<GuessResult | null>(null);
  const maxGuesses = 6;

  useEffect(() => {
    const fetchEnnis = async () => {
      try {
        const res = await fetch('/api/air?location=Ennis');
        const json = await res.json();
        setEnnisPm25(json.pm25);
      } catch {
        // Demo mode with mock data
        setEnnisPm25(45);
      }
    };
    fetchEnnis();
  }, []);

  const handleGuess = useCallback(async (location: LocationData) => {
    if (isLoading || guesses.length >= maxGuesses) return;
    
    setIsLoading(true);
    
    try {
      const res = await fetch(`/api/air?location=${encodeURIComponent(location.name)}`);
      const json = await res.json();
      
      const pm25 = json.pm25;
      const isWorse = pm25 !== null && ennisPm25 !== null ? pm25 > ennisPm25 : null;
      
      const newResult: GuessResult = {
        location: location.name,
        pm25,
        isWorse,
      };

      setGuesses(prev => [...prev, newResult]);
      setLatestGuess(newResult);

      // Auto-clear latest guess notification after 3 seconds
      setTimeout(() => setLatestGuess(null), 3000);

      if (isWorse) {
        setScore(prev => prev + 1);
        // Unlock next region after finding a worse city
        const regionOrder: Region[] = ['ireland', 'uk', 'europe', 'world'];
        const currentIndex = regionOrder.indexOf(currentRegion);
        if (currentIndex < regionOrder.length - 1) {
          const nextRegion = regionOrder[currentIndex + 1];
          if (!unlockedRegions.includes(nextRegion)) {
            setUnlockedRegions(prev => [...prev, nextRegion]);
          }
        }
      }

      if (guesses.length + 1 >= maxGuesses) {
        setGameComplete(true);
      }

      // Scroll to results on mobile after a short delay
      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, guesses.length, ennisPm25, currentRegion, unlockedRegions]);

  const resetGame = () => {
    setGuesses([]);
    setScore(0);
    setGameComplete(false);
    setCurrentRegion('ireland');
    setUnlockedRegions(['ireland']);
  };

  const filteredLocations = locations.filter(l => l.region === currentRegion);
  const guessedNames = guesses.map(g => g.location);

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-lg text-white">
            <span className="text-amber-400">ENNIS</span> AIR
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              Guesses: <span className="text-white font-bold">{guesses.length}/{maxGuesses}</span>
            </div>
            <div className="text-sm text-slate-400">
              Score: <span className="text-amber-400 font-bold">{score}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Tonight's Challenge
            </h1>
            <p className="text-slate-400 mb-4">
              Find cities with worse air than Ennis tonight
            </p>
            
            {/* Ennis current reading */}
            <div className="inline-flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-3">
              <div className={`w-4 h-4 rounded-full ${getAirQualityColor(ennisPm25)}`}></div>
              <div>
                <p className="text-sm text-slate-400">Ennis right now</p>
                <p className="text-2xl font-bold text-white">
                  {ennisPm25 !== null ? `${ennisPm25.toFixed(1)} µg/m³` : 'Loading...'}
                </p>
              </div>
            </div>
          </div>

          {/* Region selector */}
          <div className="mb-8">
            <RegionSelector 
              currentRegion={currentRegion}
              onSelect={setCurrentRegion}
              unlockedRegions={unlockedRegions}
            />
          </div>

          {/* Map area */}
          <div className="relative bg-slate-800/30 border border-slate-700 rounded-2xl aspect-[16/10] overflow-hidden mb-8">
            {/* Map background with gradient and geographic features */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-800/50 to-slate-900">
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}></div>

              {/* Simple region indicators based on current view */}
              {currentRegion === 'ireland' && (
                <div className="absolute left-[48%] top-[45%] w-16 h-24 border-2 border-emerald-500/30 rounded-full blur-sm"></div>
              )}
              {currentRegion === 'uk' && (
                <div className="absolute left-[45%] top-[40%] w-32 h-40 border-2 border-blue-500/30 rounded-lg blur-sm"></div>
              )}
              {currentRegion === 'europe' && (
                <div className="absolute left-[40%] top-[35%] w-48 h-56 border-2 border-purple-500/30 rounded-xl blur-sm"></div>
              )}
              {currentRegion === 'world' && (
                <div className="absolute inset-4 border-2 border-teal-500/30 rounded-xl blur-sm"></div>
              )}
            </div>

            {/* Ennis marker (always visible) */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative">
                <div className="absolute inset-0 animate-ping bg-amber-400 rounded-full opacity-30"></div>
                <div className={`w-6 h-6 rounded-full ${getAirQualityColor(ennisPm25)} border-2 border-white shadow-lg`}></div>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-amber-500 px-2 py-0.5 rounded text-xs font-bold text-slate-900 whitespace-nowrap">
                ENNIS
              </div>
            </div>

            {/* Location pins */}
            {filteredLocations.map((location) => {
              const guessResult = guesses.find(g => g.location === location.name);
              return (
                <MapPin
                  key={location.name}
                  location={location}
                  onClick={() => handleGuess(location)}
                  disabled={isLoading || gameComplete}
                  guessed={guessedNames.includes(location.name)}
                  wasWorse={guessResult?.isWorse ?? null}
                />
              );
            })}

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-30">
                <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Toast notification for latest guess */}
          {latestGuess && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
              <div className={`px-6 py-4 rounded-xl shadow-2xl border-2 ${
                latestGuess.isWorse
                  ? 'bg-red-500/90 border-red-400 backdrop-blur-sm'
                  : latestGuess.isWorse === false
                    ? 'bg-emerald-500/90 border-emerald-400 backdrop-blur-sm'
                    : 'bg-slate-700/90 border-slate-600 backdrop-blur-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {latestGuess.isWorse ? '💨' : latestGuess.isWorse === false ? '✓' : '?'}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{latestGuess.location}</p>
                    <p className="text-white/90 text-sm">
                      {latestGuess.pm25 !== null
                        ? `${latestGuess.pm25.toFixed(1)} µg/m³ - ${latestGuess.isWorse ? 'Worse!' : 'Better than Ennis'}`
                        : 'No data available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {guesses.length > 0 && (
            <div id="results-section" className="mb-8 scroll-mt-24">
              <h3 className="text-lg font-semibold mb-4 text-slate-300">Your Guesses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {guesses.map((result, index) => (
                  <ResultCard key={index} result={result} ennisPm25={ennisPm25} />
                ))}
              </div>
            </div>
          )}

          {/* Game complete */}
          {gameComplete && (
            <div className="text-center bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
              <p className="text-slate-400 mb-4">
                You found <span className="text-amber-400 font-bold">{score}</span> cities with worse air than Ennis
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={() => {
                    // Share functionality
                    const text = `I found ${score} cities with worse air than Ennis, Ireland tonight! 💨 Can you beat that? #EnnisAirChallenge`;
                    if (navigator.share) {
                      navigator.share({ text, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(text + ' ' + window.location.href);
                    }
                  }}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
                >
                  Share Result
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          {guesses.length === 0 && !gameComplete && (
            <div className="text-center text-slate-500 text-sm">
              <p>Click on a city marker to guess if it has worse air quality than Ennis.</p>
              <p className="mt-1">Find a worse city to unlock the next region!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}