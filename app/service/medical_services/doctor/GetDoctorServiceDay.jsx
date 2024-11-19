import axios from "axios";
import { getToken } from '../../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const GET_DOCTOR_SERVICE_DAY = process.env.EXPO_PUBLIC_API_GET_DOCTOR_SERVICE_DAY;

const REST_API_DOCTOR_SERVICE_DAY = `${IP}${GET_DOCTOR_SERVICE_DAY}`;
export const getDoctorServiceDay = async (doctorServiceId) => {
    try {
        const response = await axios.get(`${REST_API_DOCTOR_SERVICE_DAY}`, {
            params: {doctorServiceId },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching doctor services day:', error);
        throw error;
    }
};

export default {
    getDoctorServiceDay
};