import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { getDoctorService } from '../../../service/medical_services/doctor/GetDoctorService'; // API mới
import tw from 'tailwind-react-native-classnames';

export default function DoctorService() {
 
  
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchServices();
  }, [page]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getDoctorService(doctorId, page, 4);
      if (data?.service) {
        setServices(data.service.data);
      }
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderService = ({ item }) => (
    <View style={tw`bg-white p-4 my-2 rounded-lg shadow`}>
      <Text style={tw`text-lg font-bold mb-2`}>{item.name}</Text>
      <Text>{`Giá dịch vụ: ${item.unitPrice} VND`}</Text>
      <Text>{`Trạng thái: ${item.status}`}</Text>
      <Text>{`Cập nhật: ${new Date(item.lastUpdated).toLocaleDateString()}`}</Text>
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
      <View style={tw`flex-row justify-center flex-wrap mt-4`}>
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
      </View>
    );
  };

  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
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
    </View>
  );
}