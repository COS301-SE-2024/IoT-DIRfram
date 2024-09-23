import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import EditProfile from '../pages/Edit-Profile/EditProfile';
import Cookies from 'js-cookie';

// Mock the modules
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
jest.mock('js-cookie');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));
jest.mock('../components/Header/Header', () => () => <div data-testid="mock-header">Header</div>);

describe('EditProfile Component', () => {
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

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Profile updated successfully' }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders EditProfile component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <EditProfile />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Change Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Name (optional):')).toBeInTheDocument();
    expect(screen.getByLabelText('Surname (optional):')).toBeInTheDocument();
    expect(screen.getByLabelText('Age (optional):')).toBeInTheDocument();
  });

  test('fills form with user details from cookies', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <EditProfile />
        </BrowserRouter>
      );
    });

    expect(screen.getByLabelText('Username:')).toHaveValue('testuser');
    expect(screen.getByLabelText('Email:')).toHaveValue('test@example.com');
    expect(screen.getByLabelText('Name (optional):')).toHaveValue('Test');
    expect(screen.getByLabelText('Surname (optional):')).toHaveValue('User');
    expect(screen.getByLabelText('Age (optional):')).toHaveValue(30);
  });

  test('toggles password visibility', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <EditProfile />
        </BrowserRouter>
      );
    });

    const passwordInput = screen.getByLabelText('Change Password:');
    const toggleButton = passwordInput.nextElementSibling;

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('submits form with updated details', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <EditProfile />
        </BrowserRouter>
      );
    });

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'newusername' } });
    fireEvent.change(screen.getByLabelText('Change Password:'), { target: { value: 'newpassword' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'newpassword' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'newemail@example.com' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Save'));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/auth/updateUserDetails`,
        expect.any(Object)
      );
    });
  });

  test('shows error when passwords do not match', async () => {
    const { toast } = require('react-toastify');

    await act(async () => {
      render(
        <BrowserRouter>
          <EditProfile />
        </BrowserRouter>
      );
    });

    fireEvent.change(screen.getByLabelText('Change Password:'), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText('Confirm Password:'), { target: { value: 'password2' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Save'));
    });

    expect(toast.error).toHaveBeenCalledWith('Passwords do not match', expect.any(Object));
  });
});
