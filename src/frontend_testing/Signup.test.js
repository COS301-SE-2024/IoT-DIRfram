// Signup.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../pages/Signup/Signup';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  window.alert.mockRestore();
});

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

test('submits the form', () => {
  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'testuser@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

  fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

  expect(console.log).toHaveBeenCalledWith('Form submitted:', {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  });
});
