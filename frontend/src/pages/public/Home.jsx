import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiSearch,
  HiArrowRight,
  HiStar,
  HiClock,
  HiShieldCheck,
} from "react-icons/hi";
import RestaurantCard from "../../components/restaurant/RestaurantCard";
import { CUISINES } from "../../utils/constants";
import axios from "axios";

const HERO_STATS = [
  { label: "Restaurants", value: "500+", icon: "🍽️" },
  { label: "Happy Customers", value: "50K+", icon: "😊" },
  { label: "Cities", value: "25+", icon: "🌆" },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    desc: "Average delivery in under 30 minutes",
  },
  {
    icon: "🍴",
    title: "Curated Menus",
    desc: "Handpicked restaurants and fresh menus",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    desc: "PCI-compliant secure payment gateway",
  },
  {
    icon: "📍",
    title: "Live Tracking",
    desc: "Track your order in real-time on the map",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/v1/restaurants/approved",
        );

        setRestaurants(res.data.data);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter(
    (r) => activeCategory === "All" || r.cuisine === activeCategory,
  );

  return (
    <div className="page-enter">
      {/* ── Hero ──────────────────────────────────── */}
      <section className="bg-hero-gradient dark:bg-none dark:bg-gradient-to-br dark:from-stone-900 dark:to-stone-800 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="badge-brand text-sm mb-6 inline-flex">
              🎉 Free delivery on your first order
            </span>
          </motion.div>

          <motion.h1
            className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl
                       text-stone-900 dark:text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Food that makes
            <br />
            <span className="text-brand-500">you smile</span> 😋
          </motion.h1>

          <motion.p
            className="text-stone-500 dark:text-stone-400 text-lg mt-5 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Discover great restaurants near you and get your favourite meals
            delivered in minutes.
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="mt-8 flex gap-3 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex-1 relative">
              <HiSearch className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
              <input
                type="text"
                className="input pl-12 py-3.5 bg-white dark:bg-stone-800 shadow-card"
                placeholder="Search restaurants, cuisines…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(`/restaurants?q=${query}`)
                }
              />
            </div>
            <button
              onClick={() => navigate(`/restaurants?q=${query}`)}
              className="btn-primary px-6 py-3.5 flex-shrink-0"
            >
              Search
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex items-center justify-center gap-8 mt-10 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {HERO_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <span className="text-2xl block">{s.icon}</span>
                <p className="font-display font-bold text-2xl text-stone-800 dark:text-white">
                  {s.value}
                </p>
                <p className="text-xs text-stone-500">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Category Filter ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100 mb-6">
          What are you craving?
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CUISINES.slice(0, 10).map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`
                flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all
                ${
                  activeCategory === c
                    ? "bg-brand-500 text-white shadow-brand"
                    : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-brand-300"
                }
              `}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured Restaurants ──────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
            Popular near you
          </h2>
          <Link
            to="/restaurants"
            className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 font-medium"
          >
            View all <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filtered.map((r) => (
            <motion.div key={r.id} variants={item}>
              <RestaurantCard restaurant={r} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────── */}
      <section className="bg-stone-50 dark:bg-stone-900/50 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-stone-800 dark:text-stone-100 mb-12">
            Why choose FoodDash?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="card p-6 text-center hover:shadow-hover transition-shadow"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-4xl block mb-4">{f.icon}</span>
                <h3 className="font-display font-semibold text-stone-800 dark:text-stone-100 mb-2">
                  {f.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────── */}
      <section className="py-16 px-4">
        <motion.div
          className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-brand-500 to-orange-400
                     p-10 text-center text-white shadow-brand"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-4">
            Hungry right now?
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Sign up and get your first delivery free. No minimum order.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-brand-600 font-bold px-8 py-4 rounded-2xl hover:bg-orange-50 transition-colors"
          >
            Get Started Free
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
