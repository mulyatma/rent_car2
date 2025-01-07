import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../register'; // Sesuaikan path
import { Alert } from 'react-native';

// Mock useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits registration data successfully', async () => {
    const mockNavigate = jest.fn();
    const { useNavigation } = require('@react-navigation/native');
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Mock fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText('Nama'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Registration Success',
        'Account created successfully'
      );
      expect(mockNavigate).toHaveBeenCalledWith('login');
    });
  });
});
