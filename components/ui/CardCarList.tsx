import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Link } from 'expo-router';

interface CardCarListProps {
    car: {
        _id: string;
        nameCar: string;
        description: string;
        transmission: string;
        passenger: number;
        oil: string;
        driver: boolean;
        price: string;
        img: string;
    };
}

const CardCarList: React.FC<CardCarListProps> = ({ car }) => {
    // Pindahkan penggunaan useNavigation ke dalam komponen
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(car.price));

    return (
        <TouchableOpacity style={styles.card} >
            <Link href={{
                pathname: '/detail/[id]',
                params: { id: car._id },
            }}
                style={styles.link}>
                <View style={styles.cardDetails}>
                    <View>
                        <Text style={styles.cardName}>{car.nameCar}</Text>
                        <Image source={{ uri: car.img }} style={styles.cardImage} />
                    </View>
                    <View style={styles.cardInfo}>
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
                            {car.driver && (
                                <View style={styles.info}>
                                    <Icon name="person" size={20} color="#32CD32" />
                                    <Text style={styles.infoDriver}> Sopir</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.cardPrice}>Harga: {formattedPrice} /Hari</Text>
                    </View>
                </View>
            </Link>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        backgroundColor: 'white',
        height: 150,
        marginBottom: 10,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        display: 'flex',
    },
    link: {
        flexDirection: 'column',
    },
    cardName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000',
    },
    cardImage: {
        width: 100,
        height: '80%',
        resizeMode: 'contain',
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
        marginLeft: 12,
    },
    cardInfo: {
        alignSelf: 'flex-end',
        width: '70%',
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
    },
    infoText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#D3D3D3',
    },
    infoDriver: {
        fontSize: 14,
        color: '#32CD32',
    },
});

export default CardCarList;