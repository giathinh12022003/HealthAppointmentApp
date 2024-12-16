import axios from 'axios';
import { getToken } from '../../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_DOCTOR_SERVICE = process.env.EXPO_PUBLIC_API_GET_DOCTOR_SERVICE;

const REST_API_DOCTOR_SERVICE = `${IP}${API_GET_DOCTOR_SERVICE}`;
export const getDoctorService = async (doctorId, page, size) => {
    try {
        const storedToken = await getToken('accessToken');

        if (!storedToken) {
            return { data: [], totalPages: 0, totalElements: 0, currentPage: page };
        }

        const response = await axios.get(`${REST_API_DOCTOR_SERVICE}/${doctorId}`, {
            params: { page, size },
        });
        console.log(REST_API_DOCTOR_SERVICE);
        return response.data;
    } catch (error) {
        // console.error('Error fetching doctor services:', error);
        throw error;
    }
};

export default {
    getDoctorService
};