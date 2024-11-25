import axios from 'axios';
import { getToken } from '../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_CREATE_PATIENT = process.env.EXPO_PUBLIC_API_GET_ALL_PATIENT;
const API_CREATE_PATIENT_ID = process.env.EXPO_PUBLIC_API_GET_PATIENT_BY_ID;

const REST_API_GET_PATIENT = `${IP}${API_CREATE_PATIENT}`;

const REST_API_GET_PATIENT_ID = `${IP}${API_CREATE_PATIENT_ID}`;

export const getAllPatientRecord = async (page, size) => {
  try {
    const storedToken = await getToken('accessToken');

    if (!storedToken) {
      return { data: [], totalPages: 0, totalElements: 0, currentPage: page };
    }

    const response = await axios.get(`${REST_API_GET_PATIENT}`, {
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

export const getPatientRecord = async (id) => {
  try {
    const storedToken = await getToken('accessToken');

    const response = await axios.get(`${REST_API_GET_PATIENT_ID}/${id}`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      }
    });
    return response.data;
  } catch (error) {
    return;
  }
};

export default {
  getPatientRecord,
  getAllPatientRecord
};