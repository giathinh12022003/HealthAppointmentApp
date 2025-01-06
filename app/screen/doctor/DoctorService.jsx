import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { getDoctorService } from '../../service/medical_services/doctor/GetDoctorService';
import tw from 'tailwind-react-native-classnames';
import { useLocalSearchParams, router } from 'expo-router';
import Modal from 'react-native-modal';

export default function DoctorService() {
  const { doctorId, doctorName } = useLocalSearchParams();
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedServiceDescription, setSelectedServiceDescription] = useState('');

  const openModal = (description) => {
    setSelectedServiceDescription(description);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedServiceDescription('');
  };

  useEffect(() => {
    if (doctorId) {
      fetchServices();
    } else {
      // console.error('doctorId is missing!');
    }
  }, [page, doctorId]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getDoctorService(doctorId, page, 5);
      setTotalPages(data.totalPages);
      setServices(data.data);
    } catch (error) {
      // console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const renderService = ({ item }) => (
    <View style={tw`bg-white p-4 my-2 rounded-lg shadow`}>
      <Text style={tw`text-lg font-bold mb-2`}>{item.service.name}</Text>
      <Text>{`Giá dịch vụ: ${formatCurrency(item.unitPrice)} VNĐ`}</Text>

      <View style={tw`flex-row justify-between mt-4`}>
        <TouchableOpacity
          style={tw`bg-gray-300 py-2 px-4 rounded-lg flex-1 mr-2`}
          onPress={() => openModal(item.service.description)}
        >
          <Text style={tw`text-center text-black font-bold text-base`}>Xem chi tiết</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-blue-500 py-2 px-4 rounded-lg flex-1`}
          onPress={() =>
            router.push({
              pathname: 'screen/doctor/DoctorServiceTimeFrame',
              params: {
                serviceId: item.id,
                serviceName: item.service.name,
                doctorId: doctorId,
                doctorName: doctorName,
                unitPrice: item.unitPrice
              }
            })
          }
        >
          <Text style={tw`text-center text-white font-bold text-base`}>Chọn dịch vụ</Text>
        </TouchableOpacity>
      </View>

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
      <Text style={tw`text-lg font-bold mb-1 text-left w-full`}>Dịch vụ bác sĩ: {doctorName}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={renderService}
          />
          {renderPagination()}
        </>
      )}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
      >
        <View style={tw`bg-white rounded-xl p-6 shadow-lg`}>
          {/* Tiêu đề Modal */}
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>Mô tả dịch vụ</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={tw`text-gray-500 text-lg font-bold`}>X</Text>
            </TouchableOpacity>
          </View>

          {/* Nội dung */}
          <View style={tw`max-h-80`}>
            <Text style={tw`text-base text-gray-700`}>
              {selectedServiceDescription}
            </Text>
          </View>

          {/* Footer (Nút đóng lại) */}
          <TouchableOpacity
            onPress={() => setIsModalVisible(false)}
            style={tw`mt-4 bg-blue-500 py-2 px-4 rounded-lg`}
          >
            <Text style={tw`text-center text-white font-bold text-lg`}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}