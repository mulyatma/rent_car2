import React from 'react';
import renderer from 'react-test-renderer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { IconSymbol } from '../IconSymbol';

describe('IconSymbol Component', () => {
  it('renders correctly with default props', () => {
    const component = renderer.create(
      <IconSymbol name="house.fill" color="black" />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders the correct MaterialIcon based on the mapping', () => {
    const component = renderer.create(
      <IconSymbol name="car.fill" color="red" size={30} />
    );
    const instance = component.root;

    // Find the MaterialIcons component
    const materialIcon = instance.findByType(MaterialIcons);

    expect(materialIcon.props.name).toBe('directions-car'); // Verify the mapped name
    expect(materialIcon.props.color).toBe('red'); // Verify the color
    expect(materialIcon.props.size).toBe(30); // Verify the size
  });

  it('applies the style prop correctly', () => {
    const style = { margin: 10 };
    const component = renderer.create(
      <IconSymbol name="paperplane.fill" color="blue" size={24} style={style} />
    );
    const instance = component.root;

    const materialIcon = instance.findByType(MaterialIcons);
    expect(materialIcon.props.style).toBe(style); // Verify the style prop
  });

  it('throws an error for an invalid icon name', () => {
    // Using a try-catch to handle the error and check its message
    expect(() =>
      renderer.create(<IconSymbol name="invalid.icon" color="black" />)
    ).toThrowError('undefined is not an object (evaluating \'MAPPING[name]\')');
  });
});
