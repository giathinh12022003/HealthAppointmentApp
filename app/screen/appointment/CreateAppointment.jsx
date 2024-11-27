import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import React from 'react';
import tw from 'tailwind-react-native-classnames';
import { createAppointment } from '../../service/appointment/CreateAppointment'

export default function AppointmentSummary() {
  const {
    serviceName,
    doctorName,
    serviceTimeFrameId,
    day,
    dayOfWeek,
    room,
    patientId,
    session,
  } = useLocalSearchParams();

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const convertDateToApiFormat = (date) => {
    const [year, month, day] = date.split('-');
    return `${year}-${month}-${day}`;
  };

  const navigator = useNavigation();

  const handleConfirmAppointment = async () => {
    const formattedDate = convertDateToApiFormat(day);
    const appointmentData = {
      date: formattedDate,
      session: session,
      serviceTimeFrameId: serviceTimeFrameId,
      patientsId: patientId,
    };

    try {
      // await createAppointment(appointmentData);
      Alert.alert(
        'Thành công',
        'Lịch hẹn của bạn đã được lưu! Nhấn OK để quay lại trang chủ.',
        [
          {
            text: 'OK',
            onPress: () => navigator.reset({
              index: 0,
              routes: [{ name: 'screen' }],
            }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tạo lịch hẹn. Vui lòng thử lại.');
    }
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
        <Text style={tw`text-gray-700 mb-4 text-base`}>Khung giờ: {session}</Text>

        <Text style={tw`text-lg font-bold mb-3`}>Phòng:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>{room}</Text>

        <Text style={tw`text-lg font-bold mb-3`}>Mã Hồ sơ:</Text>
        <Text style={tw`text-gray-700 text-base`}>{patientId}</Text>
      </View>

      <View style={tw`mt-6`}>
        <TouchableOpacity
          style={tw`bg-blue-600 py-4 rounded-lg shadow mb-4`}
          onPress={handleConfirmAppointment}
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
