import React from "react";
import {
  LayoutDashboard,
  Grid2X2,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Plus,
  X,
} from "lucide-react";

const Sidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
}) => {
  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Categories",
      icon: Grid2X2,
    },
    {
      name: "Add category",
      label: "Add Category",
      icon: Plus,
    },
    {
      name: "Product",
      icon: Package,
    },
    {
      name: "Add Product",
      icon: Plus,
    },
    {
      name: "Orders",
      icon: ShoppingCart,
    },
    {
      name: "Users",
      icon: Users,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky
          top-0 left-0
          z-50
          h-dvh
          w-56
          shrink-0
          bg-green-900
          shadow-xl
          transition-transform duration-300
          flex flex-col
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* Logo */}
        <div className="flex h-20 items-center justify-between px-5">
          <div className="rounded-xl bg-yellow-300 px-3 py-2 text-xl font-black text-black">
            blinkit
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 space-y-1 px-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActivePage(item.name);
                  setSidebarOpen(false);
                }}
                className={`
                  flex h-10 w-full items-center gap-3 rounded-lg px-3
                  text-sm font-medium transition
                  ${
                    activePage === item.name
                      ? "bg-white text-black"
                      : "text-white hover:bg-white hover:text-black"
                  }
                `}
              >
                <Icon size={20} />

                {item.label || item.name}
              </button>
            );
          })}
        </div>

        {/* LOGOUT */}
        <div className="p-3 border-t border-white/20">
          <button
            onClick={onLogout}
            className="
              flex h-11 w-full items-center gap-3
              rounded-lg px-3
              text-sm font-medium
              text-white
              transition
              hover:bg-red-500
              hover:text-white
            "
          >
            <LogOut size={20} />

            Logout
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;