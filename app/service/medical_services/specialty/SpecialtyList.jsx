import axios from 'axios';
import { getToken } from '../../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_SPECIALTY = process.env.EXPO_PUBLIC_API_GET_SPECIALTY;

const REST_API_SPECIALTY = `${IP}${API_GET_SPECIALTY}`;

export const getSpecialties = async (page, size) => {
    try {
        const response = await axios.get(`${REST_API_SPECIALTY}`, {
            params: { page, size },
        });
        console.log(REST_API_SPECIALTY);
        return response.data;
    } catch (error) {
        // console.error('Error fetching specialty:', error);
        throw error;
    }
};

export default {
    getSpecialties
};