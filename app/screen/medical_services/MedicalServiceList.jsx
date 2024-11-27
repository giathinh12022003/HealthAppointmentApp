import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import React from 'react';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from 'expo-router';

export default function MedicalServiceList() {
  const services = [
    {
      id: 1,
      title: 'Đặt lịch khám theo bác sĩ',
      description: 'Tìm và đặt lịch với bác sĩ phù hợp.',
      image: 'https://via.placeholder.com/150/doctor.png',
      route: 'doctor', // Đường dẫn cho dịch vụ này
    },
    {
      id: 2,
      title: 'Đặt lịch khám theo chuyên khoa',
      description: 'Khám theo chuyên môn mong muốn.',
      image: 'https://via.placeholder.com/150/specialist.png',
      route: 'specialty', // Đường dẫn cho chuyên khoa
    },
    {
      id: 3,
      title: 'Đặt lịch khám theo dịch vụ',
      description: 'Lựa chọn các dịch vụ y tế phù hợp.',
      image: 'https://via.placeholder.com/150/service.png',
      route: '(tabs)/service/ServiceList', // Đường dẫn cho dịch vụ y tế
    },
    {
      id: 4,
      title: 'Đặt lịch khám theo ngày',
      description: 'Chọn ngày khám tiện lợi cho bạn.',
      image: 'https://via.placeholder.com/150/calendar.png',
      route: '(tabs)/calendar/CalendarList', // Đường dẫn cho lịch ngày
    },
    {
      id: 5,
      title: 'Đặt lịch tiêm chủng',
      description: 'Lên lịch tiêm chủng dễ dàng.',
      image: 'https://via.placeholder.com/150/vaccine.png',
      route: '(tabs)/vaccine/VaccineList', // Đường dẫn cho tiêm chủng
    },
  ];

  const navigator = useNavigation();

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <ScrollView style={tw`flex-1 pt-2`}>
        <View style={tw`p-4`}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={tw`bg-white mb-4 rounded-lg shadow`}
              onPress={() => navigator.navigate(service.route)} // Chuyển hướng theo route của dịch vụ
            >
              {/* Ảnh minh họa */}
              <Image
                source={{ uri: service.image }}
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
