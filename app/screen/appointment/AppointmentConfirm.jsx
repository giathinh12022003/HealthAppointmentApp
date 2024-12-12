import { View, Text, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
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
    unitPrice
  } = useLocalSearchParams();

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const navigator = useNavigation();

  const newAppointment = () => {
    setTimeout(() => {
      router.replace({ pathname: "screen" });
      setTimeout(() => {
        router.push({ pathname: "screen/medical_services/MedicalServiceList" });
      }, 0);
    }, 0);
  }

  const handleBack = () => {
    router.replace({
      pathname: "screen"
    })
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBack);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    }
  }, []);

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
        <Text style={tw`text-lg font-bold mb-0`}>Dịch vụ:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>{serviceName}</Text>

        <Text style={tw`text-lg font-bold mb-0`}>Bác sĩ:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>{doctorName}</Text>

        <Text style={tw`text-lg font-bold mb-3`}>Thời gian khám:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>
          Ngày: {formatDate(day)} ({`Thứ ${dayOfWeek}`})
        </Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>Khung giờ: {session}</Text>

        <Text style={tw`text-lg font-bold mb-0`}>Phòng:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>{room}</Text>

        <Text style={tw`text-lg font-bold mb-0`}>Phí khám:</Text>
        <Text style={tw`text-gray-700 mb-4 text-base`}>{unitPrice}</Text>

        <Text style={tw`text-lg font-bold mb-0`}>Trạng thái:</Text>
        <Text style={tw`text-gray-700 text-base`}>Chờ phê duyệt</Text>
      </View>
      <TouchableOpacity
        style={tw`bg-blue-600 py-4 rounded-lg shadow mb-4`}
        onPress={newAppointment}
      >
        <Text style={tw`text-center text-white font-bold text-lg`}>Thực hiện đặt lịch mới</Text>
      </TouchableOpacity>
    </View>
  );
}
