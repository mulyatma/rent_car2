import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    Platform,
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import RentedCarCard from '@/components/ui/RentedCarCard';

interface Car {
    _id: string;
    nameCar: string;
    price: number;
    img: string;
    description: string;
    driver: boolean;
}

interface Car {
    carId: {
        nameCar: string,
        img: string
    },
    startDate: string,
    endDate: string,
    totalPrice: number
}

export default function RentScreen() {
    const [rentedCars, setRentedCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const navigation = useNavigation();

    const fetchRentedCars = async () => {
        const token = await AsyncStorage.getItem('@myApp:token');
        if (!token) {
            setRentedCars([]);
            setLoggedIn(false);
            setLoading(false);
            return;
        }

        setLoggedIn(true);

        try {
            const response = await fetch('https://be-rent-car.vercel.app/rentcars/history', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            });

            const result = await response.json();

            if (response.ok) {
                setRentedCars(result);
            } else {
                Alert.alert('Error', result.message || 'Something went wrong!');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch rented cars.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentedCars();
    }, []);

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <Text style={styles.header}>Mobil Sedang Disewa</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : !loggedIn ? (
                    <View style={styles.notLoggedInContainer}>
                        <Text style={styles.notLoggedInText}>Anda belum login</Text>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={() => navigation.navigate('login' as never)}
                        >
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={rentedCars}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <RentedCarCard car={item} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.cartContainer}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        padding: 20,
    },
    cartContainer: {
        paddingTop: 15,
        paddingHorizontal: 20,
    },
    notLoggedInContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    notLoggedInText: {
        fontSize: 25,
        color: '#000',
        marginBottom: 20,
        textAlign: 'center',
    },
    loginButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    loginButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});
