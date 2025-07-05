"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Layout } from "../layout";

interface ReportEntry {
  number: number;
  realUsers: { name: string; amount: number }[];
  dummyUsers: { name: string; amount: number }[];
  realTotal: number;
  dummyTotal: number;
}

const MatkaCombineReport = () => {
  return (
    <>
      <Layout>
        <Content />
      </Layout>
    </>
  );
};

const Content = () => {
  const router = useParams();

  const [reportData, setReportData] = useState<{ [key: string]: ReportEntry }>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bets/combine-report/${router.id}`
        );
        setReportData(res.data.report);
      } catch (err) {
        console.error("Failed to fetch report", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router.id]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Matka Number Betting Report</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(reportData).map((entry) => (
            <div
              key={entry.number}
              className="border rounded-lg p-4 shadow bg-white"
            >
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                Number: {entry.number}
              </h2>

              <div className="mb-2">
                <p className="font-bold text-green-600">Genuine Users:</p>
                {entry.realUsers.map((user, idx) => (
                  <p key={idx} className="text-sm text-gray-700">
                    {user.name}: ₹{user.amount}
                  </p>
                ))}
                <p className="font-semibold text-green-700 mt-1">
                  Total: ₹{entry.realTotal}
                </p>
              </div>

              <div>
                <p className="font-bold text-yellow-600">Dummy Users:</p>
                {entry.dummyUsers.map((user, idx) => (
                  <p key={idx} className="text-sm text-gray-700">
                    {user.name}: ₹{user.amount}
                  </p>
                ))}
                <p className="font-semibold text-yellow-700 mt-1">
                  Total: ₹{entry.dummyTotal}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatkaCombineReport;
