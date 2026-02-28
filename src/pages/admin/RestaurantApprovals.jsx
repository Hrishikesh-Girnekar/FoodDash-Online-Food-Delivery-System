import { useState, useEffect } from "react";
import { HiCheck, HiX, HiEye } from "react-icons/hi";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import axios from "axios";
import { formatDate } from "../../utils/helpers";
import toast from "react-hot-toast";

export default function RestaurantApprovals() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");

  const token = localStorage.getItem("fooddash_token");

  //  Fetch PENDING restaurants
  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);

        if (!token) {
          toast.error("Please login again");
          return;
        }

        const res = await axios.get(
          "http://localhost:8080/api/v1/admin/restaurants/status/PENDING",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = res.data.data || [];
        setPending(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch pending restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  // Approve restaurant
  const approve = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/v1/admin/restaurants/${id}/status?status=APPROVED`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPending((prev) => prev.filter((r) => r.id !== id));
      toast.success("Restaurant approved!");
      setSelected(null);
    } catch (err) {
      toast.error("Failed to approve restaurant");
    }
  };

  // Reject restaurant
  const reject = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8080/api/v1/admin/restaurants/${rejecting.id}/status?status=REJECTED`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPending((prev) => prev.filter((r) => r.id !== rejecting.id));
      toast.success("Restaurant rejected");

      setRejecting(null);
      setReason("");
    } catch (err) {
      toast.error("Failed to reject restaurant");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Restaurant Name",
      render: (v) => <span className="font-semibold">{v}</span>,
    },
    { key: "cuisine", label: "Cuisine" },
    { key: "city", label: "City" },
    {
      key: "createdAt",
      label: "Submitted",
      render: (v) => formatDate(v),
    },
    {
      key: "id",
      label: "Actions",
      render: (id, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelected(row)}
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
          >
            <HiEye className="w-4 h-4" />
          </button>

          <button
            onClick={() => approve(id)}
            className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
          >
            <HiCheck className="w-4 h-4" />
          </button>

          <button
            onClick={() => setRejecting(row)}
            className="p-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="font-display font-bold text-2xl text-stone-800 dark:text-stone-100">
          Restaurant Approvals
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          {pending.length} pending{" "}
          {pending.length === 1 ? "request" : "requests"}
        </p>
      </div>

      <Table
        columns={columns}
        rows={pending}
        loading={loading}
        emptyTitle="No pending approvals"
        emptyMessage="All restaurant requests have been reviewed"
      />

      {/* Details Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Restaurant Details"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setRejecting(selected);
                setSelected(null);
              }}
            >
              Reject
            </Button>
            <Button onClick={() => approve(selected?.id)}>Approve</Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4 text-sm">
            {[
              ["Restaurant Name", selected.name],
              ["Cuisine", selected.cuisine],
              ["City", selected.city],
              ["Submitted", formatDate(selected.createdAt)],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between">
                <span className="text-stone-400">{label}</span>
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  {val}
                </span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        open={!!rejecting}
        onClose={() => {
          setRejecting(null);
          setReason("");
        }}
        title="Reject Restaurant"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejecting(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={reject}>
              Reject
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-stone-500">
            You are rejecting <strong>{rejecting?.name}</strong>.
          </p>

          <textarea
            className="input resize-none h-28"
            placeholder="Reason for rejection…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
