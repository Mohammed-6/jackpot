"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Matka } from "../types/matka";
import { Layout } from "../layout";

const TriggerWinning = () => {
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
  const [matkaId, setMatkaId] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/matka`).then((res) => {
      setMatkas(res.data);
    });
  }, []);

  const handleTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/winning/trigger`,
        {
          matkaId,
          winningNumber: number,
        }
      );
      setMessage("Winning number processed successfully!");
      setLoading(false);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">🎯 Trigger Winning Number</h2>

      <form onSubmit={handleTrigger} className="space-y-4">
        <select
          value={matkaId}
          onChange={(e) => setMatkaId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select Matka</option>
          {matkas.map((matka) => (
            <option key={matka._id} value={matka._id}>
              {matka.betName}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Winning Number"
          className="w-full px-4 py-2 border border-gray-300 rounded"
          required
        />

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Loading..." : "Trigger Win"}
        </button>
      </form>

      {message && <p className="text-sm mt-4 text-gray-700">{message}</p>}
    </div>
  );
};

export default TriggerWinning;
