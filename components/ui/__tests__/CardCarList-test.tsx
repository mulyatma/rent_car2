import React from 'react';
import renderer from 'react-test-renderer';
import CardCarList from '../CardCarList';



// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe('CardCarList Component', () => {
  it('renders correctly', () => {
    const mockCar = {
      _id: '1',
      nameCar: 'Toyota Avanza',
      description: 'A reliable car for family trips.',
      transmission: 'Automatic',
      passenger: 5,
      oil: 'Petrol',
      driver: true,
      price: '300000',
      img: 'https://example.com/car.jpg',
    };

    const tree = renderer
      .create(<CardCarList car={mockCar} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
