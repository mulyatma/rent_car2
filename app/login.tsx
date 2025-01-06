import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const navigation = useNavigation();

    const handleLogin = async () => {
        let hasError = false;
        if (!email) {
            setEmailErrorMessage('Email harus diisi.');
            hasError = true;
        } else {
            setEmailErrorMessage('');
        }

        if (!password) {
            setPasswordErrorMessage('Password harus diisi.');
            hasError = true;
        } else {
            setPasswordErrorMessage('');
        }

        if (hasError) {
            return;
        }

        try {
            const response = await fetch('https://be-rent-car.vercel.app/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                await AsyncStorage.setItem('@myApp:token', data.accessToken);
                await AsyncStorage.setItem('@myApp:name', data.name);

                navigation.navigate('(tabs)' as never);
            } else if (response.status === 400) {
                setEmailErrorMessage('Email tidak ditemukan.');
                setPasswordErrorMessage('');
            } else if (response.status === 403) {
                setPasswordErrorMessage('Password salah.');
                setEmailErrorMessage('');
            } else {
                console.error('Login failed');
                Alert.alert('Error', 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert('Error', 'Error during login. Please try again.');
        }
    };

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconAndTitleContainer}>
                <Icon name="car-side" size={120} color="#000" style={styles.carIcon} />
                <Text style={styles.title}>Login</Text>
            </View>
            <View style={styles.formContainer}>
                <TextInput
                    style={[styles.input, emailErrorMessage && styles.errorInput]}
                    placeholder={emailErrorMessage ? emailErrorMessage : 'Email'}
                    placeholderTextColor={emailErrorMessage ? 'red' : '#aaa'}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.passwordInput, passwordErrorMessage && styles.errorInput]}
                        placeholder={passwordErrorMessage ? passwordErrorMessage : 'Password'}
                        placeholderTextColor={passwordErrorMessage ? 'red' : '#aaa'}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secureTextEntry}
                    />
                    <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
                        <Icon name={secureTextEntry ? 'eye-off' : 'eye'} size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Belum punya akun? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('register' as never)}>
                    <Text style={styles.registerButtonText}>Daftar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    iconAndTitleContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    carIcon: {
        marginBottom: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 35,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 8,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        color: '#000',
    },
    errorInput: {
        borderColor: 'red',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
    passwordInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        color: '#aaa',
        fontSize: 16,
    },
    registerButtonText: {
        color: '#007BFF',
        fontSize: 16,
    },
});
