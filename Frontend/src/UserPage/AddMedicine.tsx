import React, { useState, useEffect } from "react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";
import { useNavigate } from "react-router-dom";
import {
  Pill,
  DollarSign,
  Truck,
  CheckCircle,
  AlertTriangle,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";

interface MedicineForm {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  expiry: string;
  supplier: string;
  batch: string;
  manufacturer: string;
  description: string;
}

const AddMedicine: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<MedicineForm>({
    id: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    expiry: "",
    supplier: "",
    batch: "",
    manufacturer: "",
    description: "",
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const generatedId = "MED-" + Math.floor(Math.random() * 100000);
    setForm((prev) => ({ ...prev, id: generatedId }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    let value = e.target.value;

    // Prevent negative values
    if (e.target.name === "price" || e.target.name === "stock") {
      if (Number(value) < 0) return;
    }

    // Capitalize each word in medicine name
    if (e.target.name === "name") {
      value = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    setForm({ ...form, [e.target.name]: value });
  };

  const handleReset = () => {
    setForm({
      ...form,
      name: "",
      category: "",
      price: "",
      stock: "",
      expiry: "",
      supplier: "",
      batch: "",
      manufacturer: "",
      description: "",
    });
  };

  const isFormValid =
    form.name &&
    form.category &&
    Number(form.price) > 0 &&
    Number(form.stock) >= 0 &&
    form.expiry;

  const isFormEmpty =
    !form.name && !form.category && !form.price && !form.stock && !form.expiry;

  const isLowStock = Number(form.stock) > 0 && Number(form.stock) < 10;

  const getExpiryStatus = () => {
    if (!form.expiry) return { text: "—", color: "" };

    const today = new Date();
    const expiryDate = new Date(form.expiry);
    const diffDays =
      (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

    if (diffDays < 0) return { text: "Expired", color: "text-red-600" };
    if (diffDays <= 30)
      return { text: "Expiring Soon", color: "text-yellow-600" };
    return { text: "Safe", color: "text-green-600" };
  };

  const formatDate = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price: string) => {
    if (!price) return "—";
    return `Rs ${Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;
  };

  const descriptionLength = form.description.length;

  const stockColor =
    Number(form.stock) === 0
      ? "text-red-600"
      : Number(form.stock) < 10
        ? "text-yellow-600"
        : "text-green-600";

  const expiryStatus = getExpiryStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSuccess(true);

    setTimeout(() => {
      navigate("/medicines");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      <Header />

      <main className="flex-grow p-6 max-w-6xl mx-auto w-full">
        <div className="bg-white rounded-2xl p-6 shadow mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-blue-600">
            <Pill />
            Add New Medicine
          </h1>

          <p className="text-gray-500 mt-2">
            Generated Medicine ID: <b>{form.id}</b>
          </p>
        </div>

        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 flex items-center gap-2">
            <CheckCircle size={18} />
            Medicine added successfully!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            {/* Your existing form fields remain unchanged */}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" />
              Live Preview
            </h2>

            <ul className="text-sm space-y-2 text-gray-600">
              <li>
                <b>ID:</b> {form.id}
              </li>
              <li>
                <b>Name:</b> {form.name || "—"}
              </li>
              <li>
                <b>Category:</b> {form.category || "—"}
              </li>
              <li>
                <b>Price:</b> {formatPrice(form.price)}
              </li>

              <li>
                <b>Description:</b> {form.description || "—"}
                <div className="text-xs text-gray-400 mt-1">
                  {descriptionLength} characters
                </div>
              </li>

              <li className={stockColor}>
                <b>Stock:</b> {form.stock || "—"}
              </li>

              <li>
                <b>Expiry:</b> {formatDate(form.expiry)}
              </li>

              <li className={expiryStatus.color}>
                <b>Status:</b> {expiryStatus.text}
              </li>
            </ul>

            {isLowStock && (
              <div className="mt-4 flex items-center gap-2 text-yellow-600 text-sm">
                <AlertTriangle size={16} />
                Warning: Low stock!
              </div>
            )}

            <div className="border-t mt-4 pt-4 space-y-3">
              <button
                type="submit"
                disabled={!isFormValid || success}
                className={`w-full py-3 rounded-xl text-white ${
                  isFormValid
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Save Medicine
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isFormEmpty}
                className="w-full flex items-center justify-center gap-2 border py-2 rounded-xl hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCcw size={14} />
                Clear Form
              </button>

              <button
                type="button"
                onClick={() => navigate("/medicines")}
                className="w-full flex items-center justify-center gap-2 border py-2 rounded-xl hover:bg-gray-100"
              >
                <ArrowLeft size={14} />
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default AddMedicine;
