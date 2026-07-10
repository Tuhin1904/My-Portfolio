export const STATUS_FLOW = ["pending", "accepted", "accepted_by_client", "working", "delivered", "completed"];

export const TERMINAL_STATUS = ["rejected", "cancelled"];

export const STATUS_CONFIG: Record<string, string> = {
  pending: "bg-yellow-400 text-black",
  accepted: "bg-blue-500 text-white",
  accepted_by_client: "bg-purple-500 text-white",
  working: "bg-orange-500 text-white",
  delivered: "bg-teal-500 text-white",
  completed: "bg-green-600 text-white",
  rejected: "bg-red-500 text-white",
  cancelled: "bg-gray-600 text-white",
};

export const getStatusLabel = (status: string, role: 'admin' | 'client'): string => {
  const s = status?.trim().toLowerCase();
  if (s === 'accepted_by_client') {
    return role === 'admin' ? 'Accepted By Client' : 'Approved By you';
  }
  const mappings: Record<string, string> = {
    pending: "Pending",
    accepted: "Accepted",
    working: "Working",
    delivered: "Delivered",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };
  return mappings[s] || status;
};
