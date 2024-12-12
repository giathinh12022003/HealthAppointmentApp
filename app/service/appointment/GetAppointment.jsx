import axios from "axios";
import { getToken } from "../Token";

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_ALL_APPOINTMENT = process.env.EXPO_PUBLIC_API_GET_ALL_APPOINTMENT;

const REST_API_GET_ALL_APPOINTMENT = `${IP}${API_GET_ALL_APPOINTMENT}`;

export const getAllAppointment = async (page, size) => {
    try {
        const storedToken = await getToken('accessToken');

        if (!storedToken) {
            return { data: [], totalPages: 0, totalElements: 0, currentPage: page };
        }

        const response = await axios.get(`${REST_API_GET_ALL_APPOINTMENT}`, {
            params: { page, size },
            headers: {
                Authorization: `Bearer ${storedToken}`,
            }
        });
        return response.data;
    } catch (error) {
        // console.error('Error create record:', error);
        throw error;
    }
};

export default {
    getAllAppointment
};