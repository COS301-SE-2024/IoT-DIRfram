import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RaspberryPi from '../pages/RaspberryPi/RaspberryPi';
import '@testing-library/jest-dom/extend-expect';
import Cookies from 'js-cookie';

// Mock the Header and IOT_DEVICE components
jest.mock('../components/Header/Header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('../components/IOT_DEVICE/IOT_DEVICE', () => ({ deviceId, isAdmin }) => (
  <div data-testid="mock-iot-device">
    IOT_DEVICE: {deviceId}, Admin: {isAdmin.toString()}
  </div>
));

// Mock Cookies
jest.mock('js-cookie');

describe('RaspberryPi Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('renders RaspberryPi component with correct elements', () => {
    Cookies.get.mockImplementation((key) => {
      if (key === 'deviceId') return 'test-device-id';
      if (key === 'isAdmin') return 'true';
      return null;
    });

    render(
      <MemoryRouter>
        <RaspberryPi />
      </MemoryRouter>
    );

    // Check if Header component is rendered
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();

    // Check if the title is rendered
    expect(screen.getByText('IoT Devices')).toBeInTheDocument();

    // Check if the hint text is rendered
    expect(screen.getByText(/HINT:/)).toBeInTheDocument();

    // Check if IOT_DEVICE component is rendered with correct props
    const iotDevice = screen.getByTestId('mock-iot-device');
    expect(iotDevice).toBeInTheDocument();
    expect(iotDevice).toHaveTextContent('IOT_DEVICE: test-device-id, Admin: true');
  });

  test('renders RaspberryPi component with default values when cookies are not set', () => {
    Cookies.get.mockImplementation(() => null);

    render(
      <MemoryRouter>
        <RaspberryPi />
      </MemoryRouter>
    );

    const iotDevice = screen.getByTestId('mock-iot-device');
    expect(iotDevice).toBeInTheDocument();
    expect(iotDevice).toHaveTextContent('IOT_DEVICE: , Admin: false');
  });
});
