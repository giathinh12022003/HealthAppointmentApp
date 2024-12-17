import axios from "axios";
import { removeToken } from "../Token";

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_LOGOUT = process.env.EXPO_PUBLIC_API_LOGOUT;

const REST_API_LOGOUT = `${IP}${API_LOGOUT}`;

export const logOut = async (token) => {
    try {
        const data = {
            token: token
        };
        const response = await axios.post(`${REST_API_LOGOUT}`, data);
        await removeToken('accessToken');
        // console.log(REST_API_LOGOUT);
    } catch (error) {
        return;
    }
}

export default {
    logOut,
}