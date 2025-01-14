import React, { useState } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import { FontAwesome, MaterialIcons, Ionicons, FontAwesome6, FontAwesome5, Entypo } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';
import Modal from 'react-native-modal';

export default function Home() {

  const [isNavigating, setIsNavigating] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const handleNavigation = (link) => {
    if (isNavigating) {
      // Prevent navigation if already navigating
      return;
    }

    // Set navigating to true to block further presses
    setIsNavigating(true);

    // Perform navigation with a timeout to simulate completion
    router.push(link);

    // Reset navigating status after navigation is completed
    setTimeout(() => {
      setIsNavigating(false);
    }, 500); // Adjust timeout if necessary
  };

  const buttons = [
    { title: "Đặt lịch khám", icon: <FontAwesome name="calendar" size={24} color="white" />, link: "screen/medical_services/MedicalServiceList" },
    { title: "Hồ sơ khám bệnh", icon: <MaterialIcons name="assignment" size={24} color="white" />, link: "screen/patient/RecordPatientList" },
    { title: "Danh sách bác sĩ", icon: <FontAwesome6 name="user-doctor" size={24} color="white" />, link: "screen/doctor/DoctorList" },
    { title: "Danh sách chuyên khoa", icon: <MaterialIcons name="category" size={24} color="white" />, link: "screen/specialty/SpecialtyList" },
    { title: "Lịch hẹn khám bệnh", icon: <FontAwesome name="calendar-check-o" size={24} color="white" />, link: "screen/appointment/AppointmentList" },
    { title: "Danh sách dịch vụ", icon: <Ionicons name="list" size={24} color="white" />, link: "screen/servicetype/ServiceTypeList" },
    { title: "Dịch vụ tiêm chủng", icon: <FontAwesome5 name="syringe" size={24} color="white" />, link: "screen/servicetype/VaccineList" },
    { title: "Thông báo", icon: <Entypo name="notification" size={24} color="white" />, link: "/tab/procedure" },
  ];

  return (
    <View style={tw`flex-1 bg-blue-50`}>
      <StatusBar style="light" />

      {/* Buttons Container */}
      <View style={tw`mt-20 flex-row flex-wrap justify-center`}>
        {buttons.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={tw`w-40 h-20 bg-blue-500 m-2 rounded-lg items-center justify-center`}
            onPress={() => handleNavigation(item.link)}
          >
            {item.icon}
            <Text style={tw`text-white font-semibold text-center mt-1`}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activities Section */}
      <View style={tw`mt-8 px-4 ml-4`}>
        <Text style={tw`text-lg font-bold mb-2`}>HOẠT ĐỘNG</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Image
            style={tw`w-36 h-24 mr-4 rounded-lg`}
            source={require('../../assets/banners/doctor_banner.jpg')}
          />
          <Image
            style={tw`w-36 h-24 mr-4 rounded-lg`}
            source={require('../../assets/banners/service_banner.jpg')}
          />
        </ScrollView>
      </View>

      {/* Chat Icon */}
      <TouchableOpacity
        style={tw`absolute bottom-6 right-6 w-16 h-16 bg-blue-500 rounded-full items-center justify-center shadow-lg`}
        onPress={() => setIsChatVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
