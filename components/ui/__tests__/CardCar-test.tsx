import React from 'react';
import renderer from 'react-test-renderer';
import CarCard from '../CardCar';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe('CarCard Component', () => {
  it('renders correctly with given props', () => {
    const mockCar = {
      _id: '1',
      img: 'https://example.com/car.jpg',
      nameCar: 'Toyota Avanza',
      transmission: 'Automatic',
      passenger: 5,
      oil: 'Petrol',
      driver: true,
      price: 350000,
    };

    const tree = renderer.create(<CarCard car={mockCar} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders driver info correctly when driver is true', () => {
    const mockCar = {
      _id: '3',
      img: 'https://example.com/car.jpg',
      nameCar: 'Suzuki Ertiga',
      transmission: 'Automatic',
      passenger: 7,
      oil: 'Petrol',
      driver: true,
      price: 500000,
    };
  
    const component = renderer.create(<CarCard car={mockCar} />);
    const instance = component.root;
  
    // Check for the "Sopir" text
    const driverText = instance.findByProps({ children: 'Sopir' });
    expect(driverText).toBeTruthy();
  });

  it('displays formatted price and information correctly', () => {
    const mockCar = {
      _id: '2',
      img: 'https://example.com/car.jpg',
      nameCar: 'Honda Jazz',
      transmission: 'Manual',
      passenger: 4,
      oil: 'Diesel',
      driver: false,
      price: 450000,
    };

    const component = renderer.create(<CarCard car={mockCar} />);
    const instance = component.root;

    // Check for car name
    const nameText = instance.findByProps({ children: 'Honda Jazz' });
    expect(nameText).toBeTruthy();

    // Check for formatted price
    const priceText = instance.findByProps({ children: ' Rp450.000 /Hari' });
    expect(priceText).toBeTruthy();

    // Check for transmission
    const transmissionText = instance.findByProps({ children: 'Manual' });
    expect(transmissionText).toBeTruthy();

    // Check for passenger count
    const passengerText = instance.findByProps({ children: 4 });
    expect(passengerText).toBeTruthy();

    // Check for oil type
    const oilText = instance.findByProps({ children: 'Diesel' });
    expect(oilText).toBeTruthy();

    // Ensure driver icon is not rendered when driver is false
    expect(() => instance.findByProps({ children: 'Sopir' })).toThrow();
  });
});
