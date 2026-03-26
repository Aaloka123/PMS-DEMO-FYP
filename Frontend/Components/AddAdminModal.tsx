import React, { useState } from "react";

interface Props {
  onAdd: (admin: { name: string; email: string; role: string }) => void;
  onClose: () => void;
}

const AddAdminModal: React.FC<Props> = ({ onAdd, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = () => {
    setError("");

    if (!name || !email) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      onAdd({ name, email, role });

      // reset form
      setName("");
      setEmail("");
      setRole("Admin");

      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-80 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Add Admin</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-2 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>Admin</option>
          <option>Super Admin</option>
        </select>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
