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
  expiry?: string;
  stock?: number;
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
  <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold mt-1">{value}</h2>
    <div
      className={`mt-4 w-12 h-12 flex items-center justify-center rounded-xl text-white bg-gradient-to-r ${gradient}`}
    >
      {icon}
    </div>
  </div>
);

/* ---------- Main ---------- */

const Reports: React.FC = () => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  const sales: Sale[] = [
    {
      date: "2026-02-06",
      medicine: "Paracetamol",
      qty: 10,
      amount: 500,
      status: "Completed",
      expiry: "2026-01-01",
      stock: 5,
    },
    {
      date: "2026-02-06",
      medicine: "Amoxicillin",
      qty: 5,
      amount: 750,
      status: "Completed",
      expiry: "2027-01-01",
      stock: 50,
    },
    {
      date: "2026-02-05",
      medicine: "Vitamin C",
      qty: 20,
      amount: 1000,
      status: "Pending",
      expiry: "2025-12-01",
      stock: 2,
    },
  ];

  /* ---------- Filter + Sort ---------- */

  const filteredSales = useMemo(() => {
    let data = sales.filter((sale) => {
      const matchesSearch = sale.medicine
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFrom = fromDate ? sale.date >= fromDate : true;
      const matchesTo = toDate ? sale.date <= toDate : true;

      const matchesStatus =
        statusFilter === "All" ? true : sale.status === statusFilter;

      return matchesSearch && matchesFrom && matchesTo && matchesStatus;
    });

    if (sortBy === "amount") {
      data.sort((a, b) => b.amount - a.amount);
    } else {
      data.sort((a, b) => b.date.localeCompare(a.date));
    }

    return data;
  }, [search, fromDate, toDate, statusFilter, sortBy]);

  /* ---------- Stats ---------- */

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.amount, 0);
  const totalOrders = filteredSales.length;

  const lowStock = sales.filter((s) => (s.stock ?? 0) < 10).length;

  const expired = sales.filter(
    (s) => s.expiry && s.expiry < new Date().toISOString().split("T")[0],
  ).length;

  /* ---------- Daily Revenue ---------- */

  const revenueByDate = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSales.forEach((s) => {
      map[s.date] = (map[s.date] || 0) + s.amount;
    });
    return map;
  }, [filteredSales]);

  /* ---------- Export ---------- */

  const handleExport = () => {
    if (!filteredSales.length) return alert("No data");

    const csv =
      "Date,Medicine,Qty,Amount,Status\n" +
      filteredSales
        .map((s) => `${s.date},${s.medicine},${s.qty},${s.amount},${s.status}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `report_${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-8">
        {/* Top */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reports</h1>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            <Download size={18} /> Export
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow">
          <input
            type="text"
            placeholder="Search"
            className="border px-3 py-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <select
            className="border px-3 py-2 rounded"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>

          <select
            className="border px-3 py-2 rounded"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Revenue"
            value={`Rs ${totalRevenue}`}
            icon={<TrendingUp />}
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            title="Orders"
            value={`${totalOrders}`}
            icon={<ShoppingCart />}
            gradient="from-blue-500 to-cyan-600"
          />
          <StatCard
            title="Low Stock"
            value={`${lowStock}`}
            icon={<AlertTriangle />}
            gradient="from-yellow-500 to-orange-500"
          />
          <StatCard
            title="Expired"
            value={`${expired}`}
            icon={<AlertTriangle />}
            gradient="from-red-500 to-rose-600"
          />
        </div>

        {/* Daily Revenue */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Daily Revenue</h2>
          {Object.entries(revenueByDate).map(([date, value]) => (
            <div key={date} className="flex justify-between border-b py-1">
              <span>{date}</span>
              <span>Rs {value}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>Date</th>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((s, i) => (
                <tr key={i} className="border-t">
                  <td>{s.date}</td>
                  <td>{s.medicine}</td>
                  <td>{s.qty}</td>
                  <td>Rs {s.amount}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
