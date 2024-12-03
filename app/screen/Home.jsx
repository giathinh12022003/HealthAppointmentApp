import React from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import tw from 'tailwind-react-native-classnames';

export default function Home() {
  return (
    <View style={tw`flex-1 bg-blue-50 items-center`}>
      <StatusBar style="light" />

      <View style={tw`mt-36 flex-row flex-wrap justify-around w-11/12`}>
        <Link href="screen/medical_services/MedicalServiceList" asChild>
          <TouchableOpacity style={tw`w-5/12 py-4 bg-blue-500 my-1 rounded-lg items-center`}>
            <Text style={tw`text-white font-semibold text-lg`}>Đặt lịch khám</Text>
          </TouchableOpacity>
        </Link>
        <Link href="screen/patient/RecordPatientList" asChild>
          <TouchableOpacity style={tw`w-5/12 py-4 bg-blue-500 my-1 rounded-lg items-center`}>
            <Text style={tw`text-white font-semibold text-lg`}>Hồ sơ khám bệnh</Text>
          </TouchableOpacity>
        </Link>
        <Link href="screen/doctor/DoctorList" asChild>
          <TouchableOpacity style={tw`w-5/12 py-4 bg-blue-500 my-1 rounded-lg items-center`}>
            <Text style={tw`text-white font-semibold text-lg`}>Tìm kiếm bác sĩ</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/tab/inpatient-treatment" asChild>
          <TouchableOpacity style={tw`w-5/12 py-4 bg-blue-500 my-1 rounded-lg items-center`}>
            <Text style={tw`text-white font-semibold text-lg`}>Điều trị nội trú</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/tab/schedule" asChild>
          <TouchableOpacity style={tw`w-5/12 py-4 bg-blue-500 my-1 rounded-lg items-center`}>
            <Text style={tw`text-white font-semibold text-lg`}>Lịch hẹn khám bệnh</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/tab/insurance" asChild>
          <TouchableOpacity style={tw`w-5/12 py-4 bg-blue-500 my-1 rounded-lg items-center`}>
            <Text style={tw`text-white font-semibold text-lg`}>Bảo hiểm y tế</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/tab/procedure" asChild>
          <TouchableOpacity style={tw`w-5/12 py-4 bg-blue-500 my-1 rounded-lg items-center`}>
            <Text style={tw`text-white font-semibold text-lg`}>Quy trình khám bệnh</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/tab/faq" asChild>
          <TouchableOpacity style={tw`w-5/12 py-4 bg-blue-500 my-1 rounded-lg items-center`}>
            <Text style={tw`text-white font-semibold text-lg`}>Giải đáp & tư vấn</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={tw`mt-5 w-11/12`}>
        <Text style={tw`text-lg font-bold mb-2`}>HOẠT ĐỘNG</Text>
        <ScrollView horizontal>
          <Image
            style={tw`w-36 h-24 mr-2 rounded-lg`}
            source={{ uri: 'https://example.com/activity1.jpg' }} // Thay thế bằng URL ảnh thật
          />
          <Image
            style={tw`w-36 h-24 mr-2 rounded-lg`}
            source={{ uri: 'https://example.com/activity2.jpg' }} // Thay thế bằng URL ảnh thật
          />
        </ScrollView>
      </View>
    </View>
  );
}
