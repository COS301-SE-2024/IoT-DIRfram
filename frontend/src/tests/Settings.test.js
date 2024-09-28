import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import Settings from '../pages/Settings/Settings';
import Cookies from 'js-cookie';

// Mock the modules
jest.mock('../components/Header/Header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('js-cookie');

// Mock fetch
global.fetch = jest.fn();

describe('Settings Component', () => {
  beforeEach(() => {
    Cookies.get.mockReturnValue('testuser');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        notifications: {
          newDataAvailable: true,
          newResponseToPosts: false
        }
      })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Settings component', async () => {
    await act(async () => {
      render(<Settings />);
    });

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByText('Receive an email notification for the following:')).toBeInTheDocument();
    expect(screen.getByText('When new IoT data is uploaded')).toBeInTheDocument();
    expect(screen.getByText("When there's a new response to my posts")).toBeInTheDocument();
  });


  test('calls API to save settings when save button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Settings updated successfully' })
    });

    await act(async () => {
      render(<Settings />);
    });

    const saveButton = screen.getByText('Save Changes');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2); // Once for initial load, once for save
    expect(global.fetch).toHaveBeenLastCalledWith(
      `${process.env.REACT_APP_API_URL}/auth/updateNotifications`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String)
      })
    );
  });
});
