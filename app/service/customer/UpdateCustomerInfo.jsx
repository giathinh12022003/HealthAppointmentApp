import axios from 'axios';
import { getToken } from '../Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_UPDATE_CUSTOMER_INFO = process.env.EXPO_PUBLIC_API_UPDATE_CUSTOMER_INFO;

const REST_API_UPDATE_CUSTOMER_INFO = `${IP}${API_UPDATE_CUSTOMER_INFO}`;

export const updateCustomerInfo = async (customerData) => {
    try {
        const storedToken = await getToken('accessToken');

        const response = await axios.put(`${REST_API_UPDATE_CUSTOMER_INFO}`, customerData,
            {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            }
        );

        if (response.status === 200) {
            console.log('updated successfully:', response.data);
        } else {
            console.error('Failed to update:', response.data || response.statusText);
        }
    } catch (error) {
        console.error('Error updating:', error);
    }
};

export default {
    updateCustomerInfo
};