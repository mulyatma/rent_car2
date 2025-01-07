import React from 'react';
import { render } from '@testing-library/react-native';
import TabLayout from '@/app/(tabs)/_layout'; // Adjust the import path
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Platform } from 'react-native';

// Mock dependencies
jest.mock('@/components/HapticTab', () => ({
  HapticTab: jest.fn(() => <div />),
}));

jest.mock('@/components/ui/IconSymbol', () => ({
  IconSymbol: jest.fn(() => <div />),
}));

jest.mock('@/components/ui/TabBarBackground', () => ({
  TabBarBackground: jest.fn(() => <div />),
}));

jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

describe('TabLayout', () => {
  it('should render the tabs with icons', () => {
    const { getByText } = render(<TabLayout />);

    // Check if the tab titles are rendered
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Explore')).toBeTruthy();
    expect(getByText('Sewa')).toBeTruthy();

    // Check if icons are rendered (mocked)
    expect(IconSymbol).toHaveBeenCalledTimes(3); // Should be called for each tab
    expect(IconSymbol).toHaveBeenCalledWith(expect.objectContaining({ name: 'house.fill' }), {});
    expect(IconSymbol).toHaveBeenCalledWith(expect.objectContaining({ name: 'paperplane.fill' }), {});
    expect(IconSymbol).toHaveBeenCalledWith(expect.objectContaining({ name: 'car.fill' }), {});
  });

  it('should use HapticTab as tabBarButton', () => {
    render(<TabLayout />);

    // Ensure that the custom tab button is used
    expect(HapticTab).toHaveBeenCalled();
  });

  it('should use correct tabBar style for iOS', () => {
    Platform.OS = 'ios';
    const { getByTestId } = render(<TabLayout />);

    // Ensure that the tabBar has the correct style for iOS
    expect(getByTestId('tabBar')).toHaveStyle({ position: 'absolute' });
  });

  it('should use the correct color scheme for the tabs', () => {
    const { getByTestId } = render(<TabLayout />);

    // Test if the color scheme is applied to the tab bar
    expect(getByTestId('tabBar')).toHaveStyle({
      color: 'light', // Replace with expected color based on the color scheme
    });
  });
});
