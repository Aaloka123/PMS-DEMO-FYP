import React from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ShieldCheck,
  ArrowUp,
} from "lucide-react";

const AdminFooter: React.FC = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: "Manage Users", link: "/admin/users" },
    { name: "System Settings", link: "/admin/settings" },
    { name: "Audit Logs", link: "/admin/logs" },
    { name: "Reports", link: "/reports" },
  ];

  const socialLinks = [
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-gray-300 mt-24 border-t border-gray-800">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-blue-500" size={22} />
            <h2 className="text-white font-bold text-lg">PharmaCare Admin</h2>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed">
            Secure pharmacy management dashboard for monitoring users,
            medicines, orders, and analytics in real time.
          </p>

          <a
            href="mailto:support@pharmacare.com"
            className="flex items-center gap-2 mt-4 text-sm text-gray-400 hover:text-blue-400 transition"
          >
            <Mail size={16} />
            support@pharmacare.com
          </a>
        </section>

        {/* Quick Links */}
        <section>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  className="text-gray-400 hover:text-white transition relative group inline-block"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 transition-all group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Social */}
        <section>
          <h3 className="text-white font-semibold mb-3">Connect</h3>
          <div className="flex gap-3">
            {socialLinks.map((item, i) => (
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
        </section>

        {/* Newsletter */}
        <section>
          <h3 className="text-white font-semibold mb-3">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-3">
            Get updates about system improvements.
          </p>

          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-md bg-gray-800 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 transition text-white text-sm py-2 rounded-md"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-gray-950">
        <p>© {year} PharmaCare. All rights reserved.</p>

        <p className="text-gray-600">Made with ❤️ for healthcare systems</p>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition"
        >
          <ArrowUp size={14} />
          Top
        </button>
      </div>
    </footer>
  );
};

export default AdminFooter;
