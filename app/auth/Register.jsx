import { Text, View, TextInput, Alert, ToastAndroid, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import { Link, useNavigation, router } from 'expo-router';
import { RadioButton } from 'react-native-paper';
import { createUser } from '../service/identity/User';
import tw from 'tailwind-react-native-classnames';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigator = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);

  //Hiển thị ngày dd/mm/yyyy trên text input
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 1 nên cần +1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  //Lưu định dạng ngày yyyy/mm/dd vào cơ sở dữ liệu
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedDateOfBirth = formatDateForAPI(dateOfBirth);

  const userData = {
    fullName,
    dateOfBirth: formattedDateOfBirth,
    gender,
    phoneNumber,
    email,
    password,
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      ToastAndroid.show('Mật khẩu và xác nhận mật khẩu không khớp!', ToastAndroid.BOTTOM);
      return;
    }

    try {
      const response = await createUser(userData);
      if (response) {
        setModalMessage('Tạo tài khoản thành công!');
        setModalVisible(true);
      }
    } catch (error) {
      if (error.message) {
        setModalMessage(error.message);
      } else {
        setModalMessage('Đăng ký thất bại!');
      }
      setModalVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1`}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust offset as needed
    >
      <ScrollView contentContainerStyle={tw`flex-grow justify-center px-5`} keyboardShouldPersistTaps="handled">
        <Text style={tw`text-lg font-bold mb-1 text-left w-full`}>Thông tin tài khoản:</Text>
        <View style={tw`flex-1 items-center`}>
          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Họ và tên(có dấu):</Text>
          <TextInput
            style={tw`w-full h-10 border rounded-md px-3 mb-4`}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nhập họ và tên"
          />

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Ngày sinh:</Text>
          <TouchableOpacity
            style={tw`w-full h-10 border rounded-md px-3 justify-center mb-4`}
            onPress={() => setShowDatePicker(true)}
          >
            <TextInput
              value={formatDate(dateOfBirth)}
              keyboardType='default'
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="spinner"
              onChange={(event, formattedDateOfBirth) => {
                setShowDatePicker(false);
                if (formattedDateOfBirth) {
                  setDateOfBirth(formattedDateOfBirth);
                }
              }}
            />
          )}
          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Giới tính:</Text>
          <View style={tw`flex-row items-center mb-4 w-full`}>
            <RadioButton
              value="Nam"
              status={gender === 'Nam' ? 'checked' : 'unchecked'}
              onPress={() => setGender('Nam')}
            />
            <Text style={tw`mr-4`}>Nam</Text>
            <RadioButton
              value="Nữ"
              status={gender === 'Nữ' ? 'checked' : 'unchecked'}
              onPress={() => setGender('Nữ')}
            />
            <Text>Nữ</Text>
          </View>

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Số điện thoại:</Text>
          <TextInput
            style={tw`w-full h-10 border rounded-md px-3 mb-4`}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Email:</Text>
          <TextInput
            style={tw`w-full h-10 border rounded-md px-3 mb-4`}
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email"
            keyboardType="email-address"
          />

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Mật khẩu:</Text>
          <View style={tw`w-full h-10 border rounded-md flex-row items-center px-3 mb-4`}>
            <TextInput
              style={tw`flex-1`}
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Xác nhận mật khẩu:</Text>
          <View style={tw`w-full h-10 border rounded-md flex-row items-center px-3 mb-6`}>
            <TextInput
              style={tw`flex-1`}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={tw`rounded-full bg-blue-500 p-4 w-full flex items-center justify-center`}
            onPress={handleRegister}
          >
            <Text style={tw`text-white font-bold text-lg`}>Đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigator.goBack()}
          >
            <Text style={tw`mt-4 text-base text-blue-600`}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={tw`bg-white p-5 rounded-md items-center`}>
          <Text style={tw`text-lg mb-4`}>{modalMessage}</Text>
          <TouchableOpacity
            style={tw`rounded-full bg-blue-500 p-3 w-32 flex items-center`}
            onPress={() => {
              setModalVisible(false);
              if (modalMessage === 'Tạo tài khoản thành công!') {
                navigator.goBack();
              }
            }
            }
          >
            <Text style={tw`text-white font-bold`}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
