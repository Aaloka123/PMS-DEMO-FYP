import React from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ShieldCheck,
  ArrowUpRight,
  CircleCheck,
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Receipt,
  ArrowUp,
} from "lucide-react";

const AdminFooter: React.FC = () => {
  const year = new Date().getFullYear();
  const version = "v1.6.3";

  const quickLinks = [
    { name: "Dashboard", link: "/admin", icon: LayoutDashboard },
    { name: "Users", link: "/admin/users", icon: Users },
    { name: "Inventory", link: "/admin/inventory", icon: Package },
    { name: "Sales", link: "/admin/sales", icon: Receipt },
    { name: "Reports", link: "/admin/reports", icon: BarChart3 },
  ];

  const legal = [
    { name: "Privacy", link: "/privacy" },
    { name: "Terms", link: "/terms" },
    { name: "Security", link: "/security" },
  ];

  const social = [
    { icon: Github, link: "https://github.com", label: "GitHub" },
    { icon: Linkedin, link: "https://linkedin.com", label: "LinkedIn" },
    { icon: Twitter, link: "https://twitter.com", label: "Twitter" },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/5 bg-[#0b1220] text-slate-300">
      {/* Accent glow */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-600/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-16">
        {/* Top row: brand + CTA */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <CircleCheck size={12} aria-hidden />
                Live · Systems healthy
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {version}
              </span>
            </div>

            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                <ShieldCheck size={22} aria-hidden />
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  PharmaCare
                </h2>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Admin Console · Secure
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-400">
              Secure pharmacy operations, inventory control, and insights — in
              one admin workspace.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Support hours: Sun–Fri, 9:00 AM – 6:00 PM NPT
            </p>
          </div>

          <a
            href="mailto:support@pharmacare.com"
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-white/10 transition hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Mail size={16} aria-hidden />
            Contact support
            <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>

        {/* Quick link cards */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickLinks.map(({ name, link, icon: Icon }) => (
            <Link
              key={link}
              to={link}
              className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-cyan-400/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-cyan-300 ring-1 ring-white/10 transition group-hover:scale-105 group-hover:text-cyan-200">
                <Icon size={18} aria-hidden />
              </span>
              <span className="flex items-center justify-between gap-2 text-sm font-medium text-slate-200 group-hover:text-white">
                {name}
                <ArrowUpRight
                  size={14}
                  className="opacity-0 transition group-hover:opacity-100 text-cyan-300"
                  aria-hidden
                />
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {year} PharmaCare Admin Platform · {version}
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            {legal.map((item) => (
              <li key={item.link}>
                <Link
                  to={item.link}
                  className="transition hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              title="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <ArrowUp size={15} aria-hidden />
            </button>
            {social.map(({ icon: Icon, link, label }) => (
              <a
                key={label}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Icon size={15} aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
