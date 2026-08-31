import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
  /** Narrower content width for forms */
  narrow?: boolean;
  className?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  narrow = false,
  className = "",
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
      <Header />

      <main
        id="admin-main"
        className={`flex-1 w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8 ${className}`}
      >
        <div
          className={`mx-auto w-full ${narrow ? "max-w-4xl" : "max-w-7xl"}`}
        >
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLayout;
