import React, { useEffect, useState, useCallback } from "react";
import {
  Users,
  Pill,
  Store,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface CardData {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  growth: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<CardData[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const today = new Date().toLocaleDateString();

  // Simulated API fetch
  const fetchData = useCallback(() => {
    const newData: CardData[] = [
      {
        title: "Total Admins",
        value: 12,
        icon: <Users size={28} />,
        color: "from-blue-500 to-blue-600",
        growth: 5,
      },
      {
        title: "Pharmacies",
        value: 8,
        icon: <Store size={28} />,
        color: "from-green-500 to-green-600",
        growth: -2,
      },
      {
        title: "Medicines",
        value: 320,
        icon: <Pill size={28} />,
        color: "from-purple-500 to-purple-600",
        growth: 10,
      },
      {
        title: "Total Sales",
        value: 150000,
        icon: <BarChart3 size={28} />,
        color: "from-orange-500 to-orange-600",
        growth: 12,
      },
    ];

    setData(newData);
    setLastUpdated(new Date());
  }, []);

  // Initial load + auto refresh
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000); // refresh every 10 sec

    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Super Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back! Here is the overview of your pharmacy system.
        </p>

        <p className="text-sm text-gray-400 mt-1">Today: {today}</p>
      </div>

      {/* Section Title */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        System Statistics
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.map((card, index) => {
          const isPositive = card.growth >= 0;

          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${card.color} text-white p-6 rounded-2xl shadow-lg 
              hover:shadow-2xl hover:ring-2 hover:ring-white/40 
              transform hover:-translate-y-1 hover:scale-105 
              transition-all duration-300`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90">{card.title}</p>

                  <h2 className="text-3xl font-bold mt-2">
                    {card.title === "Total Sales"
                      ? `Rs ${card.value.toLocaleString()}`
                      : card.value}
                  </h2>

                  {/* Growth Indicator */}
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    {isPositive ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <span>
                      {isPositive ? "+" : ""}
                      {card.growth}%
                    </span>
                  </div>

                  {/* Status */}
                  <span className="text-xs bg-white/20 px-2 py-1 rounded mt-2 inline-block">
                    Active
                  </span>
                </div>

                <div className="bg-white/20 p-3 rounded-full">{card.icon}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t mt-10 pt-4"></div>

      {/* Footer */}
      <div className="text-sm text-gray-600 flex justify-between">
        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        <span>Dashboard v2.0</span>
      </div>
    </div>
  );
};

export default Dashboard;
