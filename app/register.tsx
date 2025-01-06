import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');

    const navigation = useNavigation();

    const handleRegister = async () => {
        let hasError = false;

        if (!name) {
            setNameErrorMessage('Nama harus diisi.');
            hasError = true;
        } else {
            setNameErrorMessage('');
        }

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

        if (!confirmPassword) {
            setConfirmPasswordErrorMessage('Konfirmasi password harus diisi.');
            hasError = true;
        } else if (confirmPassword !== password) {
            setConfirmPasswordErrorMessage('Password tidak cocok.');
            hasError = true;
        } else {
            setConfirmPasswordErrorMessage('');
        }

        if (hasError) {
            return;
        }

        // Send POST request to backend
        try {
            const response = await fetch('https://be-rent-car.vercel.app/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Registration Success', 'Account created successfully');
                navigation.navigate('login' as never); // Navigate to login screen on success
            } else {
                // Handle errors from the server (e.g., email already in use)
                Alert.alert('Registration Failed', result.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            // Handle network or other unexpected errors
            Alert.alert('Error', 'Unable to register. Please check your internet connection and try again.');
        }
    };

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const toggleConfirmSecureEntry = () => {
        setSecureConfirmTextEntry(!secureConfirmTextEntry);
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconAndTitleContainer}>
                <Icon name="car-side" size={120} color="#000" style={styles.carIcon} />
                <Text style={styles.title}>Register</Text>
            </View>

            {/* Name Input */}
            <TextInput
                style={[styles.input, nameErrorMessage && styles.errorInput]}
                placeholder={nameErrorMessage ? nameErrorMessage : 'Nama'}
                placeholderTextColor={nameErrorMessage ? 'red' : '#aaa'}
                value={name}
                onChangeText={setName}
            />

            {/* Email Input */}
            <TextInput
                style={[styles.input, emailErrorMessage && styles.errorInput]}
                placeholder={emailErrorMessage ? emailErrorMessage : 'Email'}
                placeholderTextColor={emailErrorMessage ? 'red' : '#aaa'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Password Input */}
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

            {/* Confirm Password Input */}
            <View style={styles.conPasswordContainer}>
                <TextInput
                    style={[styles.passwordInput, confirmPasswordErrorMessage && styles.errorInput]}
                    placeholder={confirmPasswordErrorMessage ? confirmPasswordErrorMessage : 'Confirm Password'}
                    placeholderTextColor={confirmPasswordErrorMessage ? 'red' : '#aaa'}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={secureConfirmTextEntry}
                />
                <TouchableOpacity onPress={toggleConfirmSecureEntry} style={styles.eyeIcon}>
                    <Icon name={secureConfirmTextEntry ? 'eye-off' : 'eye'} size={20} color="#aaa" />
                </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Sudah punya akun? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('login' as never)}>
                    <Text style={styles.registerButtonText}>Masuk</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 75,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    iconAndTitleContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    carIcon: {
        marginBottom: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 16,
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
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    conPasswordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 35,
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
        marginBottom: 16,
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
