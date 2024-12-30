import axios from 'axios';
import { getToken } from '../../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_VACCINE_SERVICE= process.env.EXPO_PUBLIC_API_GET_SERVICE_BY_SERVICE_TYPE_ID;

const REST_API_GET_VACCINE_SERVICE_TYPE = `${IP}${API_GET_VACCINE_SERVICE}`;

export const getVaccineService = async (page, size) => {
    try {
        const storedToken = await getToken('accessToken');

        if (!storedToken) {
            return { data: [], totalPages: 0, totalElements: 0, currentPage: page };
        }

        const response = await axios.get(`${REST_API_GET_VACCINE_SERVICE_TYPE}/TiemChung`, {
            params: { page, size },
        });
        // console.log(REST_API_GET_VACCINE_SERVICE_TYPE);
        return response.data;
    } catch (error) {
        // console.error('Error fetching vaccine services:', error);
        throw error;
    }
};

export default {
    getVaccineService
};