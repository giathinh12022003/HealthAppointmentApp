import axios from 'axios';
import { getToken } from './Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_CREATE_PATIENT = process.env.EXPO_PUBLIC_API_CREATE_PATIENT;

const REST_API_PATIENT = `${IP}${API_CREATE_PATIENT}`;

export const createPatientRecord = async (patientData) => {
  try {
    const storedToken = await getToken('accessToken');

    const response = await axios.post(`${REST_API_PATIENT}`, patientData, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error create record:', error);
    throw error;
  }
};