import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login/Login';
import '@testing-library/jest-dom/extend-expect'; // for additional matchers

// Mock fetch API
global.fetch = jest.fn((url) => {
  if (url.includes('/auth/login')) {
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ message: 'Login successful', sessionId: 'dummy-session-id' }),
    });
  }
  return Promise.reject(new Error('Unknown API endpoint'));
});

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  window.alert = jest.fn();
});

afterAll(() => {
  console.log.mockRestore();
  window.alert.mockRestore();
  global.fetch.mockRestore();
});

describe('Login Component', () => {
  test('renders login form', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows user to type into input fields', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    expect(screen.getByLabelText(/username/i).value).toBe('testuser');
    expect(screen.getByLabelText(/password/i).value).toBe('password123');
  });

  test('displays error message on invalid credentials', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        status: 400,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      })
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
