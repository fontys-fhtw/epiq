import { ENV_VARS } from "@src/constants";
import axios from "axios";

const getOrders = async () => {
    const response = await axios.get(
        `${ENV_VARS.NEXT_PUBLIC_CLIENT_URL}/api/admin/orders`,
    );
    return response.data; // Axios automatically parses JSON, so return response.data
};

const getReservations = async () => {
    const response = await axios.get(
        `${ENV_VARS.NEXT_PUBLIC_CLIENT_URL}/api/admin/reservations`,
    );
    return response.data;
};

export { getOrders, getReservations };
