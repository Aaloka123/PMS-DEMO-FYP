import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../AdminComponents/AdminLayout";
import AdminPageHeader from "../AdminComponents/AdminPageHeader";
import {
  Package,
  AlertTriangle,
  Search,
  Plus,
  ArrowUpDown,
  X,
} from "lucide-react";

/* ---------- Stock Card ---------- */

const StockCard = ({
  title,
  value,
  gradient,
  icon,
  onClick,
  active = false,
}: {
  title: string;
  value: string;
  gradient: string;
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative w-full overflow-hidden rounded-3xl border bg-white/80 p-6 text-left shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
      active
        ? "border-green-400 ring-2 ring-green-200"
        : "border-gray-200 hover:border-green-200"
    }`}
  >
    <div
      className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-2xl transition-all duration-500 group-hover:opacity-40`}
    />
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-3xl font-bold mt-1">{value}</h2>
    <div
      className={`mt-5 w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg`}
    >
      {icon}
    </div>
  </button>
);

/* ---------- Main Component ---------- */

const ManagerInventory: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"All" | "In Stock" | "Low Stock" | "Critical">("All");

  const medicines = [
    { name: "Paracetamol", stock: 120, price: "Rs 50" },
    { name: "Amoxicillin", stock: 25, price: "Rs 150" },
    { name: "Vitamin C", stock: 200, price: "Rs 30" },
    { name: "Insulin", stock: 5, price: "Rs 500" },
  ];

  const getStatus = (stock: number) => {
    if (stock <= 5) return "Critical";
    if (stock <= 30) return "Low Stock";
    return "In Stock";
  };

  const filtered = useMemo(() => {
    return medicines
      .filter((med) => {
        const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase());
        const status = getStatus(med.stock);
        const matchesStatus = statusFilter === "All" || status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => (sortAsc ? a.stock - b.stock : b.stock - a.stock));
  }, [search, sortAsc, statusFilter]);

  /* 🔥 Dynamic Summary */
  const total = medicines.length;
  const lowStock = medicines.filter((m) => m.stock <= 30 && m.stock > 5).length;
  const critical = medicines.filter((m) => m.stock <= 5).length;
  const lastSynced = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AdminLayout>
      <div className="space-y-10">
        <AdminPageHeader
          title="Medicine Inventory"
          description={`${total} medicines tracked · ${critical} critical · synced ${lastSynced}`}
          icon={Package}
          iconClassName="bg-green-100 text-green-600"
          action={
            <Link
              to="/admin/add-medicine"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-700"
            >
              <Plus size={18} aria-hidden />
              Add stock
            </Link>
          }
        />

        {/* Stock Summary */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StockCard
            title="Total Medicines"
            value={total.toString()}
            gradient="from-blue-500 to-cyan-600"
            icon={<Package size={28} />}
            active={statusFilter === "All"}
            onClick={() => setStatusFilter("All")}
          />
          <StockCard
            title="Low Stock Items"
            value={lowStock.toString()}
            gradient="from-yellow-500 to-orange-500"
            icon={<AlertTriangle size={28} />}
            active={statusFilter === "Low Stock"}
            onClick={() => setStatusFilter("Low Stock")}
          />
          <StockCard
            title="Critical Stock"
            value={critical.toString()}
            gradient="from-red-500 to-rose-600"
            icon={<AlertTriangle size={28} />}
            active={statusFilter === "Critical"}
            onClick={() => setStatusFilter("Critical")}
          />
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Stock list</h2>
              <p className="text-sm text-slate-500">
                Showing {filtered.length} of {total} medicines
                {statusFilter !== "All" && (
                  <span className="text-green-600"> · {statusFilter}</span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
                <Search size={18} className="text-gray-400 shrink-0" aria-hidden />
                <input
                  type="text"
                  placeholder="Search medicine..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-40 bg-transparent text-sm outline-none sm:w-48"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "All" | "In Stock" | "Low Stock" | "Critical",
                  )
                }
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Filter by stock status"
              >
                <option value="All">All status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Critical">Critical</option>
              </select>

              {/* Sort */}
              <button
                type="button"
                onClick={() => setSortAsc(!sortAsc)}
                className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200"
              >
                <ArrowUpDown size={16} aria-hidden />
                {sortAsc ? "Low → High" : "High → Low"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 bg-gray-50">
                  <th className="p-4 text-left">Medicine</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((med) => {
                    const status = getStatus(med.stock);

                    return (
                      <tr
                        key={med.name}
                        className={`border-t even:bg-gray-50/80 transition hover:bg-green-50/80 ${
                          status === "Critical" ? "bg-red-50/60" : ""
                        }`}
                      >
                        <td className="p-4 font-medium">
                          <span className="inline-flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                              {med.name.slice(0, 2).toUpperCase()}
                            </span>
                            {med.name}
                          </span>
                        </td>
                        <td className="p-4 text-center font-semibold">
                          {med.stock}
                        </td>
                        <td className="p-4 text-right font-semibold">
                          {med.price}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              status === "In Stock"
                                ? "bg-green-100 text-green-700"
                                : status === "Low Stock"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-500">
                      <p className="font-medium">No medicines match your filters.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("All");
                        }}
                        className="mt-2 text-sm text-green-600 hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManagerInventory;
