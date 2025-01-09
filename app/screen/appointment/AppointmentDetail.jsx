import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Linking,TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getAllAppointmentById } from '../../service/appointment/GetAppointment';
import { getPatientRecordById } from '../../service/patient/GetRecordPatient';
import tw from 'tailwind-react-native-classnames';

export default function AppointmentDetail() {
  const { appointmentId, patientId, bookDate } = useLocalSearchParams();
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullProfile, setShowFullProfile] = useState(false);

  useEffect(() => {
    if (appointmentId && patientId) {
      fetchDetails();
    }
  }, [appointmentId, patientId]);

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getAllAppointmentById(appointmentId);
      const dataPatient = await getPatientRecordById(patientId);
      setAppointment(data);
      setPatient(dataPatient);
    } catch (error) {
      console.error('Failed to fetch details:', error);
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

  if (!appointment || !patient) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <Text style={tw`text-lg text-gray-600`}>Không tìm thấy thông tin.</Text>
      </View>
    );
  }

  const getStatusStyle = (status) => {
    const normalizedStatus = status?.normalize('NFC');
    if (normalizedStatus === 'Chờ phê duyệt') {
      return 'text-yellow-500';
    } else if (normalizedStatus === 'Đã xác nhận') {
      return 'text-blue-500';
    } else if (normalizedStatus === 'Đã có kết quả') {
      return 'text-green-500';
    } else {
      return 'text-gray-500';
    }
  };

  const {
    id,
    dateFullName,
    status,
    orderNumber,
    serviceTimeFrame,
    checkResultResponseList,
  } = appointment;

  const {
    fullName,
    dateOfBirth,
    gender,
    phoneNumber,
    email,
    insuranceId,
    identificationCode,
    nation,
    occupation,
    address,
    province,
    district,
    ward,
    relationship
  } = patient;

  return (
    <ScrollView style={tw`flex-1 bg-gray-100`}>
      {/* Service Information */}
      <View style={tw`bg-white p-6 m-4 rounded-lg shadow-lg`}>
        <Text style={tw`text-xl font-bold text-blue-600 mb-4 text-center`}>Thông tin dịch vụ</Text>
        <View style={tw`border-b border-gray-300 mb-2`} />
        <Text style={tw`text-base text-gray-700`}>Mã lịch hẹn: <Text style={tw`font-semibold`}>{id}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Dịch vụ: <Text style={tw`font-semibold`}>{serviceTimeFrame?.serviceName}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Số thứ tự: <Text style={tw`font-semibold`}>{orderNumber}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Ngày khám: <Text style={tw`font-semibold`}>{dateFullName}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Trạng thái: <Text style={tw`font-semibold`}>{status}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Thời gian đặt: <Text style={tw`font-semibold`}>{bookDate}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>
          Bác sĩ: <Text style={tw`font-semibold`}>{serviceTimeFrame?.doctorName} ({serviceTimeFrame?.doctorQualificationName})</Text>
        </Text>
        <Text style={tw`text-base text-gray-700`}>Phòng khám: <Text style={tw`font-semibold`}>{serviceTimeFrame?.roomName}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Khung giờ khám: <Text style={tw`font-semibold`}>{serviceTimeFrame?.timeFrameNameFullName}</Text></Text>
      </View>

     {/* Patient Information */}
     <View style={tw`bg-white p-6 m-4 rounded-lg shadow-lg`}>
        <Text style={tw`text-xl font-bold text-blue-600 mb-4 text-center`}>Thông tin hồ sơ</Text>
        <View style={tw`border-b border-gray-300 mb-2`} />

        {/* Thông tin cơ bản */}
        <Text style={tw`text-base text-gray-700`}>Mã hồ sơ: <Text style={tw`font-semibold`}>{patientId}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Họ tên: <Text style={tw`font-semibold`}>{fullName}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Ngày sinh: <Text style={tw`font-semibold`}>{formatDate(dateOfBirth)}</Text></Text>
        <Text style={tw`text-base text-gray-700`}>Giới tính: <Text style={tw`font-semibold`}>{gender}</Text></Text>

        {/* Thông tin chi tiết */}
        {showFullProfile && (
          <View>
            <Text style={tw`text-base text-gray-700`}>Dân tộc: <Text style={tw`font-semibold`}>{nation}</Text></Text>
            <Text style={tw`text-base text-gray-700`}>Số CCCD: <Text style={tw`font-semibold`}>{identificationCode}</Text></Text>
            <Text style={tw`text-base text-gray-700`}>Số điện thoại: <Text style={tw`font-semibold`}>{phoneNumber}</Text></Text>
            <Text style={tw`text-base text-gray-700`}>Email: <Text style={tw`font-semibold`}>{email}</Text></Text>
            <Text style={tw`text-base text-gray-700`}>Nghề nghiệp: <Text style={tw`font-semibold`}>{occupation}</Text></Text>
            <Text style={tw`text-base text-gray-700`}>Số BHYT: <Text style={tw`font-semibold`}>{insuranceId}</Text></Text>
            <Text style={tw`text-base text-gray-700`}>Địa chỉ: <Text style={tw`font-semibold`}>{address}, {ward}, {district}, {province}</Text></Text>
            <Text style={tw`text-base text-gray-700`}>Hồ sơ đặt cho: <Text style={tw`font-semibold`}>{relationship}</Text></Text>
          </View>
        )}

        {/* Nút xem thêm/thu gọn */}
        <TouchableOpacity
          style={tw``}
          onPress={() => setShowFullProfile(!showFullProfile)}
        >
          <Text style={tw`text-blue-600 text-center font-bold mt-0`}>
            {showFullProfile ? 'Thu gọn' : 'Xem thêm'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Check Results */}
      <View style={tw`bg-white p-6 m-4 rounded-lg shadow-lg`}>
        <Text style={tw`text-xl font-bold text-blue-600 mb-4 text-center`}>Kết quả và đơn thuốc</Text>
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
