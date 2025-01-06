import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import tw from 'tailwind-react-native-classnames';
import { WebView } from 'react-native-webview';
import { createAppointment } from '../../service/appointment/CreateAppointment';
import { getPatientRecordById } from '../../service/patient/GetRecordPatient';

export default function AppointmentSummary() {
  const [patient, setPatient] = useState(null);
  const [expanded, setExpanded] = useState(false); // State để quản lý xem thêm/thu gọn
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const {
    serviceName,
    doctorName,
    serviceTimeFrameId,
    day,
    dayOfWeek,
    room,
    patientId,
    session,
    unitPrice,
  } = useLocalSearchParams();

  useEffect(() => {
    fetchPatientDetails();
  }, []);

  const fetchPatientDetails = async () => {
    try {
      const data = await getPatientRecordById(patientId);
      setPatient(data);
    } catch (error) {
      console.error('Failed to fetch patient details:', error);
    }
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleConfirmAppointment = async () => {
    const appointmentData = {
      date: day,
      serviceTimeFrameId,
      patientsId: patientId,
    };

    try {
      const data = await createAppointment(appointmentData);
      setPaymentUrl(data.vnpayURL);
      setOrderNumber(data.paymentRequest.orderNumber);
      setWebViewVisible(true);
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tạo lịch hẹn. Vui lòng thử lại.');
    }
  };

  const handlePaymentSuccess = () => {
    setWebViewVisible(false);
    router.replace({
      pathname: 'screen/appointment/AppointmentConfirm',
      params: {
        serviceName,
        doctorName,
        day,
        dayOfWeek,
        room,
        session,
        orderNumber,
        unitPrice,
      },
    });
  };

  const handleCloseWebView = () => {
    setWebViewVisible(false);
    Alert.alert(
      'Thông báo',
      'Bạn đã hủy thanh toán. Nếu muốn thanh toán lại, vui lòng xác nhận đặt lịch.',
      [{ text: 'OK', onPress: () => { } }]
    );
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {webViewVisible ? (
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={(event) => {
            if (event.url.includes('vnp_TransactionStatus=00')) {
              handlePaymentSuccess();
            } else if (event.url.includes('vnp_TransactionStatus=02')) {
              handleCloseWebView();
            }
          }}
          style={tw`flex-1`}
        />
      ) : (
        <ScrollView style={tw`p-4`}>
          <Text style={tw`text-lg font-bold text-center text-blue-600 mb-2`}>
            Kiểm Tra Thông Tin Lịch Hẹn
          </Text>

          <View style={tw`bg-white p-5 rounded-lg shadow mb-2`}>
            <Text style={tw`text-lg font-bold mb-0`}>Bác sĩ:</Text>
            <Text style={tw`text-gray-700 mb-2 text-base`}>{doctorName}</Text>

            <Text style={tw`text-lg font-bold mb-0`}>Dịch vụ:</Text>
            <Text style={tw`text-gray-700 mb-2 text-base`}>{serviceName}</Text>

            <Text style={tw`text-lg font-bold mb-0`}>Thời gian khám:</Text>
            <Text style={tw`text-gray-700 mb-0 text-base`}>
              Ngày: {formatDate(day)} ({`Thứ ${dayOfWeek}`})
            </Text>
            <Text style={tw`text-gray-700 mb-2 text-base`}>Khung giờ: {session}</Text>

            <Text style={tw`text-lg font-bold mb-0`}>Phòng:</Text>
            <Text style={tw`text-gray-700 mb-2 text-base`}>{room}</Text>

            <Text style={tw`text-lg font-bold mb-0`}>Phí dịch vụ:</Text>
            <Text style={tw`text-gray-700 text-base`}>{formatCurrency(unitPrice)} VNĐ</Text>
          </View>

          {patient && (
            <View style={tw`bg-white p-5 rounded-lg shadow mb-0`}>
              <Text style={tw`text-lg font-bold mb-0 text-center text-blue-600`}>
                Thông Tin Hồ Sơ Đăng Ký
              </Text>

              <Text style={tw`text-lg font-bold mb-0`}>Mã Hồ sơ:</Text>
              <Text style={tw`text-gray-700 mb-2 text-base`}>{patientId}</Text>

              <Text style={tw`text-lg font-bold mb-0`}>Họ tên:</Text>
              <Text style={tw`text-gray-700 mb-2 text-base`}>{patient.fullName}</Text>

              <Text style={tw`text-lg font-bold mb-0`}>Ngày sinh:</Text>
              <Text style={tw`text-gray-700 mb-2 text-base`}>{formatDate(patient.dateOfBirth)}</Text>

              <Text style={tw`text-lg font-bold mb-0`}>Giới tính:</Text>
              <Text style={tw`text-gray-700 mb-2 text-base`}>{patient.gender}</Text>

              {expanded && (
                <>
                  <Text style={tw`text-lg font-bold mb-0`}>Email:</Text>
                  <Text style={tw`text-gray-700 mb-2 text-base`}>{patient.email}</Text>

                  <Text style={tw`text-lg font-bold mb-0`}>Địa chỉ:</Text>
                  <Text style={tw`text-gray-700 mb-2 text-base`}>{patient.address}, {patient.ward}, {patient.district}, {patient.province}</Text>

                  <Text style={tw`text-lg font-bold mb-0`}>Nghề nghiệp:</Text>
                  <Text style={tw`text-gray-700 mb-2 text-base`}>{patient.occupation}</Text>

                  <Text style={tw`text-lg font-bold mb-0`}>Hồ sơ đặt cho:</Text>
                  <Text style={tw`text-gray-700 mb-2 text-base`}>{patient.relationship}</Text>

                  <Text style={tw`text-lg font-bold mb-0`}>Ghi chú:</Text>
                  <Text style={tw`text-gray-700 mb-2 text-base`}>{patient.note}</Text>
                </>
              )}

              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={tw`text-blue-600 text-center font-bold mt-0`}>
                  {expanded ? 'Thu gọn' : 'Xem thêm'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={tw`w-full mt-4 mb-8`}>
            <TouchableOpacity
              style={tw`bg-blue-600 py-4 rounded-lg shadow mb-2`}
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
        </ScrollView>
      )}
    </View>
  );
}
