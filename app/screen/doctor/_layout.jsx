import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen
                name='DoctorList'
                options={{
                    title: 'Danh sách bác sĩ',
                    headerBackVisible: true,
                    headerStyle: {
                        backgroundColor: '#2563eb',
                    },
                    headerTitleStyle: { color: 'white' },
                }}
            />
            <Stack.Screen
                name='DoctorService'
                options={{
                    title: 'Danh sách dịch vụ bác sĩ',
                    headerBackVisible: true,
                    headerStyle: {
                        backgroundColor: '#2563eb',
                    },
                    headerTitleStyle: { color: 'white' },
                }}
            />
            <Stack.Screen
                name='DoctorServiceDetails'
                options={{
                    title: 'Chọn ngày khám',
                    headerBackVisible: true,
                    headerStyle: {
                        backgroundColor: '#2563eb',
                    },
                    headerTitleStyle: { color: 'white' },
                }}
            />
        </Stack>
    )
}