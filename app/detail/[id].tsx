import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, Platform, SafeAreaView, ScrollView, TouchableOpacity, Modal, Alert, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Car {
    _id: string;
    img: string;
    nameCar: string;
    transmission: string;
    passenger: number;
    oil: string;
    driver?: boolean;
    price: number;
    about: string;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

async function sendPushNotification(expoPushToken: string, car: Car) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Berhasil Sewa Mobil',
        body: `Selamat! Anda telah berhasil menyewa mobil ${car.nameCar}.`,
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}


function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

export default function App() {
    const { id } = useLocalSearchParams(); // Ambil parameter `id` dari URL
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
    const [showEndPicker, setShowEndPicker] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    const navigation = useNavigation();

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const formatDate = (date: Date): string => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const formatPrice = (price: number): string => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        if (car && car.price) {
            setTotalPrice(calculateTotalPrice());
        }
    }, [startDate, endDate, car]);

    const calculateTotalPrice = (): number => {
        if (!car || !car.price) return 0;
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));
        return diffDays * car.price;
    };

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await fetch(`https://be-rent-car.vercel.app/cars/${id}`);
                const data = await response.json();
                setCar(data);
            } catch (error) {
                console.error('Failed to fetch car data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCarData();
    }, [id]);


    const handleRentCar = async (): Promise<void> => {
        const token = await AsyncStorage.getItem('@myApp:token');
        if (!token) {
            setShowLoginModal(true);
            return;
        }
        setShowConfirmModal(true);
    };

    const confirmRentCar = async (): Promise<void> => {
        const token = await AsyncStorage.getItem('@myApp:token');
        const rentData = {
            carId: car._id,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        };

        try {
            setShowConfirmModal(false);
            const response = await fetch('https://be-rent-car.vercel.app/rentcars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token || '',
                },
                body: JSON.stringify(rentData),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Sukses', 'Berhasil Menyewa Mobil!');
                sendPushNotification(expoPushToken, car);
            } else {
                Alert.alert('Error', result.message || 'Something went wrong!');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to rent car.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (!car) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Data mobil tidak ditemukan.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <Image source={{ uri: car.img }} style={styles.image} />
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.wrapper}>
                        <Text style={styles.name}>{car.nameCar}</Text>
                        <View style={styles.datePickerSection}>
                            <Text style={styles.datePickerSectionText} >Atur tanggal sewa</Text>
                            <View style={styles.datePickerRow}>
                                <View style={styles.datePickerWrapper}>
                                    <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.datePickerButton}>
                                        <Text style={styles.datePickerButtonText}>{formatDate(startDate)}</Text>
                                    </TouchableOpacity>
                                    {showStartPicker && (
                                        <DateTimePicker
                                            value={startDate}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setShowStartPicker(false);
                                                if (selectedDate) {
                                                    setStartDate(selectedDate);
                                                }
                                            }}
                                        />
                                    )}
                                </View>

                                <Icon name="arrow-forward" size={30} color="#000" style={styles.arrowIcon} />

                                <View style={styles.datePickerWrapper}>
                                    <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.datePickerButton}>
                                        <Text style={styles.datePickerButtonText}>{formatDate(endDate)}</Text>
                                    </TouchableOpacity>
                                    {showEndPicker && (
                                        <DateTimePicker
                                            value={endDate}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setShowEndPicker(false);
                                                if (selectedDate) {
                                                    setEndDate(selectedDate);
                                                }
                                            }}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoTitle}>Informasi Mobil</Text>
                            <View style={styles.infoWrapper}>
                                <View style={styles.info}>
                                    <Icon name="settings" size={20} color="#D3D3D3" />
                                    <Text style={styles.infoText}>{car.transmission}</Text>
                                </View>
                                <View style={styles.info}>
                                    <Icon name="people" size={20} color="#D3D3D3" />
                                    <Text style={styles.infoText}>{car.passenger}</Text>
                                </View>
                                <View style={styles.info}>
                                    <Icon name="local-gas-station" size={20} color="#D3D3D3" />
                                    <Text style={styles.infoText}>{car.oil}</Text>
                                </View>
                                {car.driver ? <View style={styles.info}>
                                    <Icon name="person" size={20} color="#32CD32" />
                                    <Text style={styles.infoDriver}> Sopir</Text>
                                </View> : null}
                            </View>
                        </View>
                        <Text style={styles.aboutTitle}>About Car</Text>
                        <Text style={styles.aboutText}>{car.about}</Text>
                    </View>
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <Text style={styles.totalPriceText}>
                        Total Harga: Rp {car && car.price ? formatPrice(totalPrice) : '...'}
                    </Text>
                    <TouchableOpacity style={styles.rentButton} onPress={handleRentCar} disabled={!car}>
                        <Text style={styles.rentButtonText}>Sewa Sekarang</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={showLoginModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowLoginModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Anda belum login</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setShowLoginModal(false);
                                    navigation.navigate('login' as never);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={showConfirmModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowConfirmModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Apakah Anda yakin ingin menyewa mobil ini?</Text>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setShowConfirmModal(false)}
                                >
                                    <Text style={styles.modalButtonText}>Batal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.confirmButton]}
                                    onPress={confirmRentCar}
                                >
                                    <Text style={styles.modalButtonText}>Ya</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },

    price: {
        fontSize: 20,
        color: '#00A86B',
        marginBottom: 20,
    },


    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 50,
    },
    wrapper: {
        padding: 20,
    },
    name: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    datePickerSection: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#000',
        padding: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    datePickerSectionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    datePickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    datePickerWrapper: {
        flex: 1,
    },
    datePickerButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    datePickerButtonText: {
        fontSize: 16,
        color: '#000',
    },
    arrowIcon: {
        marginHorizontal: 10,
    },
    infoContainer: {
        flexDirection: 'column',
        marginBottom: 20,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    aboutTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    aboutText: {
        fontSize: 18,
        color: '#545151',
    },
    infoWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 5,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginBottom: 5,
    },
    infoText: {
        marginLeft: 5,
        fontSize: 18,
        color: '#000',
    },
    bottomContainer: {
        paddingTop: 10,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 15,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalPriceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    rentButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    rentButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    infoDriver: {
        color: '#32CD32',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#000',
    },
    modalButton: {
        backgroundColor: '#32CD32',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    confirmButton: {
        backgroundColor: '#FF4500',
    },
    modalButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

});