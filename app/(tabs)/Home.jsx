import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.menu}>
        <Link href="/(tabs)/medical_services/MedicalServiceList" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Đặt lịch khám</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(tabs)/patient/RecordPatientList" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Hồ sơ khám bệnh</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(tabs)/doctor/DoctorList" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Tìm kiếm bác sĩ</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/tab/inpatient-treatment" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Điều trị nội trú</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/tab/schedule" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Lịch khám bệnh</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/tab/insurance" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Bảo hiểm y tế</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/tab/procedure" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Quy trình khám bệnh</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/tab/faq" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Giải đáp & tư vấn</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.activities}>
        <Text style={styles.activitiesTitle}>HOẠT ĐỘNG</Text>
        <ScrollView horizontal>
          <Image
            style={styles.activityImage}
            source={{ uri: 'https://example.com/activity1.jpg' }} // Thay thế bằng URL ảnh thật
          />
          <Image
            style={styles.activityImage}
            source={{ uri: 'https://example.com/activity2.jpg' }} // Thay thế bằng URL ảnh thật
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f9ff',
    alignItems: 'center',
  },
  menu: {
    marginTop: 150,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '90%',
  },
  menuItem: {
    width: '45%',
    padding: 15,
    backgroundColor: '#3b82f6',
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuItemText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  activities: {
    marginTop: 20,
    width: '90%',
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activityImage: {
    width: 150,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
});
