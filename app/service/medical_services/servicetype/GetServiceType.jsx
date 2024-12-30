import axios from 'axios';
import { getToken } from '../../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_ALL_SERVICE_TYPE = process.env.EXPO_PUBLIC_API_GET_ALL_SERVICE_TYPE;

const API_GET_SERVICE_BY_SERVICE_TYPE_ID = process.env.EXPO_PUBLIC_API_GET_SERVICE_BY_SERVICE_TYPE_ID;

const REST_API_SERVICE_TYPE = `${IP}${API_GET_ALL_SERVICE_TYPE}`;

const REST_API_SERVICE_TYPE_ID=`${IP}${API_GET_SERVICE_BY_SERVICE_TYPE_ID}`;

export const getServiceType = async (page, size) => {
    try {
        const storedToken = await getToken('accessToken');

        if (!storedToken) {
            return { data: [], totalPages: 0, totalElements: 0, currentPage: page };
        }

        const response = await axios.get(`${REST_API_SERVICE_TYPE}`, {
            params: { page, size },
        });
        // console.log(REST_API_SERVICE_TYPE);
        return response.data;
    } catch (error) {
        // console.error('Error fetching services:', error);
        throw error;
    }
};

export const getServiceTypeById = async (serviceId, page, size) => {
    try {
        const storedToken = await getToken('accessToken');

        if (!storedToken) {
            return { data: [], totalPages: 0, totalElements: 0, currentPage: page };
        }

        const response = await axios.get(`${REST_API_SERVICE_TYPE_ID}/${serviceId}`, {
            params: { page, size },
        });
        // console.log(REST_API_SERVICE_TYPE_ID);
        return response.data;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
};

export default {
    getServiceType,
    getServiceTypeById
};