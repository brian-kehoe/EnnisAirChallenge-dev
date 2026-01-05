'use client';
import { useState } from 'react';
import Link from 'next/link';

// Mock historical data - would come from API in production
const historicalData = {
  lastYear: [
    { date: '2024-12-28', pm25: 89, time: '21:00', conditions: 'Cold, calm winds' },
    { date: '2024-12-15', pm25: 76, time: '20:00', conditions: 'Very cold, no wind' },
    { date: '2025-01-02', pm25: 72, time: '22:00', conditions: 'Frost, calm' },
    { date: '2024-11-30', pm25: 68, time: '19:00', conditions: 'Cold evening' },
    { date: '2024-12-22', pm25: 65, time: '21:30', conditions: 'Christmas period' },
    { date: '2024-12-08', pm25: 62, time: '20:30', conditions: 'Weekend evening' },
    { date: '2024-11-15', pm25: 58, time: '19:30', conditions: 'Early winter' },
    { date: '2024-12-01', pm25: 55, time: '21:00', conditions: 'December start' },
    { date: '2024-11-22', pm25: 52, time: '20:00', conditions: 'Cold snap' },
    { date: '2025-01-04', pm25: 48, time: '19:00', conditions: 'New Year period' },
  ],
  monthlyAverages: [
    { month: 'Jan 2024', avg: 28, max: 52 },
    { month: 'Feb 2024', avg: 22, max: 45 },
    { month: 'Mar 2024', avg: 15, max: 32 },
    { month: 'Apr 2024', avg: 10, max: 22 },
    { month: 'May 2024', avg: 8, max: 18 },
    { month: 'Jun 2024', avg: 7, max: 15 },
    { month: 'Jul 2024', avg: 6, max: 14 },
    { month: 'Aug 2024', avg: 7, max: 16 },
    { month: 'Sep 2024', avg: 12, max: 28 },
    { month: 'Oct 2024', avg: 22, max: 42 },
    { month: 'Nov 2024', avg: 35, max: 68 },
    { month: 'Dec 2024', avg: 42, max: 89 },
  ],
  comparisons: [
    { city: 'Delhi', country: 'India', winterAvg: 180, flag: '🇮🇳' },
    { city: 'Beijing', country: 'China', winterAvg: 85, flag: '🇨🇳' },
    { city: 'Ennis', country: 'Ireland', winterAvg: 42, flag: '🇮🇪', highlight: true },
    { city: 'Paris', country: 'France', winterAvg: 18, flag: '🇫🇷' },
    { city: 'Dublin', country: 'Ireland', winterAvg: 12, flag: '🇮🇪' },
    { city: 'Reykjavik', country: 'Iceland', winterAvg: 5, flag: '🇮🇸' },
  ],
};

function getAirQualityColor(pm25: number): string {
  if (pm25 <= 12) return 'from-emerald-400 to-green-500';
  if (pm25 <= 35) return 'from-yellow-400 to-amber-500';
  if (pm25 <= 55) return 'from-orange-400 to-orange-600';
  if (pm25 <= 150) return 'from-red-500 to-red-700';
  return 'from-purple-600 to-purple-900';
}

function getBarColor(pm25: number): string {
  if (pm25 <= 12) return 'bg-emerald-500';
  if (pm25 <= 35) return 'bg-yellow-500';
  if (pm25 <= 55) return 'bg-orange-500';
  if (pm25 <= 150) return 'bg-red-500';
  return 'bg-purple-600';
}

type Tab = 'highs' | 'monthly' | 'comparisons';

export default function HistoricalPage() {
  const [activeTab, setActiveTab] = useState<Tab>('highs');

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-lg text-white">
            <span className="text-amber-400">ENNIS</span> AIR
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/play/tonight" className="text-sm text-slate-400 hover:text-white transition-colors">
              Tonight
            </Link>
            <Link href="/play/historical" className="text-sm text-amber-400 font-semibold">
              Historical
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Historical Air Quality
            </h1>
            <p className="text-slate-400">
              Ennis's air quality records over the past year
            </p>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 justify-center mb-8">
            {[
              { id: 'highs' as Tab, label: 'Worst Days', icon: '📊' },
              { id: 'monthly' as Tab, label: 'Monthly Trends', icon: '📈' },
              { id: 'comparisons' as Tab, label: 'City Comparisons', icon: '🌍' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'highs' && (
            <div className="space-y-4">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-2">Hall of Shame</h2>
                <p className="text-slate-400 text-sm">
                  The 10 worst air quality readings in Ennis over the past 12 months.
                  Most occur on cold, calm winter evenings when smoke from solid fuel burning
                  accumulates in the town.
                </p>
              </div>

              {historicalData.lastYear.map((day, index) => (
                <div
                  key={day.date}
                  className="group relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-900' :
                      index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
                      index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <p className="text-slate-300 font-semibold">
                        {new Date(day.date).toLocaleDateString('en-IE', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-slate-500">
                        {day.time} • {day.conditions}
                      </p>
                    </div>

                    {/* PM2.5 badge */}
                    <div className="flex items-center gap-3">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAirQualityColor(day.pm25)} flex items-center justify-center font-bold text-xl shadow-lg`}>
                        {day.pm25}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getBarColor(day.pm25)} transition-all duration-1000`}
                      style={{ width: `${(day.pm25 / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'monthly' && (
            <div>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-2">Monthly Averages</h2>
                <p className="text-slate-400 text-sm">
                  Average PM2.5 levels by month show a clear seasonal pattern.
                  Winter months (November-February) see dramatically higher pollution
                  due to home heating with solid fuels.
                </p>
              </div>

              {/* Chart */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-end gap-2 h-64">
                  {historicalData.monthlyAverages.map((month) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center">
                      {/* Max marker */}
                      <div className="text-xs text-slate-500 mb-1">{month.max}</div>
                      
                      {/* Bar container */}
                      <div className="relative w-full h-48 flex items-end">
                        {/* Max bar (faded) */}
                        <div
                          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 ${getBarColor(month.max)} opacity-30 rounded-t`}
                          style={{ height: `${(month.max / 100) * 100}%` }}
                        ></div>
                        {/* Average bar */}
                        <div
                          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 ${getBarColor(month.avg)} rounded-t shadow-lg`}
                          style={{ height: `${(month.avg / 100) * 100}%` }}
                        ></div>
                      </div>

                      {/* Label */}
                      <div className="mt-2 text-xs text-slate-500 transform -rotate-45 origin-top-left whitespace-nowrap">
                        {month.month.slice(0, 3)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex gap-4 justify-center mt-8 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-500 rounded"></div>
                    <span className="text-slate-400">Average PM2.5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-500 opacity-30 rounded"></div>
                    <span className="text-slate-400">Peak PM2.5</span>
                  </div>
                </div>
              </div>

              {/* WHO guideline reference */}
              <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <p className="text-amber-400 font-semibold">WHO Guideline: 15 µg/m³ daily average</p>
                <p className="text-slate-400 text-sm mt-1">
                  Ennis exceeds this guideline regularly during winter months. December's average
                  of 42 µg/m³ is nearly 3x the recommended limit.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'comparisons' && (
            <div>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-2">How Does Ennis Compare?</h2>
                <p className="text-slate-400 text-sm">
                  Winter evening PM2.5 averages compared to other cities. While Ennis doesn't match
                  the chronic pollution of major Asian megacities, it regularly exceeds major
                  European capitals during winter evenings.
                </p>
              </div>

              <div className="space-y-3">
                {historicalData.comparisons.map((city) => (
                  <div
                    key={city.city}
                    className={`relative bg-slate-800/50 border rounded-xl p-4 transition-all duration-300 ${
                      city.highlight
                        ? 'border-amber-500/50 bg-amber-500/10'
                        : 'border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{city.flag}</div>
                      <div className="flex-1">
                        <p className={`font-semibold ${city.highlight ? 'text-amber-400' : 'text-slate-300'}`}>
                          {city.city}
                          {city.highlight && <span className="ml-2 text-xs bg-amber-500/30 px-2 py-0.5 rounded">ENNIS</span>}
                        </p>
                        <p className="text-sm text-slate-500">{city.country}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${city.highlight ? 'text-amber-400' : 'text-white'}`}>
                          {city.winterAvg}
                        </p>
                        <p className="text-xs text-slate-500">µg/m³ avg</p>
                      </div>
                    </div>

                    {/* Comparison bar */}
                    <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${city.highlight ? 'bg-amber-500' : getBarColor(city.winterAvg)} transition-all duration-1000`}
                        style={{ width: `${(city.winterAvg / 200) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-slate-500 text-sm">
                  Data represents typical winter evening averages (6PM-10PM) during heating season
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/play/tonight"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all"
            >
              Play Tonight's Challenge
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}