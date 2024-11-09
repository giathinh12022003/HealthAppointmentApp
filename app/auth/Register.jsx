import { Text, View, TextInput, Button, ToastAndroid, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import { Link, useNavigation } from 'expo-router';
import { RadioButton } from 'react-native-paper';
import { createUser } from '../service/User';
import tw from 'tailwind-react-native-classnames';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
        ToastAndroid.show('Tạo tài khoản thành công!', ToastAndroid.BOTTOM);
        navigator.navigate('index');
      }
      else{
        ToastAndroid.show('Đăng kí thất bại!', ToastAndroid.BOTTOM);
      }
    } catch (error) {
      console.error(error);
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
          <TextInput
            style={tw`w-full h-10 border rounded-md px-3 mb-4`}
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu"
            secureTextEntry={true}
          />

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Xác nhận mật khẩu:</Text>
          <TextInput
            style={tw`w-full h-10 border rounded-md px-3 mb-6`}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry={true}
          />

          <Button title="Đăng kí" onPress={handleRegister} color="#3b82f6" />
          <Link href="/" style={tw`mt-4 text-blue-600`}>
            Quay lại
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
