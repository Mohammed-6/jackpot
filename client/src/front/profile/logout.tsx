"use client";
import Layout from "../layout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomerSidebar from "./layout";
import { useCommon } from "@/context/CommonContext";

const LogoutConfirm = () => {
  return (
    <Layout>
      <div className="flex">
        <CustomerSidebar />
        <main className="flex-1 p-6">
          <Content />
        </main>
      </div>
    </Layout>
  );
};
const Content: React.FC = () => {
  const { customerLogout } = useCommon();
  const router = useRouter();

  const handleLogout = () => {
    customerLogout();
    router.push("/");
  };

  return (
    <>
      <div className="">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
          <p className="mb-6">Are you sure you want to logout?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutConfirm;
