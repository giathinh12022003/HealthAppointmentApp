import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { getDoctors } from '../service/Doctor';
import tw from 'tailwind-react-native-classnames';

export default function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchDoctors();
    }, [page]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const data = await getDoctors(page, 5);
            setDoctors(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const renderDoctor = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text>{`Giới tính: ${item.gender}`}</Text>
            <Text>{`Trạng thái: ${item.status}`}</Text>
            <Text>{`Cập nhật lần cuối: ${new Date(item.lastUpdated).toLocaleDateString()}`}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <FlatList
                        data={doctors}
                        keyExtractor={(item) => item.id}
                        renderItem={renderDoctor}
                    />
                    <View style={styles.pagination}>
                        <Button title="Trước" onPress={handlePrevPage} disabled={page === 1} />
                        <Text style={styles.pageInfo}>{`Trang ${page} / ${totalPages}`}</Text>
                        <Button title="Tiếp" onPress={handleNextPage} disabled={page === totalPages} />
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    pageInfo: {
        fontSize: 16,
    },
});
