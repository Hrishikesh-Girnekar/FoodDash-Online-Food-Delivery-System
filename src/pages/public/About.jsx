import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, Store, Tag, ArrowRight } from "lucide-react";

export default function About() {
  const features = [
    {
      title: "Fast Delivery",
      desc: "Lightning-fast delivery so your food arrives hot and fresh.",
      icon: <Truck size={28} />,
    },
    {
      title: "Top Restaurants",
      desc: "Choose from a wide variety of premium restaurants near you.",
      icon: <Store size={28} />,
    },
    {
      title: "Best Offers",
      desc: "Exciting discounts and deals curated just for you.",
      icon: <Tag size={28} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
      {/* 🔥 Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-300 opacity-20 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 opacity-20 blur-3xl rounded-full -z-10" />

      {/* ─── Hero Section ───────────────────── */}
      <section className="text-center py-20 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight"
        >
          About{" "}
          <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            FoodDash
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-gray-600 text-lg"
        >
          Delivering happiness through food — fast, fresh, and always reliable.
          We connect you with the best restaurants around you.
        </motion.p>
      </section>

      {/* ─── Features Section ───────────────── */}
      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 py-12">
        {features.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ y: -8 }}
            className="group relative bg-white/70 backdrop-blur-xl border border-orange-100 rounded-2xl p-8 text-center shadow-sm hover:shadow-2xl transition-all duration-300"
          >
            {/* Gradient Border Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-200 to-pink-200 opacity-0 group-hover:opacity-100 blur-xl transition" />

            <div className="relative z-10">
              <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md">
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                {item.title}
              </h3>

              <p className="mt-3 text-gray-600 text-sm">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ─── CTA Section ───────────────────── */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-orange-100 rounded-3xl shadow-xl p-10 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            Ready to explore delicious food?
          </h2>

          <p className="mt-3 text-gray-600">
            Discover top-rated restaurants and exclusive offers near you.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/"
              className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition shadow-md"
            >
              Go Home <ArrowRight size={18} />
            </Link>

            <Link
              to="/restaurants"
              className="flex items-center gap-2 bg-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300 transition"
            >
              Browse Restaurants <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
