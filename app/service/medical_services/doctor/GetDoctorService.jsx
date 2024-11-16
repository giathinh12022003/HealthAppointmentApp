import axios from 'axios';
import { getToken } from '../../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_DOCTOR_SERVICE = process.env.EXPO_PUBLIC_API_GET_DOCTOR_SERVICE;

const REST_API_DOCTOR_SERVICE = `${IP}${API_GET_DOCTOR_SERVICE}`;
export const getDoctorService = async (id, page, size) => {
    try {
        const storedToken = await getToken('accessToken');
        const doctorId = id;

        if (!storedToken) {
            return { data: [], totalPages: 0, totalElements: 0, currentPage: page };
        }

        const response = await axios.get(`${REST_API_DOCTOR_SERVICE}/${doctorId}`, {
            params: { page, size },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching doctor services:', error);
        throw error;
    }
};

export default {
    getDoctorService
};