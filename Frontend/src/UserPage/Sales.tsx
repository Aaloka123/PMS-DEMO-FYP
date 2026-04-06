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
  const [medicines, setMedicines] = useState(initialMedicines);
  const [cart, setCart] = useState<(Medicine & { qty: number })[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [message, setMessage] = useState("");

  const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();

  const categories = ["All", "Pain", "Antibiotic", "Supplement", "Cold"];

  const formatCurrency = (amt: number) => `Rs ${amt.toFixed(2)}`;

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  const filtered = medicines.filter(
    (m) =>
      (activeCategory === "All" || m.category === activeCategory) &&
      m.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (med: Medicine) => {
    if (med.stock <= 0) return;

    const exists = cart.find((i) => i.id === med.id);

    setCart((prev) =>
      exists
        ? prev.map((i) => (i.id === med.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...med, qty: 1 }],
    );

    setMedicines((prev) =>
      prev.map((m) =>
        m.id === med.id ? { ...m, stock: Math.max(0, m.stock - 1) } : m,
      ),
    );

    showMessage(`${med.name} added`);
  };

  const updateQty = (id: number, delta: number) => {
    const item = cart.find((i) => i.id === id);
    const med = medicines.find((m) => m.id === id);
    if (!item || !med) return;

    if (delta > 0 && med.stock === 0) return;

    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );

    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, stock: Math.max(0, m.stock - delta) } : m,
      ),
    );
  };

  const removeItem = (id: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stock: m.stock + item.qty } : m)),
    );

    setCart((prev) => prev.filter((i) => i.id !== id));
    showMessage("Item removed");
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
    showMessage("Cart cleared");
  };

  const completeSale = () => {
    if (cart.length === 0) return;
    setCart([]);
    setDiscountEnabled(false);
    showMessage("Sale completed ✅");
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = discountEnabled ? subtotal * 0.05 : 0;
  const tax = (subtotal - discount) * 0.13;
  const total = subtotal - discount + tax;

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />

      {/* Toast Message */}
      {message && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow">
          {message}
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-blue-600 text-white p-5 rounded-xl flex justify-between">
          <div>
            <h1 className="text-2xl font-bold flex gap-2 items-center">
              <Pill /> Pharmacy POS
            </h1>
            <p>{invoiceNumber}</p>
            <p className="text-sm">{now.toLocaleString()}</p>
          </div>
          <div>
            <p>Total Items</p>
            <p className="text-xl">{totalItems}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Products */}
          <div className="lg:col-span-3">
            <div className="flex items-center bg-white p-3 rounded mb-3">
              <Search size={16} />
              <input
                className="ml-2 w-full outline-none"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((med) => (
                <div key={med.id} className="bg-white p-4 rounded shadow">
                  <h3>{med.name}</h3>
                  <p className="text-sm">{med.category}</p>
                  <p className={med.stock <= 10 ? "text-red-500" : ""}>
                    Stock: {med.stock}
                  </p>
                  <div className="flex justify-between mt-2">
                    <span>{formatCurrency(med.price)}</span>
                    <button
                      onClick={() => addToCart(med)}
                      disabled={med.stock === 0}
                      className="bg-blue-600 text-white px-2 rounded"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="flex gap-2 items-center mb-3">
              <ShoppingCart /> Cart
            </h2>

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <div className="flex gap-1 items-center">
                  <button onClick={() => updateQty(item.id, -1)}>
                    <Minus size={14} />
                  </button>
                  {item.qty}
                  <button onClick={() => updateQty(item.id, 1)}>
                    <Plus size={14} />
                  </button>
                  <button onClick={() => removeItem(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <div className="border-t mt-3 pt-3 text-sm">
              <p>Subtotal: {formatCurrency(subtotal)}</p>
              <p>Tax: {formatCurrency(tax)}</p>
              <p className="font-bold">Total: {formatCurrency(total)}</p>

              <button
                disabled={cart.length === 0}
                onClick={completeSale}
                className="w-full bg-green-600 text-white mt-2 py-1 rounded disabled:bg-gray-400"
              >
                Complete Sale
              </button>

              <button
                onClick={clearCart}
                className="w-full bg-gray-200 mt-2 py-1 rounded"
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
