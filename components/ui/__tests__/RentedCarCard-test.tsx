import React from 'react';
import renderer from 'react-test-renderer';
import RentedCarCard from '../RentedCarCard';

describe('RentedCarCard Component', () => {
  it('renders correctly with given props', () => {
    const mockCar = {
      carId: {
        nameCar: 'Toyota Avanza',
        img: 'https://example.com/car.jpg',
      },
      startDate: '2023-01-01',
      endDate: '2023-01-07',
      totalPrice: 3000000,
    };

    const tree = renderer.create(<RentedCarCard car={mockCar} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('formats dates and price correctly', () => {
    const mockCar = {
      carId: {
        nameCar: 'Toyota Avanza',
        img: 'https://example.com/car.jpg',
      },
      startDate: '2023-01-01',
      endDate: '2023-01-07',
      totalPrice: 3000000,
    };

    const component = renderer.create(<RentedCarCard car={mockCar} />);
    const instance = component.root;

    // Check formatted dates
    const startDateText = instance.findByProps({ children: 'Sewa dari: 1/1/2023' });
    expect(startDateText).toBeTruthy();

    const endDateText = instance.findByProps({ children: 'Sampai: 7/1/2023' });
    expect(endDateText).toBeTruthy();

    // Check formatted price
    const priceText = instance.findByProps({ children: 'Total harga: Rp 3.000.000' });
    expect(priceText).toBeTruthy();
  });
});
