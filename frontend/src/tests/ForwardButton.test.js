import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import ForwardButton from '../components/ForwardButton/ForwardButton';
import { useNavigate } from 'react-router-dom';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ForwardButton Component', () => {
  test('renders ForwardButton component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ForwardButton />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('→')).toBeInTheDocument();
    expect(screen.getByText('Forward')).toBeInTheDocument();
  });

  test('calls navigate with 1 when button is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <ForwardButton />
        </BrowserRouter>
      );
    });

    const button = screen.getByRole('button', { name: /forward/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockNavigate).toHaveBeenCalledWith(1);
  });
});
