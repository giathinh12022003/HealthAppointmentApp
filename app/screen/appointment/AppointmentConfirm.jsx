import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React from 'react';
import tw from 'tailwind-react-native-classnames';

export default function AppointmentConfirm() {
  const {
    serviceName,
    doctorName,
    day,
    dayOfWeek,
    room,
    session,
    orderNumber,
  } = useLocalSearchParams();

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const navigator = useNavigation();

  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      <Text style={tw`text-lg font-bold text-center text-green-600 mb-4`}>
        Lịch Hẹn Đã Được Tạo Thành Công
      </Text>
      <View style={tw`mt-4 bg-green-100 p-6 rounded-lg shadow`}>
        <Text style={tw`text-center text-gray-800 text-xl font-bold`}>
          Số thứ tự khám của bạn:
        </Text>
        <Text style={tw`text-center text-green-700 text-4xl font-extrabold`}>
          {orderNumber}
        </Text>
      </View>

      <View style={tw`bg-white p-5 rounded-lg shadow`}>
        <Text style={tw`text-lg font-bold mb-3`}>Dịch vụ:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>{serviceName}</Text>

        <Text style={tw`text-lg font-bold mb-3`}>Bác sĩ:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>{doctorName}</Text>

        <Text style={tw`text-lg font-bold mb-3`}>Thời gian khám:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>
          Ngày: {formatDate(day)} ({`Thứ ${dayOfWeek}`})
        </Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>Khung giờ: {session}</Text>

        <Text style={tw`text-lg font-bold mb-3`}>Phòng:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>{room}</Text>
      </View>
      <TouchableOpacity
        style={tw`bg-blue-600 py-4 rounded-lg shadow mb-4`}
        onPress={() => navigator.reset({
          index: 0,
          routes: [{ name: 'screen' }]
        })}
      >
        <Text style={tw`text-center text-white font-bold text-lg`}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}
