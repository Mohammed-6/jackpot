"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react"; // optional spinner
import Layout from "./layout";
import { useParams, useRouter } from "next/navigation";
import { useCommon } from "@/context/CommonContext";
import { Matka } from "../admin/types/matka";

interface CasinoPreloaderProps {
  show: boolean;
}

const CasinoPreloader: React.FC<CasinoPreloaderProps> = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-70">
      <div className="flex flex-col items-center gap-4 p-6 rounded-xl border-4 border-yellow-400 bg-gradient-to-br from-[#2d0000] to-[#4b0000] shadow-2xl">
        {/* Spinner */}
        <div className="animate-spin rounded-full border-4 border-yellow-500 border-t-transparent h-14 w-14"></div>

        {/* Casino text */}
        <h2 className="text-yellow-300 text-lg font-bold tracking-widest animate-pulse uppercase">
          Loading Casino Magic...
        </h2>
      </div>
    </div>
  );
};

// const MAX_NUMBER = 999;

interface BetEntry {
  number: number;
  amount: number;
}

export default function CasinoStyleSpinSelector() {
  return (
    <Layout>
      <Content />
    </Layout>
  );
}

function Content() {
  const router = useParams();
  const { matkas, updateWallet, customerId, openAuthModal } = useCommon();
  const [selected, setSelected] = useState<BetEntry[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [matka, setMatka] = useState<Matka>({
    _id: "",
    betName: "",
    dealType: 0,
    minAmt: 0,
    rangeFrom: 0,
    rangeTo: 0,
  });

  useEffect(() => {
    matkas.map((matka) => {
      if (matka._id === router?.id) {
        setMatka(matka);
      }
    });
  }, [matkas]);

  const totalPoints = selected.reduce((acc, item) => acc + item.amount, 0);

  const handleAddBet = () => {
    if (!amount || Number(amount) <= 0) return;

    const exists = selected.find((item) => item.number === currentNumber);
    if (!exists) {
      setSelected([
        ...selected,
        { number: currentNumber, amount: Number(amount) },
      ]);
      setAmount("");
      setCurrentNumber(0);
    }
  };

  const handleRemove = (num: number) => {
    setSelected(selected.filter((entry) => entry.number !== num));
  };

  const handlePlaceBet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customerId === 0) {
      openAuthModal("login");
      return;
    }
    setMessage("");
    setLoading(true);

    const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
    const numbers = selected.map((bet: any) => {
      return bet.number;
    });
    try {
      await axios
        .post(
          BASE_URL + "/api/bets/place",
          {
            customerId: localStorage.getItem("customer"),
            amount: Number(totalPoints),
            gameId: matka?._id,
            numbers: numbers,
            selected,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res: any) => {
          setMessage(
            res.data.message + `. Available balance: ₹${res.data.walletBalance}`
          );
          setAmount("");
          setLoading(false);
          updateWallet(res.data.walletBalance);
          setSelected([]);
        });
    } catch (err: any) {
      setMessage(err.response.data.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3d0000] via-[#56070c] to-[#2d0000] text-white p-6 font-sans">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-yellow-400 mb-6 drop-shadow">
          🎲 Select Your Lucky Number
        </h2>

        <CasinoPreloader show={loading} />
        {/* Spin Number Selector */}
        <div className="relative h-48 overflow-y-scroll snap-y snap-mandatory rounded-md border-4 border-yellow-600 bg-[#1b1b1b] text-2xl font-bold text-yellow-300 mb-6 shadow-lg">
          {Array.from(
            { length: matka?.rangeTo + 1 - matka?.rangeFrom },
            (_, i) => matka?.rangeFrom + i
          ).map((num) => (
            <div
              key={num}
              onClick={() => setCurrentNumber(num)}
              className={`snap-center py-3 px-4 cursor-pointer transition-all ${
                currentNumber === num
                  ? "bg-yellow-500 text-black scale-105"
                  : "hover:bg-yellow-700 hover:text-black"
              }`}
            >
              {num.toString().padStart(3, "0")}
            </div>
          ))}
        </div>

        {/* Input + Button */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <input
            type="number"
            min={1}
            placeholder="Enter Amount"
            className="px-4 py-2 rounded text-black border-2 border-yellow-400 w-1/2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={handleAddBet}
            className="bg-yellow-500 text-black font-bold px-5 py-2 rounded hover:bg-yellow-400 shadow-lg"
          >
            Place Bet
          </button>
        </div>
        {message && (
          <div className="bg-yellow-400 text-black font-bold px-5 py-2 rounded my-2">
            {message}
          </div>
        )}

        {/* Selected Bets */}
        {selected.length > 0 && (
          <div className="text-left space-y-4 bg-[#1c1c1c] p-5 rounded shadow-xl border border-yellow-700">
            <h3 className="text-lg font-bold text-yellow-300">🎯 Your Bets</h3>
            {selected.map((entry) => (
              <div
                key={entry.number}
                className="flex justify-between items-center bg-[#2c2c2c] px-4 py-2 rounded-md border-l-4 border-yellow-500"
              >
                <span className="text-yellow-100">
                  #{entry.number.toString().padStart(3, "0")} → ₹{entry.amount}
                </span>
                <button
                  onClick={() => handleRemove(entry.number)}
                  className="text-red-400 text-sm hover:underline"
                >
                  ✖ Remove
                </button>
              </div>
            ))}
            <p className="text-right font-bold text-green-400">
              Total Points: ₹{totalPoints}
            </p>
            <button
              onClick={handlePlaceBet}
              className="w-full mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-bold"
            >
              Submit Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
