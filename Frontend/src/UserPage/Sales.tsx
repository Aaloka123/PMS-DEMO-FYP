import React, { useState } from "react";
import { Trash2, Plus, Minus, Search, ShoppingCart, Pill } from "lucide-react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";

interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

const initialMedicines: Medicine[] = [
  { id: 1, name: "Paracetamol", price: 20, stock: 120, category: "Pain" },
  { id: 2, name: "Amoxicillin", price: 50, stock: 60, category: "Antibiotic" },
  { id: 3, name: "Vitamin C", price: 30, stock: 90, category: "Supplement" },
  { id: 4, name: "Ibuprofen", price: 40, stock: 45, category: "Pain" },
  { id: 5, name: "Cough Syrup", price: 70, stock: 10, category: "Cold" },
];

const Sales: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [cart, setCart] = useState<(Medicine & { qty: number })[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [addedId, setAddedId] = useState<number | null>(null);
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [invoiceNumber] = useState(
    `INV-${Math.floor(1000 + Math.random() * 9000)}`,
  );

  const categories = ["All", "Pain", "Antibiotic", "Supplement", "Cold"];

  const formatCurrency = (amount: number) => `Rs ${amount}`;

  const filtered = medicines.filter(
    (m) =>
      (activeCategory === "All" || m.category === activeCategory) &&
      m.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (med: Medicine) => {
    if (med.stock === 0) return;

    const existing = cart.find((i) => i.id === med.id);

    setCart((prev) => {
      if (existing)
        return prev.map((i) =>
          i.id === med.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...med, qty: 1 }];
    });

    setMedicines((prev) =>
      prev.map((m) => (m.id === med.id ? { ...m, stock: m.stock - 1 } : m)),
    );

    setAddedId(med.id);
    setTimeout(() => setAddedId(null), 600);
  };

  const updateQty = (id: number, delta: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    const med = medicines.find((m) => m.id === id);
    if (!med) return;
    if (delta > 0 && med.stock === 0) return;

    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );

    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stock: m.stock - delta } : m)),
    );
  };

  const clearCart = () => {
    setMedicines((prev) =>
      prev.map((m) => {
        const item = cart.find((i) => i.id === m.id);
        return item ? { ...m, stock: m.stock + item.qty } : m;
      }),
    );
    setCart([]);
    setDiscountEnabled(false);
    alert("Cart cleared successfully!");
  };

  const completeSale = () => {
    setCart([]);
    setDiscountEnabled(false);
    alert("✅ Sale completed successfully!");
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = discountEnabled ? Math.round(subtotal * 0.05) : 0;
  const tax = Math.round((subtotal - discount) * 0.13);
  const total = subtotal - discount + tax;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-slate-200">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Pill /> Pharmacy POS
            </h1>
            <p>Invoice: {invoiceNumber}</p>
            <p className="text-sm">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm">Items in cart</p>
            <p className="text-2xl font-bold">{cart.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
              <Search size={18} />
              <input
                placeholder="Search medicine..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1 rounded-full border ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((med) => (
                <div key={med.id} className="bg-white rounded-2xl shadow p-5">
                  <p className="text-xs text-indigo-600">{med.category}</p>
                  <h3 className="text-lg font-semibold">{med.name}</h3>

                  <p
                    className={`text-sm ${
                      med.stock <= 10 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    Stock: {med.stock}
                    {med.stock <= 10 && " (Low stock!)"}
                  </p>

                  <div className="flex justify-between mt-4">
                    <span className="font-bold text-green-600">
                      {formatCurrency(med.price)}
                    </span>
                    <button
                      disabled={med.stock === 0}
                      onClick={() => addToCart(med)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-5">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <ShoppingCart /> Cart
            </h2>

            {cart.length === 0 ? (
              <p className="text-center text-gray-500">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between mb-3">
                  <p>{item.name}</p>
                  <div className="flex gap-2">
                    <button onClick={() => updateQty(item.id, -1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}>
                      <Plus size={14} />
                    </button>
                    <button onClick={() => updateQty(item.id, -item.qty)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <input
                  type="checkbox"
                  checked={discountEnabled}
                  onChange={() => setDiscountEnabled(!discountEnabled)}
                />
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <button
                onClick={completeSale}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Complete Sale
              </button>

              <button
                onClick={clearCart}
                className="w-full bg-gray-200 py-2 rounded"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sales;
