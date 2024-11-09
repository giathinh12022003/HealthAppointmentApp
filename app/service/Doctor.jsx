import axios from 'axios';
import { getToken } from './Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_DOCTOR_DATA = process.env.EXPO_PUBLIC_API_GET_DOCTOR_DATA;

const REST_API_DOCTOR = IP + API_GET_DOCTOR_DATA;

export const getDoctors = async (page, size) => {
  try {
    const storedToken = await getToken('accessToken');

    if (!storedToken) {
      return { data: [], totalPages: 0, totalElements: 0, currentPage: page };
    }

    const response = await axios.get(`${REST_API_DOCTOR}`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${storedToken}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};
