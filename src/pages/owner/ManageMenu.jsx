import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiSwitchHorizontal } from "react-icons/hi";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { formatCurrency } from "../../utils/helpers";
import { menuApi } from "../../api/menu.api";
import toast from "react-hot-toast";

const DEFAULT_ITEM = {
  name: "",
  description: "",
  price: "",
  category: "",
  isVeg: true,
  available: true,
  imageUrl: "",
};

export default function ManageMenu() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT_ITEM);
  const [saving, setSaving] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    const storedRestaurants = JSON.parse(
      localStorage.getItem("fooddash_restaurants") || "[]",
    );
    const activeRestaurant = localStorage.getItem("fooddash_activeRestaurant");

    setRestaurants(storedRestaurants);

    if (activeRestaurant) {
      setRestaurantId(activeRestaurant);
      fetchMenu(activeRestaurant);
    }
  }, []);

  const fetchMenu = async (id) => {
    try {
      const res = await menuApi.getByRestaurant(id);
      console.log(res);

      if (res.data.success) {
        setItems(res.data.data || []);
      } else {
        toast.error(res.data.message || "Failed to fetch menu");
      }
    } catch(err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong while fetching menu";

      toast.error(backendMessage);
    }
  };
  const handleRestaurantChange = (id) => {
    localStorage.setItem("fooddash_activeRestaurant", id);
    setRestaurantId(id);
    fetchMenu(id);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(DEFAULT_ITEM);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      ...item,
      price: item.price?.toString() || "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }

    if (!restaurantId) {
      toast.error("Restaurant not selected");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        restaurantId,
      };

      if (editing) {
        await menuApi.updateItem(editing.id, payload);
        toast.success("Item updated!");
      } else {
        await menuApi.addItem(payload);
        toast.success("Item added!");
      }

      fetchMenu(restaurantId);
      setOpen(false);
    } catch {
      toast.error("Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await menuApi.deleteItem(id);
      toast.success("Item deleted");
      fetchMenu(restaurantId);
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const toggleAvailable = async (id) => {
    try {
      await menuApi.toggleAvailable(id);
      fetchMenu(restaurantId);
    } catch {
      toast.error("Failed to update availability");
    }
  };

  const grouped = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
            Menu
          </h1>
          <p className="text-stone-400 text-sm mt-1">{items.length} items</p>
        </div>
        {restaurants.length > 1 && (
          <div className="flex items-center gap-3">
            <label className="text-sm text-stone-500">Select Restaurant:</label>
            <select
              className="input max-w-xs"
              value={restaurantId || ""}
              onChange={(e) => handleRestaurantChange(e.target.value)}
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <Button icon={<HiPlus />} onClick={openAdd}>
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title="No menu items"
          message="Add your first dish to get started"
          action={<Button onClick={openAdd}>Add Item</Button>}
        />
      ) : (
        Object.entries(grouped).map(([category, catItems]) => (
          <div key={category}>
            <h2 className="font-display font-semibold text-lg text-stone-700 dark:text-stone-300 mb-3 px-1">
              {category} ({catItems.length})
            </h2>
            <div className="space-y-3">
              <AnimatePresence>
                {catItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`card p-4 flex items-center gap-4 ${!item.isAvailable ? "opacity-50" : ""}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${item.isVeg ? "border-emerald-500" : "border-red-500"}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-emerald-500" : "bg-red-500"}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-stone-800 dark:text-stone-100 text-sm">
                          {item.name}
                        </p>
                        {!item.isAvailable && (
                          <span className="badge-warning text-xs px-1.5 py-0.5 rounded">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5 truncate">
                        {item.description}
                      </p>
                      <p className="font-bold text-brand-600 text-sm mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleAvailable(item.id)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400"
                      >
                        <HiSwitchHorizontal className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => remove(item.id)}
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
        title={editing ? "Edit Menu Item" : "Add Menu Item"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={save}>
              {editing ? "Save Changes" : "Add Item"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Item name *</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Price (₹) *</label>
              <input
                type="number"
                className="input"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Category</label>
              <input
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
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
              <label className="label">Type</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={form.isVeg}
                    onChange={() => setForm({ ...form, isVeg: true })}
                  />
                  <span className="text-sm text-emerald-600">Veg</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!form.isVeg}
                    onChange={() => setForm({ ...form, isVeg: false })}
                  />
                  <span className="text-sm text-red-500">Non-Veg</span>
                </label>
              </div>
            </div>

            <div>
              <label className="label">Availability</label>
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) =>
                  setForm({ ...form, isAvailable: e.target.checked })
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
