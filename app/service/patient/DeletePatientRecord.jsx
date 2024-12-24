import axios from 'axios';
import { getToken } from '../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_DELETE_PATIENT = process.env.EXPO_PUBLIC_API_DELETE_PATIENT;

const REST_API_DELETE_PATIENT = `${IP}${API_DELETE_PATIENT}`;

export const deletePatient = async (id) => {
    try {
        const storedToken = await getToken('accessToken');

        const response = await axios.delete(`${REST_API_DELETE_PATIENT}/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            }
        );

        if (response.status === 200) {
            console.log('delete successfully');
        } else {
            console.error('Failed to delete:');
        }
    } catch (error) {
        console.error('Error deletting:', error);
    }
}

export default {
    deletePatient
};