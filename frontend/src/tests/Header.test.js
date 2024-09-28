import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import Header from '../components/Header/Header';
import BackButton from '../components/BackButton/BackButton';
import ForwardButton from '../components/ForwardButton/ForwardButton';
import Sidebar from '../components/Sidebar/Sidebar';

// Mock the components and modules
jest.mock('../components/BackButton/BackButton', () => () => <div data-testid="mock-back-button">BackButton</div>);
jest.mock('../components/ForwardButton/ForwardButton', () => () => <div data-testid="mock-forward-button">ForwardButton</div>);
jest.mock('../components/Sidebar/Sidebar', () => ({ isOpen, handleToggleSidebar }) => (
  <div data-testid="mock-sidebar" className={isOpen ? 'open' : ''}>
    Sidebar
    <button onClick={handleToggleSidebar}>Close</button>
  </div>
));

describe('Header Component', () => {
  test('renders Header component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('IoT-DIRfram')).toBeInTheDocument();
    expect(screen.getByAltText('Code_Crafters_logo')).toBeInTheDocument();
    expect(screen.getByTestId('mock-back-button')).toBeInTheDocument();
    expect(screen.getByTestId('mock-forward-button')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('toggles sidebar when menu button is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );
    });

    const menuButton = screen.getByText('Menu');
    expect(screen.getByTestId('mock-sidebar')).not.toHaveClass('open');

    await act(async () => {
      fireEvent.click(menuButton);
    });

    expect(screen.getByTestId('mock-sidebar')).toHaveClass('open');

    await act(async () => {
      fireEvent.click(screen.getByText('Close'));
    });

    expect(screen.getByTestId('mock-sidebar')).not.toHaveClass('open');
  });
});
