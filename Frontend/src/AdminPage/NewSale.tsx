import React, { useState, useMemo } from "react";
import { Plus, Trash2, Printer, RotateCcw, X } from "lucide-react";

interface Item {
  name: string;
  price: number;
  quantity: number;
}

const medicineData: { name: string; price: number }[] = [
  { name: "Paracetamol", price: 20 },
  { name: "Amoxicillin", price: 35 },
  { name: "Ibuprofen", price: 25 },
  { name: "Cough Syrup", price: 80 },
  { name: "Vitamin C", price: 15 },
];

const formatRs = (value: number) => `Rs ${value.toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const NewSale: React.FC = () => {
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // NEW
  const [search, setSearch] = useState(""); // NEW
  const [discountEnabled, setDiscountEnabled] = useState(false);

  const [items, setItems] = useState<Item[]>([
    { name: "", price: 0, quantity: 1 },
  ]);

  // Improved invoice number
  const invoiceNumber = useMemo(() => {
    const year = new Date().getFullYear();
    const time = Date.now().toString().slice(-4);
    return `INV-${year}-${time}`;
  }, []);

  const today = new Date().toLocaleDateString();

  const filteredMedicines = medicineData.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string | number,
  ) => {
    const updated = [...items];

    if (field === "name") {
      const selectedMed = medicineData.find((med) => med.name === value);
      updated[index] = {
        ...updated[index],
        name: value as string,
        price: selectedMed ? selectedMed.price : 0,
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: Math.max(0, Number(value)),
      };
    }

    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { name: "", price: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.13;
  const discount = discountEnabled ? subtotal * 0.05 : 0;
  const total = subtotal + tax - discount;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const clearInvoice = () => {
    setCustomer("");
    setEmail("");
    setPhone("");
    setSearch("");
    setDiscountEnabled(false);
    setItems([{ name: "", price: 0, quantity: 1 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hasValidItem = items.some((item) => item.name !== "");
    if (!hasValidItem) {
      alert("Please select at least one medicine.");
      return;
    }

    alert("Invoice Generated Successfully!");
    clearInvoice();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8">
          <h1 className="text-3xl font-bold">New Sales Invoice</h1>
          <div className="flex justify-between mt-4 text-sm opacity-90">
            <span>Invoice No: {invoiceNumber}</span>
            <span>Date: {today}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Customer Info */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
              placeholder="Enter customer name"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Customer Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="customer@email.com"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* NEW Phone */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Customer Phone <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98XXXXXXXX"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Discount */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={discountEnabled}
              onChange={() => setDiscountEnabled(!discountEnabled)}
            />
            <span className="text-sm font-medium">Apply 5% Discount</span>
          </div>

          {/* Medicine Search */}
          <div>
            <label className="text-sm font-semibold">Search Medicine</label>
            <input
              type="text"
              placeholder="Type medicine name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {search && filteredMedicines.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">No medicines match &quot;{search}&quot;</p>
            )}
          </div>

          {/* Items Table */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Invoice Items ({totalItems} items)
            </h2>

            <table className="w-full border rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="p-3 text-left">Medicine</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Qty</th>
                  <th className="p-3 text-left">Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <select
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        required
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select Medicine</option>
                        {filteredMedicines.map((med) => (
                          <option key={med.name} value={med.name}>
                            {med.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3 bg-gray-100">{formatRs(item.price)}</td>

                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        required
                        className="w-full p-2 border rounded-lg"
                      />
                    </td>

                    <td className="p-3 font-semibold">
                      {formatRs(item.price * item.quantity)}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        type="button"
                        disabled={items.length === 1}
                        onClick={() => removeItem(index)}
                        aria-label={`Remove item ${index + 1}`}
                        className="rounded-lg p-1 text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              onClick={addItem}
              className="mt-4 flex items-center gap-2 text-green-600 font-medium"
            >
              <Plus size={18} /> Add Item
            </button>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatRs(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>VAT (13%)</span>
              <span>{formatRs(tax)}</span>
            </div>

            {discountEnabled && (
              <div className="flex justify-between text-red-600">
                <span>Discount (5%)</span>
                <span>- {formatRs(discount)}</span>
              </div>
            )}

            {/* Highlight Total */}
            <div className="flex justify-between text-2xl font-bold text-green-700 border-t pt-3">
              <span>Grand Total</span>
              <span>{formatRs(total)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
            >
              Generate Invoice
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 bg-gray-300 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Printer size={18} /> Print
            </button>

            {/* NEW Clear Button */}
            <button
              type="button"
              onClick={clearInvoice}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} /> Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSale;
