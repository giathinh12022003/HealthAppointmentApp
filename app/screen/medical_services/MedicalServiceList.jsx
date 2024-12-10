import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import React from 'react';
import tw from 'tailwind-react-native-classnames';
import { useNavigation,router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function MedicalServiceList() {
  const services = [
    {
      id: 1,
      title: 'Đặt lịch khám theo bác sĩ',
      description: 'Tìm và đặt lịch với bác sĩ phù hợp.',
      image: require('../../../assets/banners/doctor_banner.jpg'),
      route: 'screen/doctor/DoctorList', // Đường dẫn cho dịch vụ này
    },
    {
      id: 2,
      title: 'Đặt lịch khám theo chuyên khoa',
      description: 'Khám theo chuyên môn mong muốn.',
      image: require('../../../assets/banners/specialty_banner.jpg'),
      route: 'screen/specialty/SpecialtyList', // Đường dẫn cho chuyên khoa
    },
    {
      id: 3,
      title: 'Đặt lịch khám theo dịch vụ',
      description: 'Lựa chọn các dịch vụ y tế phù hợp.',
      image: require('../../../assets/banners/service_banner.jpg'),
      route: '(tabs)/service/ServiceList', // Đường dẫn cho dịch vụ y tế
    },
    {
      id: 4,
      title: 'Đặt lịch khám theo ngày',
      description: 'Chọn ngày khám tiện lợi cho bạn.',
      image: require('../../../assets/banners/doctor_service_day_banner.jpg'),
      route: '(tabs)/calendar/CalendarList', // Đường dẫn cho lịch ngày
    },
    {
      id: 5,
      title: 'Đặt lịch tiêm chủng',
      description: 'Lên lịch tiêm chủng dễ dàng.',
      image: require('../../../assets/banners/vaccine_banner.jpg'),
      route: '(tabs)/vaccine/VaccineList', // Đường dẫn cho tiêm chủng
    },
  ];

  const navigator = useNavigation();

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <StatusBar style="light" />
      <ScrollView style={tw`flex-1 pt-2`}>
        <View style={tw`p-4`}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={tw`bg-white mb-4 rounded-lg shadow`}
              onPress={() => router.push({
                pathname:service.route
              })} // Chuyển hướng theo route của dịch vụ
            >
              {/* Ảnh minh họa */}
              <Image
                source={service.image}
                style={tw`w-full h-40 rounded-t-lg`}
                resizeMode="cover"
              />
              {/* Nội dung thẻ */}
              <View style={tw`p-4`}>
                <Text style={tw`text-lg font-bold text-blue-600`}>{service.title}</Text>
                <Text style={tw`text-gray-700 mt-2`}>{service.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
