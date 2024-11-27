import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen
                name='RecordPatientList'
                options={{
                    title: 'Danh sách hồ sơ khám bệnh',
                    headerBackVisible: true,
                    headerStyle: {
                        backgroundColor: '#2563eb',
                    },
                    headerTitleStyle: { color: 'white' },
                }}
            />
            <Stack.Screen
                name='RecordPatient'
                options={{
                    title: 'Tạo hồ sơ khám bệnh',
                    headerBackVisible: true,
                    headerStyle: {
                        backgroundColor: '#2563eb',
                    },
                    headerTitleStyle: { color: 'white' },
                }}
            />
            <Stack.Screen
                name='ChooseRecordPatient'
                options={{
                    title: 'Chọn hồ sơ khám bệnh',
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