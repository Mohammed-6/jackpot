"use client";

import { useEffect, useState } from "react";
import Layout from "../layout";
import CustomerSidebar from "./layout";
import axios from "axios";
import { Dice3 } from "lucide-react";

interface Bet {
  _id: string;
  numbers: number[];
  amount: number;
  createdAt: string;
  matkaId: {
    betName: string;
  };
}

const BetTransactionList = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const customerId = localStorage.getItem("customer");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bets/customer-bet/${customerId}`
        );
        setBets(res.data);
      } catch (err) {
        console.error("Error fetching bet transactions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);

  return (
    <Layout>
      <div className="flex">
        <CustomerSidebar />
        <main className="flex-1 p-6 bg-gradient-to-br from-black via-red-950 to-black text-yellow-300 min-h-screen">
          <h2 className="text-2xl font-bold mb-6">🎰 Bet Transactions</h2>

          {loading ? (
            <p className="text-gray-200">Loading...</p>
          ) : bets.length === 0 ? (
            <p className="text-gray-400">No bets found.</p>
          ) : (
            <div className="space-y-4">
              {bets.map((bet: any, i: number) => {
                const isWon = bet.showDown && bet.isNone;
                const isLost = bet.showDown && !bet.isNone;
                const isPending = !bet.showDown;

                return (
                  <div
                    key={i}
                    className={`border rounded-lg p-4 shadow-md hover:shadow-lg transition
        ${
          isWon
            ? "bg-green-900 border-green-500"
            : isLost
            ? "bg-red-900 border-red-500"
            : "bg-zinc-900 border-yellow-500"
        }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold text-yellow-400">
                        🎯 {bet.gameId?.betName ?? "Matka"}
                      </h3>
                      <span className="text-sm text-yellow-200">
                        {new Date(bet.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      {bet.numbers.map((num: any, idx: number) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold shadow-sm
              ${
                isWon
                  ? "bg-green-300 text-black"
                  : isLost
                  ? "bg-red-300 text-black"
                  : "bg-yellow-400 text-black"
              }`}
                        >
                          <Dice3 size={16} /> {num}
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-yellow-300 font-medium mb-2">
                      Bet Amount: ₹{bet.amount.toFixed(2)}
                    </div>

                    {isWon && (
                      <div className="text-green-400 font-semibold text-sm">
                        🎉 You Won!
                      </div>
                    )}
                    {isLost && (
                      <div className="text-red-400 font-semibold text-sm">
                        ❌ Lost
                      </div>
                    )}
                    {isPending && (
                      <div className="text-yellow-400 font-semibold text-sm">
                        ⏳ Awaiting Result
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default BetTransactionList;
