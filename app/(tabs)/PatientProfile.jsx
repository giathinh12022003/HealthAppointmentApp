import { Modal, Text, View, TextInput, Button, ToastAndroid, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link, useNavigation } from 'expo-router';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { createPatientRecord } from '../service/Patient';
import { fetchProvinces, fetchDistrictsByProvinceCode, fetchWardsByDistrictCode } from '../service/VietNamUnits';
import tw from 'tailwind-react-native-classnames';
import { Checkbox } from 'react-native-paper';
import { getIdLogin } from '../service/Authenticate';
import nationsData from '../data/nations'; // Import file dữ liệu dân tộc
import countriesData from '../data/countries'; // Import file dữ liệu quốc gia


export default function PatientProfile() {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [insuranceId, setInsuranceId] = useState('');
  const [identificationCode, setIdentificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [customerId, setCustomerId] = useState('');

  // Combo box values for drop-down menus
  const [nation, setNation] = useState('');
  const [nations, setNations] = useState([]); // 54 dân tộc Việt Nam
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]); // Tất cả các quốc gia
  const [occupation, setOccupation] = useState('');
  const [province, setProvince] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [district, setDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [ward, setWard] = useState('');
  const [wards, setWards] = useState([]);
  const [relationship, setRelationship] = useState('');

  const navigator = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [isInfoConfirmed, setIsInfoConfirmed] = useState(false);

  useEffect(() => {
    const loadCustomerId = async () => {
      try {
        const id = await getIdLogin('customerId');
        setCustomerId(id);
      } catch (error) {
        console.error("Failed to load customerId from storage", error);
      }
    };
    loadCustomerId();
  }, []);

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await fetchProvinces();
        setProvinces(data);
      } catch (error) {
        ToastAndroid.show('Lỗi khi lấy dữ liệu tỉnh thành!', ToastAndroid.BOTTOM);
        console.error('Error fetching provinces:', error);
      }
    };

    loadProvinces();
  }, []);

  const handleProvinceChange = async (selectedProvince) => {
    setProvince(selectedProvince);
    setDistrict(''); // Reset district when province changes
    setWard(''); // Reset ward when province changes

    try {
      const data = await fetchDistrictsByProvinceCode(selectedProvince);
      setDistricts(data || []);
    } catch (error) {
      ToastAndroid.show('Lỗi khi lấy dữ liệu thành phố/huyện!', ToastAndroid.BOTTOM);
      console.error('Error fetching districts:', error);
    }
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

    loadNations();
    loadCountries();
  }, []);

  const handleDistrictChange = async (selectedDistrict) => {
    setDistrict(selectedDistrict);
    setWard(''); // Reset ward when district changes

    try {
      const data = await fetchWardsByDistrictCode(selectedDistrict);
      setWards(data || []);
    } catch (error) {
      ToastAndroid.show('Lỗi khi lấy dữ liệu phường/xã!', ToastAndroid.BOTTOM);
      console.error('Error fetching wards:', error);
    }
  };


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
      province,
      district,
      ward,
      address,
      relationship,
      note,
      customerId,
    };

    try {
      await createPatientRecord(patientData);
      ToastAndroid.show('Đăng ký thông tin bệnh nhân thành công!', ToastAndroid.BOTTOM);
      navigator.navigate('index');
    } catch (error) {
      ToastAndroid.show('Đăng ký thất bại!', ToastAndroid.BOTTOM);
      console.error('Registration error:', error);
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
            selectedValue={nation}
            onValueChange={(value) => setNation(value)}
            style={tw`w-full mb-4`}
          >
            <Picker.Item label="Chọn dân tộc" value=""/>
            {nations.map((item, index) => (
              <Picker.Item key={index} label={item.name} value={item.code}/>
            ))}
          </Picker>

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Nghề nghiệp:</Text>
          <Picker selectedValue={occupation} onValueChange={(value) => setOccupation(value)} style={tw`w-full mb-4`}>
            <Picker.Item label="Chọn nghề nghiệp" value="" />
            {/* Add additional options here */}
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
            selectedValue={country}
            onValueChange={(value) => setCountry(value)}
            style={tw`w-full mb-4`}
          >
            <Picker.Item label="Chọn quốc gia" value=""/>
            {countries.map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.code} />
            ))}
          </Picker>

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Tỉnh thành:</Text>
          <Picker
            selectedValue={province}
            onValueChange={handleProvinceChange}
            style={tw`w-full mb-4`}

          >
            <Picker.Item label="Chọn tỉnh thành" value="" />
            {provinces && provinces.length > 0 && provinces.map((item) => (
              <Picker.Item key={item.code} label={item.fullName} value={item.code} />
            ))}
          </Picker>

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Thành phố/huyện:</Text>
          <Picker
            selectedValue={district}
            onValueChange={handleDistrictChange}
            style={tw`w-full mb-4`}
            enabled={province !== ''} // Disable if no province selected
          >
            <Picker.Item label="Chọn thành phố/huyện" value="" />
            {districts.map((item) => (
              <Picker.Item key={item.code} label={item.fullName} value={item.code} />
            ))}
          </Picker>


          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Phường/xã:</Text>
          <Picker
            selectedValue={ward}
            onValueChange={(value) => setWard(value)}
            style={tw`w-full mb-4`}
            enabled={district !== ''} // Disable if no district selected
          >
            <Picker.Item label="Chọn phường/xã" value="" />
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

          <Text style={tw`text-sm font-bold mb-1 text-left w-full`}>Quan hệ:</Text>
          <Picker selectedValue={occupation} onValueChange={(value) => setRelationship(value)} style={tw`w-full mb-4`}>
            <Picker.Item label="Quan hệ với bệnh nhân" value="" />
            {/* Add additional options here */}
          </Picker>

          <View style={tw`flex-row items-center mb-4 w-full`}>
            <Checkbox
              status={isInfoConfirmed ? 'checked' : 'unchecked'}
              onPress={() => setIsInfoConfirmed(!isInfoConfirmed)}
            />
            <Text style={tw`text-sm`}>Tôi cam kết thông tin trên hồ sơ là đúng sự thật</Text>
          </View>

          <Button
            title="Tạo hồ sơ"
            onPress={handlePatient}
            color="#3b82f6"
            disabled={!isInfoConfirmed}  // Điều kiện để kích hoạt nút Đăng kí
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
