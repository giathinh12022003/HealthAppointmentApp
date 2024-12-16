import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getAllAppointmentById } from '../../service/appointment/GetAppointment';
import tw from 'tailwind-react-native-classnames';

export default function AppointmentDetail() {
  const { appointmentId } = useLocalSearchParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const data = await getAllAppointmentById(appointmentId);
      setAppointment(data);
    } catch (error) {
      console.error('Failed to fetch appointment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error('Failed to open URL:', err)
      );
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg text-gray-600`}>
          Không tìm thấy thông tin lịch hẹn.
        </Text>
      </View>
    );
  }

  const {
    id,
    dateFullName,
    status,
    orderNumber,
    serviceTimeFrame,
    checkResultResponseList,
  } = appointment;

  return (
    <ScrollView style={tw`flex-1 bg-gray-100 p-4`}>
      {/* Appointment Details */}
      <View style={tw`bg-white p-4 rounded-lg shadow mb-4`}>
        <Text style={tw`text-lg font-bold text-blue-600`}>Chi tiết lịch hẹn</Text>
        <Text style={tw`text-base text-gray-700 mt-2`}>Mã lịch hẹn: {id}</Text>
        <Text style={tw`text-base text-gray-700`}>Ngày hẹn: {dateFullName}</Text>
        <Text style={tw`text-base text-gray-700`}>Số thứ tự: {orderNumber}</Text>
        <Text style={tw`text-base text-gray-700`}>Trạng thái: {status}</Text>
      </View>

      {/* Service Information */}
      <View style={tw`bg-white p-4 rounded-lg shadow mb-4`}>
        <Text style={tw`text-lg font-bold text-blue-600`}>Thông tin dịch vụ</Text>
        <Text style={tw`text-base text-gray-700 mt-2`}>
          Dịch vụ: {serviceTimeFrame?.serviceName}
        </Text>
        <Text style={tw`text-base text-gray-700`}>
          Giờ khám: {serviceTimeFrame?.timeFrameNameFullName}
        </Text>
        <Text style={tw`text-base text-gray-700`}>
          Phòng khám: {serviceTimeFrame?.roomName}
        </Text>
        <Text style={tw`text-base text-gray-700`}>
          Bác sĩ: {serviceTimeFrame?.doctorName} (
          {serviceTimeFrame?.doctorQualificationName})
        </Text>
        <Text style={tw`text-base text-gray-700`}>
          Đơn giá: {serviceTimeFrame?.unitPrice?.toLocaleString('vi-VN')} VND
        </Text>
      </View>

      {/* Check Results */}
      {checkResultResponseList?.length > 0 && (
        <View style={tw`bg-white p-4 rounded-lg shadow`}>
          <Text style={tw`text-lg font-bold text-blue-600`}>Kết quả khám</Text>
          {checkResultResponseList.map((result) => (
            <Text key={result.id} style={tw`text-base text-blue-500 mt-2`}>
              {result.name}:{' '}
              <Text
                style={tw`underline`}
                onPress={() => handleOpenLink(result.url)}
              >
                Tải về
              </Text>
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}