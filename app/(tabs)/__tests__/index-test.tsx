import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../index';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('react-native-elements', () => ({
  SearchBar: ({ onChangeText, value }: { onChangeText: (text: string) => void; value: string }) => (
    <input
      data-testid="search-bar"
      type="text"
      onChange={(e) => onChangeText(e.target.value)}
      value={value}
    />
  ),
}));

jest.mock('@/components/ui/CardCar', () => {
  return ({ car }: { car: any }) => <div data-testid="car-card">{car.nameCar}</div>;
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  useBottomTabBarHeight: jest.fn(() => 50),
}));

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  rn.FlatList = jest.fn(({ data, renderItem }: any) =>
    data.map((item: any, index: number) => renderItem({ item, index }))
  );
  return rn;
});

// Mock AsyncStorage
beforeEach(() => {
  AsyncStorage.getItem = jest.fn((key) => {
    if (key === '@myApp:name') return Promise.resolve('John Doe');
    if (key === '@myApp:token') return Promise.resolve('test-token');
    return Promise.resolve(null);
  });
  AsyncStorage.removeItem = jest.fn(() => Promise.resolve());
});

describe('HomeScreen', () => {
  it('renders correctly with default values', async () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    // Wait for useEffect to complete
    await waitFor(() => {
      expect(getByText('Hai!! John Doe')).toBeTruthy();
      expect(getByTestId('search-bar')).toBeTruthy();
    });
  });

  it('handles search input correctly', () => {
    const { getByTestId } = render(<HomeScreen />);
    const searchBar = getByTestId('search-bar');

    fireEvent.changeText(searchBar, 'Sedan');
    expect(searchBar.props.value).toBe('Sedan');
  });

  it('renders car cards correctly', async () => {
    const mockCars = [
      { _id: '1', nameCar: 'Car 1', img: '', transmission: '', passenger: 4, oil: '', price: 100 },
      { _id: '2', nameCar: 'Car 2', img: '', transmission: '', passenger: 4, oil: '', price: 200 },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCars),
      })
    ) as jest.Mock;

    const { getAllByTestId } = render(<HomeScreen />);

    await waitFor(() => {
      const carCards = getAllByTestId('car-card');
      expect(carCards).toHaveLength(2);
      expect(carCards[0].textContent).toBe('Car 1');
      expect(carCards[1].textContent).toBe('Car 2');
    });
  });

  it('handles logout correctly', async () => {
    const { getByText } = render(<HomeScreen />);
    const logoutButton = getByText('Logout');

    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@myApp:name');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@myApp:token');
    });
  });
});
