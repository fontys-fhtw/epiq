import { ENV_VARS } from "@src/constants";

const getOrders = async () => {
  const response = await fetch(
    `${ENV_VARS.NEXT_PUBLIC_CLIENT_URL}/api/admin/orders`,
  );
  return response.json();
};

const getReservations = async () => {
  const response = await fetch(
    `${ENV_VARS.NEXT_PUBLIC_CLIENT_URL}/api/admin/reservations`,
  );
  return response.json();
};

export { getOrders, getReservations };
