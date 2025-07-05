"use client";
import React, { useEffect, useState } from "react";
import { Matka } from "../types/matka";
import { getAllMatkasAPI, deleteMatkaAPI } from "../query/matka";
import { Layout } from "../layout";
import Link from "next/link";

const MatkaList = () => {
  return (
    <>
      <Layout>
        <Content />
      </Layout>
    </>
  );
};

const Content: React.FC = () => {
  const [matkas, setMatkas] = useState<Matka[]>([]);

  const fetchMatkas = async () => {
    const data = await getAllMatkasAPI();
    setMatkas(data);
  };

  const handleDelete = async (id: string) => {
    await deleteMatkaAPI(id);
    fetchMatkas();
  };

  useEffect(() => {
    fetchMatkas();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">Matka List</h2>
        </div>
        <div>
          <Link
            href={"/admin/matka/create"}
            className="text-white px-3 py-1.5 bg-blue-500 rounded-md"
          >
            Create
          </Link>
        </div>
      </div>

      <ul className="space-y-3">
        {matkas.map((matka) => (
          <li
            key={matka._id}
            className="bg-white shadow p-4 rounded flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{matka.betName}</div>
              <div className="text-sm text-gray-500">
                Deal Type: {matka.dealType} | Range: {matka.rangeFrom} -{" "}
                {matka.rangeTo}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleDelete(matka._id!)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>

              <Link
                href={`/admin/matka/edit?id=${matka._id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatkaList;
