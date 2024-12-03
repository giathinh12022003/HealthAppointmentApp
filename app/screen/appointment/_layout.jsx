import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen
                name='CreateAppointment'
                options={{
                    title: 'Thông tin lịch hẹn',
                    headerBackVisible: true,
                    headerStyle: {
                        backgroundColor: '#2563eb',
                    },
                    headerTitleStyle: { color: 'white' },
                }}
            />
            <Stack.Screen
                name='AppointmentConfirm'
                options={{
                    title: 'Xác nhận lịch hẹn',
                    headerStyle: {
                        backgroundColor: '#2563eb',
                    },
                    headerTitleStyle: { color: 'white' },
                }}
            />
        </Stack>
    )
}