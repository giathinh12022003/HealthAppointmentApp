import { View, Text, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import React, { useState, useEffect } from 'react';
import tw from 'tailwind-react-native-classnames';
import { WebView } from 'react-native-webview';
import { createAppointment } from '../../service/appointment/CreateAppointment';

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
    unitPrice
  } = useLocalSearchParams();

  const [webViewVisible, setWebViewVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const navigator = useNavigation();

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const convertDateToApiFormat = (date) => {
    const [year, month, day] = date.split('-');
    return `${year}-${month}-${day}`;
  };

  const handleConfirmAppointment = async () => {
    const formattedDate = convertDateToApiFormat(day);
    const appointmentData = {
      date: formattedDate,
      serviceTimeFrameId: serviceTimeFrameId,
      patientsId: patientId,
    };

    try {
      const data = await createAppointment(appointmentData);
      setPaymentUrl(data.vnpayURL); // Lấy URL thanh toán
      setOrderNumber(data.paymentRequest.orderNumber);
      setWebViewVisible(true); // Hiển thị WebView
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tạo lịch hẹn. Vui lòng thử lại.');
    }
  };

  const handlePaymentSuccess = () => {
    setWebViewVisible(false);
    router.replace({
      pathname: 'screen/appointment/AppointmentConfirm',
      params: {
        serviceName: serviceName,
        doctorName: doctorName,
        day: day,
        dayOfWeek: dayOfWeek,
        room: room,
        session: session,
        orderNumber: orderNumber,
        unitPrice: unitPrice,
      },
    });
  };

  const handleCloseWebView = () => {
    // Logic xử lý khi người dùng đóng WebView
    setWebViewVisible(false);
    Alert.alert(
      'Thông báo',
      'Bạn đã hủy thanh toán. Nếu muốn thanh toán lại, vui lòng xác nhận đặt lịch.',
      [
        { text: 'OK', onPress: () => { } },
      ]
    );
  };

  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      {webViewVisible ? (
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={(event) => {
            if (event.url.includes('vnp_TransactionStatus=00')) { // Kiểm tra URL thành công
              handlePaymentSuccess();
            }
            if (event.url.includes('vnp_TransactionStatus=02')) {// Mã trả về đã hủy thanh toán
              handleCloseWebView();
            }
          }}
          style={tw`flex-1`}
        />
      ) : (
        <>
          <Text style={tw`text-lg font-bold text-center text-blue-600 mb-4`}>
            Kiểm Tra Thông Tin Lịch Hẹn
          </Text>

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

            <Text style={tw`text-lg font-bold mb-0`}>Mã Hồ sơ:</Text>
            <Text style={tw`text-gray-700 mb-4 text-base`}>{patientId}</Text>

            <Text style={tw`text-lg font-bold mb-0`}>Phí khám:</Text>
            <Text style={tw`text-gray-700 text-base`}>{unitPrice} VNĐ</Text>
          </View>

          <View style={tw`mt-6`}>
            <TouchableOpacity
              style={tw`bg-blue-600 py-4 rounded-lg shadow mb-4`}
              onPress={handleConfirmAppointment}
            >
              <Text style={tw`text-center text-white font-bold text-lg`}>Xác nhận đặt lịch</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`bg-gray-200 py-4 rounded-lg shadow`}
              onPress={() => router.back()}
            >
              <Text style={tw`text-center text-gray-700 font-bold text-lg`}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
