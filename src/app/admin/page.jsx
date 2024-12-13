"use client";

import AdminOptionCard from "@src/components/admin/AdminOptionCard";

const adminOptionsGrid1 = [
  {
    href: "/admin/menu-management",
    title: "Manage Menu",
    imageSrc: "/images/icons/ManageMenu.png",
    imageAlt: "Manage Menu",
    description: "Update, add, or remove items from the menu with ease.",
  },
  {
    href: "/admin/table-management",
    title: "Manage Tables",
    imageSrc: "/images/icons/ManageTables.png",
    imageAlt: "Manage Tables",
    description: "Configure and organize table availability for customers.",
  },
  {
    href: "/admin/reservation-management",
    title: "Manage Reservations",
    imageSrc: "/images/icons/ManageReservations.png",
    imageAlt: "Manage Reservations",
    description:
      "Track and manage customer reservations with a simple interface.",
  },
];

const adminOptionsGrid2 = [
  {
    href: "/admin/order-management",
    title: "Manage Orders",
    imageSrc: "/images/icons/ManageOrders.png",
    imageAlt: "Manage Orders",
    description: "Monitor and manage active customer orders in real-time.",
    targetBlank: true,
  },
  {
    href: "/admin/qr",
    title: "QR Codes",
    imageSrc: "/images/icons/ManageQRCODES.png",
    imageAlt: "QR Codes",
    description:
      "Generate QR codes for fast access to menus or ordering systems.",
  },
];

const AdminPage = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-8 bg-darkBg pb-12 pt-24">
      <div className="flex w-full max-w-7xl flex-col justify-between gap-3">
        <h1 className="text-center text-3xl font-bold text-white">
          Welcome to the Admin Dashboard!
        </h1>
        <p className="text-center text-base text-gray-400">
          Manage your content and settings efficiently.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-between gap-6">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          {adminOptionsGrid1.map((option) => (
            <AdminOptionCard key={option.href} {...option} />
          ))}
        </div>

        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {adminOptionsGrid2.map((option) => (
            <AdminOptionCard key={option.href} {...option} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
