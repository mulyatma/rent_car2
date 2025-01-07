import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RentScreen from '@/app/(tabs)/rent';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock navigation
const mockNavigate = jest.fn();

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Test RentScreen Component
describe('RentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render "Mobil Sedang Disewa" text', () => {
    const { getByText } = render(
      <NavigationContainer>
        <RentScreen />
      </NavigationContainer>
    );

    // Periksa apakah teks header muncul
    const headerText = getByText('Mobil Sedang Disewa');
    expect(headerText).toBeTruthy();
  });

  it('should display login prompt if not logged in', async () => {
    // Mock AsyncStorage to simulate user not logged in
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const { getByText } = render(
      <NavigationContainer>
        <RentScreen />
      </NavigationContainer>
    );

    // Periksa apakah "Anda belum login" muncul
    const loginPromptText = await getByText('Anda belum login');
    expect(loginPromptText).toBeTruthy();

    // Periksa apakah tombol Login muncul
    const loginButton = getByText('Login');
    expect(loginButton).toBeTruthy();
  });

  it('should navigate to login screen on login button press', async () => {
    // Mock AsyncStorage to simulate user not logged in
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const { getByText } = render(
      <NavigationContainer>
        <RentScreen />
      </NavigationContainer>
    );

    const loginButton = getByText('Login');

    fireEvent.press(loginButton);

    // Pastikan navigasi berhasil
    expect(mockNavigate).toHaveBeenCalledWith('login');
  });

  it('should fetch and display rented cars when logged in', async () => {
    // Mock AsyncStorage to simulate user logged in
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('valid-token');

    const rentedCarsMock = [
      {
        _id: '1',
        carId: {
          nameCar: 'Car 1',
          img: 'image1.png',
        },
        startDate: '2021-01-01',
        endDate: '2021-01-10',
        totalPrice: 100,
      },
      {
        _id: '2',
        carId: {
          nameCar: 'Car 2',
          img: 'image2.png',
        },
        startDate: '2021-02-01',
        endDate: '2021-02-10',
        totalPrice: 150,
      },
    ];

    // Mock fetch response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => rentedCarsMock,
    });

    const { getByText, findByText } = render(
      <NavigationContainer>
        <RentScreen />
      </NavigationContainer>
    );

    // Tunggu hingga data mobil yang disewa dimuat
    await waitFor(() => findByText('Car 1'));

    // Pastikan data mobil yang disewa muncul
    expect(getByText('Car 1')).toBeTruthy();
    expect(getByText('Car 2')).toBeTruthy();
  });

  it('should show loading indicator while fetching rented cars', async () => {
    // Mock AsyncStorage to simulate user logged in
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('valid-token');

    // Mock fetch to simulate loading state
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { getByTestId } = render(
      <NavigationContainer>
        <RentScreen />
      </NavigationContainer>
    );

    // Pastikan indikator loading muncul
    const loadingIndicator = getByTestId('loading-indicator');
    expect(loadingIndicator).toBeTruthy();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <RentScreen />
      </NavigationContainer>
    );

    // Ambil snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot when loading rented cars', async () => {
    // Mock AsyncStorage to simulate user logged in
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('valid-token');
    
    const rentedCarsMock = [];

    // Mock fetch response for loading state
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => rentedCarsMock,
    });

    const { toJSON } = render(
      <NavigationContainer>
        <RentScreen />
      </NavigationContainer>
    );

    // Take snapshot of loading state
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot when there are no rented cars', async () => {
    // Mock AsyncStorage to simulate user logged in
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('valid-token');
    
    const rentedCarsMock = [];

    // Mock fetch response for empty rented cars list
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => rentedCarsMock,
    });

    const { toJSON } = render(
      <NavigationContainer>
        <RentScreen />
      </NavigationContainer>
    );

    // Take snapshot of empty rented cars state
    expect(toJSON()).toMatchSnapshot();
  });
});
