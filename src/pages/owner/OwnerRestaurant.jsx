import { useState } from "react";
import { motion } from "framer-motion";
import { HiOfficeBuilding, HiClock, HiCheckCircle } from "react-icons/hi";
import Button from "../../components/common/Button";
import { submitRestaurantForApproval } from '../../api/restaurant.api'
import { CUISINES } from "../../utils/constants";
import toast from "react-hot-toast";
import axios from "axios";

const OWNER_RESTAURANT = null; // null means not yet created

export default function OwnerRestaurant() {
  const [restaurant, setRestaurant] = useState(OWNER_RESTAURANT);
  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    cuisine: "",
    address: "",
    city: "",
    openingTime: "09:00",
    closingTime: "22:00",
    costForTwo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        costForTwo: Number(form.costForTwo),
      };

      const res = await submitRestaurantForApproval(payload);

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      toast.success(res.data.message);
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 200 }}
          className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6"
        >
          <HiClock className="w-10 h-10 text-amber-500" />
        </motion.div>
        <h2 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
          Pending Approval
        </h2>
        <p className="text-stone-400 mt-3 leading-relaxed">
          Your restaurant has been submitted and is under review. We'll notify
          you once it's approved (usually within 24 hours).
        </p>
        <div className="mt-8 card p-5 w-full text-left space-y-3 text-sm">
          {[
            ["Restaurant Name", form.name],
            ["Cuisine", form.cuisine],
            ["City", form.city],
            ["Hours", `${form.openingTime} – ${form.closingTime}`],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between">
              <span className="text-stone-400">{label}</span>
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
          {restaurant ? "My Restaurant" : "Add Your Restaurant"}
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          {restaurant
            ? "Manage your restaurant details"
            : "Submit your restaurant for admin approval"}
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
          <HiCheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Your restaurant will be reviewed by our admin team before going
            live. This usually takes 12-24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="label">Restaurant name *</label>
              <input
                className="input"
                required
                placeholder="e.g. Spice Garden"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                className="input resize-none h-20"
                placeholder="Describe your restaurant…"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">Phone *</label>
              <input
                className="input"
                required
                placeholder="9876543210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Cuisine *</label>
              <select
                className="input"
                required
                value={form.cuisine}
                onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
              >
                <option value="">Select cuisine</option>
                {CUISINES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Cost for two (₹) *</label>
              <input
                type="number"
                className="input"
                required
                placeholder="500"
                value={form.costForTwo}
                onChange={(e) =>
                  setForm({ ...form, costForTwo: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Address *</label>
              <input
                className="input"
                required
                placeholder="Street address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div>
              <label className="label">City *</label>
              <input
                className="input"
                required
                placeholder="Mumbai"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <div />

            <div>
              <label className="label">Opening time</label>
              <input
                type="time"
                className="input"
                value={form.openingTime}
                onChange={(e) =>
                  setForm({ ...form, openingTime: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">Closing time</label>
              <input
                type="time"
                className="input"
                value={form.closingTime}
                onChange={(e) =>
                  setForm({ ...form, closingTime: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            type="submit"
            loading={submitting}
            size="lg"
            icon={<HiOfficeBuilding className="w-5 h-5" />}
          >
            Submit for Approval
          </Button>
        </form>
      </div>
    </div>
  );
}
