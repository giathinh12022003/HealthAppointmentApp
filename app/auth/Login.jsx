import { StyleSheet, Text, View, TextInput, ToastAndroid, TouchableOpacity } from 'react-native';
import React from 'react'
import { useNavigation, router, Link } from 'expo-router'
import { useState } from 'react';
import tw from 'tailwind-react-native-classnames';
import { setToken } from '../service/Token';
import { StatusBar } from 'expo-status-bar';
import { loginUser } from '../service/identity/Authenticate';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigator = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [isToastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleLogin = async () => {
    const normalizedUserName = userName.trim().toLowerCase();
    const response = await loginUser(normalizedUserName, password);

    if (response) {
      await setToken('accessToken', response.token);
      console.log("token log-in: " + response.token);
      setToastMessage('Đăng nhập thành công!');
      setToastType('success');
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        router.replace({ pathname: 'screen/Home' });
      }, 1300);
    } else {
      setToastMessage('Thông tin đăng nhập không chính xác!');
      setToastType('error');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    }
  };

  const handleRegisterNavigation = () => {
    navigator.navigate('auth/Register');
  };

  return (
    <View style={tw`flex-1 bg-white items-center justify-center p-5`}>
      <StatusBar style="light" />
      <Text style={tw`text-lg font-bold mb-1 text-left w-full`}>Email hoặc Số điện thoại:</Text>
      <TextInput
        style={tw`w-full h-12 border border-gray-300 rounded-md px-3 mb-4 text-lg`}
        value={userName}
        onChangeText={setUserName}
        placeholder="Nhập email hoặc số điện thoại"
        keyboardType="email-address"
      />

      <Text style={tw`text-lg font-bold mb-1 text-left w-full`}>Mật khẩu:</Text>
      <View style={tw`w-full h-12 border border-gray-300 rounded-md flex-row items-center px-3 mb-6`}>
        <TextInput
          style={tw`flex-1 text-lg`}
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={tw`rounded-full bg-blue-500 p-4 w-full flex items-center justify-center`}
        onPress={handleLogin}
      >
        <Text style={tw`text-white text-lg font-bold`}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`mt-4`}
        onPress={handleRegisterNavigation}
      >
        <Text style={tw`text-blue-600 text-base`}>Đăng ký tài khoản</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isToastVisible}
        onBackdropPress={() => setToastVisible(false)}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        backdropOpacity={0}
        style={tw`m-0 justify-end`}
      >
        <View
          style={[
            tw`p-4 rounded-lg mb-8 items-center flex-row`,
            { backgroundColor: toastType === 'success' ? '#4CAF50' : '#F44336' },
          ]}
        >
          <Ionicons
            name={toastType === 'success' ? "checkmark-circle" : "alert-circle"}
            size={24}
            color="white"
            style={tw`mr-2`}
          />
          <Text style={tw`text-white text-base`}>{toastMessage}</Text>
        </View>
      </Modal>
    </View>
  );
}