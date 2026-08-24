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
      icon: <Github size={16} />,
      link: "https://github.com",
      label: "GitHub",
      hover: "hover:bg-slate-600 hover:text-white",
    },
    {
      icon: <Linkedin size={16} />,
      link: "https://linkedin.com",
      label: "LinkedIn",
      hover: "hover:bg-blue-600 hover:text-white",
    },
    {
      icon: <Twitter size={16} />,
      link: "https://twitter.com",
      label: "Twitter",
      hover: "hover:bg-sky-500 hover:text-white",
    },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-24 overflow-hidden border-t border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-300">
      {/* Status bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 px-6 py-3">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs md:flex-row">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-300">
            <CircleCheck size={14} className="shrink-0" aria-hidden />
            <span className="font-medium">All systems operational</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <Server size={14} aria-hidden />
            Secure encrypted admin infrastructure
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-14">
        {/* Brand */}
        <section className="sm:col-span-2 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/30">
              <ShieldCheck className="text-blue-400" size={20} aria-hidden />
            </span>
            <h2 className="text-lg font-bold tracking-tight text-white">
              PharmaCare Admin
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            Enterprise-grade pharmacy management for secure operations,
            real-time analytics, and compliance.
          </p>

          <a
            href="mailto:support@pharmacare.com"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-500/40 hover:bg-slate-800 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Mail size={15} aria-hidden />
            support@pharmacare.com
          </a>
        </section>

        {/* Navigation */}
        <section>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
            Navigation
          </h3>
          <ul className="space-y-2.5">
            {navigation.map((item) => (
              <li key={item.link}>
                <Link
                  to={item.link}
                  className="group relative inline-block text-sm text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-blue-400 transition-all duration-200 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Resources */}
        <section>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
            Resources
          </h3>
          <ul className="space-y-2.5">
            {resources.map((item) => (
              <li key={item.link}>
                <Link
                  to={item.link}
                  className="group relative inline-block text-sm text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-slate-400 transition-all duration-200 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Connect */}
        <section>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
            Connect
          </h3>

          <div className="mb-5 flex gap-2.5">
            {social.map((item) => (
              <a
                key={item.label}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/80 text-slate-300 transition duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${item.hover}`}
              >
                {item.icon}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/50 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowUp size={14} aria-hidden />
            Back to top
          </button>
        </section>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/80 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-slate-500 md:flex-row">
          <p>© {year} PharmaCare Admin Platform</p>

          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {legal.map((item) => (
              <li key={item.link}>
                <Link
                  to={item.link}
                  className="transition hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <p className="flex items-center gap-2 text-slate-600">
            <Server size={12} aria-hidden />
            v1.0 · Updated {lastUpdated}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
