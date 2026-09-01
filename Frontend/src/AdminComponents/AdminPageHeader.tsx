import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  backTo?: string;
  backLabel?: string;
  action?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  iconClassName = "bg-blue-100 text-blue-600",
  backTo = "/admin",
  backLabel = "Back to dashboard",
  action,
}) => {
  return (
    <div className="space-y-4 border-b border-slate-200/80 pb-6">
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft size={16} aria-hidden />
        {backLabel}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`rounded-2xl p-3 shadow-sm ${iconClassName}`}>
              <Icon size={26} aria-hidden />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>
    </div>
  );
};

export default AdminPageHeader;
