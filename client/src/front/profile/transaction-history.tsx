"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, MinusCircle, Dice3, Loader2 } from "lucide-react";
import CustomerSidebar from "./layout";
import Layout from "../layout";

interface Transaction {
  _id: string;
  amount: number;
  type: "credit" | "debit" | "bet";
  createdAt: string;
}

const TransactionItem = ({ tx }: { tx: Transaction }) => {
  const colorMap = {
    credit: "text-emerald-400",
    win: "text-emerald-400",
    debit: "text-red-400",
    bet: "text-yellow-300",
  };

  const bgMap = {
    credit: "bg-emerald-800/20",
    win: "bg-emerald-800/20",
    debit: "bg-red-800/20",
    bet: "bg-yellow-700/10",
  };

  const iconMap = {
    credit: <PlusCircle className="w-5 h-5" />,
    debit: <MinusCircle className="w-5 h-5" />,
    bet: <Dice3 className="w-5 h-5" />,
  };

  return (
    <div
      className={`flex items-center justify-between ${
        bgMap[tx.type]
      } px-4 py-3 rounded-xl shadow-md mb-3 border-l-4 border-yellow-500 transition hover:scale-[1.01]`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-full bg-black/30 border ${colorMap[tx.type]}`}
        >
          {iconMap[tx.type]}
        </div>
        <div>
          <p className="font-semibold capitalize text-yellow-100">{tx.type}</p>
          <p className="text-xs text-gray-400">
            {new Date(tx.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <div className={`font-bold text-lg ${colorMap[tx.type]}`}>
        ₹ {tx.amount.toFixed(2)}
      </div>
    </div>
  );
};

const CustomerTransactionList = () => {
  return (
    <Layout>
      <div className="flex bg-gradient-to-b from-black via-zinc-900 to-black min-h-screen text-white">
        <CustomerSidebar />
        <main className="flex-1 p-6">
          <Content />
        </main>
      </div>
    </Layout>
  );
};

function Content() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customerId = localStorage.getItem("customer")!;
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/${customerId}`
        );
        setTransactions(res.data);
      } catch (err) {
        console.error("Transaction fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) fetchTransactions();
  }, []);

  return (
    <div className="max-w-xl mx-auto bg-black/40 p-6 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-extrabold mb-6 text-yellow-300 border-b border-yellow-600 pb-2">
        🎲 Your Casino Transactions
      </h2>
      {loading ? (
        <div className="flex justify-center text-yellow-400">
          <Loader2 className="animate-spin" />
        </div>
      ) : transactions.length > 0 ? (
        transactions.map((tx) => <TransactionItem key={tx._id} tx={tx} />)
      ) : (
        <p className="text-gray-400 text-sm">No transactions found.</p>
      )}
    </div>
  );
}

export default CustomerTransactionList;
