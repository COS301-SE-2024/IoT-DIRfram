import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import BackButton from '../components/BackButton/BackButton';
import { useNavigate } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('BackButton Component', () => {
  test('renders BackButton component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <BackButton />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('←')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  test('calls navigate with -1 when button is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <BackButton />
        </BrowserRouter>
      );
    });

    const button = screen.getByRole('button', { name: /back/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
