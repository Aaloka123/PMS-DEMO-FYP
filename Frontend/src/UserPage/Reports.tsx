import React, { useState, useMemo } from "react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";
import {
  Download,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Calendar,
  Search,
} from "lucide-react";

/* ---------- Types ---------- */

interface Sale {
  date: string;
  medicine: string;
  qty: number;
  amount: number;
  status: string;
}

/* ---------- Stat Card ---------- */

const StatCard = ({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
}) => (
  <div className="group relative bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl overflow-hidden border border-white/40 transition-all duration-500 hover:scale-[1.06] hover:-translate-y-3 hover:shadow-2xl">
    <div
      className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-2xl`}
    />
    <p className="text-gray-500 text-sm tracking-wide">{title}</p>
    <h2 className="text-3xl font-bold mt-1">{value}</h2>
    <div
      className={`mt-5 w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${gradient} transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg`}
    >
      {icon}
    </div>
  </div>
);

/* ---------- Main Component ---------- */

const Reports: React.FC = () => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const sales: Sale[] = [
    {
      date: "2026-02-06",
      medicine: "Paracetamol",
      qty: 10,
      amount: 500,
      status: "Completed",
    },
    {
      date: "2026-02-06",
      medicine: "Amoxicillin",
      qty: 5,
      amount: 750,
      status: "Completed",
    },
    {
      date: "2026-02-05",
      medicine: "Vitamin C",
      qty: 20,
      amount: 1000,
      status: "Completed",
    },
  ];

  /* ---------- Filtering Logic ---------- */

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch = sale.medicine
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFrom = fromDate ? sale.date >= fromDate : true;
      const matchesTo = toDate ? sale.date <= toDate : true;

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [search, fromDate, toDate]);

  /* ---------- Calculations ---------- */

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.amount, 0);
  const totalOrders = filteredSales.length;

  /* ---------- Export Function ---------- */

  const handleExport = () => {
    if (filteredSales.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = ["Date", "Medicine", "Quantity", "Amount", "Status"];

    const rows = filteredSales.map((sale) => [
      sale.date,
      sale.medicine,
      sale.qty,
      sale.amount,
      sale.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 overflow-hidden">
      {/* Floating Background */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 opacity-20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400 opacity-20 blur-3xl rounded-full animate-pulse" />

      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full p-6 space-y-12 relative z-10">
        {/* Hero */}
        <div className="relative bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl">
          <div className="absolute right-10 top-10 opacity-10 text-[140px]">
            <TrendingUp />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold">Reports & Analytics</h1>
              <p className="opacity-90 mt-3 text-lg">
                Advanced monitoring of pharmacy sales and performance metrics.
              </p>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-3 bg-white text-blue-700 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
            >
              <Download size={20} />
              Export Report
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-6 flex flex-wrap gap-6 items-center border border-white/50">
          <div className="flex items-center gap-3">
            <Calendar size={18} />
            <span className="font-medium">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            title="Total Revenue"
            value={`Rs ${totalRevenue.toLocaleString()}`}
            gradient="from-green-500 to-emerald-600"
            icon={<TrendingUp size={28} />}
          />
          <StatCard
            title="Total Orders"
            value={totalOrders.toString()}
            gradient="from-blue-500 to-cyan-600"
            icon={<ShoppingCart size={28} />}
          />
          <StatCard
            title="Low Stock"
            value="18"
            gradient="from-yellow-500 to-orange-500"
            icon={<AlertTriangle size={28} />}
          />
          <StatCard
            title="Expired"
            value="3"
            gradient="from-red-500 to-rose-600"
            icon={<AlertTriangle size={28} />}
          />
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold tracking-wide">
              Sales Transactions
            </h2>

            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search medicine..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 bg-gray-50">
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Medicine</th>
                  <th className="p-4 text-center">Qty</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale, i) => (
                  <tr
                    key={i}
                    className="even:bg-gray-50 hover:bg-blue-50 transition"
                  >
                    <td className="p-4">{sale.date}</td>
                    <td className="p-4 font-medium">{sale.medicine}</td>
                    <td className="p-4 text-center">{sale.qty}</td>
                    <td className="p-4 text-right font-semibold">
                      Rs {sale.amount}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSales.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No transactions found.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
