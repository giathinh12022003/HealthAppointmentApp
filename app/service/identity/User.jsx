import axios from 'axios'

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_REGISTER=process.env.EXPO_PUBLIC_API_REGISTER;

const REST_API_REGISTER = `${IP}${API_REGISTER}`;

export const createUser = async (userData) => {
    try {
        const response = await axios.post(`${REST_API_REGISTER}`, userData);
        if(response.status==200){
            console.log(response.data);
            return response.data;  
        }
        
    } catch (error) {
        console.error('Error posting data:', error);
    }
};