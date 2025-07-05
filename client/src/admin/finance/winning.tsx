"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, PieChart, Users } from "lucide-react";
import { Layout } from "../layout";

interface WinningEntry {
  _id: string;
  number: number;
  matkaId: { betName: string };
  date: string;
  summary: {
    totalBetAmount: number;
    totalPaidOut: number;
    profit: number;
  };
  bets: {
    amountWon: number;
  }[];
}

const AdminWinningBreakdown = () => {
  return (
    <>
      <Layout>
        <Content />
      </Layout>
    </>
  );
};

const Content = () => {
  const [winnings, setWinnings] = useState<WinningEntry[]>([]);

  useEffect(() => {
    const fetchWinnings = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/winning/list`
        );
        setWinnings(res.data);
      } catch (err) {
        console.error("Failed to fetch winnings", err);
      }
    };
    fetchWinnings();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-900">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-zinc-600">
        <Trophy size={24} /> Winning Breakdown
      </h2>

      {winnings.map((win) => {
        const winners = win.bets.filter((b) => b.amountWon > 0).length;

        return (
          <div
            key={win._id}
            className="bg-zinc-900 border border-zinc-400 text-white rounded-lg p-4 mb-5 shadow"
          >
            <div className="flex flex-wrap justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                🎯 {win.matkaId.betName} — Number:{" "}
                <span className="text-white">{win.number}</span>
              </h3>
              <span className="text-sm text-gray-400">
                {new Date(win.date).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded">
                <Users size={16} />
                <span>
                  Total Winners: <strong>{winners}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded">
                <PieChart size={16} />
                <span>
                  Total Bet: ₹<strong>{win.summary.totalBetAmount}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded">
                <PieChart size={16} />
                <span>
                  Paid Out: ₹<strong>{win.summary.totalPaidOut}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded col-span-full">
                <PieChart size={16} />
                <span>
                  Platform Profit: ₹<strong>{win.summary.profit}</strong>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminWinningBreakdown;
