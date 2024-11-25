const CUSTOMER_NAV_ITEMS = [
  { name: "Home", path: "/customer", iconKey: "home" },
  {
    name: "Reservation",
    path: "/customer/reservation/list",
    iconKey: "reservation",
  },
  { name: "Menu", path: "/customer/menu", iconKey: "menu" },
  { name: "Profile", path: "/customer/profile", iconKey: "profile" },
];

const ADMIN_NAV_ITEMS = [
  { name: "Home", path: "/admin" },
  {
    name: "Menu",
    path: "/admin/menu-management",
  },
  {
    name: "Tables",
    path: "/admin/table-management",
  },
  {
    name: "Reservations",
    path: "/admin/reservation-management",
  },
  {
    name: "Orders",
    path: "/admin/order-management",
    newTab: true,
  },
  {
    name: "QR Codes",
    path: "/admin/qr",
  },
];

export { ADMIN_NAV_ITEMS, CUSTOMER_NAV_ITEMS };
