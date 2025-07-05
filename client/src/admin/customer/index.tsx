"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout } from "../layout";

type Customer = {
  _id: string;
  name: string;
  phone: string;
  customerId: string;
  createdAt: string;
};

const CustomerList = () => {
  return (
    <>
      <Layout>
        <Content />
      </Layout>
    </>
  );
};

const Content: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    customerId: "",
    page: 1,
  });
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_URL + "/api/customers/filter",
        filters
      );
      setCustomers(res.data.customers);
      setTotalPages(res.data.total);
    } catch (err) {
      console.error("Error fetching customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filters.page]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
    fetchCustomers();
  };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

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
              {page}
            </button>
          )
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Customer List</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleInputChange}
          placeholder="Search by Name"
          className="border px-3 py-2 rounded text-sm"
        />
        <input
          type="text"
          name="phone"
          value={filters.phone}
          onChange={handleInputChange}
          placeholder="Search by Phone"
          className="border px-3 py-2 rounded text-sm"
        />
        <input
          type="text"
          name="customerId"
          value={filters.customerId}
          onChange={handleInputChange}
          placeholder="Search by Customer ID"
          className="border px-3 py-2 rounded text-sm"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="space-y-3">
          {customers.map((cust) => (
            <div
              key={cust._id}
              className="p-4 border rounded shadow-sm flex justify-between"
            >
              <div>
                <p className="font-bold">{cust.name}</p>
                <p className="text-sm text-gray-500">
                  <b>M.</b>
                  {cust.phone}
                </p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>
                  <b>C.</b>
                  {cust.customerId}
                </p>
                <p>{new Date(cust.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6 gap-2">{renderPagination()}</div>
    </div>
  );
};

export default CustomerList;
