import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HapticTab } from '@/components/HapticTab'; // Adjust the import path
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Mocking expo-haptics's impactAsync
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
}));

describe('HapticTab', () => {
  const mockOnPressIn = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(
      <HapticTab onPressIn={mockOnPressIn} testID="haptic-tab-button" children={undefined} />
    );

    const button = getByTestId('haptic-tab-button');
    expect(button).toBeTruthy();
  });

  it('triggers haptic feedback on iOS platform', () => {
    // Simulate iOS platform
    Platform.OS = 'ios';

    const { getByTestId } = render(
      <HapticTab onPressIn={mockOnPressIn} testID="haptic-tab-button" children={undefined} />
    );

    const button = getByTestId('haptic-tab-button');
    
    // Simulate the onPressIn event
    fireEvent.press(button);

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('does not trigger haptic feedback on non-iOS platforms', () => {
    // Simulate non-iOS platform (e.g., Android)
    Platform.OS = 'android';

    const { getByTestId } = render(
      <HapticTab onPressIn={mockOnPressIn} testID="haptic-tab-button" children={undefined} />
    );

    const button = getByTestId('haptic-tab-button');
    
    // Simulate the onPressIn event
    fireEvent.press(button);

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('calls onPressIn prop function when pressed', () => {
    Platform.OS = 'ios'; // Simulate iOS platform

    const { getByTestId } = render(
      <HapticTab onPressIn={mockOnPressIn} testID="haptic-tab-button" children={undefined} />
    );

    const button = getByTestId('haptic-tab-button');
    
    // Simulate the onPressIn event
    fireEvent.press(button);

    expect(mockOnPressIn).toHaveBeenCalled();
  });
});
