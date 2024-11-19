import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useLocalSearchParams } from 'expo-router';
import { getDoctorServiceDay } from '../../../service/medical_services/doctor/GetDoctorServiceDay';
import { Calendar } from 'react-native-calendars';

export default function DoctorServiceDetails() {
  const { serviceId, serviceName } = useLocalSearchParams();
  const [availableDays, setAvailableDays] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableDays();
  }, [serviceId]);

  const fetchAvailableDays = async () => {
    try {
      setLoading(true);
      const data = await getDoctorServiceDay(serviceId);
      console.log('Available days from API:', data);
      const today = new Date();
      today.setHours(today.getHours() + 7);
      const todayDateString = today.toISOString().split('T')[0]; // Ngày hiện tại (YYYY-MM-DD)
  
      const markedDays = {};
  
      // Lặp qua các ngày trong 31 ngày tiếp theo từ ngày hiện tại
      for (let i = 0; i < 31; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const dayOfWeek = date.getDay(); // 0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7
        const dateString = date.toISOString().split('T')[0];
  
        // Chỉ đánh dấu nếu ngày thuộc JSON và >= ngày hiện tại
        if (data.includes(dayOfWeek.toString()) && dateString >= todayDateString) {
          console.log(`Ngày hợp lệ: ${dateString}, Thứ: ${dayOfWeek}`);
          markedDays[dateString] = {
            selected: true,
            marked: true,
            selectedColor: 'blue',
          };
        }
      }
  
      setAvailableDays(markedDays);
    } catch (error) {
      console.error('Error fetching available days:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu ngày');
    } finally {
      setLoading(false);
    }
  };
  

  const onDayPress = (day) => {
    if (availableDays[day.dateString]) {
      Alert.alert('Ngày đã chọn', `Bạn đã chọn ngày ${day.dateString}`);
    } else {
      Alert.alert('Ngày không khả dụng', `Ngày ${day.dateString} không khả dụng.`);
    }
  };

  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      <Text style={tw`text-xl font-bold mb-4 text-center`}>Dịch vụ: {serviceName}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Calendar
          markedDates={availableDays}
          onDayPress={onDayPress}
          theme={{
            selectedDayBackgroundColor: 'blue',
            todayTextColor: 'red',
            dayTextColor: 'black',
            textDisabledColor: 'gray',
            arrowColor: 'blue',
            monthTextColor: 'blue',
          }}
          style={tw`border rounded-lg bg-white shadow`}
        />
      )}
    </View>
  );
}
