import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CarDetail from '@/app/detail/[id]'; // Adjust the import path
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock useNavigation and other necessary modules
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

// Define a mock navigation object with the methods you need
const mockNavigate = jest.fn();
const mockSetOptions = jest.fn();

// Mocking useNavigation to return a mock navigate function
(useNavigation as jest.Mock).mockReturnValue({
  navigate: mockNavigate,
  setOptions: mockSetOptions,
});

describe('CarDetail', () => {
  const mockCarData = {
    _id: '1',
    img: 'https://example.com/car.jpg',
    nameCar: 'Car Name',
    transmission: 'Automatic',
    passenger: 5,
    oil: 'Petrol',
    price: 100,
    about: 'About the car...',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mockToken');
  });

  it('renders correctly and displays car data', async () => {
    // Mock the fetch API to return mock car data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCarData),
      })
    ) as jest.Mock;

    const { getByText, getByTestId } = render(<CarDetail />);

    // Wait for the component to load and check if car name is displayed
    await waitFor(() => {
      expect(getByText(mockCarData.nameCar)).toBeTruthy();
      expect(getByText(mockCarData.transmission)).toBeTruthy();
    });
  });

  it('shows loading indicator while data is loading', () => {
    // Mock fetch to simulate loading state
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    const { getByTestId } = render(<CarDetail />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('handles rent car button press', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCarData),
      })
    ) as jest.Mock;

    const { getByText, getByTestId } = render(<CarDetail />);

    await waitFor(() => {
      expect(getByText(mockCarData.nameCar)).toBeTruthy();
    });

    const rentButton = getByTestId('rent-button');
    fireEvent.press(rentButton);

    // Expect that navigate was called after pressing rent button
    expect(mockNavigate).toHaveBeenCalledWith('login');
  });

  it('handles confirm rent car action', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCarData),
      })
    ) as jest.Mock;

    const { getByText, getByTestId } = render(<CarDetail />);

    await waitFor(() => {
      expect(getByText(mockCarData.nameCar)).toBeTruthy();
    });

    const rentButton = getByTestId('rent-button');
    fireEvent.press(rentButton);

    // Simulate pressing confirm in the modal
    const confirmButton = getByTestId('confirm-rent-button');
    fireEvent.press(confirmButton);

    // Check if the fetch request to rent a car is made
    expect(global.fetch).toHaveBeenCalledWith(
      'https://be-rent-car.vercel.app/rentcars',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(String),
      })
    );
  });
});
