export const STATUS_FLOW = ["pending", "accepted", "working", "completed"];

export const TERMINAL_STATUS = ["rejected", "cancelled"];

export const STATUS_CONFIG: Record<string, string> = {
  pending: "bg-yellow-400 text-black",
  accepted: "bg-blue-500 text-white",
  working: "bg-orange-500 text-white",
  completed: "bg-green-600 text-white",
  rejected: "bg-red-500 text-white",
  cancelled: "bg-gray-600 text-white",
};
