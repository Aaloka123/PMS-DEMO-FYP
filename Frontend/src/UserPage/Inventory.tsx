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

const ITEMS_PER_PAGE = 5;

const Inventory: React.FC = () => {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState<InventoryItem[]>([
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
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  // Filter
  const filtered = useMemo(() => {
    return inventory.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [inventory, search]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const deleteSelected = () => {
    setInventory((prev) => prev.filter((i) => !selected.includes(i.id)));
    setSelected([]);
  };

  const exportCSV = () => {
    const csv = [
      ["Name", "Category", "Stock", "Supplier"],
      ...inventory.map((i) => [i.name, i.category, i.stock, i.supplier]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
  };

  const getStatus = (item: InventoryItem) =>
    item.stock > item.minStock ? "Healthy" : "Low";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-600">
            <Package /> Inventory
          </h1>

          <div className="flex gap-2">
            <button onClick={exportCSV} className="border px-4 py-2 rounded">
              Export CSV
            </button>
            <button
              onClick={() => navigate("/add-medicine")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Search + Bulk */}
        <div className="bg-white p-4 rounded shadow flex justify-between">
          <div className="flex items-center gap-2 w-full">
            <Search size={18} />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          {selected.length > 0 && (
            <button
              onClick={deleteSelected}
              className="text-red-600 font-medium"
            >
              Delete ({selected.length})
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-600 text-white sticky top-0">
              <tr>
                <th></th>
                <th className="px-4 py-2 text-left">Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Supplier</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>

                  <td className="px-4 py-2">{item.name}</td>
                  <td className="text-center">{item.category}</td>
                  <td className="text-center font-bold">{item.stock}</td>
                  <td className="text-center">{item.supplier}</td>

                  <td className="text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        getStatus(item) === "Healthy"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {getStatus(item)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center p-6 text-gray-500">
              No inventory found
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Inventory;
