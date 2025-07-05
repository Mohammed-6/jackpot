import {
  PlusCircle,
  Wallet,
  KeyRound,
  LogOut,
  History,
  Dice3,
} from "lucide-react";
import Link from "next/link";

const CustomerSidebar = () => {
  return (
    <aside className="w-60 h-screen bg-gradient-to-b from-black via-red-900 to-black border-r-2 border-yellow-600 shadow-lg p-5 hidden md:block text-yellow-200">
      <h2 className="text-xl font-bold text-yellow-400 mb-6 tracking-wide uppercase">
        🎲 My Account
      </h2>
      <nav className="space-y-3 text-sm font-medium">
        <Link
          href={"/profile/add-money"}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-yellow-500/20 transition hover:text-yellow-300"
        >
          <PlusCircle size={18} className="text-yellow-400" /> Add Money
        </Link>

        <Link
          href={"/profile/withdraw-money"}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-yellow-500/20 transition hover:text-yellow-300"
        >
          <Wallet size={18} className="text-yellow-400" /> Withdraw
        </Link>

        <Link
          href={"/profile/bet-transaction"}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-yellow-500/20 transition hover:text-yellow-300"
        >
          <Dice3 size={18} className="text-yellow-400" /> Bet Transaction
        </Link>

        <Link
          href={"/profile/transaction-history"}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-yellow-500/20 transition hover:text-yellow-300"
        >
          <History size={18} className="text-yellow-400" /> Transaction History
        </Link>

        <Link
          href={"/profile/change-password"}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-yellow-500/20 transition hover:text-yellow-300"
        >
          <KeyRound size={18} className="text-yellow-400" /> Change Password
        </Link>

        <Link
          href={"/profile/logout"}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600/30 transition text-red-500 hover:text-red-400"
        >
          <LogOut size={18} /> Logout
        </Link>
      </nav>
    </aside>
  );
};

export default CustomerSidebar;
