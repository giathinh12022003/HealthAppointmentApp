import axios from 'axios'

const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const API_REGISTER=process.env.EXPO_PUBLIC_API_REGISTER;

const REST_API_REGISTER = `${IP}${API_REGISTER}`;

export const createUser = async (userData) => {
    try {
      const response = await axios.post(`${REST_API_REGISTER}`, userData);
      if (response.status === 200) {
        // console.log(REST_API_REGISTER);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        // Nếu backend trả về lỗi (status code >= 400)
        throw error.response.data; // Ném lỗi để xử lý trên giao diện
      } else {
        // console.error('Lỗi kết nối:', error);
        throw { message: 'Email hoặc số điện thoại đã tồn tại. Vui lòng thử lại!' };
      }
    }
  };
  

export default{
    createUser
};