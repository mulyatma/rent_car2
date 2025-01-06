/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Car {
    carId: {
        nameCar: string;
        img: string;
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
}

interface RentedCarCardProps {
    car: Car;
}

export default function RentedCarCard({ car }: RentedCarCardProps) {
    const formatDate = (date: string): string => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const formatPrice = (price: number): string => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                <Text style={styles.cardName}>{car.carId.nameCar}</Text>
                <Text style={styles.cardDescription}>Sewa dari: {formatDate(car.startDate)}</Text>
                <Text style={styles.cardDescription}>Sampai: {formatDate(car.endDate)}</Text>
                <Text style={styles.cardPrice}>Total harga: Rp {formatPrice(car.totalPrice)}</Text>
            </View>
            <Image source={{ uri: car.carId.img }} style={styles.cardImage} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    textContainer: {
        flex: 1,
    },
    cardImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        borderRadius: 8,
    },
    cardName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000',
    },
    cardDescription: {
        fontSize: 18,
        color: '#000',
        marginTop: 4,
    },
    cardPrice: {
        fontSize: 18,
        color: '#000',
        marginTop: 4,
    },
});
