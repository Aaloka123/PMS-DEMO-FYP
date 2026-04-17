import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingCart, Pill } from "lucide-react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";

interface Medicine {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem extends Medicine {
  qty: number;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState(0);

  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoice());

  function generateInvoice() {
    return `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const formatCurrency = (amt: number) => `Rs ${amt.toFixed(2)}`;

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem("salesHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("salesHistory", JSON.stringify(history));
  }, [history]);

  // Keyboard Enter = Complete Sale
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") completeSale();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (med: Medicine) => {
    if (med.stock <= 0) return;

    setCart((prev) => {
      const exists = prev.find((i) => i.id === med.id);
      return exists
        ? prev.map((i) => (i.id === med.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...med, qty: 1 }];
    });

    setMedicines((prev) =>
      prev.map((m) => (m.id === med.id ? { ...m, stock: m.stock - 1 } : m)),
    );
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );

    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, stock: delta > 0 ? m.stock - 1 : m.stock + 1 }
          : m,
      ),
    );
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;
  const change = amountPaid - total;

  const completeSale = () => {
    if (cart.length === 0) {
      showMessage("Cart is empty ❌");
      return;
    }

    if (amountPaid < total) {
      showMessage("Insufficient payment ❌");
      return;
    }

    const sale = {
      invoiceNumber,
      items: cart,
      total,
      customerName,
      paymentMethod,
      amountPaid,
      change,
      date: new Date().toLocaleString(),
    };

    setHistory((prev) => [sale, ...prev]);

    setCart([]);
    setAmountPaid(0);
    setCustomerName("");
    setInvoiceNumber(generateInvoice());

    showMessage("Sale completed ✅");
  };

  const lowStockItems = medicines.filter((m) => m.stock < 10);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />

      {message && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded">
          {message}
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded mb-4">
          <h1 className="flex items-center gap-2 text-xl">
            <Pill /> Pharmacy POS
          </h1>
          <p>{invoiceNumber}</p>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
            ⚠ Low Stock: {lowStockItems.map((m) => m.name).join(", ")}
          </div>
        )}

        {/* Customer Section */}
        <div className="bg-white p-3 rounded mb-3 shadow">
          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border p-2 w-full mb-2"
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 w-full mb-2"
          >
            <option>Cash</option>
            <option>Card</option>
            <option>eSewa</option>
          </select>

          <input
            type="number"
            placeholder="Amount Paid"
            value={amountPaid}
            onChange={(e) => setAmountPaid(Number(e.target.value))}
            className="border p-2 w-full"
          />
        </div>

        {/* Search */}
        <input
          placeholder="Search medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />

        {/* Auto Suggest */}
        {search && (
          <div className="bg-white border rounded shadow mb-3">
            {filtered.slice(0, 5).map((m) => (
              <div
                key={m.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  addToCart(m);
                  setSearch("");
                }}
              >
                {m.name}
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-4">
          {/* Products */}
          <div className="lg:col-span-3 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((med) => (
              <div key={med.id} className="bg-white p-3 rounded shadow">
                <h3>{med.name}</h3>
                <p>{med.category}</p>
                <p>Stock: {med.stock}</p>

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

          {/* Cart */}
          <div className="bg-white p-3 rounded shadow">
            <h2 className="flex gap-2">
              <ShoppingCart /> Cart
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 mt-4">Cart empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="mt-2">
                  {item.name} ({item.qty})
                  <div className="flex gap-2">
                    <Minus onClick={() => updateQty(item.id, -1)} />
                    <Plus onClick={() => updateQty(item.id, 1)} />
                    <Trash2 onClick={() => updateQty(item.id, -item.qty)} />
                  </div>
                </div>
              ))
            )}

            <div className="mt-3 text-sm">
              <p>Total: {formatCurrency(total)}</p>
              <p>Paid: {formatCurrency(amountPaid)}</p>
              <p>Change: {formatCurrency(change > 0 ? change : 0)}</p>

              <button
                onClick={completeSale}
                className="bg-green-600 text-white w-full mt-2 p-1 rounded"
              >
                Complete Sale
              </button>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-gray-200 w-full mt-2 p-1 rounded"
              >
                Toggle History
              </button>

              {showHistory && (
                <div className="mt-2 max-h-40 overflow-y-auto text-xs">
                  {history.length === 0 ? (
                    <p>No sales yet</p>
                  ) : (
                    history.slice(0, 5).map((sale, i) => (
                      <div key={i} className="border-b py-1">
                        <p>{sale.invoiceNumber}</p>
                        <p>{formatCurrency(sale.total)}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sales;
