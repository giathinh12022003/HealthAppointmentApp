import AsyncStorage from '@react-native-async-storage/async-storage';

export const setToken = async (token, value) => {
  try {
    await AsyncStorage.setItem(token, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const getToken = async (token) => {
  try {
    const value = await AsyncStorage.getItem(token);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async (token) => {
  try {
    await AsyncStorage.removeItem(token);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export default {
  setToken,
  getToken,
  removeToken
};