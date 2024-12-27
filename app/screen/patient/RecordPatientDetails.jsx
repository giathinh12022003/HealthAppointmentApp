import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import tw from 'tailwind-react-native-classnames';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import { fetchProvinces, fetchDistrictsByProvinceCode, fetchWardsByDistrictCode } from '../../service/VietNamUnits';
import { getPatientRecordById } from '../../service/patient/GetRecordPatient';
import { updatePatientRecord } from '../../service/patient/UpdatePatientRecord';
import nationsData from '../../data/nations';
import occupationsData from '../../data/occupation';
import relationshipsData from '../../data/relationship';

const RecordPatientDetails = () => {
    // Lấy thông tin được push qua từ màn hình trước
    const { patientId } = useLocalSearchParams();

    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        insuranceId: '',
        identificationCode: '',
        nation: '',
        occupation: '',
        phoneNumber: '',
        email: '',
        country: '',
        province: '',
        district: '',
        ward: '',
        address: '',
        relationship: '',
        note: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // State lưu mã code cho API
    const [provinceCode, setProvinceCode] = useState('');
    const [districtCode, setDistrictCode] = useState('');
    const [wardCode, setWardCode] = useState('');

    // State lưu tên đầy đủ cho hiển thị
    const [provinceName, setProvinceName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [wardName, setWardName] = useState('');

    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const data = await fetchProvinces();
                setProvinces(data);
            } catch (error) {
                // ToastAndroid.show('Lỗi khi lấy dữ liệu tỉnh thành!', ToastAndroid.BOTTOM);
                // console.error('Error fetching provinces:', error);
            }
        };

        loadProvinces();
    }, []);

    useEffect(() => {
        const fetchPatientRecord = async () => {
            if (patientId) {
                const data = await getPatientRecordById(patientId);
                if (data) {
                    setFormData(data);
                }
            }
        };
        fetchPatientRecord();
    }, [patientId]);

    const handleProvinceChange = async (selectedProvinceCode) => {
        const selectedProvince = provinces.find(p => p.code === selectedProvinceCode);

        setProvinceCode(selectedProvinceCode);
        setProvinceName(selectedProvince?.fullName || '');

        setFormData((prevState) => ({
            ...prevState,
            province: selectedProvince?.fullName || '',
            district: '', // Xóa dữ liệu cũ
            ward: '',     // Xóa dữ liệu cũ
        }));

        // Reset district and ward when province changes
        // setDistrictCode('');
        // setDistrictName('');
        // setWardCode('');
        // setWardName('');

        try {
            const data = await fetchDistrictsByProvinceCode(selectedProvinceCode);
            setDistricts(data || []);
        } catch (error) {
            //ToastAndroid.show('Lỗi khi lấy dữ liệu thành phố/huyện!', ToastAndroid.BOTTOM);
            // console.error('Error fetching districts:', error);
        }
    };

    const handleDistrictChange = async (selectedDistrictCode) => {
        const selectedDistrict = districts.find(d => d.code === selectedDistrictCode);

        setDistrictCode(selectedDistrictCode);
        setDistrictName(selectedDistrict?.fullName || '');

        setFormData((prevState) => ({
            ...prevState,
            district: selectedDistrict?.fullName || '',
            ward: '', // Xóa dữ liệu cũ
        }));

        // Reset ward when district changes
        // setWardCode('');
        // setWardName('');
        try {
            const data = await fetchWardsByDistrictCode(selectedDistrictCode);
            setWards(data || []);
        } catch (error) {
            //ToastAndroid.show('Lỗi khi lấy dữ liệu phường/xã!', ToastAndroid.BOTTOM);
            // console.error('Error fetching wards:', error);
        }
    };

    const handleWardChange = (selectedWardCode) => {
        const selectedWard = wards.find(w => w.code === selectedWardCode);

        setWardCode(selectedWardCode);
        setWardName(selectedWard?.fullName || '');

        setFormData((prevState) => ({
            ...prevState,
            ward: selectedWard?.fullName || '',
        }));
    };

    // Lưu lại các thông tin ban đầu và trạng thái chỉnh sửa
    const [editable, setEditable] = useState(false);

    // Hàm xử lý thay đổi dữ liệu khi người dùng nhập
    const handleChange = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    // Hàm hủy thay đổi, trả về giá trị ban đầu
    const handleCancel = async () => {
        if (patientId) {
            const data = await getPatientRecordById(patientId);
            if (data) {
                setFormData(data);
            }
        }
        setEditable(false); // Hủy chế độ chỉnh sửa
    };

    // Hàm lưu thay đổi (Giả sử là lưu vào backend hoặc local storage)
    const handleSave = async () => {
        const patientDataSave = { ...formData };
        const isFormValid = Object.values(formData).every(
            (value) => value !== null && value !== "" && value !== "n/a" // Kiểm tra giá trị không null và không rỗng
        );

        if (!isFormValid) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ tất cả các thông tin trong biểu mẫu.");
            return;
        }
        try {
            console.log("Form Data:", formData);
            await updatePatientRecord(patientId, patientDataSave);
            Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!');

            setEditable(false);
        } catch (error) {
            Alert.alert('Lỗi', 'Cập nhật hồ sơ thất bại.');
            console.error('Error updating record:', error);
        }
    };

    // Hàm xử lý thay đổi giới tính
    const handleGenderChange = (gender) => {
        setFormData(prevState => ({
            ...prevState,
            gender: gender,
        }));
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            handleChange('dateOfBirth', formattedDate);
        }
    };

    const displayDate = () => {
        if (!formData.dateOfBirth) return '';
        const [year, month, day] = formData.dateOfBirth.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={tw`flex-1`}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView contentContainerStyle={tw`flex-grow justify-center px-5 pb-14`} keyboardShouldPersistTaps="handled">
                <View style={tw`p-4`}>
                    <Text style={tw`text-2xl font-bold mb-4`}>Chi tiết hồ sơ</Text>

                    <Text style={tw`mb-2 text-base`}>Họ tên:</Text>
                    <TextInput
                        value={formData.fullName}
                        onChangeText={(value) => handleChange('fullName', value)}
                        editable={editable}
                        style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />

                    <Text style={tw`mb-2 text-base`}>Ngày sinh:</Text>
                    <TouchableOpacity
                        onPress={() => editable && setShowDatePicker(true)}
                        style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 justify-center ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                        disabled={!editable}
                    >
                        <Text style={tw`${editable ? 'text-black' : 'text-gray-500'}`}>
                            {displayDate() || 'Chọn ngày sinh'}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={new Date(formData.dateOfBirth || new Date())}
                            mode="date"
                            display='spinner'
                            onChange={handleDateChange}
                        />
                    )}

                    {/* Hiển thị giới tính */}
                    <Text style={tw`mb-2 text-base`}>Giới tính:</Text>
                    <View style={tw`flex-row mb-4`}>
                        <TouchableOpacity
                            onPress={() => editable && handleGenderChange('Nam')}
                            style={[
                                tw`flex-row items-center mr-4`,
                                { opacity: editable ? 1 : 0.5 } // Chỉ cho phép chọn khi editable là true
                            ]}
                            disabled={!editable}
                        >
                            <View
                                style={[
                                    tw`w-5 h-5 rounded-full border-2`,
                                    { borderColor: formData.gender === 'Nam' ? '#1D4ED8' : '#ccc', backgroundColor: formData.gender === 'Nam' ? '#1D4ED8' : 'transparent' }
                                ]}
                            />
                            <Text style={tw`ml-2`}>Nam</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => editable && handleGenderChange('Nữ')}
                            style={[
                                tw`flex-row items-center`,
                                { opacity: editable ? 1 : 0.5 } // Chỉ cho phép chọn khi editable là true
                            ]}
                            disabled={!editable}
                        >
                            <View
                                style={[
                                    tw`w-5 h-5 rounded-full border-2`,
                                    { borderColor: formData.gender === 'Nữ' ? '#1D4ED8' : '#ccc', backgroundColor: formData.gender === 'Nữ' ? '#1D4ED8' : 'transparent' }
                                ]}
                            />
                            <Text style={tw`ml-2`}>Nữ</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={tw`mb-2 text-base`}>Bảo hiểm y tế:</Text>
                    <TextInput
                        value={formData.insuranceId}
                        onChangeText={(value) => handleChange('insuranceId', value)}
                        editable={editable}
                        style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />

                    <Text style={tw`mb-2 text-base`}>Số CCCD:</Text>
                    <TextInput
                        value={formData.identificationCode}
                        onChangeText={(value) => handleChange('identificationCode', value)}
                        editable={editable}
                        style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />

                    <Text style={tw`mb-2 text-base`}>Dân tộc:</Text>
                    {editable ? (
                        <Picker
                            mode='dropdown'
                            selectedValue={formData.nation}
                            onValueChange={(value) => handleChange('nation', value)}
                            style={tw`h-14 border border-gray-300 rounded-md mb-4`}
                        >
                            {nationsData.map((item, index) => (
                                <Picker.Item key={index} label={item.name} value={item.name} />
                            ))}
                        </Picker>
                    ) : (
                        <View style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 justify-center`}>
                            <Text style={tw`text-gray-500`}>{formData.nation || 'Không xác định'}</Text>
                        </View>
                    )}

                    <Text style={tw`mb-2 text-base`}>Nghề nghiệp:</Text>
                    {editable ? (
                        <Picker
                            mode='dropdown'
                            selectedValue={formData.occupation}
                            onValueChange={(value) => handleChange('occupation', value)}
                            style={tw`h-14 border border-gray-300 rounded-md mb-4`}
                        >
                            {occupationsData.map((item, index) => (
                                <Picker.Item key={index} label={item.name} value={item.name} />
                            ))}
                        </Picker>
                    ) : (
                        <View style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 justify-center ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}>
                            <Text style={tw`text-gray-500`}>{formData.occupation || 'Không xác định'}</Text>
                        </View>
                    )}

                    <Text style={tw`mb-2 text-base`}>Số điện thoại:</Text>
                    <TextInput
                        value={formData.phoneNumber}
                        onChangeText={(value) => handleChange('phoneNumber', value)}
                        editable={editable}
                        style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />

                    <Text style={tw`mb-2 text-base`}>Email:</Text>
                    <TextInput
                        value={formData.email}
                        onChangeText={(value) => handleChange('email', value)}
                        editable={editable}
                        style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />

                    <Text style={tw`mb-2 text-base`}>Quốc gia sinh sống:</Text>
                    {editable ? (
                        <Picker
                            mode="dropdown"
                            selectedValue={formData.country}
                            onValueChange={(value) => handleChange('country', value)}
                            style={tw`h-14 border border-gray-300 rounded-md mb-4`}
                        >
                            
                            <Picker.Item label="Việt Nam" value="Việt Nam" />
                            <Picker.Item label="Nước ngoài" value="Nước ngoài" />
                        </Picker>
                    ) : (
                        <View style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 justify-center`}>
                            <Text style={tw`text-gray-500`}>{formData.country || 'Không xác định'}</Text>
                        </View>
                    )}

                    <Text style={tw`mb-2 text-base`}>Tỉnh thành:</Text>
                    {editable ? (
                        <Picker
                            mode='dropdown'
                            selectedValue={formData.province}
                            onValueChange={handleProvinceChange}
                            style={tw`h-14 border border-gray-300 rounded-md mb-4`}
                        >
                            <Picker.Item label="Chọn tỉnh thành" value="n/a" />
                            {provinces.map((item) => (
                                <Picker.Item key={item.code} label={item.fullName} value={item.code} />
                            ))}
                        </Picker>
                    ) : (
                        <View style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 justify-center`}>
                            <Text style={tw`text-gray-500`}>{formData.province || 'Không xác định'}</Text>
                        </View>
                    )}

                    <Text style={tw`mb-2 text-base`}>Thành phố/Quận/Huyện:</Text>
                    {editable ? (
                        <Picker
                            mode='dropdown'
                            selectedValue={formData.district}
                            onValueChange={handleDistrictChange}
                            style={tw`h-14 border border-gray-300 rounded-md mb-4`}
                        >
                            <Picker.Item label="Chọn thành phố/quận/huyện" value="n/a"/>
                            {districts.map((item) => (
                                <Picker.Item key={item.code} label={item.fullName} value={item.code} />
                            ))}
                        </Picker>
                    ) : (
                        <View style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 justify-center`}>
                            <Text style={tw`text-gray-500`}>{formData.district || 'Không xác định'}</Text>
                        </View>
                    )}

                    <Text style={tw`mb-2 text-base`}>Phường/Xã:</Text>
                    {editable ? (
                        <Picker
                            mode='dropdown'
                            selectedValue={formData.ward}
                            onValueChange={handleWardChange}
                            style={tw`h-14 border border-gray-300 rounded-md mb-4`}
                        >
                            <Picker.Item label="Chọn phường/xã" value="n/a" />
                            {wards.map((item) => (
                                <Picker.Item key={item.code} label={item.fullName} value={item.code} />
                            ))}
                        </Picker>
                    ) : (
                        <View style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 justify-center`}>
                            <Text style={tw`text-gray-500`}>{formData.ward || 'Không xác định'}</Text>
                        </View>
                    )}

                    <Text style={tw`mb-2 text-base`}>Bạn đặt hồ sơ cho:</Text>
                    {editable ? (
                        <Picker
                            mode='dropdown'
                            selectedValue={formData.relationship}
                            onValueChange={(value) => handleChange('relationship', value)}
                            style={tw`h-14 border border-gray-300 rounded-md mb-4`}
                        >
                            {relationshipsData.map((item, index) => (
                                <Picker.Item key={index} label={item.label} value={item.label} />
                            ))}
                        </Picker>
                    ) : (
                        <View style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 justify-center`}>
                            <Text style={tw`text-gray-500`}>{formData.relationship || 'Không xác định'}</Text>
                        </View>
                    )}

                    <Text style={tw`mb-2 text-base`}>Ghi chú:</Text>
                    <TextInput
                        value={formData.note}
                        onChangeText={(value) => handleChange('note', value)}
                        editable={editable}
                        style={tw`h-10 border border-gray-300 rounded-md p-2 mb-4 ${editable ? 'border-blue-500 bg-white' : 'border-gray-300'}`}
                    />
                </View>
            </ScrollView>

            {/* Nút chức năng */}
            <View style={[
                tw`flex-row justify-between p-4 bg-white border-t border-gray-200`,
                { position: 'absolute', bottom: 0, left: 0, right: 0 }
            ]}>
                {/* Nút Sửa */}
                <TouchableOpacity
                    onPress={() => {
                        setEditable(true);
                    }}
                    style={tw`flex-1 p-3 bg-blue-500 rounded-md mx-1`}
                >
                    <Text style={tw`text-center text-white font-bold`}>Sửa</Text>
                </TouchableOpacity>

                {/* Nút Hủy */}
                <TouchableOpacity
                    onPress={handleCancel}
                    style={[
                        tw`flex-1 p-3 rounded-md mx-1`,
                        { backgroundColor: editable ? 'gray' : '#c1c8bf', opacity: editable ? 1 : 0.85 }
                    ]}
                    disabled={!editable}
                >
                    <Text style={tw`text-center text-white font-bold`}>Hủy</Text>
                </TouchableOpacity>

                {/* Nút Lưu */}
                <TouchableOpacity
                    onPress={handleSave}
                    style={[
                        tw`flex-1 p-3 rounded-md mx-1`,
                        { backgroundColor: editable ? 'green' : '#96f084', opacity: editable ? 1 : 0.85 }
                    ]}
                    disabled={!editable}
                >
                    <Text style={tw`text-center text-white font-bold`}>Lưu</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView >
    );
};

export default RecordPatientDetails;
