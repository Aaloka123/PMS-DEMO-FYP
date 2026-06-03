import React from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ShieldCheck,
  ArrowUp,
  CircleCheck,
  Server,
} from "lucide-react";

const AdminFooter: React.FC = () => {
  const year = new Date().getFullYear();
  const lastUpdated = new Date().toLocaleDateString("en-NP", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const navigation = [
    { name: "Dashboard", link: "/admin" },
    { name: "Users", link: "/admin/users" },
    { name: "Inventory", link: "/admin/inventory" },
    { name: "Sales", link: "/admin/sales" },
    { name: "Reports", link: "/admin/reports" },
  ];

  const resources = [
    { name: "System Settings", link: "/admin/settings" },
    { name: "Audit Logs", link: "/admin/logs" },
    { name: "API Docs", link: "/docs" },
  ];

  const legal = [
    { name: "Privacy Policy", link: "/privacy" },
    { name: "Terms", link: "/terms" },
    { name: "Security", link: "/security" },
  ];

  const social = [
    {
      icon: <Github size={18} />,
      link: "https://github.com",
      label: "GitHub",
      hover: "hover:bg-gray-700",
    },
    {
      icon: <Linkedin size={18} />,
      link: "https://linkedin.com",
      label: "LinkedIn",
      hover: "hover:bg-blue-600",
    },
    {
      icon: <Twitter size={18} />,
      link: "https://twitter.com",
      label: "Twitter",
      hover: "hover:bg-sky-500",
    },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800 mt-24">
      {/* Live System Status Bar */}
      <div className="border-b border-gray-800 px-6 py-3 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-2">
        <div className="flex items-center gap-2">
          <CircleCheck size={14} className="text-green-500 animate-pulse" />
          <span className="font-medium text-gray-300">
            All Systems Operational
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <Server size={14} />
          Secure Encrypted Admin Infrastructure
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-blue-500" size={22} />
            <h2 className="text-white font-bold text-lg">PharmaCare Admin</h2>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed">
            Enterprise-grade pharmacy management platform designed for secure
            operations, real-time analytics, and regulatory compliance.
          </p>

          <a
            href="mailto:support@pharmacare.com"
            className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-blue-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <Mail size={16} />
            support@pharmacare.com
          </a>
        </section>

        {/* Navigation */}
        <section>
          <h3 className="text-white font-semibold mb-3">Navigation</h3>
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.link}>
                <Link
                  to={item.link}
                  className="text-gray-400 hover:text-white transition relative group inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Resources */}
        <section>
          <h3 className="text-white font-semibold mb-3">Resources</h3>
          <ul className="space-y-2">
            {resources.map((item) => (
              <li key={item.link}>
                <Link
                  to={item.link}
                  className="text-gray-400 hover:text-white transition relative group inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gray-400 transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Actions */}
        <section>
          <h3 className="text-white font-semibold mb-3">Connect</h3>

          <div className="flex gap-3 mb-6">
            {social.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className={`p-2 bg-gray-800 rounded-full transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-blue-500 ${item.hover}`}
              >
                {item.icon}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex items-center gap-2 rounded-lg text-sm text-gray-400 transition hover:bg-gray-800/60 hover:text-white px-2 py-1.5"
          >
            <ArrowUp size={14} />
            Back to top
          </button>
        </section>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-3">
        <p>© {year} PharmaCare Admin Platform</p>

        <ul className="flex flex-wrap justify-center gap-4">
          {legal.map((item) => (
            <li key={item.link}>
              <Link
                to={item.link}
                className="text-gray-500 transition hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-gray-600 flex items-center gap-2">
          <Server size={12} aria-hidden />
          v1.0 · Updated {lastUpdated}
        </p>
      </div>
    </footer>
  );
};

export default AdminFooter;
