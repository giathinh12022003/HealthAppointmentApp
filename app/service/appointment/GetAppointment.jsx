import axios from "axios";
import { getToken } from "../Token";

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_ALL_APPOINTMENT = process.env.EXPO_PUBLIC_API_GET_ALL_APPOINTMENT;

const API_GET_APPOINTMENT_BY_ID=process.env.EXPO_PUBLIC_API_GET_APPOINTMENT_BY_ID;

const REST_API_GET_ALL_APPOINTMENT = `${IP}${API_GET_ALL_APPOINTMENT}`;
const REST_API_GET_APPOINTMENT_BY_ID = `${IP}${API_GET_APPOINTMENT_BY_ID}`;

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
        // console.error('Error get record:', error);
        throw error;
    }
};

export const getAllAppointmentById = async (id) => {
    try {
        const storedToken = await getToken('accessToken');

        const response = await axios.get(`${REST_API_GET_APPOINTMENT_BY_ID}/${id}`, {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getAllAppointment,
    getAllAppointmentById
};