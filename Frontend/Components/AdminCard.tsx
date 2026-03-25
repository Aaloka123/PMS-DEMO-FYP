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
  return (
    <div className="flex items-center justify-between bg-white p-4 mb-4 border rounded-lg shadow-sm hover:border-blue-400 hover:bg-blue-50 transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
          {admin.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            {admin.name}

            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
              {admin.role}
            </span>
          </h2>

          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Mail size={14} />
            {admin.email}
          </p>
        </div>
      </div>

      <button
        onClick={() => onDelete(admin.id)}
        className="text-red-500 hover:bg-red-100 p-2 rounded"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default AdminCard;
