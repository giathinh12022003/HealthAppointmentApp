import axios from 'axios';
import { getToken } from '../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_ALL_PATIENT = process.env.EXPO_PUBLIC_API_GET_ALL_PATIENT;
const API_GET_PATIENT_NON_EXISTS_APPOINTMENT = process.env.EXPO_PUBLIC_API_GET_PATIENT_NON_EXISTS_APPOINTMENT;

const REST_API_GET_PATIENT = `${IP}${API_GET_ALL_PATIENT}`;

const REST_API_GET_PATIENT_NON_EXISTS = `${IP}${API_GET_PATIENT_NON_EXISTS_APPOINTMENT}`;

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
    // console.log(REST_API_GET_PATIENT);
    return response.data;
  } catch (error) {
    return;
  }
};

export const getPatientRecordNonExistsInAppointment = async (page,size,serviceTimeFrameId, date) => {
  try {
    const storedToken = await getToken('accessToken');

    if (!storedToken) {
      return { data: [], totalPages: 0, totalElements: 0, currentPage: page };
    }

    const response = await axios.get(`${REST_API_GET_PATIENT_NON_EXISTS}`, {
      params: {page,size, serviceTimeFrameId, date },
      headers: {
        Authorization: `Bearer ${storedToken}`,
      }
    });
    // console.log(REST_API_GET_PATIENT_NON_EXISTS);
    return response.data;
  } catch (error) {
    return;
  }
};

export default {
  getPatientRecordNonExistsInAppointment,
  getAllPatientRecord
};