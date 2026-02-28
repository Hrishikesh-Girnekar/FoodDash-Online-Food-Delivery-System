
import { useState, useEffect } from "react";
import { HiSearch, HiBan, HiCheck } from "react-icons/hi";
import Table from "../../components/common/Table";
import { useDebounce } from "../../hooks/useDebounce";
import { adminApi } from "../../api/admin.api";
import { formatDate } from "../../utils/helpers";
import toast from "react-hot-toast";

const ROLE_BADGE = {
  CUSTOMER: "badge-info",
  RESTAURANT_OWNER: "badge-brand",
  DELIVERY_PARTNER: "badge-success",
  ADMIN: "badge-warning",
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("ALL");

  const debouncedQuery = useDebounce(query);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = {};
      if (debouncedQuery) params.search = debouncedQuery;
      if (role !== "ALL") params.role = role;

      const { data } = await adminApi.getUsers(params);
      console.log(data);
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedQuery, role]);

  const toggleBan = async (id, isBanned) => {
    try {
      if (isBanned) {
        await adminApi.unbanUser(id);
        toast.success("User unbanned successfully");
      } else {
        await adminApi.banUser(id);
        toast.success("User banned successfully");
      }

      fetchUsers();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (v) => <span className="font-semibold">{v}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (v) => <span className="text-stone-400">{v}</span>,
    },
    
    {
      key: "roles",
      label: "Role",
      render: (_, row) => {
        const roles = row.roles || [];

        return (
          <span className={`badge ${ROLE_BADGE[roles] || "badge-info"} text-xs`}>
            {roles.length
              ? roles.map((r) => r.replace(/_/g, " ")).join(", ")
              : "N/A"}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <span
          className={`badge ${
            v === "BANNED" ? "badge-error" : "badge-success"
          } text-xs`}
        >
          {v}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (v) => formatDate(v),
    },
    {
      key: "id",
      label: "Actions",
      render: (id, row) => (
        <button
          onClick={() => toggleBan(id, row.status === "BANNED")}
          className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
            row.status === "BANNED"
              ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
              : "bg-red-100 text-red-500 hover:bg-red-200"
          }`}
        >
          {row.status === "BANNED" ? (
            <>
              <HiCheck className="w-3.5 h-3.5" /> Unban
            </>
          ) : (
            <>
              <HiBan className="w-3.5 h-3.5" /> Ban
            </>
          )}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
          Manage Users
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          {users.length} users found
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <HiSearch className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" />
          <input
            className="input pl-11"
            placeholder="Search users…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="input w-auto"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="ALL">All roles</option>
          <option value="CUSTOMER">Customers</option>
          <option value="RESTAURANT_OWNER">Owners</option>
          <option value="DELIVERY_PARTNER">Delivery</option>
        </select>
      </div>

      <Table
        columns={columns}
        rows={users}
        loading={loading}
        emptyTitle="No users found"
      />
    </div>
  );
}
