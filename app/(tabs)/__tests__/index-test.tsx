import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '@/app/(tabs)/index'; // Adjust the import path
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/components/ui/CardCar', () => ({
  __esModule: true,
  default: jest.fn(() => <div>CarCard</div>),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        { _id: '1', nameCar: 'Car A', img: '', price: 100 },
        { _id: '2', nameCar: 'Car B', img: '', price: 200 },
      ]),
  })
) as jest.Mock;

describe('HomeScreen', () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({ navigate: navigateMock });
    jest.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    const { getByText, getByPlaceholderText } = render(<HomeScreen />);

    expect(getByText('Hai!! User')).toBeTruthy();
    expect(getByPlaceholderText('Cari Mobil')).toBeTruthy();
  });

  it('fetches and displays car data', async () => {
    const { getByText, findAllByText } = render(<HomeScreen />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const carCards = await findAllByText('CarCard');
    expect(carCards.length).toBe(2); // Matches mocked car data length
  });

  it('handles login navigation', () => {
    const { getByText } = render(<HomeScreen />);

    const loginButton = getByText('Login');
    fireEvent.press(loginButton);

    expect(navigateMock).toHaveBeenCalledWith('login');
  });

  it('opens and closes logout modal', () => {
    const { getByText, queryByText } = render(<HomeScreen />);

    fireEvent.press(getByText('Login')); // Open login to mock token
    fireEvent.press(getByText('User')); // Open modal

    expect(getByText('Yakin ingin keluar?')).toBeTruthy();

    fireEvent.press(getByText('Cancel'));
    expect(queryByText('Yakin ingin keluar?')).toBeNull();
  });

  it('logs out correctly', async () => {
    const { getByText } = render(<HomeScreen />);

    fireEvent.press(getByText('Login')); // Open login to mock token
    fireEvent.press(getByText('User')); // Open modal

    fireEvent.press(getByText('Logout'));

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@myApp:name');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@myApp:token');
    });

    expect(navigateMock).toHaveBeenCalledWith('login');
  });

  it('filters car results based on search', async () => {
    const { getByPlaceholderText, findAllByText } = render(<HomeScreen />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const searchInput = getByPlaceholderText('Cari Mobil');

    fireEvent.changeText(searchInput, 'Car A');
    const filteredCars = await findAllByText('CarCard');
    expect(filteredCars.length).toBe(1); // Matches filtered result
  });
});
