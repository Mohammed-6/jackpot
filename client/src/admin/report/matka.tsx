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
  useEffect(() => {
    fetchMatkas();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">Matka List</h2>
        </div>
      </div>

      <ul className="space-y-3">
        {matkas.map((matka) => (
          <li
            key={matka._id}
            className="bg-white shadow p-4 rounded flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">
                <Link href={"/admin/report/matka/" + matka._id}>
                  {matka.betName}
                </Link>
              </div>
              <div className="text-sm text-gray-500">
                Deal Type: {matka.dealType} | Range: {matka.rangeFrom} -{" "}
                {matka.rangeTo}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={"/admin/report/matka/" + matka._id}
                className="text-red-500 hover:text-red-700"
              >
                Profit Report
              </Link>

              <Link
                href={"/admin/report/matka/combine/" + matka._id}
                className="text-blue-500 hover:text-blue-700"
              >
                Betting Report
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatkaList;
