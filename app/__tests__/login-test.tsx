import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from '@/app/login'; // Update the path to the actual file

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

global.fetch = jest.fn();

describe('LoginScreen', () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: navigateMock });
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('displays validation errors when inputs are empty', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    const loginButton = getByText('Login');

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByPlaceholderText('Email harus diisi.')).toBeTruthy();
      expect(getByPlaceholderText('Password harus diisi.')).toBeTruthy();
    });
  });

  it('makes API call and navigates on successful login', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: 'test-token',
        name: 'Test User',
      }),
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    await act(async () => {
      fireEvent.press(loginButton);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@myApp:token', 'test-token');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@myApp:name', 'Test User');
    expect(navigateMock).toHaveBeenCalledWith('(tabs)');
  });

  it('displays error when email is not found', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'unknown@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    await act(async () => {
      fireEvent.press(loginButton);
    });

    await waitFor(() => {
      expect(getByPlaceholderText('Email tidak ditemukan.')).toBeTruthy();
    });
  });

  it('displays error when password is incorrect', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    await act(async () => {
      fireEvent.press(loginButton);
    });

    await waitFor(() => {
      expect(getByPlaceholderText('Password salah.')).toBeTruthy();
    });
  });

  it('displays an alert on network error', async () => {
    jest.spyOn(Alert, 'alert');
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    await act(async () => {
      fireEvent.press(loginButton);
    });

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Error during login. Please try again.');
  });

  it('toggles password visibility', () => {
    const { getByTestId } = render(<LoginScreen />);
    const toggleButton = getByTestId('toggle-password-visibility');

    expect(toggleButton).toBeTruthy();
    fireEvent.press(toggleButton);
    // Ensure the state changes
  });
});
