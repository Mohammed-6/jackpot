"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout } from "../layout";
import { toast } from "react-toastify";

interface Matka {
  _id: string;
  betName: string;
}

const SeedForm = () => {
  return (
    <>
      <Layout>
        <Content />
      </Layout>
    </>
  );
};

const Content = () => {
  const [matkas, setMatkas] = useState<Matka[]>([]);
  const [selectedMatka, setSelectedMatka] = useState("");
  const [customerCount, setCustomerCount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatkas = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/matka`
        );
        setMatkas(res.data);
      } catch (err) {
        console.error("Error fetching matkas", err);
      }
    };

    fetchMatkas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bets/seed`, {
        gameId: selectedMatka,
        count: Number(customerCount),
      });
      toast.success("Seeded successfully");
      setCustomerCount("");
      setLoading(false);
    } catch (error) {
      console.error("Seeding failed", error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 mt-8 rounded-lg border">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
        Seed Customers for Matka
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Matka Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Matka Game
          </label>
          <select
            value={selectedMatka}
            onChange={(e) => setSelectedMatka(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="">-- Choose a Matka --</option>
            {matkas.map((matka) => (
              <option key={matka._id} value={matka._id}>
                {matka.betName}
              </option>
            ))}
          </select>
        </div>

        {/* Number of Customers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Customers to Generate
          </label>
          <input
            type="number"
            value={customerCount}
            onChange={(e) => setCustomerCount(e.target.value)}
            min="1"
            required
            placeholder="Enter number"
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 rounded font-semibold transition`}
        >
          {loading ? "Generating..." : "Seed Customers"}
        </button>
      </form>
    </div>
  );
};

export default SeedForm;
