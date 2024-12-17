import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAllAppointment } from '../../service/appointment/GetAppointment';
import tw from 'tailwind-react-native-classnames';
import { router } from 'expo-router';

export default function AppointmentList() {
    const [allAppointments, setAllAppointments] = useState([]); // Dữ liệu gốc
    const [filteredAppointments, setFilteredAppointments] = useState([]); // Dữ liệu đã lọc
    const [displayAppointments, setDisplayAppointments] = useState([]); // Dữ liệu trang hiện tại
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all'); // Lọc theo ngày
    const [filterStatus, setFilterStatus] = useState('all'); // Lọc theo trạng thái
    const itemsPerPage = 5;

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        handleFilterAppointments();
    }, [filter, filterStatus, allAppointments]);

    useEffect(() => {
        paginateAppointments();
    }, [filteredAppointments, page]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const data = await getAllAppointment();
            setAllAppointments(data.data || []);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterAppointments = () => {
        let updatedAppointments = [...allAppointments];

        // Lọc theo trạng thái
        if (filterStatus !== 'all') {
            updatedAppointments = updatedAppointments.filter(
                (appointment) => appointment.status === filterStatus
            );
        }

        // Lọc theo ngày
        if (filter === 'newest') {
            updatedAppointments.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        } else if (filter === 'oldest') {
            updatedAppointments.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
        }

        setFilteredAppointments(updatedAppointments);
        setPage(1); // Quay về trang 1 sau khi lọc
    };

    const paginateAppointments = () => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayAppointments(filteredAppointments.slice(startIndex, endIndex));
    };

    const renderAppointment = ({ item }) => (
        <View style={tw`bg-white p-4 my-2 rounded-lg shadow relative`}>
            <Text style={tw`text-lg font-bold`}>{item.id}</Text>
            <Text>Số thứ tự: {item.orderNumber}</Text>
            <Text>Ngày khám: {new Date(item.date).toLocaleDateString()}</Text>
            <Text>Ngày đặt lịch: {new Date(item.dateTime).toLocaleString()}</Text>
            <Text>Trạng thái: {item.status}</Text>
            <TouchableOpacity
                style={tw`absolute bottom-2 right-2 px-3 py-2 bg-blue-500 rounded-lg`}
                onPress={() =>
                    router.push({
                        pathname: 'screen/appointment/AppointmentDetail',
                        params: { appointmentId: item.id },
                    })
                }
            >
                <Text style={tw`text-white text-sm font-bold`}>Xem chi tiết</Text>
            </TouchableOpacity>
        </View>
    );

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
        if (totalPages <= 1) return null;
    
        const visiblePages = 3; // Số lượng trang xung quanh trang hiện tại
        const pages = [];
        const startEllipsis = page > visiblePages + 1;
        const endEllipsis = page < totalPages - visiblePages;
    
        pages.push(1);
        if (startEllipsis) pages.push('startEllipsis');
    
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i);
        }
    
        if (endEllipsis) pages.push('endEllipsis');
        pages.push(totalPages);
    
        return (
            <View style={tw`flex-row justify-center items-center flex-wrap mt-4`}>
                <TouchableOpacity
                    onPress={() => setPage(1)}
                    disabled={page === 1}
                    style={tw`m-1 px-3 py-2 bg-gray-200 rounded-lg ${page === 1 ? 'opacity-50' : ''}`}
                >
                    <Text>{`<<`}</Text>
                </TouchableOpacity>
    
                <TouchableOpacity
                    onPress={() => setPage(page - 1)}
                    disabled={page === 1}
                    style={tw`m-1 px-3 py-2 bg-gray-200 rounded-lg ${page === 1 ? 'opacity-50' : ''}`}
                >
                    <Text>{`<`}</Text>
                </TouchableOpacity>
    
                {pages.map((pageNumber, index) => {
                    if (pageNumber === 'startEllipsis' || pageNumber === 'endEllipsis') {
                        return <Text key={`ellipsis-${index}`} style={tw`px-4 py-2 text-gray-500`}>...</Text>;
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
    
                <TouchableOpacity
                    onPress={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    style={tw`m-1 px-3 py-2 bg-gray-200 rounded-lg ${page === totalPages ? 'opacity-50' : ''}`}
                >
                    <Text>{`>`}</Text>
                </TouchableOpacity>
    
                <TouchableOpacity
                    onPress={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    style={tw`m-1 px-3 py-2 bg-gray-200 rounded-lg ${page === totalPages ? 'opacity-50' : ''}`}
                >
                    <Text>{`>>`}</Text>
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
                    <Text style={tw`text-sm`}>Trạng thái:</Text>
                    {/* Bộ lọc trạng thái */}
                    <View style={tw`flex-row justify-around my-2`}>
                        {['all', 'Chờ phê duyệt', 'Đã xác nhận', 'Đã có kết quả'].map((status) => (
                            <TouchableOpacity
                                key={status}
                                onPress={() => setFilterStatus(status)}
                                style={tw`px-3 py-2 rounded-lg ${filterStatus === status ? 'bg-blue-500' : 'bg-gray-200'}`}
                            >
                                <Text style={tw`${filterStatus === status ? 'text-white' : 'text-black'} font-semibold`}>
                                    {status === 'all' ? 'Tất cả' : status}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={tw`text-sm`}>Thời gian:</Text>
                    {/* Bộ lọc ngày */}
                    <View style={tw`flex-row my-2 justify-start`}>
                        {['all', 'newest', 'oldest'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setFilter(type)}
                                style={tw`px-3 py-2 rounded-lg ${filter === type ? 'bg-blue-500' : 'bg-gray-200'}`}
                            >
                                <Text style={tw`${filter === type ? 'text-white' : 'text-black'} font-semibold`}>
                                    {type === 'all' ? 'Tất cả' : type === 'newest' ? 'Mới nhất' : 'Cũ nhất'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <FlatList
                        data={displayAppointments}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderAppointment}
                        ListEmptyComponent={<Text style={tw`text-center text-gray-600`}>Không có dữ liệu.</Text>}
                    />

                    {renderPagination()}
                </>
            )}
        </View>
    );
}
