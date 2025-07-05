"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  FileEdit,
  Boxes,
  FileText,
  Users,
  ChevronDown,
  ChevronUp,
  HardHat,
  ClipboardCheck,
  Gamepad2,
  List,
  User2Icon,
  IndianRupee,
  Dice1,
  Dice3,
  GitPullRequest,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6">
          <ToastContainer />
          {children}
        </main>
      </div>
    </div>
  );
};

const navItems = [
  {
    title: "Team",
    icon: <Users size={18} className="inline-block mr-2" />,
    features: [
      { label: "Team", path: "/admin/team" },
      { label: "Roles", path: "/admin/team/roles" },
    ],
  },
  {
    title: "Matka",
    icon: <Gamepad2 size={18} className="inline-block mr-2" />,
    features: [
      { label: "View", path: "/admin/matka/view" },
      { label: "Add", path: "/admin/matka/create" },
    ],
  },
  {
    title: "Report",
    icon: <List size={18} className="inline-block mr-2" />,
    features: [
      { label: "View Matka", path: "/admin/report/matka" },
      { label: "Matka winner", path: "/admin/report/matka/winning" },
    ],
  },
  {
    title: "Customer",
    icon: <User2Icon size={18} className="inline-block mr-2" />,
    features: [
      { label: "Customer", path: "/admin/customer" },
      { label: "Customer Seed", path: "/admin/customer/seed" },
    ],
  },
  {
    title: "Finance",
    icon: <IndianRupee size={18} className="inline-block mr-2" />,
    features: [
      { label: "Transaction", path: "/admin/finance/transaction" },
      { label: "Winning", path: "/admin/finance/winning" },
    ],
  },
  {
    title: "Request",
    icon: <GitPullRequest size={18} className="inline-block mr-2" />,
    features: [
      { label: "Add Money Request", path: "/admin/finance/add-money" },
      { label: "Withdraw Request", path: "/admin/finance/withdraw" },
      { label: "Failed Transaction", path: "/admin/finance/failed" },
    ],
  },
];

function Sidebar() {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const index = navItems.findIndex((item) =>
      item.features.some((feat) => pathname.startsWith(feat.path))
    );
    setOpenIndex(index);
  }, [pathname]);

  return (
    <aside className="fixeda top-0 left-0 h-screen w-64 bg-gray-900 text-white px-4 py-6 overflow-y-auto shadow-lg">
      <h2 className="text-2xl font-bold mb-6 pl-2">MatkaZone</h2>
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <div key={index} className="space-y-1 py-2">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between text-left px-3 py-2 rounded-md hover:bg-gray-700 transition-all"
            >
              <span className="flex items-center text-sm font-medium">
                {item.icon}
                {item.title}
              </span>
              {openIndex === index ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            {openIndex === index && (
              <ul className="ml-6 mt-1 space-y-1">
                {item.features.map((feat, i) => (
                  <li key={i}>
                    <Link
                      href={feat.path}
                      className={`block px-3 py-1.5 text-sm rounded transition ${
                        pathname === feat.path
                          ? "text-white bg-gray-800"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      {feat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

function Header() {
  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Dice3 className="text-yellow-500" size={24} /> MatkaZone
      </h1>
      <div className="text-gray-600">Welcome, User</div>
    </header>
  );
}
