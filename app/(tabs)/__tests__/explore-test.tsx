import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ExploreScreen from '@/app/(tabs)/explore';
import { NavigationContainer } from '@react-navigation/native';
import fetchMock from 'jest-fetch-mock';  // Import jest-fetch-mock

// Enable fetch mocking
fetchMock.enableMocks();

describe('ExploreScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();  // Reset mocks before each test
  });

  it('should fetch cars based on search and driver filter', async () => {
    const carsMockData = [
      { _id: '1', nameCar: 'Car 1', description: 'Description 1', price: '100', img: 'car1.jpg' },
      { _id: '2', nameCar: 'Car 2', description: 'Description 2', price: '150', img: 'car2.jpg' },
    ];

    // Mock the fetch API response with a complete Response object
    fetchMock.mockResolvedValueOnce({
      ok: true,  // Indicate that the request was successful
      status: 200,  // Standard HTTP status code for a successful request
      headers: { 'Content-Type': 'application/json' },  // Mock the response headers
      json: jest.fn().mockResolvedValue(carsMockData),  // Mock the json method
    });

    const { getByPlaceholderText, getByText, findByText } = render(
      <NavigationContainer>
        <ExploreScreen />
      </NavigationContainer>
    );

    // Type in the search bar
    const searchBar = getByPlaceholderText('Search...');
    fireEvent.changeText(searchBar, 'Car');
    
    // Wait for the cars to be displayed after the fetch
    await waitFor(() => findByText('Car 1'));
    await waitFor(() => findByText('Car 2'));

    // Check if the car names are displayed
    expect(getByText('Car 1')).toBeTruthy();
    expect(getByText('Car 2')).toBeTruthy();
  });

  it('should match snapshot', async () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ExploreScreen />
      </NavigationContainer>
    );

    // Capture a snapshot of the component's initial state
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle fetch error gracefully', async () => {
    // Mock the fetch API to simulate an error
    fetchMock.mockRejectedValueOnce(new Error('Failed to fetch cars'));

    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <ExploreScreen />
      </NavigationContainer>
    );

    // Type in the search bar
    const searchBar = getByPlaceholderText('Search...');
    fireEvent.changeText(searchBar, 'Toyota');

    // Wait for the cars to be fetched (in this case, it will fail)
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'https://be-rent-car.vercel.app/cars?&nameCar=Toyota'
      );
    });
  });
});
