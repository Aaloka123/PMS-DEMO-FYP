import React, { useState, useMemo, useEffect } from "react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";
import {
  Download,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
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

/* ---------- Main ---------- */

const Reports: React.FC = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  /* ---------- Debounce ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  /* ---------- Data ---------- */

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
    {
      date: "2026-02-04",
      medicine: "Ibuprofen",
      qty: 8,
      amount: 600,
      status: "Completed",
      expiry: "2025-01-01",
      stock: 3,
    },
  ];

  /* ---------- Filtering ---------- */

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch = s.medicine
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ? true : s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [debouncedSearch, statusFilter]);

  /* ---------- Pagination ---------- */

  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

  const paginatedData = filteredSales.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  /* ---------- Stats ---------- */

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.amount, 0);
  const lowStock = sales.filter((s) => (s.stock ?? 0) < 10).length;
  const expired = sales.filter(
    (s) => s.expiry && s.expiry < new Date().toISOString().split("T")[0],
  ).length;

  /* ---------- Export ---------- */

  const handleExport = () => {
    if (!filteredSales.length) return;

    const csv =
      `Filters: Status=${statusFilter}, Search=${debouncedSearch}\n\n` +
      "Date,Medicine,Qty,Amount,Status\n" +
      filteredSales
        .map((s) => `${s.date},${s.medicine},${s.qty},${s.amount},${s.status}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "report.csv";
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reports</h1>
          <button
            onClick={handleExport}
            disabled={!filteredSales.length}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
          >
            <Download size={18} /> Export
          </button>
        </div>

        {/* Summary */}
        <div className="bg-white p-4 rounded-xl shadow flex justify-between">
          <span>Revenue: Rs {totalRevenue}</span>
          <span>Low Stock: {lowStock}</span>
          <span>Expired: {expired}</span>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 border px-3 py-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border px-3 py-2 rounded"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white p-4 rounded-xl shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th>Date</th>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((s, i) => {
                const isLowStock = (s.stock ?? 0) < 10;
                const isExpired =
                  s.expiry && s.expiry < new Date().toISOString().split("T")[0];

                return (
                  <tr
                    key={i}
                    className={`border-t ${
                      isExpired ? "bg-red-50" : isLowStock ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td>{s.date}</td>
                    <td>{s.medicine}</td>
                    <td>{s.qty}</td>
                    <td>Rs {s.amount}</td>
                    <td>{s.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              Page {page} / {totalPages || 1}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
