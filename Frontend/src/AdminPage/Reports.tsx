import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";
import AdminLayout from "../AdminComponents/AdminLayout";
import AdminPageHeader from "../AdminComponents/AdminPageHeader";

type FilterType = "This Week" | "This Month" | "This Year";

const Reports: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>("This Month");
  const [fade, setFade] = useState(false);

  const handleFilterChange = (value: FilterType) => {
    setFade(true);
    setTimeout(() => {
      setFilter(value);
      setFade(false);
    }, 200);
  };

  const reportData =
    filter === "This Week"
      ? { sales: 75000, revenue: 8450, transactions: 42, growth: 8 }
      : filter === "This Year"
        ? { sales: 1245000, revenue: 98450, transactions: 1580, growth: 18 }
        : { sales: 245000, revenue: 12450, transactions: 158, growth: 12 };

  const lastUpdated = new Date().toLocaleString();

  const growthColor = reportData.growth > 0 ? "text-green-600" : "text-red-500";

  return (
    <AdminLayout narrow>
      <div className="space-y-8">
        <AdminPageHeader
          title="Sales & Reports"
          description={`Last updated: ${lastUpdated}`}
          icon={BarChart3}
          iconClassName="bg-purple-100 text-purple-700"
          action={
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-md ring-1 ring-purple-100 transition hover:bg-purple-50"
            >
              <Download size={16} aria-hidden />
              Export
            </button>
          }
        />

        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <p className="text-sm font-medium text-purple-100">Analytics overview</p>
            <p className="opacity-80 mt-2">
              Monitor sales performance and analytics insights
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value as FilterType)}
              className="bg-white text-gray-700 px-4 py-2 rounded-xl shadow-md focus:ring-2 focus:ring-purple-400 outline-none"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Sales</p>
            <p className="mt-1 text-xl font-bold text-slate-800">
              Rs {reportData.sales.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Transactions</p>
            <p className="mt-1 text-xl font-bold text-slate-800">
              {reportData.transactions}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Growth</p>
            <p className={`mt-1 text-xl font-bold ${growthColor}`}>
              {reportData.growth > 0 ? "+" : ""}
              {reportData.growth}%
            </p>
          </div>
        </div>

        {/* Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          <ReportCard
            title="Total Sales"
            value={`Rs ${reportData.sales.toLocaleString()}`}
            progress={reportData.growth}
            icon={<TrendingUp />}
            gradient="from-green-500 to-emerald-600"
          />

          <ReportCard
            title="Revenue"
            value={`Rs ${reportData.revenue.toLocaleString()}`}
            progress={70}
            icon={<Calendar />}
            gradient="from-blue-500 to-cyan-600"
          />

          <ReportCard
            title="Transactions"
            value={reportData.transactions.toString()}
            progress={60}
            icon={<BarChart3 />}
            gradient="from-purple-500 to-indigo-600"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-xl font-semibold mb-4">
            Sales Performance Chart ({filter})
          </h2>

          <div className="h-64 flex flex-col items-center justify-center gap-2 text-gray-400 border-2 border-dashed rounded-2xl bg-slate-50/60">
            <BarChart3 size={36} className="opacity-40" aria-hidden />
            <p className="font-medium text-slate-500">
              Chart preview for {filter}
            </p>
            <p className="text-xs text-slate-400">
              Interactive analytics coming soon
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

/* ---------- Report Card ---------- */

interface ReportCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  progress: number;
}

const ReportCard: React.FC<ReportCardProps> = ({
  title,
  value,
  icon,
  gradient,
  progress,
}) => {
  const isPositive = progress >= 0;

  return (
    <div className="relative bg-white rounded-3xl p-6 shadow-lg overflow-hidden transition hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-purple-400">
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-20 rounded-bl-full`}
      />

      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{value}</h2>

      {/* Growth Indicator */}
      <p
        className={`text-sm mt-1 font-medium ${
          isPositive ? "text-green-600" : "text-red-500"
        }`}
      >
        {isPositive ? "+" : ""}
        {progress}%
      </p>

      {/* Progress Bar */}
      <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{ width: `${Math.abs(progress)}%` }}
        />
      </div>

      {/* Icon */}
      <div
        className={`mt-4 w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${gradient}`}
      >
        {icon}
      </div>
    </div>
  );
};

export default Reports;
