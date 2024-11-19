import axios from 'axios';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_LOGIN = process.env.EXPO_PUBLIC_API_LOGIN;

const REST_API_LOGIN = `${IP}${API_LOGIN}`;

export const loginUser = async (userName, password) => {
    try {
        const data = {
            userName: userName,
            password: password,
        };
        const response = await axios.post(`${REST_API_LOGIN}`, data);
        if (response.status == 200) {
            return response.data;
        }
        else {
            return;
        }
    } catch (error) {
        return;
    }
};

export default {
    loginUser,
};
