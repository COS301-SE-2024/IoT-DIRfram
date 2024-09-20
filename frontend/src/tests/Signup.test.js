import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../pages/Signup/Signup';
import '@testing-library/jest-dom/extend-expect';

// Mock fetch API
global.fetch = jest.fn((url) => {
  if (url.includes('/auth/check-username') || url.includes('/auth/check-email')) {
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

jest.useFakeTimers();

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  window.alert = jest.fn();
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
  window.alert.mockRestore();
  jest.clearAllTimers();
});

describe('Signup Component', () => {
  test('renders signup form', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('allows user to type into input fields', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      );
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'testuser@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    });

    expect(screen.getByLabelText(/username/i)).toHaveValue('testuser');
    expect(screen.getByLabelText(/email/i)).toHaveValue('testuser@example.com');
    expect(screen.getByLabelText('Password')).toHaveValue('password123');
    expect(screen.getByLabelText('Confirm Password')).toHaveValue('password123');
  });

  test('checks username and email availability', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      );
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'testuser@example.com' } });
    });

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/check-username'), expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/check-email'), expect.any(Object));
    });
  });

  // test('submits the form', async () => {
  //   await act(async () => {
  //     render(
  //       <MemoryRouter>
  //         <Signup />
  //       </MemoryRouter>
  //     );
  //   });

  //   await act(async () => {
  //     fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  //     fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'testuser@example.com' } });
  //     fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
  //     fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
  //   });

  //   await act(async () => {
  //     fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
  //   });

  //   await act(async () => {
  //     jest.runAllTimers();
  //   });

  //   await waitFor(() => {
  //     expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/register'), expect.any(Object));
  //   });

  //   // Check if the console log was called with 'Success:'
  //   await waitFor(() => {
  //     expect(console.log).toHaveBeenCalledWith('Success:', expect.any(Object));
  //   });
  // });
});
