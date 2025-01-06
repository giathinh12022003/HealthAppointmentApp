import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import tw from 'tailwind-react-native-classnames';
import { getInfo } from '../../service/customer/GetCustomerInfo';

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const data = await getInfo();
        setUserInfo(data);
        setEditedInfo(data);
        setGender(data.gender);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    fetchUserInfo();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setGender(userInfo.gender);
    setIsEditing(false);
  };

  const handleSave = () => {
    // Save logic here
    setUserInfo(editedInfo);
    setIsEditing(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEditedInfo({
        ...editedInfo,
        dateOfBirth: selectedDate,
      });
    }
  };

  const handleGenderChange = (value) => {
    setGender(value);
    setEditedInfo({
      ...editedInfo,
      gender: value,
    });
  };

  if (!userInfo) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`p-4`}>
      <Text style={tw`text-lg font-bold mb-4`}>Thông Tin Người Dùng</Text>

      <View style={tw`mb-4`}>
        <Text style={tw`text-sm text-gray-600`}>Họ và tên:</Text>
        <TextInput
          style={tw`border border-gray-300 rounded p-2 mt-1 ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
          value={editedInfo.fullName}
          onChangeText={(text) => setEditedInfo({ ...editedInfo, fullName: text })}
          editable={isEditing}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-sm text-gray-600`}>Ngày sinh:</Text>
        {isEditing ? (
          <TouchableOpacity
            style={tw`p-2 border border-gray-300 rounded bg-white`}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{new Date(editedInfo.dateOfBirth).toLocaleDateString('vi-VN')}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={tw`p-2 bg-gray-100 rounded`}>
            {new Date(editedInfo.dateOfBirth).toLocaleDateString('vi-VN')}
          </Text>
        )}
        {showDatePicker && (
          <DateTimePicker
            value={new Date(editedInfo.dateOfBirth)}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-sm text-gray-600`}>Giới tính:</Text>
        {isEditing ? (
          <View style={tw`flex-row items-center`}>
            <RadioButton
              value="Nam"
              status={gender === 'Nam' ? 'checked' : 'unchecked'}
              onPress={() => handleGenderChange('Nam')}
            />
            <Text style={tw`mr-4`}>Nam</Text>
            <RadioButton
              value="Nữ"
              status={gender === 'Nữ' ? 'checked' : 'unchecked'}
              onPress={() => handleGenderChange('Nữ')}
            />
            <Text>Nữ</Text>
          </View>
        ) : (
          <Text style={tw`p-2 bg-gray-100 rounded`}>{editedInfo.gender}</Text>
        )}
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-sm text-gray-600`}>Email:</Text>
        <TextInput
          style={tw`border border-gray-300 rounded p-2 mt-1 bg-gray-100`}
          value={editedInfo.email}
          editable={false}
        />
      </View>

      <View style={tw`flex-row justify-around mt-4`}>
        <TouchableOpacity
          style={tw`px-4 py-2 bg-blue-500 rounded ${isEditing ? 'opacity-50' : ''}`}
          onPress={handleEdit}
          disabled={isEditing}
        >
          <Text style={tw`text-white`}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`px-4 py-2 bg-gray-500 rounded ${isEditing ? '' : 'opacity-50'}`}
          onPress={handleCancel}
          disabled={!isEditing}
        >
          <Text style={tw`text-white`}>Hủy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`px-4 py-2 bg-green-500 rounded ${isEditing ? '' : 'opacity-50'}`}
          onPress={handleSave}
          disabled={!isEditing}
        >
          <Text style={tw`text-white`}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
