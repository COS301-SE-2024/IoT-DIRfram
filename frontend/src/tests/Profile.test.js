import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Profile from '../pages/Profile/Profile';
import '@testing-library/jest-dom/extend-expect';
import Cookies from 'js-cookie';

jest.mock('../pages/Profile/ProfileConfig', () => ({
  getUserProfile: jest.fn(),
}));

jest.mock('js-cookie');

describe('Profile Component', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  beforeEach(() => {
    Cookies.get.mockImplementation((key) => {
      const cookies = {
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
        age: '30',
      };
      return cookies[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile page with user details', async () => {
    const mockUserData = {
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test',
      surname: 'User',
      age: '30',
    };

    require('../pages/Profile/ProfileConfig').getUserProfile.mockResolvedValue(mockUserData);

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });
  });

  test('displays "None" for missing user details', async () => {
    const mockUserData = {
      username: 'testuser',
      email: '',
      name: '',
      surname: '',
      age: '',
    };

    require('../pages/Profile/ProfileConfig').getUserProfile.mockResolvedValue(mockUserData);

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getAllByText('None').length).toBe(4);
    });
  });

  test('renders edit profile button', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  test('handles API error and falls back to cookie data', async () => {
    require('../pages/Profile/ProfileConfig').getUserProfile.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });
  });
});
