import React from "react";
import { Trash2, Mail, Shield } from "lucide-react";

export interface Admin {
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
    <article
      aria-label={`${admin.name}, ${admin.role}`}
      className="flex items-center justify-between bg-white p-4 mb-4 border border-gray-200 rounded-xl shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition"
    >
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
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                isSuperAdmin
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {isSuperAdmin && <Shield size={12} aria-hidden />}
              {admin.role}
            </span>
          </h2>

          <a
            href={`mailto:${admin.email}`}
            className="text-sm text-gray-500 flex items-center gap-1 truncate hover:text-blue-600 transition"
          >
            <Mail size={14} className="shrink-0" aria-hidden />
            <span className="truncate">{admin.email}</span>
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(admin.id)}
        disabled={isSuperAdmin}
        title={isSuperAdmin ? "Super Admin cannot be deleted" : undefined}
        aria-label={isSuperAdmin ? "Super Admin cannot be deleted" : `Delete ${admin.name}`}
        className={`shrink-0 p-2 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          isSuperAdmin
            ? "text-gray-400 cursor-not-allowed focus-visible:ring-gray-300"
            : "text-red-500 hover:bg-red-100 active:scale-95 focus-visible:ring-red-400"
        }`}
      >
        <Trash2 size={18} />
      </button>
    </article>
  );
};

export default AdminCard;
