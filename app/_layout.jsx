import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          gestureEnabled: false,
          title: 'Ứng dụng đặt lịch khám trực tuyến',
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTitleStyle: { color: 'white' },
        }}
      />
      <Stack.Screen
        name='auth/Register'
        options={{
          title: 'Đăng ký tài khoản',
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTitleStyle: { color: 'white' },
        }}
      />
      <Stack.Screen
        name='screen'
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
    </Stack>
  );
}