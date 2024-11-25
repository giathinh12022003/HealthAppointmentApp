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
          title: 'Welcome',
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTitleStyle: { color: 'white' },
        }}
      />
      <Stack.Screen
        name='auth/Register'
        options={{
          title: 'Register',
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTitleStyle: { color: 'white' },
        }}
      />
      <Stack.Screen
        name='(tabs)/Home'
        options={{
          title: 'Home',
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
        name='(tabs)/doctor/DoctorList'
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
        name='(tabs)/patient/RecordPatientList'
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
        name='(tabs)/patient/RecordPatient'
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
        name='(tabs)/medical_services/doctor/DoctorService'
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
        name='(tabs)/medical_services/doctor/DoctorServiceDetails'
        options={{
          title: 'Chọn ngày khám dịch vụ',
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTitleStyle: { color: 'white' },
        }}
      />
      <Stack.Screen
        name='(tabs)/patient/ChooseRecordPatient'
        options={{
          title: 'Chọn hồ sơ khám bệnh',
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTitleStyle: { color: 'white' },
        }}
      />
      <Stack.Screen
        name='(tabs)/appointment/CreateAppointment'
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
        name='(tabs)/medical_services/MedicalServiceList'
        options={{
          title: 'Đặt lịch khám',
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTitleStyle: { color: 'white' },
        }}
      />
      <Stack.Screen
        name='(tabs)/specialty/SpecialtyList'
        options={{
          title: 'Danh sách chuyên khoa',
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTitleStyle: { color: 'white' },
        }}
      />
      <Stack.Screen
        name='(tabs)/medical_services/specialty/Specialty'
        options={{
          title: 'Danh sách dịch vụ',
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