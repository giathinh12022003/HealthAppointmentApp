import { StyleSheet, Text, View, TextInput, Button, ToastAndroid, TouchableOpacity } from 'react-native';
import React from 'react'
import { Link, useNavigation } from 'expo-router'
import { useState } from 'react';
import { loginUser, setIdLogin } from '../service/Authenticate';
import { setToken } from '../service/Token';
import tw from 'tailwind-react-native-classnames';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigator = useNavigation();

  const handleLogin = async () => {
    const response = await loginUser(userName, password);

    if (response) {
      await setToken('accessToken', response.token);
      await setIdLogin('customerId', response.id);

      console.log("id: " + response.id);
      console.log("token: " + response.token);

      navigator.navigate('(tabs)/Home');

      ToastAndroid.show('Đăng nhập thành công!', ToastAndroid.BOTTOM);
    }
    else {
      ToastAndroid.show('Invalid login!', ToastAndroid.BOTTOM);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={tw`text-lg font-bold mb-1 text-left w-full`}>Email hoặc Số điện thoại:</Text>
      <TextInput
        style={tw`w-full h-12 border border-gray-300 rounded-md px-3 mb-4 text-lg`}
        value={userName}
        onChangeText={setUserName}
        placeholder="Nhập email hoặc số điện thoại"
        keyboardType="email-address"
      />

      <Text style={tw`text-lg font-bold mb-1 text-left w-full`}>Mật khẩu:</Text>
      <TextInput
        style={tw`w-full h-12 border border-gray-300 rounded-md px-3 mb-6 text-lg`}
        value={password}
        onChangeText={setPassword}
        placeholder="Nhập mật khẩu"
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={tw`rounded-full bg-blue-500 p-4 w-full flex items-center justify-center`}
        onPress={handleLogin}
      >
        <Text style={tw`text-white text-lg`}>Đăng nhập</Text>
      </TouchableOpacity>

      <Link href="/auth/Register" style={tw`mt-4 text-blue-600`}>
        Đăng ký tài khoản
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});