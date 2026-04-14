import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import {  Globe } from "lucide-react";
import { Outlet } from "react-router-dom";
import {
  HiShoppingCart,
  HiMenu,
  HiX,
  HiUser,
  HiLogout,
  HiMoon,
  HiSun,
  HiChevronDown,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { ROLE_HOME } from "../utils/helpers";
import NotificationDropdown from "../components/common/NotificationDropdown";
import CartDrawer from "../components/cart/CartDrawer";

export default function PublicLayout() {
  const { isAuthenticated, user, logout, role } = useAuth();
  const { totalItems } = useCart();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileOpen(false);
  };

  const navLinks = [
    { label: "Restaurants", to: "/restaurants" },
    { label: "Offers", to: "/offers" },
    { label: "About", to: "/about" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Navbar ──────────────────────────────────── */}
      <header className="sticky top-0 z-30 glass border-b border-stone-200/60 dark:glass-dark dark:border-stone-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🍜</span>
              <span className="font-display font-bold text-xl text-stone-800 dark:text-stone-100">
                Food<span className="text-brand-500">Dash</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-colors
                    ${
                      location.pathname === l.to
                        ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600"
                        : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                    }
                  `}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggle}
                className="p-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800
                           dark:text-stone-400 transition-colors"
              >
                {dark ? (
                  <HiSun className="w-5 h-5" />
                ) : (
                  <HiMoon className="w-5 h-5" />
                )}
              </button>

              {isAuthenticated ? (
                <>
                  <NotificationDropdown />

                  {/* Cart (customer only) */}
                  {role === "CUSTOMER" && (
                    <button
                      onClick={() => setCartOpen(true)}
                      className="relative p-2 rounded-xl text-stone-500 hover:bg-stone-100
                                 dark:hover:bg-stone-800 dark:text-stone-400 transition-colors"
                    >
                      <HiShoppingCart className="w-6 h-6" />
                      {totalItems > 0 && (
                        <motion.span
                          key={totalItems}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white
                                     text-xs font-bold rounded-full flex items-center justify-center"
                        >
                          {totalItems > 9 ? "9+" : totalItems}
                        </motion.span>
                      )}
                    </button>
                  )}

                  {/* Profile dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen((o) => !o)}
                      className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl
                                 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center
                                      text-white text-sm font-bold"
                      >
                        {user?.name?.charAt(0) || "U"}
                      </div>
                      <HiChevronDown
                        className={`w-4 h-4 text-stone-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          className="absolute right-0 mt-2 w-52 card shadow-hover z-50 overflow-hidden py-1"
                          initial={{ opacity: 0, y: -6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800">
                            <p className="font-semibold text-sm text-stone-800 dark:text-stone-100 truncate">
                              {user?.name}
                            </p>
                            <p className="text-xs text-stone-400 truncate">
                              {user?.email}
                            </p>
                          </div>
                          <Link
                            to={ROLE_HOME[role] || "/"}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700
                                       dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                          >
                            <HiUser className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500
                                       hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <HiLogout className="w-4 h-4" />
                            Log out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="btn-secondary text-sm">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="md:hidden p-2 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                {menuOpen ? (
                  <HiX className="w-6 h-6" />
                ) : (
                  <HiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden border-t border-stone-100 dark:border-stone-800 px-4 py-4 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-stone-700
                             dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  {l.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn-secondary flex-1 text-center text-sm"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="btn-primary  flex-1 text-center text-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Content ─────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ─── Premium++ Footer ──────────────────────────────────── */}
      <footer className="relative mt-24">
        {/* Gradient Top Border Glow */}
        <div className="h-[2px] bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 animate-pulse" />

        <div className="bg-white/70 backdrop-blur-xl border-t border-orange-100">
          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* ─── Brand Section ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-stone-900 mb-3">
                🍜 Food<span className="text-orange-500">Dash</span>
              </h2>
              <p className="text-sm leading-relaxed text-stone-600">
                Fast, fresh, and delicious meals delivered to your doorstep.
                Bringing happiness with every bite.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 mt-6">
                <a
                  href="#"
                  className="p-2 rounded-lg bg-white shadow hover:shadow-md hover:-translate-y-1 transition"
                >
                  <Globe size={18} />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-white shadow hover:shadow-md hover:-translate-y-1 transition"
                >
                  <FaFacebook size={18} />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-white shadow hover:shadow-md hover:-translate-y-1 transition"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-white shadow hover:shadow-md hover:-translate-y-1 transition"
                >
                  <FaTwitter  size={18} />
                </a>
              </div>
            </motion.div>

            {/* ─── Quick Links ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-stone-900 font-semibold mb-5">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                {["Home", "Restaurants", "Offers", "My Orders"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-orange-500 transition hover:translate-x-1 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ─── Support ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-stone-900 font-semibold mb-5">Support</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Help Center",
                  "Terms & Conditions",
                  "Privacy Policy",
                  "Report Issue",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-orange-500 transition hover:translate-x-1 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ─── Newsletter + Contact ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-stone-900 font-semibold mb-5">
                Stay Updated
              </h3>

              {/* Newsletter */}
              <div className="flex items-center bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm transition">
                  Subscribe
                </button>
              </div>

              {/* Contact */}
              <div className="mt-5 text-sm text-stone-600 space-y-2">
                <p>📍 Pune, India</p>
                <p>📧 support@fooddash.com</p>
                <p>📞 +91 98765 43210</p>
              </div>
            </motion.div>
          </div>

          {/* ─── Bottom Bar ─── */}
          <div className="border-t border-orange-100 py-6 text-center text-xs text-stone-500">
            © {new Date().getFullYear()} FoodDash Inc. All rights reserved.
          </div>
        </div>
      </footer>
      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
