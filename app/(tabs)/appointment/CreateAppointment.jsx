import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import React from 'react';
import tw from 'tailwind-react-native-classnames';

export default function AppointmentSummary() {
  const {
    serviceId,
    serviceName,
    doctorId,
    doctorName,
    serviceTimeFrameId,
    day,
    dayOfWeek,
    startTime,
    endTime,
    room,
    patientId,
  } = useLocalSearchParams();

  const formatTime = (start, end) => {
    const startPeriod = start < 12 ? 'sáng' : 'chiều';
    const endPeriod = end < 12 ? 'sáng' : 'chiều';

    if (startPeriod === endPeriod) {
      return `${start} - ${end} giờ (${startPeriod})`;
    }
    return `${start} ${startPeriod} - ${end} ${endPeriod}`;
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      <Text style={tw`text-lg font-bold text-center text-blue-600 mb-4`}>
        Xác nhận Thông Tin Lịch Hẹn
      </Text>
      
      <View style={tw`bg-white p-5 rounded-lg shadow`}>
        <Text style={tw`text-lg font-bold mb-3`}>Dịch vụ:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>{serviceName}</Text>

        <Text style={tw`text-lg font-bold mb-3`}>Bác sĩ:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>{doctorName}</Text>

        <Text style={tw`text-lg font-bold mb-3`}>Thời gian khám:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>
          Ngày: {formatDate(day)} ({`Thứ ${dayOfWeek}`})
        </Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>Khung giờ: {formatTime(startTime, endTime)}</Text>

        <Text style={tw`text-lg font-bold mb-3`}>Phòng:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>{room}</Text>

        <Text style={tw`text-lg font-bold mb-3`}>Mã Hồ sơ:</Text>
        <Text style={tw`text-gray-700 text-base`}>{patientId}</Text>
      </View>

      <View style={tw`mt-6`}>
        <TouchableOpacity
          style={tw`bg-blue-600 py-4 rounded-lg shadow mb-4`}
          onPress={() => Alert.alert('Xác nhận', 'Lịch hẹn của bạn đã được lưu!')}
        >
          <Text style={tw`text-center text-white font-bold text-lg`}>Xác nhận</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-gray-200 py-4 rounded-lg shadow`}
          onPress={() => router.back()}
        >
          <Text style={tw`text-center text-gray-700 font-bold text-lg`}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
