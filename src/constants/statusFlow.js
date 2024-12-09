const STATUS_FLOW = [
  { id: 1, name: "Submitted", color: "bg-gray-500", short: "S" },
  { id: 2, name: "Preparing", color: "bg-blue-500", short: "P" },
  { id: 3, name: "Ready for Pickup", color: "bg-teal-500", short: "R" },
  { id: 4, name: "Completed", color: "bg-green-500", short: "C" },
  { id: 5, name: "Cancelled", color: "bg-red-500", short: "X" },
];

const getStatusByName = (name) =>
  STATUS_FLOW.find((status) => status.name === name);

export { getStatusByName, STATUS_FLOW };
