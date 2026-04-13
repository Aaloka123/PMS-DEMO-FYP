import React, { useMemo, useState, useEffect } from "react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";
import { useNavigate } from "react-router-dom";
import {
  Package,
  AlertTriangle,
  Truck,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  supplier: string;
  lastUpdated: string;
}

interface KpiProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "purple";
}

const Inventory: React.FC = () => {
  const navigate = useNavigate();

  const [inventory] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Paracetamol",
      category: "Tablet",
      stock: 120,
      minStock: 50,
      supplier: "ABC Pharma",
      lastUpdated: "2026-01-10",
    },
    {
      id: 2,
      name: "Amoxicillin",
      category: "Capsule",
      stock: 25,
      minStock: 40,
      supplier: "LifeCare",
      lastUpdated: "2026-01-08",
    },
    {
      id: 3,
      name: "Cough Syrup",
      category: "Syrup",
      stock: 10,
      minStock: 30,
      supplier: "MedPlus",
      lastUpdated: "2026-01-07",
    },
  ]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Dynamic categories
  const categories = useMemo(
    () => [...new Set(inventory.map((i) => i.category))],
    [inventory],
  );

  // Format date
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB");

  // Status helper
  const getStatus = (item: InventoryItem) => {
    return item.stock > item.minStock ? "Healthy" : "Reorder";
  };

  // Filter + Sort
  const filtered = useMemo(() => {
    let data = inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
        (categoryFilter ? item.category === categoryFilter : true),
    );

    if (sortBy === "stock") {
      data.sort((a, b) => b.stock - a.stock);
    } else {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data;
  }, [inventory, debouncedSearch, categoryFilter, sortBy]);

  const healthy = inventory.filter((i) => i.stock > i.minStock).length;
  const low = inventory.length - healthy;
  const suppliers = new Set(inventory.map((i) => i.supplier)).size;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-slate-200">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Package /> Inventory Management
            </h1>
            <p className="opacity-90">
              Real-time stock, supplier & update tracking
            </p>
          </div>

          <button
            onClick={() => navigate("/add-medicine")}
            className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100"
          >
            + Add Stock
          </button>
        </div>

        {/* Alert */}
        {low > 0 && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl flex items-center gap-2">
            <AlertTriangle size={18} />
            {low} item(s) need restocking.
          </div>
        )}

        {/* KPIs */}
        <div className="grid md:grid-cols-4 gap-6">
          <Kpi
            title="Total Products"
            value={inventory.length}
            icon={<Package />}
            color="blue"
          />
          <Kpi
            title="Healthy"
            value={healthy}
            icon={<CheckCircle />}
            color="green"
          />
          <Kpi
            title="Low Stock"
            value={low}
            icon={<AlertTriangle />}
            color="red"
          />
          <Kpi
            title="Suppliers"
            value={suppliers}
            icon={<Truck />}
            color="purple"
          />
        </div>

        {/* Search + Filter + Sort */}
        <div className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search size={18} />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-3"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-3"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Supplier</th>
                <th className="px-4 py-2">Updated</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => {
                const status = getStatus(item);

                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{item.name}</td>
                    <td className="text-center">{item.category}</td>
                    <td className="text-center font-bold">{item.stock}</td>
                    <td className="text-center">{item.supplier}</td>
                    <td className="text-center">
                      {formatDate(item.lastUpdated)}
                    </td>

                    <td className="text-center">
                      {status === "Healthy" ? (
                        <span className="text-green-600">✔ Healthy</span>
                      ) : (
                        <span className="text-red-600">⚠ Reorder</span>
                      )}
                    </td>

                    <td className="text-center">
                      <button
                        disabled={status === "Reorder"}
                        className="text-blue-600 disabled:text-gray-400"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              🔍 No matching inventory found
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Kpi: React.FC<KpiProps> = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: "border-blue-600",
    green: "border-green-600",
    red: "border-red-600",
    purple: "border-purple-600",
  };

  return (
    <div
      className={`bg-white p-4 rounded shadow border-l-4 ${colorMap[color]}`}
    >
      <div className="flex justify-between">
        <div>
          <p>{title}</p>
          <h2 className="text-xl font-bold">{value}</h2>
        </div>
        {icon}
      </div>
    </div>
  );
};

export default Inventory;
