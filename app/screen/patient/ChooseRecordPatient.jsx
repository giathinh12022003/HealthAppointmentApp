import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { getAllPatientRecord } from '../../service/patient/GetRecordPatient';
import tw from 'tailwind-react-native-classnames';

export default function ChooseRecordPatient() {
  const [recordPatients, setRecordPatients] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const { serviceId,
    serviceName,
    doctorId,
    doctorName,
    serviceTimeFrameId,
    day,
    dayOfWeek,
    startTime,
    endTime,
    room,
    session } = useLocalSearchParams();

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [page]);

  const fetchPatientDetails = async () => {
    setLoading(true);
    try {
      const data = await getAllPatientRecord(page, 4);
      if (data?.data) {
        setRecordPatients(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      // console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPatientItem = ({ item }) => (
    <View style={tw`border p-4 mb-2 bg-white rounded-lg`}>
      <Text style={tw`text-lg font-bold`}>{item.id}</Text>
      <Text>Ngày sinh: {item.dateOfBirth}</Text>
      <Text>Giới tính: {item.gender}</Text>
      <Text>Số điện thoại: {item.phoneNumber}</Text>
      <TouchableOpacity
        style={tw`mt-6 bg-blue-600 py-3 rounded-lg shadow`}
        onPress={() => router.push({
          pathname: 'screen/appointment/CreateAppointment', params: {
            serviceId: serviceId,
            serviceName: serviceName,
            doctorId: doctorId,
            doctorName: doctorName,
            day: day,
            serviceTimeFrameId: serviceTimeFrameId,
            dayOfWeek: dayOfWeek,
            startTime: startTime,
            endTime: endTime,
            room: room,
            session: session,
            patientId: item.id
          }
        })}
      >
        <Text style={tw`text-center text-white font-bold text-base`}>Chọn hồ sơ</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const visiblePages = 3; // Số lượng trang hiển thị xung quanh trang hiện tại
    const pages = [];
    const startEllipsis = page > visiblePages + 1;
    const endEllipsis = page < totalPages - visiblePages;

    // Nút đầu tiên
    pages.push(1);
    if (startEllipsis) pages.push('startEllipsis');

    // Các trang lân cận
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
    }

    if (endEllipsis) pages.push('endEllipsis');

    // Nút cuối cùng
    if (totalPages > 1) pages.push(totalPages);

    return (
        <View style={tw`flex-row justify-center items-center flex-wrap mt-4`}>
            {/* Nút đi đến trang đầu tiên */}
            <TouchableOpacity
                onPress={() => setPage(1)}
                disabled={page === 1}
                style={tw`m-1 px-3 py-2 bg-gray-200 rounded-lg ${page === 1 ? 'opacity-50' : ''}`}
            >
                <Text style={tw`text-center text-base text-black`}>{`<<`}</Text>
            </TouchableOpacity>

            {/* Nút lùi một trang */}
            <TouchableOpacity
                onPress={() => setPage(page - 1)}
                disabled={page === 1}
                style={tw`m-1 px-3 py-2 bg-gray-200 rounded-lg ${page === 1 ? 'opacity-50' : ''}`}
            >
                <Text style={tw`text-center text-base text-black`}>{`<`}</Text>
            </TouchableOpacity>

            {/* Hiển thị các trang */}
            {pages.map((pageNumber, index) => {
                if (pageNumber === 'startEllipsis' || pageNumber === 'endEllipsis') {
                    return (
                        <Text key={`ellipsis-${index}`} style={tw`px-4 py-2 text-gray-500`}>
                            ...
                        </Text>
                    );
                }
                return (
                    <TouchableOpacity
                        key={`page-${pageNumber}`}
                        onPress={() => setPage(pageNumber)}
                        disabled={page === pageNumber}
                        style={tw`m-1 px-4 py-2 ${page === pageNumber ? 'bg-blue-500' : 'bg-gray-200'} rounded-lg`}
                    >
                        <Text style={tw`text-center text-base ${page === pageNumber ? 'text-white' : 'text-black'}`}>
                            {pageNumber}
                        </Text>
                    </TouchableOpacity>
                );
            })}

            {/* Nút tiến một trang */}
            <TouchableOpacity
                onPress={() => setPage(page + 1)}
                disabled={page === totalPages}
                style={tw`m-1 px-3 py-2 bg-gray-200 rounded-lg ${page === totalPages ? 'opacity-50' : ''}`}
            >
                <Text style={tw`text-center text-base text-black`}>{`>`}</Text>
            </TouchableOpacity>

            {/* Nút đi đến trang cuối */}
            <TouchableOpacity
                onPress={() => setPage(totalPages)}
                disabled={page === totalPages}
                style={tw`m-1 px-3 py-2 bg-gray-200 rounded-lg ${page === totalPages ? 'opacity-50' : ''}`}
            >
                <Text style={tw`text-center text-base text-black`}>{`>>`}</Text>
            </TouchableOpacity>
        </View>
    );
};


  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      <Text style={tw`text-black font-bold text-left text-lg`}>Danh sách hồ sơ:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={recordPatients}
            keyExtractor={(item) => item.id}
            renderItem={renderPatientItem}
          />
          {renderPagination()}
        </>
      )}
    </View>
  );
}