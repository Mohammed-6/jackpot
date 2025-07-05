"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Loader2, Trophy, IndianRupee } from "lucide-react";
import { Layout } from "../layout";

interface ProfitEntry {
  realTotal: number;
  payout: number;
  profit: number;
}

const MatkaProfitReport = () => {
  return (
    <>
      <Layout>
        <Content />
      </Layout>
    </>
  );
};

const Content = () => {
  const router = useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Record<string, ProfitEntry>>({});
  const [rangeFrom, setRangeFrom] = useState(0);
  const [rangeTo, setRangeTo] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [bestNumber, setBestNumber] = useState("");
  const [bestProfit, setBestProfit] = useState(0);
  const [multiplier, setMultiplier] = useState(90);

  useEffect(() => {
    const fetchProfit = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bets/report/${router?.id}`
        );
        const {
          profitReport,
          rangeFrom,
          rangeTo,
          totalCollected,
          bestNumber,
          bestProfit,
          payoutMultiplier,
        } = res.data;
        setReport(profitReport);
        setRangeFrom(rangeFrom);
        setRangeTo(rangeTo);
        setTotalCollected(totalCollected);
        setBestNumber(bestNumber);
        setBestProfit(bestProfit);
        setMultiplier(payoutMultiplier);
      } catch (err) {
        console.error("Failed to load profit report", err);
      } finally {
        setLoading(false);
      }
    };

    if (router.id) fetchProfit();
  }, [router.id]);

  const sortedEntries = Object.entries(report).sort(
    (a, b) => b[1].profit - a[1].profit
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-zinc-900">
        🎲 Matka Profit Report
      </h2>

      {loading ? (
        <div className="flex justify-center text-gray-600">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm text-white">
            <div className="bg-zinc-800 p-4 rounded shadow border border-green-500">
              <p className="text-gray-400 mb-1">Range</p>
              <p>
                {rangeFrom} - {rangeTo}
              </p>
            </div>
            <div className="bg-zinc-800 p-4 rounded shadow border border-green-500">
              <p className="text-gray-400 mb-1">Total Collected</p>
              <p>₹ {totalCollected}</p>
            </div>
            <div className="bg-zinc-800 p-4 rounded shadow border border-green-500">
              <p className="text-gray-400 mb-1">Payout Multiplier</p>
              <p>x{multiplier}</p>
            </div>
            <div className="bg-zinc-800 p-4 rounded shadow border border-green-500">
              <p className="text-gray-400 mb-1">Best Number</p>
              <p className="flex items-center gap-1 text-green-400 font-semibold">
                <Trophy size={16} /> {bestNumber} (₹ {bestProfit})
              </p>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full text-sm text-gray-800">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="px-3 py-2 text-left">Number</th>
                  <th className="px-3 py-2 text-right">Total Amount</th>
                  <th className="px-3 py-2 text-right">Payout</th>
                  <th className="px-3 py-2 text-right">Profit</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map(([num, entry]) => (
                  <tr key={num} className="border-t border-gray-200">
                    <td className="px-3 py-2">{num}</td>
                    <td className="px-3 py-2 text-right">
                      ₹ {entry.realTotal.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      ₹ {entry.payout.toFixed(2)}
                    </td>
                    <td
                      className={`px-3 py-2 text-right font-medium ${
                        entry.profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹ {entry.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MatkaProfitReport;
