import React, { useState } from 'react';
import { Stack, useNavigation } from 'expo-router';
import { TouchableOpacity, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import tw from 'tailwind-react-native-classnames';

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

    const HomeIcon = () => (
        <TouchableOpacity onPress={toggleModal} style={tw`mr-4`}>
            <AntDesign name="home" size={24} color="white" />
        </TouchableOpacity>
    );

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="DoctorList"
                    options={{
                        title: 'Danh sách bác sĩ',
                        headerStyle: { backgroundColor: '#2563eb' },
                        headerTitleStyle: { color: 'white' },
                    }}
                />
                <Stack.Screen
                    name="DoctorService"
                    options={{
                        title: 'Danh sách dịch vụ bác sĩ',
                        headerStyle: { backgroundColor: '#2563eb' },
                        headerTitleStyle: { color: 'white' },
                        headerRight: () => <HomeIcon />,
                    }}
                />
                <Stack.Screen
                    name="DoctorServiceTimeFrame"
                    options={{
                        title: 'Chọn ngày khám',
                        headerStyle: { backgroundColor: '#2563eb' },
                        headerTitleStyle: { color: 'white' },
                        headerRight: () => <HomeIcon />,
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
    );
}
