import React from "react";
import { Github, Linkedin, Twitter, Mail, ShieldCheck } from "lucide-react";

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
      icon: <Github size={20} />,
      link: "https://github.com",
      label: "GitHub",
      hover: "hover:bg-gray-700",
    },
    {
      icon: <Linkedin size={20} />,
      link: "https://linkedin.com",
      label: "LinkedIn",
      hover: "hover:bg-blue-600",
    },
    {
      icon: <Twitter size={20} />,
      link: "https://twitter.com",
      label: "Twitter",
      hover: "hover:bg-sky-500",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-gray-300 mt-20 shadow-inner backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-blue-500" size={24} />
            <h2 className="text-white font-bold text-lg tracking-wide">
              PharmaCare Admin
            </h2>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Secure and efficient pharmacy management system to manage users,
            medicines, orders, and analytics from a centralized dashboard.
          </p>

          <a
            href="mailto:support@pharmacare.com"
            className="flex items-center gap-2 text-gray-400 text-sm mt-4 hover:text-blue-400 transition-colors duration-200"
          >
            <Mail size={16} />
            support@pharmacare.com
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="relative text-gray-400 hover:text-white transition duration-300 group inline-block"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">
            Connect With Us
          </h3>

          <div className="flex gap-3">
            {socialLinks.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className={`p-3 bg-gray-800 rounded-full transition-all duration-300 shadow-md flex items-center justify-center ${item.hover} hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500 bg-gray-950 tracking-wide">
        © {year} PharmaCare. All rights reserved. | Made with for healthcare.
      </div>
    </footer>
  );
};

export default AdminFooter;
