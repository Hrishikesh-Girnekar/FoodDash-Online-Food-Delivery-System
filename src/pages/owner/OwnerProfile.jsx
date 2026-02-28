import { useState } from "react";
import { motion } from "framer-motion";
import { HiUser, HiMail, HiPhone, HiCamera } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/auth.api";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";

export default function OwnerProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [pwdForm, setPwdForm] = useState({
    current: "",
    newPwd: "",
    confirm: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {data} = await authApi.updateProfile({
        fullName: form.name,
      });
      console.log(data);
      
      updateUser(data);
      
      toast.success(data.message);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPwd !== pwdForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setPwdLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: pwdForm.current,
        newPassword: pwdForm.newPwd,
      });
      toast.success("Password changed!");
      setPwdForm({ current: "", newPwd: "", confirm: "" });
    } catch {
      toast.error("Failed to change password");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="page-enter max-w-2xl space-y-6">
      <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
        Profile
      </h1>

      {/* Avatar */}
      <motion.div
        className="card p-6 flex items-center gap-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-brand-500 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <button className="absolute -bottom-1 -right-1 p-1.5 bg-white dark:bg-stone-800 rounded-full shadow border border-stone-200 dark:border-stone-700">
            <HiCamera className="w-3.5 h-3.5 text-stone-500" />
          </button>
        </div>
        <div>
          <p className="font-display font-bold text-xl text-stone-800 dark:text-stone-100">
            {user?.name}
          </p>
          <p className="text-stone-400 text-sm">{user?.email}</p>
          <span className="badge-brand text-xs mt-1 inline-flex">
            {user?.role}
          </span>
        </div>
      </motion.div>

      {/* Edit profile */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-display font-semibold text-lg mb-5 text-stone-800 dark:text-stone-100">
          Personal Information
        </h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <div className="relative">
              {/* <HiUser className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" /> */}
              <input
                className="input pl-11"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <HiMail className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" />
              <input
                className="input pl-11 opacity-60"
                value={user?.email}
                disabled
              />
            </div>
          </div>
          <div>
            <label className="label">Phone number</label>
            <div className="relative">
              <HiPhone className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" />
              <input
                className="input pl-11"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </form>
      </motion.div>

      {/* Change password */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display font-semibold text-lg mb-5 text-stone-800 dark:text-stone-100">
          Change Password
        </h2>
        <form onSubmit={changePassword} className="space-y-4">
          {[
            ["Current password", "current", "Enter current password"],
            ["New password", "newPwd", "Min 6 characters"],
            ["Confirm password", "confirm", "Repeat new password"],
          ].map(([label, key, placeholder]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input
                type="password"
                className="input"
                placeholder={placeholder}
                value={pwdForm[key]}
                onChange={(e) =>
                  setPwdForm({ ...pwdForm, [key]: e.target.value })
                }
              />
            </div>
          ))}
          <Button type="submit" loading={pwdLoading} variant="outline">
            Update Password
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
