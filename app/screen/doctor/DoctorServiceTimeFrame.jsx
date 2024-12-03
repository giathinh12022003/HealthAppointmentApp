import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useLocalSearchParams, router } from 'expo-router';
import { getDoctorServiceDay, getDoctorServiceTimeFrame } from '../../service/medical_services/doctor/GetDoctorServiceDay';
import { Calendar } from 'react-native-calendars';

export default function DoctorServiceDetails() {
  const { serviceId, serviceName, doctorId, doctorName } = useLocalSearchParams();
  const [availableDays, setAvailableDays] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    fetchAvailableDays();
  }, [serviceId]);

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const fetchAvailableDays = async () => {
    try {
      setLoading(true);
      const data = await getDoctorServiceDay(serviceId);
      // console.log(data);

      const today = new Date();
      const todayDateString = today.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });

      const markedDays = {};
      for (let i = 0; i < 31; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);

        ///////////////////////////////////
        const dayOfWeek = date.getDay() + 1;
        // 0 = sunday
        // 1 = monday
        // 2 = tuesday
        // 3 = wednesday
        // 4 = thursday
        // 5 = friday
        // 6 = saturday
        ///////////////////////////////////
        
        const dateString = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });

        if (data.includes(dayOfWeek.toString()) && dateString > todayDateString) {
          // console.log(`${dateString} ${dayOfWeek}`);
          markedDays[dateString] = {
            customStyles: {
              container: {
                backgroundColor: 'blue',
                borderRadius: 8,
                borderWidth: dateString === selectedDay ? 4 : 0, // Tăng độ dày viền
                borderColor: dateString === selectedDay ? 'red' : 'transparent',
              },
              text: {
                color: 'white',
                fontWeight: dateString === selectedDay ? 'bold' : 'normal',
              },
            },
          };
        }
      }

      setAvailableDays(markedDays);
    } catch (error) {
      // console.error('Error fetching available days:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu ngày');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceDetails = async (dayOfWeek, day) => {
    try {
      setFetchingDetails(true);
      const data = await getDoctorServiceTimeFrame(serviceId, dayOfWeek, day);
      setServiceDetails(data);
    } catch (error) {
      // console.error('Error fetching service details:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu chi tiết dịch vụ');
    } finally {
      setFetchingDetails(false);
    }
  };

  const onDayPress = (day) => {
    const { dateString } = day;
    const date = new Date(dateString + 'T00:00:00+07:00');
    const dayOfWeek = date.getDay() + 1;

    if (availableDays[dateString]) {
      // Cập nhật ngày đã chọn
      setSelectedDay(dateString);

      // Thay đổi trạng thái để hiển thị viền cho ngày đã chọn
      setAvailableDays((prevDays) => {
        const updatedDays = { ...prevDays };

        // Reset các viền cho tất cả các ngày khả dụng
        Object.keys(updatedDays).forEach((key) => {
          updatedDays[key] = {
            ...updatedDays[key],
            customStyles: {
              ...updatedDays[key].customStyles,
              container: {
                ...updatedDays[key].customStyles.container,
                borderWidth: 0, // Xóa viền
                borderColor: 'transparent',
              },
            },
          };
        });

        // Cập nhật viền cho ngày được chọn
        updatedDays[dateString] = {
          ...updatedDays[dateString],
          customStyles: {
            ...updatedDays[dateString].customStyles,
            container: {
              ...updatedDays[dateString].customStyles.container,
              borderWidth: 4, // Tăng viền
              borderColor: 'red',
            },
          },
        };

        return updatedDays;
      });

      // Tải thông tin chi tiết cho ngày được chọn
      fetchServiceDetails(dayOfWeek, dateString);
    } else {
      Alert.alert('Ngày không khả dụng', `Ngày ${dateString} không khả dụng.`);
    }
  };


  const renderServiceItem = ({ item }) => {
    // const formatTime = (start, end) => {
    //   const startPeriod = start < 12 ? 'sáng' : 'chiều';
    //   const endPeriod = end < 12 ? 'sáng' : 'chiều';

    //   if (startPeriod === endPeriod) {
    //     return `${start} - ${end} giờ (${startPeriod})`;
    //   }
    //   return `${start} ${startPeriod} - ${end} ${endPeriod}`;
    // };

    return (
      <View style={tw`p-4 mb-2 bg-white rounded-lg shadow`}>
        <Text style={tw`text-lg font-bold text-blue-600`}>
          Thời gian: {item.timeFrameResponse.fullName}
        </Text>
        <Text style={tw`text-gray-700`}>
          Ngày khám: {`thứ ${item.dayOfWeek} ngày `}{selectedDay ? formatDate(selectedDay) : ''}
        </Text>
        <Text style={tw`text-gray-700`}>Số lượng tối đa: {item.maximumQuantity}</Text>
        <Text style={tw`text-gray-700`}>Phòng: {item.roomResponse.name}</Text>
        <Text style={tw`text-gray-700`}>Trạng thái: {item.status}</Text>
        <TouchableOpacity
          style={tw`mt-6 bg-blue-600 py-3 rounded-lg shadow`}
          onPress={() => router.push({
            pathname: 'screen/patient/ChooseRecordPatient', params: {
              serviceName: serviceName,
              doctorName: doctorName,
              day: selectedDay,
              serviceTimeFrameId: item.id,
              dayOfWeek: item.dayOfWeek,
              room: item.roomResponse.name,
              session: item.timeFrameResponse.fullName,
            }
          })}
        >
          <Text style={tw`text-center text-white font-bold text-base`}>Chọn khung giờ</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      <Text style={tw`text-xl font-bold mb-4 text-center`}>Dịch vụ: {serviceName}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Calendar
          markedDates={availableDays}
          onDayPress={onDayPress}
          markingType={'custom'}
          theme={{
            selectedDayBackgroundColor: 'blue',
            todayTextColor: 'red',
            dayTextColor: 'black',
            textDisabledColor: 'gray',
            arrowColor: 'blue',
            monthTextColor: 'blue',
          }}
          style={tw`border rounded-lg bg-white shadow`}
        />
      )}
      <View style={tw`mt-4`}>
        {selectedDay ? (
          fetchingDetails ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : serviceDetails.length > 0 ? (
            <View style={tw`h-72`}>
              <FlatList
                data={serviceDetails}
                renderItem={renderServiceItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={tw`pb-4`}
              />
            </View>
          ) : (
            <Text style={tw`text-center text-gray-600`}>
              Dịch vụ ở ngày {formatDate(selectedDay)} đã hết chỗ
            </Text>
          )
        ) : (
          <Text style={tw`text-center text-gray-600`}>Vui lòng chọn ngày khám</Text>
        )}
      </View>
    </View>
  );
}
