import axios from "axios";
import { getToken } from '../../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const GET_DOCTOR_SERVICE_DAY = process.env.EXPO_PUBLIC_API_GET_DOCTOR_SERVICE_DAY;
const GET_DOCTOR_SERVICE_TIME_FRAME = process.env.EXPO_PUBLIC_API_GET_DOCTOR_SERVICE_TIME_FRAME;

const REST_API_DOCTOR_SERVICE_DAY = `${IP}${GET_DOCTOR_SERVICE_DAY}`;
const REST_API_DOCTOR_SERVICE_TIME_FRAME = `${IP}${GET_DOCTOR_SERVICE_TIME_FRAME}`;

export const getDoctorServiceDay = async (doctorServiceId) => {
    try {
        const response = await axios.get(`${REST_API_DOCTOR_SERVICE_DAY}`, {
            params: { doctorServiceId },
        });
        console.log(REST_API_DOCTOR_SERVICE_DAY);
        return response.data;
    } catch (error) {
        // console.error('Error fetching doctor services day:', error);
        throw error;
    }
};

export const getDoctorServiceTimeFrame = async (doctorServiceId, dayOfWeek, day) => {
    try {
        const response = await axios.get(`${REST_API_DOCTOR_SERVICE_TIME_FRAME}`, {
            params: { doctorServiceId, dayOfWeek, day },
        });
        console.log(REST_API_DOCTOR_SERVICE_TIME_FRAME);
        return response.data;
    } catch (error) {
        // console.error('Error fetching doctor services day:', error);
        throw error;
    }
};

export default {
    getDoctorServiceDay,
    getDoctorServiceTimeFrame
};