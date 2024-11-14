import axios from 'axios';
import { getToken } from '../Token';
import { getIdLogin } from '../identity/Authenticate';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_CREATE_PATIENT = process.env.EXPO_PUBLIC_API_GET_PATIENT;

const REST_API_GET_PATIENT = `${IP}${API_CREATE_PATIENT}`;

export const getPatientRecord = async (page, size) => {
  try {
    const storedToken = await getToken('accessToken');
    const customerId = await getIdLogin('customerId');

    if (!storedToken) {
      return { data: [], totalPages: 0, totalElements: 0, currentPage: page };
    }

    const response = await axios.get(`${REST_API_GET_PATIENT}/${customerId}`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${storedToken}`,
      }
    });
    return response.data;
  } catch (error) {
    return;
  }
};