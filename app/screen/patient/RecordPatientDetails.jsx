import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import tw from 'tailwind-react-native-classnames';
import { updatePatientRecord } from '../../service/patient/UpdatePatientRecord';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PatientDetail() {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const params = useLocalSearchParams();
    const {
        patientId,
        fullName,
        dateOfBirth,
        gender,
        insuranceId,
        identificationCode,
        nation,
        occupation,
        phoneNumber,
        email,
        country,
        province,
        district,
        ward,
        address,
        relationship,
        note
    } = params;

    const [editable, setEditable] = useState(false);
    const [formData, setFormData] = useState({
        fullName,
        dateOfBirth,
        gender,
        insuranceId,
        identificationCode,
        nation,
        occupation,
        phoneNumber,
        email,
        country,
        province,
        district,
        ward,
        address,
        relationship,
        note
    });

    const handleEdit = () => setEditable(true);

    const handleCancel = () => {
        setEditable(false);
        setFormData({
            fullName,
            dateOfBirth,
            gender,
            insuranceId,
            identificationCode,
            nation,
            occupation,
            phoneNumber,
            email,
            country,
            province,
            district,
            ward,
            address,
            relationship,
            note
        });
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            await updatePatientRecord(patientId, formData);
            Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!');
            setEditable(false);
        } catch (error) {
            Alert.alert('Lỗi', 'Cập nhật hồ sơ thất bại.');
            console.error('Error updating record:', error);
        }
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <ScrollView style={tw`flex-1 p-4 bg-gray-100 mb-0`}>
            <View style={tw`bg-white p-6 rounded-lg shadow-lg mb-0`}>
                <Text style={tw`text-2xl font-bold text-center mb-0`}>Chi tiết hồ sơ</Text>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Họ và tên:</Text>
                    <TextInput
                        value={formData.fullName}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('fullName', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Ngày sinh:</Text>
                    {editable ? (
                        <>
                            <TouchableOpacity
                                style={tw`border p-3 rounded-lg bg-white border-blue-500`}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={tw`text-gray-700`}>{formData.dateOfBirth || 'Chọn ngày sinh'}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={forma}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            handleInputChange(
                                                'dateOfBirth',
                                                selectedDate.toISOString().split('T')[0]
                                            );
                                        }
                                    }}
                                />
                            )}
                        </>
                    ) : (
                        <TextInput
                            value={formData.dateOfBirth}
                            editable={false}
                            style={tw`border p-3 rounded-lg bg-gray-100 border-gray-300`}
                        />
                    )}
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Giới tính:</Text>
                    <TextInput
                        value={formData.gender}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('gender', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Mã bảo hiểm:</Text>
                    <TextInput
                        value={formData.insuranceId}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('insuranceId', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Số căn cước:</Text>
                    <TextInput
                        value={formData.identificationCode}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('identificationCode', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Dân tộc:</Text>
                    <TextInput
                        value={formData.nation}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('nation', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Nghề nghiệp:</Text>
                    <TextInput
                        value={formData.occupation}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('occupation', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Số điện thoại:</Text>
                    <TextInput
                        value={formData.phoneNumber}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('phoneNumber', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Địa chỉ email:</Text>
                    <TextInput
                        value={formData.email}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('email', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Quốc gia sinh sống:</Text>
                    <TextInput
                        value={formData.country}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('country', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Tỉnh thành:</Text>
                    <TextInput
                        value={formData.province}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('province', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Thành phố/huyện:</Text>
                    <TextInput
                        value={formData.district}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('district', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Phường/xã:</Text>
                    <TextInput
                        value={formData.ward}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('ward', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Địa chỉ:</Text>
                    <TextInput
                        value={formData.address}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('address', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Quan hệ với bệnh nhân:</Text>
                    <TextInput
                        value={formData.relationship}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('relationship', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>

                <View style={tw`mb-2`}>
                    <Text style={tw`text-base font-bold text-gray-700 mb-0`}>Ghi chú:</Text>
                    <TextInput
                        value={formData.note}
                        editable={editable}
                        onChangeText={(text) => handleInputChange('note', text)}
                        style={tw`border p-3 rounded-lg bg-gray-100 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>
            </View>

            <View style={tw`flex-row justify-between mt-2`}>
                <TouchableOpacity
                    style={tw`flex-1 bg-blue-500 p-4 rounded-lg mr-2`}
                    onPress={handleEdit}
                    disabled={editable}
                >
                    <Text style={tw`text-center text-white font-bold`}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={tw`flex-1 bg-gray-500 p-4 rounded-lg mx-2 ${!editable ? 'opacity-50' : ''}`}
                    onPress={handleCancel}
                    disabled={!editable}
                >
                    <Text style={tw`text-center text-white font-bold`}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={tw`flex-1 bg-green-500 p-4 rounded-lg ml-2 ${!editable ? 'opacity-50' : ''}`}
                    onPress={handleSave}
                    disabled={!editable}
                >
                    <Text style={tw`text-center text-white font-bold`}>Lưu</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
