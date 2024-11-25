import axios from 'axios';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_GET_SERVICE_SPECIALTY = process.env.EXPO_PUBLIC_API_GET_SERVICE_SPECIALTY;

const REST_API_SERVICE_SPECIALTY = `${IP}${API_GET_SERVICE_SPECIALTY}`;

export const getServiceSpecialty = async (specialtyId, page, size) => {
    try {
        const response = await axios.get(`${REST_API_SERVICE_SPECIALTY}/${specialtyId}`, {
            params: { page, size },
        });
        return response.data;
    } catch (error) {
        // console.error('Error fetching:', error);
        throw error;
    }
};

export default {
    getServiceSpecialty
};