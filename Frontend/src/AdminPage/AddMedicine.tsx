import React, { useState } from "react";
import {
  Pill,
  Hash,
  Package,
  Calendar,
  DollarSign,
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";

const AddMedicine: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    batch: "",
    quantity: "",
    expiry: "",
    price: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (e.target.name === "batch") {
      value = value.toUpperCase();
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedForm = {
      name: form.name.trim(),
      batch: form.batch.trim(),
      quantity: form.quantity,
      expiry: form.expiry,
      price: form.price,
      category: form.category.trim(),
    };

    if (
      !cleanedForm.name ||
      !cleanedForm.quantity ||
      !cleanedForm.price ||
      !cleanedForm.category
    ) {
      return alert("Please fill all required fields!");
    }

    if (Number(cleanedForm.price) <= 0) {
      return alert("Price must be greater than zero.");
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setForm({
        name: "",
        batch: "",
        quantity: "",
        expiry: "",
        price: "",
        category: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  const handleReset = () => {
    setForm({
      name: "",
      batch: "",
      quantity: "",
      expiry: "",
      price: "",
      category: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
      <Header />

      <main className="flex-1 w-full px-6 py-12 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto space-y-8">
          {success && (
            <div className="flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-xl shadow-md animate-pulse">
              <CheckCircle size={18} />
              Medicine successfully added!
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 text-green-600 rounded-2xl">
                <Pill size={28} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">Add New Medicine</h1>

                <p className="text-gray-500 text-sm">
                  Enter medicine details to add to inventory
                </p>
              </div>
            </div>

            <Link
              to="/admin"
              className="flex items-center gap-2 text-sm bg-gray-900 text-white px-4 py-2 rounded-xl hover:scale-105 transition"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl p-8 space-y-8 focus-within:ring-2 focus-within:ring-green-200 transition"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medicine Name */}
              <div>
                <InputField
                  icon={<Pill />}
                  label="Medicine Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter medicine name"
                  maxLength={60}
                  required
                />

                <p className="text-xs text-gray-400 mt-1">
                  {form.name.length}/60 characters
                </p>
              </div>

              {/* Batch */}
              <InputField
                icon={<Hash />}
                label="Batch Number"
                name="batch"
                value={form.batch}
                onChange={handleChange}
                placeholder="Enter batch number"
                maxLength={20}
              />

              {/* Quantity */}
              <InputField
                icon={<Package />}
                label="Quantity"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                min="0"
                max="10000"
                placeholder="Enter quantity"
                required
              />

              {/* Expiry */}
              <InputField
                icon={<Calendar />}
                label="Expiry Date"
                name="expiry"
                type="date"
                value={form.expiry}
                onChange={handleChange}
                min={today}
              />

              {/* Price */}
              <div>
                <InputField
                  icon={<DollarSign />}
                  label="Price (Rs)"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />

                {form.price && form.quantity && (
                  <p className="text-xs text-green-600 mt-1">
                    Total Stock Value: Rs{" "}
                    {(Number(form.price) * Number(form.quantity)).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <InputField
                  icon={<Package />}
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Select category"
                  required
                />

                <datalist id="medicineCategories">
                  <option value="Antibiotic" />
                  <option value="Painkiller" />
                  <option value="Vitamin" />
                  <option value="Antiseptic" />
                  <option value="Tablet" />
                  <option value="Syrup" />
                </datalist>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white shadow-lg transition
                  ${
                    loading
                      ? "bg-gray-400"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02]"
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Medicine
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 transition"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface InputProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  step?: string;
}

const InputField: React.FC<InputProps> = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  min,
  max,
  maxLength,
  step,
}) => (
  <div>
    <label className="text-sm font-medium text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <div className="flex items-center mt-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-green-500 transition">
      <span className="text-gray-400">{icon}</span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        min={min}
        max={max}
        maxLength={maxLength}
        step={step}
        className="w-full bg-transparent outline-none px-3 text-sm focus:text-green-700"
        required={required}
      />
    </div>
  </div>
);

export default AddMedicine;
