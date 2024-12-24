import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { getAllAppointment } from '../../service/appointment/GetAppointment';
import tw from 'tailwind-react-native-classnames';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AppointmentList() {
    const [allAppointments, setAllAppointments] = useState([]); // Dữ liệu gốc
    const [filteredAppointments, setFilteredAppointments] = useState([]); // Dữ liệu đã lọc
    const [displayAppointments, setDisplayAppointments] = useState([]); // Dữ liệu trang hiện tại
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all'); // Lọc theo trạng thái
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        handleFilterAppointments();
    }, [filterStatus, allAppointments]);

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

        // Chuẩn hóa filterStatus
        const normalizedFilterStatus = filterStatus.normalize('NFC').trim();

        if (normalizedFilterStatus !== 'all') {
            updatedAppointments = updatedAppointments.filter((appointment) => {
                // Chuẩn hóa trạng thái trong JSON
                const normalizedStatus = appointment.status.normalize('NFC').trim();
                return normalizedStatus === normalizedFilterStatus;
            });
        }
        setStartDate(new Date());
        setEndDate(new Date());
        setFilteredAppointments(updatedAppointments);
        setPage(1); // Quay về trang 1 sau khi lọc
    };

    const handleFilterByDate = () => {
        setLoading(true); // Bật trạng thái loading
        setTimeout(() => {
            let updatedAppointments = [...allAppointments];

            const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

            updatedAppointments = updatedAppointments.filter((appointment) => {
                const bookingDate = new Date(appointment.dateTime.split(',')[0].split('/').reverse().join('-'));
                return bookingDate >= startOfDay && bookingDate <= endOfDay;
            });

            const normalizedFilterStatus = filterStatus.normalize('NFC').trim();

            if (normalizedFilterStatus !== 'all') {
                updatedAppointments = updatedAppointments.filter((appointment) => {
                    const normalizedStatus = appointment.status.normalize('NFC').trim();
                    return normalizedStatus === normalizedFilterStatus;
                });
            }

            setFilteredAppointments(updatedAppointments);
            setPage(1);
            setLoading(false); // Tắt trạng thái loading
        }, 500); // Giả lập thời gian xử lý
    };


    const paginateAppointments = () => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayAppointments(filteredAppointments.slice(startIndex, endIndex));
    };

    const resetFilters = () => {
        setFilterStatus('all');
        setStartDate(new Date());
        setEndDate(new Date());
        handleFilterAppointments(); // Reset trạng thái lọc
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
    };

    const formatDateFilter = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const renderAppointment = ({ item }) => {
        const bookingDate = formatDateTime(item.dateTime);
        const date = formatDate(item.date);
        return (
            <View style={tw`bg-white p-4 my-2 rounded-lg shadow relative`}>
                <Text style={tw`text-lg font-bold`}>{item.id}</Text>
                <Text>Số thứ tự: {item.orderNumber}</Text>
                <Text>Ngày khám: {date}</Text>
                <Text>Ngày đặt lịch: {bookingDate}</Text>
                <Text>Trạng thái: {item.status}</Text>
                <TouchableOpacity
                    style={tw`absolute bottom-2 right-2 px-3 py-2 bg-blue-500 rounded-lg`}
                    onPress={() =>
                        router.push({
                            pathname: 'screen/appointment/AppointmentDetail',
                            params: {
                                appointmentId: item.id,
                                patientId: item.patientsId,
                                bookDate:bookingDate
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
        const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
        if (totalPages <= 1) return null;

        const visiblePages = 3; // Số lượng trang xung quanh trang hiện tại
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
                    <View style={tw`flex-row justify-around my-2`}>
                        {['all', 'Chờ phê duyệt', 'Đã xác nhận', 'Đã có kết quả'].map((status) => (
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

                    <Text style={tw`text-sm`}>Giai đoạn:</Text>
                    <View style={tw`flex-row justify-between items-center mb-4`}>
                        <Text style={tw`text-sm`}>Từ ngày:</Text>
                        <TouchableOpacity
                            style={tw`flex-1 mr-2 px-3 py-2 bg-gray-200 rounded-lg`}
                            onPress={() => setShowStartDatePicker(true)}
                        >
                            <TextInput value={formatDateFilter(startDate)} editable={false} />
                        </TouchableOpacity>

                        <Text style={tw`text-sm`}>Đến ngày:</Text>
                        <TouchableOpacity
                            style={tw`flex-1 ml-2 px-3 py-2 bg-gray-200 rounded-lg`}
                            onPress={() => setShowEndDatePicker(true)}
                        >
                            <TextInput value={formatDateFilter(endDate)} editable={false} />
                        </TouchableOpacity>
                    </View>

                    <View style={tw`flex-row justify-between my-2`}>
                        <TouchableOpacity
                            style={tw`flex-1 mr-2 px-3 py-2 bg-blue-500 rounded-lg flex-row justify-center items-center`}
                            onPress={handleFilterByDate}
                            disabled={loading} // Vô hiệu hóa khi đang tải
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={tw`text-white text-center font-semibold`}>Tìm</Text>
                            )}
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={tw`flex-1 ml-2 px-3 py-2 bg-red-500 rounded-lg`}
                            onPress={resetFilters}
                        >
                            <Text style={tw`text-white text-center font-semibold`}>Đặt lại</Text>
                        </TouchableOpacity>
                    </View>

                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="calendar"
                            onChange={(e, date) => {
                                setShowStartDatePicker(false);
                                setStartDate(date || startDate);
                            }}
                        />
                    )}

                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="calendar"
                            onChange={(e, date) => {
                                setShowEndDatePicker(false);
                                setEndDate(date || endDate);
                            }}
                        />
                    )}

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
