import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen
                name='Home'
                options={{
                    title: 'Trang chủ',
                    headerBackVisible: true,
                    headerStyle: {
                        backgroundColor: '#2563eb',
                    },
                    headerTitleStyle: { color: 'white' },
                    headerRight: () => (
                        <TouchableOpacity onPress={() => console.log('Go to profile')}>
                            <Ionicons name="person-circle-outline" size={28} color="white" style={tw`mr-4`} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name='appointment'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='doctor'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='medical_services'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='patient'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='profile'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='specialty'
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}