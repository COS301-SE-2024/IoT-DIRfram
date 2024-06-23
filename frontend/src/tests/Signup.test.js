import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../pages/Signup/Signup';
import '@testing-library/jest-dom/extend-expect'; // for additional matchers

// Mock fetch API
global.fetch = jest.fn((url) => {
  if (url.includes('/auth/check-username')) {
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({}),
    });
  }
  if (url.includes('/auth/check-email')) {
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({}),
    });
  }
  if (url.includes('/auth/register')) {
    return Promise.resolve({
      status: 201,
      json: () => Promise.resolve({ message: 'User registered' }),
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

describe('Signup Component', () => {
  test('renders signup form', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('allows user to type into input fields', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

    expect(screen.getByLabelText(/username/i).value).toBe('testuser');
    expect(screen.getByLabelText(/email/i).value).toBe('testuser@example.com');
    expect(screen.getByLabelText('Password').value).toBe('password123');
    expect(screen.getByLabelText('Confirm Password').value).toBe('password123');
  });

  test('checks username and email availability', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'testuser@example.com' } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/check-username'), expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/check-email'), expect.any(Object));
    });
  });

  test('submits the form', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/register'), expect.any(Object));
      expect(console.log).toHaveBeenCalledWith('Form submitted:', {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });
});
