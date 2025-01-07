import React from 'react';
import { render } from '@testing-library/react-native';
import { Link } from 'expo-router';
import NotFoundScreen from '../+not-found'; // Sesuaikan path ke file NotFoundScreen

jest.mock('expo-router', () => ({
  Link: jest.fn(({ children, href, style }) => (
    <a href={href} style={style}>
      {children}
    </a>
  )),
  Stack: {
    Screen: jest.fn(({ options }) => <div data-title={options.title} />),
  },
}));

describe('NotFoundScreen', () => {
  it('renders the NotFoundScreen correctly', () => {
    const { getByText, getByRole } = render(<NotFoundScreen />);

    // Verifikasi judul layar
    const screenTitle = getByRole('div');
    expect(screenTitle).toHaveAttribute('data-title', 'Oops!');

    // Verifikasi teks utama
    const mainText = getByText("This screen doesn't exist.");
    expect(mainText).toBeTruthy();

    // Verifikasi tautan
    const link = getByText('Go to home screen!');
    expect(link).toBeTruthy();
    expect(link.parentNode).toHaveAttribute('href', '/');
  });
});
