import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import RootLayout from '@/app/_layout'; // Adjust the import path
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock external dependencies
jest.mock('@react-navigation/native', () => ({
  ThemeProvider: jest.fn(({ children }) => <>{children}</>),
  DefaultTheme: {},
  DarkTheme: {},
}));

jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true]),
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Stack: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Screen: () => null,
}));

describe('RootLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with fonts loaded', async () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');

    const { getByText } = render(<RootLayout />);

    // Verify the component renders the navigation stack
    await waitFor(() => {
      expect(getByText('(tabs)')).toBeTruthy();
      expect(SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
    });
  });

  it('returns null when fonts are not loaded', () => {
    jest.mock('expo-font', () => ({
      useFonts: jest.fn(() => [false]),
    }));

    const { queryByText } = render(<RootLayout />);

    // Ensure that no stack screens are rendered
    expect(queryByText('(tabs)')).toBeNull();
    expect(SplashScreen.hideAsync).not.toHaveBeenCalled();
  });

  it('uses the correct theme based on the color scheme', async () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');

    render(<RootLayout />);

    // Verify that the dark theme is used
    expect(ThemeProvider).toHaveBeenCalledWith(
      expect.objectContaining({ value: expect.any(Object) }),
      expect.anything()
    );
  });

  it('prevents the splash screen from auto-hiding on load', () => {
    render(<RootLayout />);

    expect(SplashScreen.preventAutoHideAsync).toHaveBeenCalledTimes(1);
  });
});
