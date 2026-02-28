import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSwitchHorizontal,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import toast from "react-hot-toast";
import {
  getOwnerRestaurants,
  createOwnerRestaurant,
  updateOwnerRestaurant,
  deleteOwnerRestaurant,
  toggleOwnerRestaurant,
} from "../../api/restaurant.api";


const DEFAULT_RESTAURANT = {
  name: "",
  description: "",
  cuisine: "",
  address: "",
  isOpen: true,
};

export default function ManageOwnerRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT_RESTAURANT);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerRestaurants();
  }, []);

  const fetchOwnerRestaurants = async () => {
    try {
      const res = await getOwnerRestaurants();
      setRestaurants(res.data.data);
    } catch {
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

    const openAdd = () => {
    setEditing(null);
    setForm(DEFAULT_RESTAURANT);
    setOpen(true);
  };

  const openEdit = (restaurant) => {
    setEditing(restaurant);
    setForm({ ...restaurant });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.cuisine) {
      toast.error("Name and cuisine are required");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updateOwnerRestaurant(editing.id, form);
        setRestaurants((prev) =>
          prev.map((r) => (r.id === editing.id ? { ...r, ...form } : r))
        );
        toast.success("Restaurant updated!");
      } else {
        const res = await createOwnerRestaurant(form);
        setRestaurants((prev) => [...prev, res.data.data]);
        toast.success("Restaurant added!");
      }

      setOpen(false);
    } catch {
      toast.error("Failed to save restaurant");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?"))
      return;

    try {
      await deleteOwnerRestaurant(id);
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
      toast.success("Restaurant deleted");
    } catch {
      toast.error("Failed to delete restaurant");
    }
  };

  const toggleOpen = async (id) => {
    try {
      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isOpen: !r.isOpen } : r))
      );

      await toggleOwnerRestaurant(id);
      toast.success("Restaurant status updated");
    } catch {
      toast.error("Failed to update restaurant status");
      fetchOwnerRestaurants();
    }
  };

  const grouped = restaurants.reduce((acc, r) => {
    (acc[r.cuisine] = acc[r.cuisine] || []).push(r);
    return acc;
  }, {});

   return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <HiOutlineOfficeBuilding className="w-6 h-6 text-brand-500" />
            My Restaurants
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            {restaurants.length} restaurants
          </p>
        </div>
        <Button icon={<HiPlus />} onClick={openAdd}>
          Add Restaurant
        </Button>
      </div>

      {loading ? null : restaurants.length === 0 ? (
        <EmptyState
          icon="🏬"
          title="No restaurants yet"
          message="Create your first restaurant to start receiving orders"
          action={<Button onClick={openAdd}>Add Restaurant</Button>}
        />
      ) : (
        Object.entries(grouped).map(([cuisine, group]) => (
          <div key={cuisine}>
            <h2 className="font-display font-semibold text-lg text-stone-700 dark:text-stone-300 mb-3 px-1">
              {cuisine} ({group.length})
            </h2>

            <div className="space-y-3">
              <AnimatePresence>
                {group.map((r) => (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`card p-4 flex items-center gap-4 ${!r.isOpen ? "opacity-50" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <HiOutlineOfficeBuilding className="w-5 h-5 text-brand-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm">
                          {r.name}
                        </p>
                        {!r.isOpen && (
                          <span className="badge-warning text-xs px-1.5 py-0.5 rounded">
                            Closed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5 truncate">
                        {r.description}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        📍 {r.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleOpen(r.id)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400"
                      >
                        <HiSwitchHorizontal className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openEdit(r)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => remove(r.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Restaurant" : "Add Restaurant"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={save}>
              {editing ? "Save Changes" : "Add Restaurant"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Restaurant Name *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Cuisine *</label>
              <input
                className="input"
                value={form.cuisine}
                onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Address</label>
              <input
                className="input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea
                className="input resize-none h-20"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">Open Status</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isOpen}
                  onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
                  className="w-4 h-4 accent-brand-500"
                />
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  Open
                </span>
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
