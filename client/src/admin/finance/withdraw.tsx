"use client";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import { Layout } from "../layout";
import { ArrowDownCircle, ArrowUpCircle, Dice3, Gift } from "lucide-react";
import { toast } from "react-toastify";

interface Transaction {
  _id: string;
  customerId: string;
  amount: number;
  type: string;
  createdAt: string;
}

interface Filter {
  customerId: string;
  type: string;
  page: number;
  limit: number;
  phone: string;
}

const TransactionList = () => {
  return (
    <>
      <Layout>
        <Content />
      </Layout>
    </>
  );
};

const Content = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<Filter>({
    customerId: "",
    type: "",
    page: 1,
    limit: 10,
    phone: "",
  });
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + "/api/transactions/w/pending",
        filters
      );
      setTransactions(res.data.transactions);
      setTotalPages(res.data.total);
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const renderPagination = () => {
    const pages: (number | string)[] = [];
    const totalToShow = 5;
    const totalPagess = totalPages / 10 + 1;

    if (totalPagess <= totalToShow + 2) {
      for (let i = 1; i <= totalPagess; i++) pages.push(i);
    } else {
      if (filters.page <= totalToShow) {
        for (let i = 1; i <= totalToShow; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPagess);
      } else if (filters.page >= totalPagess - totalToShow + 1) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPagess - totalToShow + 1; i <= totalPagess; i++)
          pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (
          let i = filters.page - 1;
          i <= filters.page + 1 && i <= totalPagess;
          i++
        )
          pages.push(i);
        pages.push("...");
        pages.push(totalPagess);
      }
    }

    const changePage = (page: number) => {
      setFilters((prev) => ({ ...prev, page }));
    };

    return (
      <div className="flex justify-center mt-4 space-x-2 flex-wrap">
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={idx * 4 * idx} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => changePage(page as number)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                filters.page === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {Number(page).toFixed(0)}
            </button>
          )
        )}
      </div>
    );
  };

  const handleApprove = async (id: string, key: number) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/${id}/approve`
      );
      toast.success(res.data.message);
      setTransactions(transactions.filter((tx: any, i: number) => i !== key));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (id: string, key: number) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/${id}/reject`
      );
      toast.success(res.data.message);
      setTransactions(transactions.filter((tx: any, i: number) => i !== key));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reject");
    }
  };
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Transaction List</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Customer ID"
          value={filters.customerId}
          onChange={(e) =>
            setFilters({ ...filters, customerId: e.target.value, page: 1 })
          }
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          value={filters.phone}
          onChange={(e) =>
            setFilters({ ...filters, phone: e.target.value, page: 1 })
          }
          placeholder="Search by Phone"
          className="border px-3 py-2 rounded text-sm"
        />
      </div>

      <div className="bg-white shadow rounded p-4">
        {transactions.map((tx: any, i: number) => {
          const type = tx.type.toLowerCase();

          const iconMap: Record<string, JSX.Element> = {
            credit: <ArrowDownCircle size={20} className="text-green-500" />,
            debit: <ArrowUpCircle size={20} className="text-red-500" />,
            bet: <Dice3 size={20} className="text-yellow-500" />,
            win: <Gift size={20} className="text-blue-500" />,
          };

          const colorMap: Record<string, string> = {
            credit: "text-green-600",
            debit: "text-red-600",
            bet: "text-yellow-600",
            win: "text-blue-600",
          };

          return (
            <div
              key={tx._id}
              className="border border-gray-200 rounded-lg px-4 py-3 mb-3 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                {/* Left: User Info + Transaction Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {iconMap[type] ?? "🔁"}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {tx.customerId?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">
                      📞 {tx.customerId?.phone ?? "-"} | 🆔{" "}
                      {tx.customerId?.customerId ?? "-"}
                    </p>
                    <p
                      className={`capitalize font-medium text-sm ${
                        colorMap[type] ?? "text-gray-700"
                      }`}
                    >
                      {tx.type} - {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Right: Amount + Actions */}
                <div className="flex flex-col md:items-end gap-2">
                  <div
                    className={`font-bold text-sm ${
                      colorMap[type] ?? "text-gray-700"
                    }`}
                  >
                    ₹ {tx.amount.toFixed(2)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(tx._id, i)}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(tx._id, i)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex gap-2 justify-center mt-4">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
