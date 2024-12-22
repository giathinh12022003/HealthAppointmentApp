import React, { useState } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import tw from 'tailwind-react-native-classnames';

export default function Home() {

  const [isNavigating, setIsNavigating] = useState(false);

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

  return (
    <View style={tw`flex-1 bg-blue-50`}>
      <StatusBar style="light" />

      {/* Buttons Container */}
      <View style={tw`mt-20 flex-row flex-wrap justify-center`}>
        {/* Individual Buttons */}
        {[
          { title: "Đặt lịch khám", link: "screen/medical_services/MedicalServiceList" },
          { title: "Hồ sơ khám bệnh", link: "screen/patient/RecordPatientList" },
          { title: "Tìm kiếm bác sĩ", link: "screen/doctor/DoctorList" },
          { title: "Điều trị nội trú", link: "/tab/inpatient-treatment" },
          { title: "Lịch hẹn khám bệnh", link: "screen/appointment/AppointmentList" },
          { title: "Bảo hiểm y tế", link: "/tab/insurance" },
          { title: "Quy trình khám bệnh", link: "/tab/procedure" },
          { title: "Giải đáp & tư vấn", link: "/tab/faq" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={tw`w-40 h-20 bg-blue-500 m-2 rounded-lg items-center justify-center`}
            onPress={() => handleNavigation(item.link)}
          >
            <Text style={tw`text-white font-semibold text-center`}>
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
    </View>
  );
}
