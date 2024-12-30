import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'tailwind-react-native-classnames';
import { router } from 'expo-router';
import { getVaccineService } from '../../service/medical_services/servicetype/GetVaccineService'

export default function VaccineList() {
  const [serviceList, setserviceList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchServices();
  }, [page]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getVaccineService(page, 5);
      setTotalPages(data.totalPages);
      setserviceList(data.data);
    } catch (error) {
      // console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderServiceList = ({ item }) => (
    <View style={tw`bg-white p-4 my-2 rounded-lg shadow`}>
      <Text style={tw`text-lg font-bold mb-2`}>{item.name}</Text>
      <Text>{`Giá dịch vụ: ${item.unitPrice} VND`}</Text>
      <Text>{`Trạng thái: ${item.status}`}</Text>
      <TouchableOpacity
        style={tw`mt-4 bg-blue-500 py-2 px-4 rounded-lg`}
        onPress={() =>
          router.push({
            pathname: 'screen/servicetype/DoctorServiceType',
            params: { serviceId: item.id, serviceName: item.name },
          })
        }
      >
        <Text style={tw`text-center text-white font-bold text-base`}>Chọn dịch vụ</Text>
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
      <Text style={tw`text-lg font-bold mb-1 text-left w-full`}>Dịch vụ tiêm chủng</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={serviceList}
            keyExtractor={(item) => item.id}
            renderItem={renderServiceList}
          />
          {renderPagination()}
        </>
      )}
    </View>
  );
}