import React from 'react';
import Login from './auth/Login';
import {EXPO_PUBLIC_IP_ADDRESS} from '@env';

export default function App() {
  console.log("IP Address:", EXPO_PUBLIC_IP_ADDRESS);
  return (
    <Login></Login>
  );
}