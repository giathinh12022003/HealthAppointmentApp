import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_LOGIN=process.env.EXPO_PUBLIC_API_LOGIN;

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

export const setIdLogin = async (id, value) => {
    try {
        await AsyncStorage.setItem(id, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting token:', error);
    }
};

export const getIdLogin = async (token) => {
    try {
        const value = await AsyncStorage.getItem(token);
        return value != null ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};
