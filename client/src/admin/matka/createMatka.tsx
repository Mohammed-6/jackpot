"use client"; // 👈 Required for using useRouter

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ next/navigation (App Router)
import { Matka } from "../types/matka";
import {
  createMatkaAPI,
  updateMatkaAPI,
  getMatkaByIdAPI,
} from "../query/matka";
import { Layout } from "../layout";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MatkaCreateForm = () => {
  return (
    <>
      <Layout>
        <Content />
      </Layout>
    </>
  );
};

const Content: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // get id from URL if needed like /matka/form?id=123

  const [formData, setFormData] = useState<Matka>({
    betName: "",
    dealType: 0,
    minAmt: 0,
    rangeFrom: 0,
    rangeTo: 0,
    timeTable: new Date(),
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && typeof id === "string") {
      const fetchData = async () => {
        const data = await getMatkaByIdAPI(id);
        setFormData(data);
      };
      fetchData();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "betName" ? value : parseInt(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && typeof id === "string") {
      await updateMatkaAPI(id, formData);
      toast.success("Matka updated successfully!");
    } else {
      await createMatkaAPI(formData);
      toast.success("Matka created successfully!");
    }

    router.push("/admin/matka/view"); // ✅ navigate after success
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md p-6 bg-white rounded shadow space-y-4"
    >
      <h2 className="text-xl font-bold">
        {isEditMode ? "Update Matka" : "Create Matka"}
      </h2>

      <div>
        <label htmlFor="betName" className="block mb-1 text-sm font-medium">
          Bet Name
        </label>
        <input
          type="text"
          id="betName"
          name="betName"
          value={formData.betName}
          onChange={handleChange}
          placeholder="Bet Name"
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      <div>
        <label htmlFor="dealType" className="block mb-1 text-sm font-medium">
          Deal Type(1x, 2x, 3x)
        </label>
        <input
          type="number"
          id="dealType"
          name="dealType"
          value={formData.dealType}
          onChange={handleChange}
          placeholder="Deal Type"
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      <div>
        <label htmlFor="minAmt" className="block mb-1 text-sm font-medium">
          Minimum Amount
        </label>
        <input
          type="number"
          id="minAmt"
          name="minAmt"
          value={formData.minAmt}
          onChange={handleChange}
          placeholder="Deal Type"
          className="w-full border border-gray-300 rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Number Range</label>
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="rangeFrom" className="block text-xs text-gray-500">
              From
            </label>
            <input
              type="number"
              id="rangeFrom"
              name="rangeFrom"
              value={formData.rangeFrom}
              onChange={handleChange}
              placeholder="From"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>

          <div className="flex-1">
            <label htmlFor="rangeTo" className="block text-xs text-gray-500">
              To
            </label>
            <input
              type="number"
              id="rangeTo"
              name="rangeTo"
              value={formData.rangeTo}
              onChange={handleChange}
              placeholder="To"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
        </div>
        <div className="py-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Show Date & Time
          </label>
          <DatePicker
            selected={formData.timeTable}
            onChange={(date) => setFormData({ ...formData, timeTable: date })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {isEditMode ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default MatkaCreateForm;
