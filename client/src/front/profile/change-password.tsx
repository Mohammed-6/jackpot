"use client";
import { useState } from "react";
import axios from "axios";
import Layout from "../layout";
import CustomerSidebar from "./layout";
import { useCommon } from "@/context/CommonContext";

const ChangePassword = () => {
  return (
    <Layout>
      <div className="flex">
        <CustomerSidebar />
        <main className="flex-1 p-6">
          <ChangePasswordForm />
        </main>
      </div>
    </Layout>
  );
};

const ChangePasswordForm = () => {
  const { customerId } = useCommon();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/customers/change-password`,
        {
          customerId: localStorage.getItem("customer"),
          oldPassword,
          newPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error changing password");
    }
  };

  return (
    <form
      onSubmit={handleChangePassword}
      className="max-w-md bg-white p-6 shadow rounded space-y-4"
    >
      <h3 className="text-lg font-bold text-gray-800">Change Password</h3>

      <div className="space-y-2">
        <label
          htmlFor="oldPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Current Password
        </label>
        <input
          id="oldPassword"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Enter your current password"
          className="w-full px-3 py-2 border border-gray-300 rounded text-black"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          className="w-full px-3 py-2 border border-gray-300 rounded text-black"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Change Password
      </button>

      {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
    </form>
  );
};

export default ChangePassword;
