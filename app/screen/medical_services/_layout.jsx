import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen
                name='MedicalServiceList'
                options={{
                    title: 'Đặt lịch khám',
                    headerBackVisible: true,
                    headerStyle: {
                        backgroundColor: '#2563eb',
                    },
                    headerTitleStyle: { color: 'white' },
                }}
            />
        </Stack>
    );
}