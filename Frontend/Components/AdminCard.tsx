import React from "react";
import { Trash2, Mail } from "lucide-react";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Props {
  admin: Admin;
  onDelete: (id: number) => void;
}

const AdminCard: React.FC<Props> = ({ admin, onDelete }) => {
  const isSuperAdmin = admin.role === "Super Admin";
  const initial = (admin.name.trim().charAt(0) || "?").toUpperCase();

  return (
    <div className="flex items-center justify-between bg-white p-4 mb-4 border border-gray-200 rounded-xl shadow-sm hover:border-blue-400 hover:bg-blue-50 transition">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-white font-semibold ${
            isSuperAdmin ? "bg-purple-600" : "bg-blue-500"
          }`}
          aria-hidden
        >
          {initial}
        </div>

        <div className="min-w-0">
          <h2 className="font-semibold text-gray-800 flex flex-wrap items-center gap-2">
            <span className="truncate">{admin.name}</span>

            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isSuperAdmin
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {admin.role}
            </span>
          </h2>

          <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
            <Mail size={14} className="shrink-0" aria-hidden />
            <span className="truncate">{admin.email}</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(admin.id)}
        disabled={isSuperAdmin}
        title={isSuperAdmin ? "Super Admin cannot be deleted" : undefined}
        aria-label={isSuperAdmin ? "Super Admin cannot be deleted" : `Delete ${admin.name}`}
        className={`shrink-0 p-2 rounded-lg transition ${
          isSuperAdmin
            ? "text-gray-400 cursor-not-allowed"
            : "text-red-500 hover:bg-red-100"
        }`}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default AdminCard;
