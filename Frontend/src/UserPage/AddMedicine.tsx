import React, { useState, useEffect, useRef, useMemo } from "react";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";
import { useNavigate } from "react-router-dom";
import { Pill, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";

/* Reusable Input Component */
const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
}: any) => (
  <div>
    <label className="text-sm">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      aria-invalid={!!error}
      className={`w-full border p-2 rounded ${error ? "border-red-500" : ""}`}
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const AddMedicine: React.FC = () => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    expiry: "",
    description: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  /* Generate ID */
  useEffect(() => {
    const id = "MED-" + crypto.randomUUID().slice(0, 6);
    setForm((prev) => ({ ...prev, id }));
    nameRef.current?.focus();
  }, []);

  /* Validation */
  const validate = (data: typeof form) => {
    const err: any = {};

    if (!data.name) err.name = "Required";
    if (!data.category) err.category = "Required";

    if (!data.price || Number(data.price) <= 0) err.price = "Price must be > 0";
    if (Number(data.price) > 100000) err.price = "Too high";

    if (Number(data.stock) < 0) err.stock = "Cannot be negative";
    if (Number(data.stock) > 10000) err.stock = "Too large";

    if (!data.expiry || new Date(data.expiry) < new Date())
      err.expiry = "Invalid expiry";

    return err;
  };

  /* Debounced validation */
  useEffect(() => {
    const t = setTimeout(() => {
      setErrors(validate(form));
    }, 300);
    return () => clearTimeout(t);
  }, [form]);

  /* Handle Change */
  const handleChange = (e: any) => {
    let value = e.target.value.replace(/\s+/g, " ").trimStart();

    if (e.target.name === "price" || e.target.name === "stock") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    if (e.target.name === "name") {
      value = value
        .split(" ")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    setIsDirty(true);
    setForm({ ...form, [e.target.name]: value });
  };

  const isFormValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  /* Scroll to first error */
  const scrollToError = () => {
    const firstError = document.querySelector(".text-red-500");
    firstError?.scrollIntoView({ behavior: "smooth" });
  };

  /* Submit */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      scrollToError();
      return;
    }

    if (loading) return; // prevent double submit

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setIsDirty(false);
      setTimeout(() => navigate("/medicines"), 1200);
    }, 1000);
  };

  /* Warn before leaving */
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (isDirty && !success) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty, success]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-600">
          <Pill /> Add Medicine
        </h1>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 flex items-center gap-2">
            <CheckCircle size={18} />
            Saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          {/* FORM */}
          <div className="lg:col-span-2 space-y-4 bg-white p-4 rounded-xl shadow">
            <InputField
              label="Medicine Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />

            <InputField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              error={errors.category}
            />

            <InputField
              label="Price"
              name="price"
              value={form.price}
              onChange={handleChange}
              error={errors.price}
            />

            <InputField
              label="Stock"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              error={errors.stock}
            />

            <InputField
              label="Expiry"
              name="expiry"
              type="date"
              value={form.expiry}
              onChange={handleChange}
              error={errors.expiry}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* PREVIEW */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Preview</h2>

            <p>
              <b>ID:</b> {form.id}
            </p>
            <p>
              <b>Name:</b> {form.name || "—"}
            </p>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded flex justify-center items-center gap-2 disabled:bg-gray-400"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/medicines")}
              className="w-full mt-2 border py-2 rounded"
            >
              <ArrowLeft size={14} className="inline mr-1" />
              Cancel
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default AddMedicine;
