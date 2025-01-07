import React from 'react';
import renderer from 'react-test-renderer';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BlurTabBarBackground, { useBottomTabOverflow } from '../TabBarBackground';

// Mocking dependencies
jest.mock('@react-navigation/bottom-tabs', () => ({
  useBottomTabBarHeight: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

describe('BlurTabBarBackground', () => {
  it('renders the BlurView with correct props', () => {
    const tree = renderer.create(<BlurTabBarBackground />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('useBottomTabOverflow', () => {
  it('calculates the bottom tab overflow correctly', () => {
    // Mock values
    const mockTabHeight = 50;
    const mockBottomInset = 20;

    (useBottomTabBarHeight as jest.Mock).mockReturnValue(mockTabHeight);
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ bottom: mockBottomInset });

    // Call the hook
    const overflow = useBottomTabOverflow();

    // Verify the result
    expect(overflow).toBe(mockTabHeight - mockBottomInset);
  });

  it('returns the correct value when bottom inset is zero', () => {
    (useBottomTabBarHeight as jest.Mock).mockReturnValue(60);
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ bottom: 0 });

    const overflow = useBottomTabOverflow();
    expect(overflow).toBe(60);
  });
});
