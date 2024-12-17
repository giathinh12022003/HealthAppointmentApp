import axios from 'axios';
import { getToken } from '../../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_DOCTOR_SERVICE_ID=process.env.EXPO_PUBLIC_API_GET_DOCTOR_SERVICE_ID;

const REST_API_DOCTOR_SERVICE_ID=`${IP}${API_GET_DOCTOR_SERVICE_ID}`;

export const getDoctorServiceId = async (serviceId, page, size) => {
    try {
        const response = await axios.get(`${REST_API_DOCTOR_SERVICE_ID}`, {
            params: {serviceId, page, size },
        });
        // console.log(REST_API_DOCTOR_SERVICE_ID);
        return response.data;
    } catch (error) {
        // console.error('Error fetching doctor services:', error);
        throw error;
    }
};

export default {
    getDoctorServiceId,
};