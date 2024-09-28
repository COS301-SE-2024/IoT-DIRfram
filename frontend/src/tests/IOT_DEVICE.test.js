import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import IoT_Device from '../components/IOT_DEVICE/IOT_DEVICE';
import { ToastContainer } from 'react-toastify';

// Mock axios
jest.mock('axios');

// Mock the modules
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart">Line Chart</div>,
}));

describe('IoT_Device Component', () => {
  const mockDeviceData = [
    {
      _id: '1',
      filename: 'testfile1.txt',
      content: 'Device content 1\n\n\nFirmware and Chip information 1',
      voltage: [1.0, 2.0, 3.0],
      device_name: 'Device 1',
    },
    {
      _id: '2',
      filename: 'testfile2.txt',
      content: 'Device content 2\n\n\nFirmware and Chip information 2',
      voltage: [2.0, 3.0, 4.0],
      device_name: 'Device 2',
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockDeviceData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders IoT_Device component', async () => {
    await act(async () => {
      render(<IoT_Device deviceId="test-device-id" isAdmin="true" />);
    });

    expect(screen.getByText('From:')).toBeInTheDocument();
    expect(screen.getByText('To:')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('IoT Device 1'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('IoT Device 2'))).toBeInTheDocument();
  });

  test('fetches and displays device data', async () => {
    await act(async () => {
      render(<IoT_Device deviceId="test-device-id" isAdmin="true" />);
    });

    await waitFor(() => {
      expect(screen.getByText((content, element) => content.includes('IoT Device 1'))).toBeInTheDocument();
      expect(screen.getByText((content, element) => content.includes('IoT Device 2'))).toBeInTheDocument();
    });
  });

  test('opens modal with device details when device is clicked', async () => {
    await act(async () => {
      render(<IoT_Device deviceId="test-device-id" isAdmin="true" />);
    });

    const deviceItem = screen.getByText((content, element) => content.includes('IoT Device 1'));
    await act(async () => {
      fireEvent.click(deviceItem);
    });

    expect(screen.getByText('Device Details')).toBeInTheDocument();
    expect(screen.getByText('Firmware and Chip information 1')).toBeInTheDocument();
    expect(screen.getByText('Current Data')).toBeInTheDocument();
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });

//   test('handles delete device', async () => {
//     axios.delete.mockResolvedValue({ data: { message: 'Device deleted successfully' } });

//     await act(async () => {
//       render(<IoT_Device deviceId="test-device-id" isAdmin="true" />);
//     });

//     const deviceItem = screen.getByText((content, element) => content.includes('IoT Device 1'));
//     await act(async () => {
//       fireEvent.click(deviceItem);
//     });

//     const deleteButton = screen.getByText('Delete Info');
//     window.confirm = jest.fn().mockImplementation(() => true);

//     await act(async () => {
//       fireEvent.click(deleteButton);
//     });

//     await waitFor(() => {
//       expect(axios.delete).toHaveBeenCalledWith('http://localhost:3001/device/deleteFile', {
//         data: { file_id: '1' },
//       });
//     });

//     expect(screen.queryByText((content, element) => content.includes('IoT Device 1'))).not.toBeInTheDocument();
//   });
});
