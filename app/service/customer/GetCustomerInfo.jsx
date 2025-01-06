import axios from 'axios';
import { getToken } from '../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_CUSTOMER_INFO = process.env.EXPO_PUBLIC_API_GET_CUSTOMER_INFO;

const REST_API_GET_CUSTOMER_INFO = `${IP}${API_GET_CUSTOMER_INFO}`;

export const getInfo = async () => {
    try {
        const storedToken = await getToken('accessToken');

        if (!storedToken) {
            return { data: [] };
        }

        const response = await axios.get(`${REST_API_GET_CUSTOMER_INFO}`, {
            headers: {
                'Authorization': `Bearer ${storedToken}`
            }
        });
        return response.data;
    } catch (error) {
        // console.error('Error fetching info:', error);
        throw error;
    }
};

export default {
    getInfo
};