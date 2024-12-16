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
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <Text style={tw`text-lg text-gray-600`}>Không tìm thấy thông tin lịch hẹn.</Text>
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
    <ScrollView style={tw`flex-1 bg-gray-100`}>
      {/* Appointment Details */}
      <View style={tw`bg-white p-6 m-4 rounded-lg shadow-lg`}>
        <Text style={tw`text-xl font-bold text-blue-600 mb-4 text-center`}>Chi tiết lịch hẹn</Text>
        <View style={tw`border-b border-gray-300 mb-2`} />
        <Text style={tw`text-base text-gray-700`}>Mã lịch hẹn: <Text style={tw`font-semibold`}>{id}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Ngày hẹn: <Text style={tw`font-semibold`}>{dateFullName}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Số thứ tự: <Text style={tw`font-semibold`}>{orderNumber}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Trạng thái: <Text style={tw`font-semibold text-green-500`}>{status}</Text></Text>
      </View>

      {/* Service Information */}
      <View style={tw`bg-white p-6 m-4 rounded-lg shadow-lg`}>
        <Text style={tw`text-xl font-bold text-blue-600 mb-4 text-center`}>Thông tin dịch vụ</Text>
        <View style={tw`border-b border-gray-300 mb-2`} />
        <Text style={tw`text-base text-gray-700`}>Dịch vụ: <Text style={tw`font-semibold`}>{serviceTimeFrame?.serviceName}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Giờ khám: <Text style={tw`font-semibold`}>{serviceTimeFrame?.timeFrameNameFullName}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Phòng khám: <Text style={tw`font-semibold`}>{serviceTimeFrame?.roomName}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>
          Bác sĩ: <Text style={tw`font-semibold`}>{serviceTimeFrame?.doctorName} ({serviceTimeFrame?.doctorQualificationName})</Text>
        </Text>
        <Text style={tw`text-base text-gray-700`}>
          Đơn giá: <Text style={tw`font-semibold text-green-500`}>{serviceTimeFrame?.unitPrice?.toLocaleString('vi-VN')} VND</Text>
        </Text>
      </View>

      {/* Check Results */}
      <View style={tw`bg-white p-6 m-4 rounded-lg shadow-lg`}>
        <Text style={tw`text-xl font-bold text-blue-600 mb-4 text-center`}>Kết quả khám</Text>
        <View style={tw`border-b border-gray-300 mb-2`} />
        {checkResultResponseList?.length > 0 ? (
          checkResultResponseList.map((result) => (
            <View key={result.id} style={tw`flex-row justify-between mt-2`}>
              <Text style={tw`text-base text-gray-700`}>{result.name}:</Text>
              <Text
                style={tw`text-base text-blue-500 underline`}
                onPress={() => handleOpenLink(result.url)}
              >
                Tải về
              </Text>
            </View>
          ))
        ) : (
          <Text style={tw`text-base text-gray-700 mt-2 text-center`}>
            Vẫn chưa có kết quả khám, vui lòng chờ.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
