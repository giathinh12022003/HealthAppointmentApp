import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity,Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useLocalSearchParams, router } from 'expo-router';
import { getDoctorServiceId } from '../../service/medical_services/servicetype/GetDoctorServiceIdForServiceType';

export default function DoctorSpecialtyService() {
    const { serviceId, serviceName } = useLocalSearchParams();
    const [doctorServiceTypes, setDoctorServiceTypes] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (serviceId) {
            fetchDoctorServiceTypes();
        } else {
            //console.error('serviceId is missing!');
        }
    }, [page, serviceId]);

    const fetchDoctorServiceTypes = async () => {
        setLoading(true);
        try {
            const data = await getDoctorServiceId(serviceId, page, 5);
            setTotalPages(data.totalPages);
            setDoctorServiceTypes(data.data);
        } catch (error) {
            // console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAvatar = (gender, image) => {
        if (image) {
            return { uri: image }; // Sử dụng ảnh từ JSON nếu có
        }
        // Sử dụng ảnh mặc định nếu không có ảnh trong JSON
        if (gender === 'Nam') {
            return require('../../../assets/avatar_doctor/male_doctor_img.jpg');
        } else if (gender === 'Nữ') {
            return require('../../../assets/avatar_doctor/female_doctor_img.jpg');
        }
    };

    const renderDoctorServiceType = ({ item }) => {
        const specialtyNames = item.doctorResponse.specialties.map((specialty) => specialty.specialtyName).join(', ');
        return (
            <View style={tw`bg-white p-4 my-2 rounded-lg shadow relative`}>
                <View style={tw`absolute top-4 right-4`}>
                    <Image
                        source={getAvatar(item.doctorResponse.gender, item.doctorResponse.image)}
                        style={tw`w-20 h-20 rounded-md border border-gray-300`}
                    />
                </View>
                <Text style={tw`text-base font-bold mb-2`}>
                    {`${item.doctorResponse.qualificationName}: ${item.doctorResponse.fullName}`}
                </Text>
                <Text style={tw`text-gray-600 text-sm mb-2`}>
                    Giới tính: {item.doctorResponse.gender}
                </Text>
                <Text style={tw`text-gray-600 text-sm mb-2`}>
                    Chuyên khoa: {specialtyNames}
                </Text>
                <View style={tw`flex-row justify-between mt-4`}>
                    <TouchableOpacity
                        style={tw`bg-gray-300 py-2 px-4 rounded-lg flex-1 mr-2`}
                        onPress={() => {
                            // Sự kiện onPress cho nút "Xem chi tiết"
                        }}
                    >
                        <Text style={tw`text-center text-black font-bold text-base`}>Xem chi tiết</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tw`bg-blue-500 py-2 px-4 rounded-lg flex-1`}
                        onPress={() =>
                            router.push({
                                pathname: 'screen/servicetype/ServiceTypeTimeFrame',
                                params: {
                                    doctorServiceId: item.id,
                                    serviceName: item.service.name,
                                    doctorName: item.doctorResponse.fullName,
                                    unitPrice: item.unitPrice
                                }
                            })
                        }
                    >
                        <Text style={tw`text-center text-white font-bold text-base`}>Chọn bác sĩ</Text>
                    </TouchableOpacity>
                </View>
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
            <Text style={tw`text-lg font-bold mb-1 text-left w-full`}>Dịch vụ: {serviceName}</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <FlatList
                        data={doctorServiceTypes}
                        keyExtractor={(item) => item.id}
                        renderItem={renderDoctorServiceType}
                    />
                    {renderPagination()}
                </>
            )}
        </View>
    );
}