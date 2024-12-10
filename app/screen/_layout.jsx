import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Menu, Provider, PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { logOut } from '../service/identity/Logout';
import { getToken } from '../service/Token';
import tw from 'tailwind-react-native-classnames';
import { Dropdown } from 'react-native-paper-dropdown';

export default function _layout() {
    const [menuVisible, setMenuVisible] = useState(false);
    const router = useRouter();

    const toggleMenu = () => setMenuVisible(!menuVisible);
    const closeMenu = () => setMenuVisible(false);

    const handleLogOut = async () => {
        closeMenu();
        try {
            // const token = await getToken('accessToken');
            // console.log("Token log out:", token);
            // await logOut(token);
            router.replace('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <PaperProvider>
            <Stack>
                <Stack.Screen
                    name='Home'
                    options={{
                        gestureEnabled:false,
                        title: 'Trang chủ',
                        headerBackVisible: false,
                        headerStyle: {
                            backgroundColor: '#2563eb',
                        },
                        headerTitleStyle: { color: 'white' },
                        headerRight: () => (
                            <View style={{ position: 'relative' }}>
                                <Menu
                                    visible={menuVisible}
                                    onDismiss={closeMenu}
                                    anchor={
                                        <TouchableOpacity onPress={toggleMenu}>
                                            <Ionicons
                                                name="person-circle-outline"
                                                size={30}
                                                color="white"
                                                style={{ marginRight: 16 }}
                                            />
                                        </TouchableOpacity>
                                    }
                                    contentStyle={{
                                        top: 80,
                                        left:250
                                    }}
                                >
                                    <Menu.Item onPress={() => console.log('Profile clicked')} title="Hồ sơ" />
                                    <Menu.Item onPress={() => console.log('Setting clicked')} title="Tùy chỉnh" />
                                    <Menu.Item onPress={handleLogOut} title="Đăng xuất" />
                                </Menu>

                            </View>

                        ),
                    }}
                />
                <Stack.Screen name="appointment" options={{ headerShown: false }} />
                <Stack.Screen name="doctor" options={{ headerShown: false }} />
                <Stack.Screen name="medical_services" options={{ headerShown: false }} />
                <Stack.Screen name="patient" options={{ headerShown: false }} />
                <Stack.Screen name="profile" options={{ headerShown: false }} />
                <Stack.Screen name="specialty" options={{ headerShown: false }} />
            </Stack>
        </PaperProvider>
    );
}