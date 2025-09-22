/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

interface Player {
  username: string;
  title?: string;
  perfs: {
    blitz?: { rating: number };
    rapid?: { rating: number };
    classical?: { rating: number };
    bullet?: { rating: number };
  };
}

interface LeaderboardData {
  blitz: Player[];
  rapid: Player[];
  classical: Player[];
  bullet: Player[];
}

export default function LeaderboardsPage() {
  const [leaderboards, setLeaderboards] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'blitz' | 'rapid' | 'classical' | 'bullet'>('blitz');

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [blitzRes, rapidRes, classicalRes, bulletRes] = await Promise.all([
        fetch('https://lichess.org/api/player/top/50/blitz'),
        fetch('https://lichess.org/api/player/top/50/rapid'),
        fetch('https://lichess.org/api/player/top/50/classical'),
        fetch('https://lichess.org/api/player/top/50/bullet')
      ]);

      if (!blitzRes.ok || !rapidRes.ok || !classicalRes.ok || !bulletRes.ok) {
        throw new Error('Failed to fetch leaderboards');
      }

      const [blitz, rapid, classical, bullet] = await Promise.all([
        blitzRes.json(),
        rapidRes.json(),
        classicalRes.json(),
        bulletRes.json()
      ]);

      setLeaderboards({
        blitz: blitz.users || [],
        rapid: rapid.users || [],
        classical: classical.users || [],
        bullet: bullet.users || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboards');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'blitz' as const, label: 'Blitz' },
    { key: 'rapid' as const, label: 'Rapid' },
    { key: 'classical' as const, label: 'Classical' },
    { key: 'bullet' as const, label: 'Bullet' }
  ];

  const getRating = (player: Player, variant: string) => {
    return player.perfs[variant as keyof typeof player.perfs]?.rating || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leaderboards...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchLeaderboards}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F59E0B' fill-opacity='0.04'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <Navigation />
      <div className="relative z-10 py-8">
        <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Lichess Leaderboards
        </h1>
        
        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboards?.[activeTab]?.map((player, index) => (
                  <tr key={player.username} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {player.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {player.title && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          {player.title}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-lg font-bold text-blue-600">
                        {getRating(player, activeTab)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
