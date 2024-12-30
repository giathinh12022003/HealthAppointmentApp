import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getServiceType } from '../../service/medical_services/servicetype/GetServiceType'
import tw from 'tailwind-react-native-classnames';
import { router } from 'expo-router';

export default function ServiceTypeList() {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchServiceTypes();
  }, [page]);

  const fetchServiceTypes = async () => {
    setLoading(true);
    try {
      const data = await getServiceType(page, 5);
      setServiceTypes(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      // console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const imageMap = {
    'tong-quat.png': require('../../../assets/icons/service-type/tong-quat.png'),
    'ho-hap.png': require('../../../assets/icons/service-type/ho-hap.png'),
    'tieu-hoa.png': require('../../../assets/icons/service-type/tieu-hoa.png'),
    'tim-mach.png': require('../../../assets/icons/service-type/tim-mach.png'),
    'ung-thu.png': require('../../../assets/icons/service-type/ung-thu.png'),
    'tiem-chung.png': require('../../../assets/icons/service-type/tiem-chung.png'),
    'default_placeholder_image.png': require('../../../assets/icons/service-type/default_placeholder_image.png'),
  }

  const renderServiceTypes = ({ item }) => {
    const imageSource = imageMap[item.image] || imageMap['default_placeholder_image.png'];
    return (
      <View style={tw`bg-white p-4 my-2 rounded-lg shadow relative flex-row items-center`}>
        <Image
          source={imageSource}
          style={tw`w-16 h-16 rounded-lg mr-4`}
          resizeMode="cover"
        />
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg font-bold mb-2`}>{item.name}</Text>
        </View>
        <TouchableOpacity
          style={tw`bg-blue-500 py-2 px-4 rounded-lg`}
          onPress={() =>
            router.push({
              pathname: 'screen/servicetype/ServiceList',
              params: {
                serviceTypeId: item.id,
                serviceTypeName: item.name
              },
            })
          }
        >
          <Text style={tw`text-center text-white font-bold text-sm`}>Đặt lịch ngay</Text>
        </TouchableOpacity>
      </View>
    );
  };
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={serviceTypes}
            keyExtractor={(item) => item.id}
            renderItem={renderServiceTypes}
          />
          {renderPagination()}
        </>
      )}
    </View>
  );
}