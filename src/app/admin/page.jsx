import Link from "next/link";

export default async function AdminPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#000",
        padding: "16px",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "16px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        Welcome to the Admin Dashboard!
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#aaa",
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        Manage your content and settings efficiently.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          width: "100%",
          maxWidth: "1200px",
          marginBottom: "16px",
        }}
      >
        {/* Manage Menu */}
        <Link
          href="/admin/menu-management"
          className="flex cursor-pointer flex-col items-center rounded-md bg-dark p-4 text-white"
        >
          <h2 className="mb-2 text-xl">Manage Menu</h2>
          <img
            src="/images/icons/ManageMenu.png"
            alt="Manage Menu"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          />
          <p>Update, add, or remove items from the menu with ease.</p>
        </Link>

        {/* Manage Tables */}
        <Link
          href="/admin/table-management"
          className="flex cursor-pointer flex-col items-center rounded-md bg-dark p-4 text-white"
        >
          <h2 className="mb-2 text-xl">Manage Tables</h2>
          <img
            src="/images/icons/ManageTables.png"
            alt="Manage Tables"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          />
          <p>Configure and organize table availability for customers.</p>
        </Link>

        {/* Manage Reservations */}
        <Link
          href="/admin/reservation-management"
          className="flex cursor-pointer flex-col items-center rounded-md bg-dark p-4 text-white"
        >
          <h2 className="mb-2 text-xl">Manage Reservations</h2>
          <img
            src="/images/icons/ManageReservations.png"
            alt="Manage Reservations"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          />
          <p>Track and manage customer reservations with a simple interface.</p>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {/* Manage Orders (opens in a new tab) */}
        <Link
          href="/admin/order-management"
          target="_blank"
          rel="noopener noreferrer"
          className="flex cursor-pointer flex-col items-center rounded-md bg-dark p-4 text-white"
        >
          <h2 className="mb-2 text-xl">Manage Orders</h2>
          <img
            src="/images/icons/ManageOrders.png"
            alt="Manage Orders"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          />
          <p>Monitor and manage active customer orders in real-time.</p>
        </Link>

        {/* QR Codes */}
        <Link
          href="/admin/qr"
          className="flex cursor-pointer flex-col items-center rounded-md bg-dark p-4 text-white"
        >
          <h2 className="mb-2 text-xl">QR Codes</h2>
          <img
            src="/images/icons/ManageQRCODES.png"
            alt="QR Codes"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          />
          <p>Generate QR codes for fast access to menus or ordering systems.</p>
        </Link>
      </div>
    </div>
  );
}
