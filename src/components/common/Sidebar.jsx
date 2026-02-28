import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiLogout, HiMenu, HiX, HiMoon, HiSun } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar({ links, title, icon }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? "" : ""}`}>
      {/* Logo / Title */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-stone-100 dark:border-stone-800">
        <span className="text-2xl">{icon}</span>
        {(!collapsed || mobile) && (
          <div>
            <Link to='/'>
              <p className="font-display font-bold text-stone-800 dark:text-stone-100">
                Food<span className="text-brand-500">Dash</span>
              </p>
            </Link>

            <p className="text-xs text-stone-400">{title}</p>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ label, to, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-150
              ${
                isActive
                  ? "bg-brand-500 text-white shadow-brand"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              }
            `}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || mobile) && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-stone-100 dark:border-stone-800 space-y-1">
        {/* User info */}
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div
              className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center
                            text-white font-bold text-sm flex-shrink-0"
            >
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-stone-400 truncate">{user?.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          {dark ? (
            <HiSun className="w-5 h-5 flex-shrink-0" />
          ) : (
            <HiMoon className="w-5 h-5 flex-shrink-0" />
          )}
          {(!collapsed || mobile) && (dark ? "Light Mode" : "Dark Mode")}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <HiLogout className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || mobile) && "Log out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={`
          hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0
          bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800
          transition-all duration-300 overflow-hidden
        `}
        animate={{ width: collapsed ? 72 : 240 }}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute top-5 right-3 z-10 p-1.5 rounded-lg text-stone-400
                     hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          {collapsed ? (
            <HiMenu className="w-4 h-4" />
          ) : (
            <HiX className="w-4 h-4" />
          )}
        </button>

        <SidebarContent />
      </motion.aside>

      {/* Mobile top bar trigger */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center
                      h-14 px-4 gap-3 bg-white dark:bg-stone-900 border-b
                      border-stone-100 dark:border-stone-800"
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <HiMenu className="w-5 h-5 text-stone-500" />
        </button>
        <span className="font-display font-bold text-stone-800 dark:text-stone-100">
          Food<span className="text-brand-500">Dash</span>
        </span>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="md:hidden fixed left-0 top-0 h-full w-72 z-50
                         bg-white dark:bg-stone-900 border-r border-stone-100 dark:border-stone-800"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              <SidebarContent mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
