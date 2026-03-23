import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  ArrowLeft,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../UserComponent/Header";
import Footer from "../UserComponent/Footer";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-gray-200">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto p-6 space-y-8">
        {/* Back Button */}
        <Link
          to="/admin"
          className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 />
              Sales & Reports Overview
            </h1>
            <p className="opacity-80 mt-2">
              Monitor sales performance and analytics insights
            </p>
            <p className="text-xs opacity-70 mt-2">
              Last Updated: {lastUpdated}
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

            <button className="flex items-center gap-2 bg-white text-purple-700 px-4 py-2 rounded-xl shadow hover:bg-gray-100 transition">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-4 shadow flex justify-between text-sm font-medium">
          <span>Total Sales: Rs {reportData.sales.toLocaleString()}</span>
          <span>Transactions: {reportData.transactions}</span>
          <span className={growthColor}>
            Growth: {reportData.growth > 0 ? "+" : ""}
            {reportData.growth}%
          </span>
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

          <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-2xl hover:bg-gray-50 transition">
            Interactive Chart Coming Soon...
          </div>
        </div>
      </main>

      <Footer />
    </div>
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
