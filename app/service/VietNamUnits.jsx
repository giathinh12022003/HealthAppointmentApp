import axios from 'axios'
import { getToken } from './Token';

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_PROVICE = process.env.EXPO_PUBLIC_API_GET_PROVINCE;
const API_DISTRIC = process.env.EXPO_PUBLIC_API_GET_DISTRICT_BY_PROVINCE;
const API_WARD = process.env.EXPO_PUBLIC_API_GET_WARD_BY_DISTRICT;

const GET_PROVINCE = `${IP}${API_PROVICE}`;
const API_DISTRICT_BY_PROVINCE = `${IP}${API_DISTRIC}`;
const API_WARD_BY_DISTRICT = `${IP}${API_WARD}`;

export const fetchProvinces = async () => {
    try {
        const storedToken = await getToken('accessToken');
        const response = await axios.get(`${GET_PROVINCE}`, {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            }
        });
        return response.data;
    } catch {
        return;
    }
};

export const fetchDistrictsByProvinceCode = async (provinceCode) => {
    try {
        const storedToken = await getToken('accessToken');
        const response = await axios.get(`${API_DISTRICT_BY_PROVINCE}/${provinceCode}`, {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            },
        });
        return response.data;
    } catch {
        return;
    }
};


export const fetchWardsByDistrictCode = async (districtCode) => {
    try {
        const storedToken = await getToken('accessToken');
        const response = await axios.get(`${API_WARD_BY_DISTRICT}/${districtCode}`, {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            },
        });
        return response.data;
    } catch {
        return;
    }
};

export default {
    fetchProvinces,
    fetchDistrictsByProvinceCode,
    fetchWardsByDistrictCode
};
