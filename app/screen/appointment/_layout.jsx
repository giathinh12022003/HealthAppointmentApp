import React, { useState } from 'react';
import { Stack, useNavigation } from 'expo-router';
import { TouchableOpacity, Alert, View, Text } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';
import Modal from 'react-native-modal';

export default function _layout() {
    const [isModalVisible, setModalVisible] = useState(false);
    const navigator = useNavigation();

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleConfirm = () => {
        toggleModal();
        navigator.reset({
            index: 0,
            routes: [{ name: 'screen' }],
        });
    };

    const HomeIconCancel = () => (
        <TouchableOpacity onPress={toggleModal} style={{ marginRight: 15 }}>
            <AntDesign name="home" size={30} color="white" />
        </TouchableOpacity>
    );

    const HomeIcon = () => (
        <TouchableOpacity onPress={() => navigator.reset({
            index: 0,
            routes: [{ name: 'screen' }],
        })} style={{ marginRight: 15 }}>
            <AntDesign name="home" size={30} color="white" />
        </TouchableOpacity>
    );

    return (
        <>
            <Stack>
                <Stack.Screen
                    name='CreateAppointment'
                    options={{
                        title: 'Thông tin lịch hẹn',
                        headerBackVisible: false,
                        headerStyle: {
                            backgroundColor: '#2563eb',
                        },
                        headerTitleStyle: { color: 'white' },
                        headerRight: () => <HomeIconCancel />,
                    }}
                />
                <Stack.Screen
                    name='AppointmentConfirm'
                    options={{
                        title: 'Xác nhận lịch hẹn',
                        headerBackVisible: false,
                        gestureEnabled: false,
                        headerStyle: {
                            backgroundColor: '#2563eb',
                        },
                        headerTitleStyle: { color: 'white' },
                        headerRight: () => <HomeIcon />,
                    }}
                />
                <Stack.Screen
                    name='AppointmentList'
                    options={{
                        title: 'Danh sách lịch hẹn',
                        headerBackVisible: true,
                        gestureEnabled: false,
                        headerStyle: {
                            backgroundColor: '#2563eb',
                        },
                        headerTitleStyle: { color: 'white' },
                    }}
                />
                <Stack.Screen
                    name='AppointmentDetail'
                    options={{
                        title: 'Chi tiết lịch hẹn',
                        headerBackVisible: true,
                        gestureEnabled: false,
                        headerStyle: {
                            backgroundColor: '#2563eb',
                        },
                        headerTitleStyle: { color: 'white' },
                    }}
                />
            </Stack>
            <Modal isVisible={isModalVisible}>
                <View style={tw`bg-white p-5 rounded-lg items-center`}>
                    <Text style={tw`text-lg mb-5 text-center`}>Hủy quy trình đặt lịch khám và quay lại trang chủ?</Text>
                    <View style={tw`flex-row justify-around w-full`}>
                        <TouchableOpacity onPress={toggleModal} style={tw`bg-blue-600 p-3 rounded-lg flex-1 mr-2 items-center`}>
                            <Text style={tw`text-white text-base font-bold`}>Không</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirm} style={tw`bg-gray-300 p-3 rounded-lg flex-1 items-center`}>
                            <Text style={tw`text-gray-700 text-base font-normal`}>Có</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>

    )
}