'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';

interface UserProfile {
  username: string;
  bio?: string;
  count: {
    all: number;
  };
  perfs: {
    blitz?: { rating: number };
    rapid?: { rating: number };
    classical?: { rating: number };
    bullet?: { rating: number };
  };
  avatar?: string;
  title?: string;
}

export default function ProfilePage() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://lichess.org/api/user/${username}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234F46E5' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <Navigation />
      <div className="relative z-10 py-8">
        <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Lichess Profile Viewer
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Search Player Profile</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Lichess username (e.g., magnuscarlsen, hikaru)"
              className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              onKeyPress={(e) => e.key === 'Enter' && fetchProfile()}
            />
            <button
              onClick={fetchProfile}
              disabled={loading}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                'Search Player'
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold text-center">{error}</p>
            </div>
          )}
        </div>

        {profile && (
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="flex items-start gap-8">
              {profile.avatar && (
                <img
                  src={`https://lichess1.org/export/crosstable/${profile.username}.png`}
                  alt={`${profile.username} avatar`}
                  className="w-32 h-32 rounded-full border-4 border-blue-200 shadow-md"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-4xl font-bold text-gray-900">
                    {profile.username}
                  </h2>
                  {profile.title && (
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-lg font-bold border-2 border-yellow-300">
                      {profile.title}
                    </span>
                  )}
                </div>
                
                {profile.bio && (
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">{profile.bio}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Games Played
                    </h3>
                    <p className="text-4xl font-bold text-blue-700">
                      {profile.count.all.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Ratings
                    </h3>
                    <div className="space-y-3">
                      {profile.perfs.blitz && (
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-green-200">
                          <span className="text-lg font-semibold text-gray-700">Blitz:</span>
                          <span className="text-2xl font-bold text-green-700">{profile.perfs.blitz.rating}</span>
                        </div>
                      )}
                      {profile.perfs.rapid && (
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-green-200">
                          <span className="text-lg font-semibold text-gray-700">Rapid:</span>
                          <span className="text-2xl font-bold text-green-700">{profile.perfs.rapid.rating}</span>
                        </div>
                      )}
                      {profile.perfs.classical && (
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-green-200">
                          <span className="text-lg font-semibold text-gray-700">Classical:</span>
                          <span className="text-2xl font-bold text-green-700">{profile.perfs.classical.rating}</span>
                        </div>
                      )}
                      {profile.perfs.bullet && (
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-green-200">
                          <span className="text-lg font-semibold text-gray-700">Bullet:</span>
                          <span className="text-2xl font-bold text-green-700">{profile.perfs.bullet.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
