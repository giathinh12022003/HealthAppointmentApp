import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAllAppointment } from '../../service/appointment/GetAppointment';
import tw from 'tailwind-react-native-classnames';
import { useNavigation, router } from 'expo-router';

export default function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchAppointments();
    }, [page]);

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const data = await getAllAppointment(page, 5);
            setAppointments(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderAppointment = ({ item }) => {
        return (
            <View style={tw`bg-white p-4 my-2 rounded-lg shadow relative`}>
                <Text style={tw`text-lg font-bold`}>{item.id}</Text>
                <Text>Số thứ tự: {item.orderNumber}</Text>
                <Text>Ngày khám: {item.date}</Text>
                <Text>Trạng thái: {item.status}</Text>
                <TouchableOpacity
                    style={tw`absolute bottom-2 right-2 px-3 py-2 bg-blue-500 rounded-lg`}
                    onPress={() =>
                        router.push({
                            pathname: 'screen/appointment/AppointmentDetail',
                            params: {
                                appointmentId: item.id,
                            },
                        })
                    }
                >
                    <Text style={tw`text-white text-sm font-bold`}>Xem chi tiết</Text>
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
                            style={tw`m-1 px-4 py-2 ${
                                page === pageNumber ? 'bg-blue-500' : 'bg-gray-200'
                            } rounded-lg`}
                        >
                            <Text
                                style={tw`text-center text-base ${
                                    page === pageNumber ? 'text-white' : 'text-black'
                                }`}
                            >
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
                        data={appointments}
                        keyExtractor={(item) => item.id}
                        renderItem={renderAppointment}
                    />
                    {renderPagination()}
                </>
            )}
        </View>
    );
}