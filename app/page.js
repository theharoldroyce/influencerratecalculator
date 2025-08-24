"use client";

import { useState, useEffect } from "react";
import { FloatingLabelInput } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState();
  const [inputValue, setInputValue] = useState();
  const [totalPlayCount, setTotalPlayCount] = useState(0);
  const [averagePlayCount, setAveragePlayCount] = useState(0);
  const [cpv, setCpv] = useState(10);
  const [estimatedEarnings, setEstimatedEarnings] = useState(0);

  const fetchReels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/instagram/reels?username=${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reels");
      }
      const data = await response.json();

      // 1. Filter out today's videos
      const today = new Date().setHours(0, 0, 0, 0);
      const filteredByDate = data.data.items.filter((reel) => {
        const reelDate = new Date(reel.taken_at * 1000).setHours(0, 0, 0, 0);
        return reelDate < today;
      });

      // 2. Remove outliers using IQR
      const playCounts = filteredByDate
        .map((reel) => reel.ig_play_count)
        .sort((a, b) => a - b);
      const q1 = playCounts[Math.floor(playCounts.length / 4)];
      const q3 = playCounts[Math.floor((playCounts.length * 3) / 4)];
      const iqr = q3 - q1;
      const maxValue = q3 + iqr * 1.5;
      const minValue = q1 - iqr * 1.5;

      const filteredByViews = filteredByDate.filter((reel) => {
        return reel.ig_play_count >= minValue && reel.ig_play_count <= maxValue;
      });

      // 3. Get the last 8 videos
      const finalReels = filteredByViews.slice(-8);

      // 4. Calculate total and average play count
      const total = finalReels.reduce(
        (acc, reel) => acc + reel.ig_play_count,
        0
      );
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
    <>
      <section className="flex items-center justify-center min-h-screen p-4 sm:p-8 md:p-20 pb-20 gap-8 sm:gap-16">
        <div className="container px-4 text-center sm:px-6 md:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 sm:gap-5 md:max-w-5xl md:gap-6">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
              Instroom
            </h1>
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
              Influencer Rate Calculator
            </h1>
            <p className="text-muted-foreground text-balance text-base sm:text-lg md:text-xl">
              No guesswork. Just performance-based pricing, built for both
              creators and brands.
            </p>
          </div>
          <div className="flex flex-col gap-4 items-center mt-12">
            <div className="flex flex-col sm:flex-row w-full max-w-xl gap-4">
              <FloatingLabelInput
                id="username"
                className="w-full h-12"
                label="Instagram Username"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <FloatingLabelInput
                id="cpv"
                label="CPV"
                type="number"
                className="w-full sm-32 h-12"
                value={cpv}
                onChange={(e) => setCpv(e.target.value)}
                step="10"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 w-full sm:w-40 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition"
              >
                Calculate
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center mt-12">
            <div className="flex flex-col sm:flex-row w-full max-w-2xl gap-4">
              {loading && <div>Loading...</div>}
              {error && <div>Error: {error}</div>}
              {!loading && !error && (
                <>
                  <Card className="w-full max-w-sm">
                    <CardHeader className="gap-3">
                      <CardTitle>Average Views</CardTitle>
                      <CardTitle>
                        {averagePlayCount.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="w-full max-w-sm">
                    <CardHeader className="gap-3">
                      <CardTitle>Suggested Influencer Rate</CardTitle>
                      <CardTitle>
                        $ {estimatedEarnings.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
