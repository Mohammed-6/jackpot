"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CommonProvider, useCommon } from "@/context/CommonContext";
import AuthSection from "../auth";
import { ToastContainer } from "react-toastify";
import {
  User,
  PlusCircle,
  Wallet,
  KeyRound,
  LogOut,
  ChevronDown,
  History,
  RotateCcw,
  Dice3,
  Home,
  ListOrdered,
  BadgeDollarSign,
  HelpCircle,
  ScrollText,
  PhoneCall,
  Gamepad2,
} from "lucide-react";
import axios from "axios";

const Header = () => {
  const { openAuthModal, customerId, matkas, walletBalance, updateWallet } =
    useCommon();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const customerId = localStorage.getItem("customer");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/customers/wallet/${customerId}`
      );
      updateWallet(res.data.walletMoney || 0);
    } catch (err) {
      console.error("Failed to fetch wallet balance", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-black via-red-900 to-yellow-800 text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <div className="text-2xl font-extrabold tracking-wide text-yellow-300 drop-shadow">
          <Link href="/">🎰 MatkaZone</Link>
        </div>

        {/* Center: Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-yellow-300">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-yellow-400 transition"
          >
            <Home size={16} /> Home
          </Link>

          <GamesMenu matkas={matkas} />

          <Link
            href="/#matka-results"
            className="flex items-center gap-1 hover:text-yellow-400 transition"
          >
            <ListOrdered size={16} /> Results
          </Link>

          <Link
            href="/#rates"
            className="flex items-center gap-1 hover:text-yellow-400 transition"
          >
            <BadgeDollarSign size={16} /> Rates
          </Link>

          <Link
            href="/#contact"
            className="flex items-center gap-1 hover:text-yellow-400 transition"
          >
            <PhoneCall size={16} /> Contact
          </Link>
        </nav>

        {/* Right: Auth/Profile */}
        <div className="space-x-4 text-sm">
          {customerId !== 0 ? (
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-yellow-300 bg-zinc-900 border border-yellow-500 rounded px-3 py-1 shadow-sm">
                <Wallet size={16} className="text-yellow-400" />₹{" "}
                {walletBalance?.toFixed(2) || 0}
                <button
                  onClick={fetchWallet}
                  disabled={loading}
                  title="Refresh"
                >
                  <RotateCcw
                    size={16}
                    className={`ml-1 text-yellow-300 hover:text-yellow-400 transition ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>
              <div
                className="relative inline-block text-left"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 text-white hover:text-yellow-300 transition"
                >
                  <User size={18} />
                  Profile
                  <ChevronDown size={16} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-black border border-yellow-500 rounded-lg shadow-xl z-50 text-white">
                    <div className="py-1 text-sm">
                      <Link
                        href="/profile/add-money"
                        className="px-4 py-2 flex items-center gap-2 hover:bg-yellow-800"
                      >
                        <PlusCircle size={16} /> Add Money
                      </Link>
                      <Link
                        href="/profile/withdraw-money"
                        className="px-4 py-2 flex items-center gap-2 hover:bg-yellow-800"
                      >
                        <Wallet size={16} /> Withdraw
                      </Link>
                      <Link
                        href="/profile/bet-transaction"
                        className="px-4 py-2 flex items-center gap-2 hover:bg-yellow-800"
                      >
                        <Dice3 size={16} /> Bet Transaction
                      </Link>
                      <Link
                        href="/profile/transaction-history"
                        className="px-4 py-2 flex items-center gap-2 hover:bg-yellow-800"
                      >
                        <History size={16} /> Transaction History
                      </Link>
                      <Link
                        href="/profile/change-password"
                        className="px-4 py-2 flex items-center gap-2 hover:bg-yellow-800"
                      >
                        <KeyRound size={16} /> Change Password
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          setShowProfileMenu(false);
                          window.location.href = "/";
                        }}
                        className="px-4 py-2 flex items-center gap-2 text-red-500 hover:bg-red-900 w-full text-left"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                      <div className="px-4 py-2 border-t border-gray-800">
                        <div className="">Customer ID</div>
                        <div className="text-xs">{customerId}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-x-4">
              <button
                onClick={() => openAuthModal("login")}
                className="text-yellow-300 hover:underline"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-1 rounded font-semibold"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const GamesMenu = ({ matkas }: { matkas: any[] }) => {
  return (
    <div className="relative group">
      <div className="flex items-center gap-1 hover:text-yellow-400 transition cursor-pointer">
        <Gamepad2 size={16} /> Games
      </div>

      <div className="absolute left-0 mt-2 w-48 bg-zinc-900 border border-yellow-500 text-yellow-300 rounded shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {matkas.map((matka) => (
          <Link
            key={matka._id}
            href={`/b/${matka._id}`}
            className="block px-4 py-2 hover:bg-yellow-400 hover:text-black text-sm transition"
          >
            🎯 {matka.betName}
          </Link>
        ))}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-black via-red-900 to-yellow-700 text-white py-4 text-center text-sm shadow-inner">
      <div className="max-w-6xl mx-auto">
        © {new Date().getFullYear()} 🎰 MatkaZone. All rights reserved.
      </div>
    </footer>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <CommonProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <ToastContainer />
        <Header />
        <AuthSection />
        <main className="flex-1 px-0 py-0 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <Footer />
      </div>
    </CommonProvider>
  );
};

export default Layout;
