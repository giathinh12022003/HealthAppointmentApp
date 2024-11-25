import axios from "axios";
import { getToken } from "../Token";

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_CREATE_PATIENT = process.env.EXPO_PUBLIC_API_CREATE_APPOINTMENT;

const REST_API_APPOINTMENT = `${IP}${API_CREATE_PATIENT}`;

export const createAppointment = async (appointmentData) => {
    try {
        const storedToken = await getToken('accessToken');

        const response = await axios.post(`${REST_API_APPOINTMENT}`, appointmentData, {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            }
        });
        // console.log(response.data);
    } catch (error) {
        // console.error('Error create record:', error);
        throw error;
    }
};

export default {
    createAppointment
  };