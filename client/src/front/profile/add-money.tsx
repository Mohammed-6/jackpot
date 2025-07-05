"use client";
import { useState } from "react";
import Layout from "../layout";
import CustomerSidebar from "./layout";
import { useCommon } from "@/context/CommonContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddMoney = () => {
  return (
    <>
      <Layout>
        <Content />
      </Layout>
    </>
  );
};
const Content = () => {
  return (
    <div className="flex">
      <CustomerSidebar />
      <main className="flex-1 p-6">
        <AddMoneyForm />
      </main>
    </div>
  );
};

const AddMoneyForm = () => {
  const { updateWallet } = useCommon();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
    try {
      await axios
        .post(
          BASE_URL + "/api/transactions/add",
          {
            customerId: localStorage.getItem("customer"),
            amount: Number(amount),
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res: any) => {
          setMessage(`Added ₹${amount}. New Balance: ₹${res.data.walletMoney}`);
          setAmount("");
          updateWallet(res.data.walletMoney);
        });
    } catch (err: any) {
      setMessage(err.response.data.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleAddMoney}
      className="max-w-sm bg-white p-4 rounded shadow space-y-3"
    >
      <h3 className="text-lg font-bold text-gray-800">Add Money</h3>

      <div className="space-y-2">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          type="number"
          min="1"
          placeholder="Enter amount"
          className="w-full border border-gray-300 text-black rounded px-3 py-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Money
      </button>
      {message && <p className="text-sm mt-2 text-gray-700">{message}</p>}
    </form>
  );
};

export default AddMoney;
