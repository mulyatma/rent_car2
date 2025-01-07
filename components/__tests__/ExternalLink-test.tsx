import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExternalLink } from '@/components/ExternalLink'; // Adjust the import path
import { openBrowserAsync } from 'expo-web-browser';
import { Platform } from 'react-native';

// Mocking expo-web-browser's openBrowserAsync
jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
}));

describe('ExternalLink', () => {
  const mockHref = 'https://example.com';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and passes props', () => {
    const { getByText } = render(
      <ExternalLink href={mockHref}>Click Me</ExternalLink>
    );

    const linkText = getByText('Click Me');
    expect(linkText).toBeTruthy();
  });

  it('opens link in the default browser on web platform', () => {
    // Simulating web platform
    Platform.OS = 'web';

    const { getByText } = render(
      <ExternalLink href={mockHref}>Click Me</ExternalLink>
    );

    const linkText = getByText('Click Me');
    fireEvent.press(linkText);

    expect(openBrowserAsync).not.toHaveBeenCalled(); // Should not call openBrowserAsync on web
  });

  it('opens link in in-app browser on native platforms', async () => {
    // Simulating native platform (e.g., iOS/Android)
    Platform.OS = 'ios'; // Can also use 'android'

    const { getByText } = render(
      <ExternalLink href={mockHref}>Click Me</ExternalLink>
    );

    const linkText = getByText('Click Me');
    fireEvent.press(linkText);

    expect(openBrowserAsync).toHaveBeenCalledWith(mockHref); // Should call openBrowserAsync with the correct URL
  });

  it('prevents default behavior when opening the link on native platforms', async () => {
    // Simulating native platform
    Platform.OS = 'ios';

    const preventDefaultMock = jest.fn();
    const { getByText } = render(
      <ExternalLink href={mockHref}>Click Me</ExternalLink>
    );

    const linkText = getByText('Click Me');
    const event = { preventDefault: preventDefaultMock };

    fireEvent.press(linkText, event);

    expect(preventDefaultMock).toHaveBeenCalled(); // Prevent default behavior should be called on native
    expect(openBrowserAsync).toHaveBeenCalledWith(mockHref); // In-app browser should still open
  });
});
