import { Text, View, TextInput, Button, ToastAndroid, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useNavigation } from 'expo-router';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { createPatientRecord } from '../../service/patient/CreateRecordPatient';
import { fetchProvinces, fetchDistrictsByProvinceCode, fetchWardsByDistrictCode } from '../../service/VietNamUnits';
import tw from 'tailwind-react-native-classnames';
import { Checkbox } from 'react-native-paper';
import nationsData from '../../data/nations'; // Import file dữ liệu dân tộc
import countriesData from '../../data/countries'; // Import file dữ liệu quốc gia
import occupationsData from '../../data/occupation';// dữ liệu nghề nghiệp
import relationshipsData from '../../data/relationship';//mối quan hệ với bệnh nhân

export default function PatientRecord() {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [insuranceId, setInsuranceId] = useState('');
  const [identificationCode, setIdentificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  // Combo box values for drop-down menus
  const [nation, setNation] = useState('');
  const [nations, setNations] = useState([]); // 54 dân tộc Việt Nam
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]); // Tất cả các quốc gia
  const [occupation, setOccupation] = useState('');
  const [occupations, setOccupations] = useState([]);
  const [relationship, setRelationship] = useState('');
  const [relationships, setRelationships] = useState([]);

  // State lưu mã code cho API
  const [provinceCode, setProvinceCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [wardCode, setWardCode] = useState('');

  // State lưu tên đầy đủ cho hiển thị
  const [provinceName, setProvinceName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [wardName, setWardName] = useState('');

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [isInfoConfirmed, setIsInfoConfirmed] = useState(false);

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

  const handleProvinceChange = async (selectedProvinceCode) => {
    const selectedProvince = provinces.find(p => p.code === selectedProvinceCode);

    setProvinceCode(selectedProvinceCode);
    setProvinceName(selectedProvince?.fullName || '');

    // Reset district and ward when province changes
    setDistrictCode('');
    setDistrictName('');
    setWardCode('');
    setWardName('');

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

    // Reset ward when district changes
    setWardCode('');
    setWardName('');
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
  };

  useEffect(() => {
    // Load danh sách dân tộc Việt Nam
    const loadNations = () => {
      setNations(nationsData); // Dữ liệu từ file dữ liệu tĩnh
    };

    // Load danh sách quốc gia
    const loadCountries = () => {
      setCountries(countriesData); // Dữ liệu từ file dữ liệu tĩnh
    };

    // Load danh sách nghề nghiệp
    const loadOccupations = () => {
      setOccupations(occupationsData);
    };

    const loadRelationShips = () => {
      setRelationships(relationshipsData);
    };

    loadNations();
    loadCountries();
    loadOccupations();
    loadRelationShips();
  }, []);

  // Format date for display
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format date for API
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePatient = async () => {
    const patientData = {
      fullName,
      dateOfBirth: formatDateForAPI(dateOfBirth),
      gender,
      insuranceId,
      identificationCode,
      phoneNumber,
      nation,
      occupation,
      email,
      country,
      province: provinceName,
      district: districtName,
      ward: wardName,
      address,
      relationship,
      note,
    };

    try {
      await createPatientRecord(patientData);
      ToastAndroid.show('Đăng ký thông tin bệnh nhân thành công!', ToastAndroid.BOTTOM);
      navigation.goBack('(tabs)/patient/RecordPatientList');
    } catch (error) {
      ToastAndroid.show('Đăng ký thất bại!', ToastAndroid.BOTTOM);
      // console.error('Registration error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1`}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={tw`flex-grow justify-center px-5`} keyboardShouldPersistTaps="handled">
        <Text style={tw`text-lg font-bold mb-1 text-left w-full`}>Thông tin bệnh nhân:</Text>
        <View style={tw`flex-1 items-center`}>

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Họ và tên (có dấu):</Text>
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
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDateOfBirth(selectedDate);
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

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Bảo hiểm y tế:</Text>
          <TextInput
            style={tw`w-full h-10 border rounded-md px-3 mb-4`}
            value={insuranceId}
            onChangeText={setInsuranceId}
            placeholder="Nhập mã bảo hiểm y tế"
          />

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Số căn cước:</Text>
          <TextInput
            style={tw`w-full h-10 border rounded-md px-3 mb-4`}
            value={identificationCode}
            onChangeText={setIdentificationCode}
            placeholder="Nhập số căn cước"
          />

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Dân tộc:</Text>
          <Picker
            mode="dropdown"
            selectedValue={nation}
            onValueChange={(value) => setNation(value)}
            style={tw`w-full mb-4`}
          >
            <Picker.Item label="Chọn dân tộc" value="n/a" />
            {nations.map((item, index) => (
              <Picker.Item key={index} label={item.name} value={item.name} />
            ))}
          </Picker>

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Nghề nghiệp:</Text>
          <Picker mode="dropdown" selectedValue={occupation} onValueChange={(value) => setOccupation(value)} style={tw`w-full mb-4`}>
            <Picker.Item label="Chọn nghề nghiệp" value="n/a" />
            {occupations.map((item, index) => (
              <Picker.Item key={index} label={item.name} value={item.name} />
            ))}
          </Picker>

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Số điện thoại:</Text>
          <TextInput
            style={tw`w-full h-10 border rounded-md px-3 mb-4`}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Nhập số điện thoại"
            keyboardType='phone-pad'
          />

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Email:</Text>
          <TextInput
            style={tw`w-full h-10 border rounded-md px-3 mb-4`}
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email"
            keyboardType="email-address"
          />

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Quốc gia sinh sống:</Text>
          <Picker
            mode="dropdown"
            selectedValue={country}
            onValueChange={(value,index) => setCountry(value)}
            style={tw`w-full mb-4`}
          >
            <Picker.Item label="Chọn quốc gia" value="n/a" />
            <Picker.Item label="Việt Nam" value="Việt Nam" />
            <Picker.Item label="Nước ngoài" value="Nước ngoài" />
          </Picker>

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Tỉnh thành:</Text>
          <Picker
            mode="dropdown"
            selectedValue={provinceCode}
            onValueChange={handleProvinceChange}
            style={tw`w-full mb-4`}
          >
            <Picker.Item label="Chọn tỉnh thành" value="n/a" />
            {provinces.map((item) => (
              <Picker.Item key={item.code} label={item.fullName} value={item.code} />
            ))}
          </Picker>

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Thành phố/huyện:</Text>
          <Picker
            mode="dropdown"
            selectedValue={districtCode}
            onValueChange={handleDistrictChange}
            style={tw`w-full mb-4`}
            enabled={provinceCode !== ''}
          >
            <Picker.Item label="Chọn thành phố/huyện" value="n/a" />
            {districts.map((item) => (
              <Picker.Item key={item.code} label={item.fullName} value={item.code} />
            ))}
          </Picker>


          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Phường/xã:</Text>
          <Picker
            mode="dropdown"
            selectedValue={wardCode}
            onValueChange={handleWardChange}
            style={tw`w-full mb-4`}
            enabled={districtCode !== ''}
          >
            <Picker.Item label="Chọn phường/xã" value="n/a" />
            {wards.map((item) => (
              <Picker.Item key={item.code} label={item.fullName} value={item.code} />
            ))}
          </Picker>

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Địa chỉ:</Text>
          <TextInput
            style={tw`w-full h-10 border rounded-md px-3 mb-4`}
            value={address}
            onChangeText={setAddress}
            placeholder="Nhập địa chỉ"
          />

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Ghi chú:</Text>
          <TextInput
            style={tw`w-full h-10 border rounded-md px-3 mb-4`}
            value={note}
            onChangeText={setNote}
            placeholder="Nhập ghi chú"
          />

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Bạn tạo hồ sơ cho:</Text>
          <Picker mode="dropdown" selectedValue={occupation} onValueChange={(value) => setRelationship(value)} style={tw`w-full mb-4`}>
            <Picker.Item label="Quan hệ với bệnh nhân" value="n/a" />
            {relationships.map((item) => (
              <Picker.Item key={item.label} label={item.label} value={item.label} />
            ))}
          </Picker>

          <View style={tw`flex-row items-center mb-4 w-full`}>
            <Checkbox
              status={isInfoConfirmed ? 'checked' : 'unchecked'}
              onPress={() => setIsInfoConfirmed(!isInfoConfirmed)}
              color='blue'
            />
            <Text style={tw`text-sm`}>Tôi cam kết thông tin trên hồ sơ là đúng sự thật</Text>
          </View>

          <View style={tw`w-full mt-4 mb-8 px-4`}>
            <TouchableOpacity
              style={tw`h-12 rounded-full justify-center items-center ${isInfoConfirmed ? 'bg-blue-500' : 'bg-gray-400'}`}
              onPress={handlePatient}
              disabled={!isInfoConfirmed}
            >
              <Text style={tw`text-white text-lg font-bold`}>Tạo hồ sơ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
