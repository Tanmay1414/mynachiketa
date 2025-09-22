/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

interface Tournament {
  id: string;
  name: string;
  slug: string;
  description: string;
  url: string;
  nbPlayers: number;
  maxPlayers: number;
  minutes: number;
  clock: {
    limit: number;
    increment: number;
  };
  rated: boolean;
  variant: string | { key: string; name?: string };
  status: number;
  system: string;
  startsAt: string;
  finishesAt?: string;
  createdAt: string;
  createdBy: string;
  pairings: any[];
  featured: boolean;
  fullName: string;
  recentGames: any[];
  isRecentlyFinished: boolean;
  schedule: {
    freq: string;
    speed: string;
  };
  winner?: {
    name: string;
    title?: string;
  };
  perf: {
    icon: string;
    name: string;
    position: number;
    key?: string;
  };
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'created' | 'started' | 'finished'>('created');

  useEffect(() => {
    fetchTournaments();
  }, [filter]);

  const fetchTournaments = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://lichess.org/api/tournament?status=${filter}&nb=50`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tournaments');
      }
      const data = await response.json();
      
      let tournamentsData = [];
      
      if (Array.isArray(data)) {
        tournamentsData = data;
      } else if (data[filter] && Array.isArray(data[filter])) {
        tournamentsData = data[filter];
      } else {
        console.log('Unexpected data format, trying to find tournaments list:', data);
        tournamentsData = data.started || data.created || data.finished || data.tournaments || data.data || [];
      }
      
      setTournaments(tournamentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournaments');
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 10: return 'Created';
      case 20: return 'Started';
      case 30: return 'Finished';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 10: return 'bg-blue-100 text-blue-800';
      case 20: return 'bg-green-100 text-green-800';
      case 30: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tournaments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchTournaments}
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23A855F7' fill-opacity='0.05'%3E%3Cpath d='M25 0l25 25-25 25L0 25z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <Navigation />
      <div className="relative z-10 py-8">
        <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Lichess Tournaments
        </h1>
        
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'created' as const, label: 'Created' },
                { key: 'started' as const, label: 'Started' },
                { key: 'finished' as const, label: 'Finished' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tournaments List */}
        <div className="space-y-4">
          {!tournaments || tournaments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No tournaments found for the selected filter.</p>
            </div>
          ) : (
            tournaments.map((tournament) => (
              <div key={tournament.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {tournament.fullName}
                    </h3>
                    {tournament.description && (
                      <p className="text-gray-600 mb-3">{tournament.description}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
                    {getStatusText(tournament.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Players</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {tournament.nbPlayers}/{tournament.maxPlayers || '∞'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Time Control</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {tournament.clock.limit / 60}+{tournament.clock.increment}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDuration(tournament.minutes)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Variant</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {typeof tournament.variant === 'object' ? tournament.variant.name || tournament.variant.key : tournament.variant}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Created:</span> {formatTime(tournament.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Starts:</span> {formatTime(tournament.startsAt)}
                  </div>
                  {tournament.finishesAt && (
                    <div>
                      <span className="font-medium">Ends:</span> {formatTime(tournament.finishesAt)}
                    </div>
                  )}
                </div>

                {tournament.schedule && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Schedule:</span> {tournament.schedule.freq} - {tournament.schedule.speed}
                    </p>
                  </div>
                )}

                {tournament.winner && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Winner:</span> {tournament.winner.name}
                      {tournament.winner.title && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          {tournament.winner.title}
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {tournament.perf && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Performance:</span> {tournament.perf.name || tournament.perf.key || 'Unknown'}
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={`https://lichess.org/tournament/${tournament.id}`}
                    target="_blank"
                   rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Tournament
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
}