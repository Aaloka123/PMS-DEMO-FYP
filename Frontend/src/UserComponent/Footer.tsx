import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Mail, Phone, ArrowUp } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const systemVersion = "1.1.0";
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Medicines", path: "/medicines" },
    { name: "Inventory", path: "/inventory" },
    { name: "Sales", path: "/sales" },
    { name: "Reports", path: "/reports" },
  ];

  const systemStatus = "Live";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 text-white mt-12 shadow-xl relative">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">PharmaCare</h2>
          <p className="text-sm text-blue-100 mt-4 leading-relaxed">
            A modern Pharmacy Management System built to manage medicines,
            inventory, billing, and analytics efficiently.
          </p>

          {/* NEW CLOCK */}
          <p className="text-xs mt-3 text-blue-200">
            Time: {time.toLocaleTimeString()}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="text-blue-200 hover:text-white hover:pl-2 transition-all duration-200"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-lg">Contact & System</h3>
          <ul className="space-y-3 text-sm text-blue-200">
            <li className="flex items-center gap-2 hover:text-white transition">
              <Mail size={16} /> support@pharmacare.com
            </li>
            <li className="flex items-center gap-2 hover:text-white transition">
              <Phone size={16} /> +977-9800000000
            </li>
            <li className="flex items-center gap-2 hover:text-white transition">
              <Facebook size={16} /> PharmaCare Official
            </li>

            <li className="mt-3">Version: {systemVersion}</li>

            <li>
              Status:{" "}
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {systemStatus}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className="absolute right-6 top-6 bg-white text-blue-800 p-2 rounded-full shadow-md hover:scale-110 transition"
      >
        <ArrowUp size={18} />
      </button>

      <div className="border-t border-blue-600 text-center text-sm py-5 text-blue-200">
        © {currentYear} PharmaCare | Developed by Aaloka Poudel | All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
