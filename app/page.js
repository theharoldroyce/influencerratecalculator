'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState();
  const [inputValue, setInputValue] = useState();
  const [totalPlayCount, setTotalPlayCount] = useState(0);
  const [averagePlayCount, setAveragePlayCount] = useState(0);
  const [cpv, setCpv] = useState(0.01);
  const [estimatedEarnings, setEstimatedEarnings] = useState(0);

  const fetchReels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/instagram/reels?username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reels');
      }
      const data = await response.json();
      
      // 1. Filter out today's videos
      const today = new Date().setHours(0, 0, 0, 0);
      const filteredByDate = data.data.items.filter(reel => {
        const reelDate = new Date(reel.taken_at * 1000).setHours(0, 0, 0, 0);
        return reelDate < today;
      });

      // 2. Remove outliers using IQR
      const playCounts = filteredByDate.map(reel => reel.ig_play_count).sort((a, b) => a - b);
      const q1 = playCounts[Math.floor(playCounts.length / 4)];
      const q3 = playCounts[Math.floor(playCounts.length * 3 / 4)];
      const iqr = q3 - q1;
      const maxValue = q3 + iqr * 1.5;
      const minValue = q1 - iqr * 1.5;

      const filteredByViews = filteredByDate.filter(reel => {
        return reel.ig_play_count >= minValue && reel.ig_play_count <= maxValue;
      });

      // 3. Get the last 8 videos
      const finalReels = filteredByViews.slice(-8);

      // 4. Calculate total and average play count
      const total = finalReels.reduce((acc, reel) => acc + reel.ig_play_count, 0);
      setTotalPlayCount(total);
      const avg = finalReels.length > 0 ? total / finalReels.length : 0;
      setAveragePlayCount(avg);
      setEstimatedEarnings((avg / 1000) * cpv);


      setReels(finalReels);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, [username]);

  useEffect(() => {
    setEstimatedEarnings((averagePlayCount / 1000) * cpv);
  }, [cpv, averagePlayCount]);

  const handleSearch = () => {
    setUsername(inputValue);
  };

  return (
    <div className="font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="flex flex-col gap-4 items-center">
        <h1 className="text-4xl font-bold">Instagram Reels</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue || ''}
            onChange={(e) => setInputValue(e.target.value)}
            className="border rounded-lg p-2"
            placeholder="Enter Instagram username"
          />
          <input
            type="number"
            value={cpv || 0}
            onChange={(e) => setCpv(e.target.value)}
            className="border rounded-lg p-2"
            placeholder="Enter CPV"
            step="0.01"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white rounded-lg p-2"
          >
            Search
          </button>
        </div>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && (
          <>
            <h2 className="text-2xl font-bold">Total Play Count: {totalPlayCount.toLocaleString()}</h2>
            <h2 className="text-2xl font-bold">Average Play Count: {averagePlayCount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
            <h2 className="text-2xl font-bold">Estimated Earnings: ${estimatedEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {reels.map((reel) => (
                <div key={reel.id} className="border rounded-lg p-4">
                  <p>Play Count: {reel.ig_play_count.toLocaleString()}</p>
                  <p>Created At: {new Date(reel.taken_at * 1000).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
