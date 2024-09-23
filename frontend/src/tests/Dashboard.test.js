import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from '../pages/Dashboard/Dashboard';

// Mocking the components and modules
jest.mock('../components/Header/Header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('../components/Device/Device', () => () => <div data-testid="mock-device">Device</div>);
jest.mock('js-cookie');
jest.mock('../pages/Dashboard/Modal', () => ({ show, handleClose, handleSave }) => (
  show ? (
    <div data-testid="mock-modal">
      Modal
      <button onClick={handleClose}>Close</button>
      <button onClick={() => handleSave('test-device-id')}>Save</button>
    </div>
  ) : null
));

// Mocking fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Device added successfully' }),
  })
);

// Mocking window.location.reload
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true
});

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Dashboard component', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByText('Devices')).toBeInTheDocument();
    expect(screen.getByText('Add device')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-device')).toBeInTheDocument();
  });

  test('opens modal when Add device button is clicked', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    fireEvent.click(screen.getByText('Add device'));
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    fireEvent.click(screen.getByText('Add device'));
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    });
  });

  test('calls handleSaveDevice when save button is clicked', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    fireEvent.click(screen.getByText('Add device'));
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/device/addDeviceToUser`,
        expect.any(Object)
      );
      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });
});
