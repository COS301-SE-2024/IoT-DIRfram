import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Sidebar from '../components/Sidebar/Sidebar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock js-cookie
jest.mock('js-cookie');

describe('Sidebar Component', () => {
  const setup = (props) => {
    return render(
      <BrowserRouter>
        <Sidebar {...props} />
      </BrowserRouter>
    );
  };

  test('renders Sidebar component', async () => {
    await act(async () => {
      setup({ isOpen: true, handleToggleSidebar: jest.fn() });
    });

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls handleToggleSidebar when a link is clicked', async () => {
    const handleToggleSidebar = jest.fn();

    await act(async () => {
      setup({ isOpen: true, handleToggleSidebar });
    });

    const dashboardLink = screen.getByText('Dashboard');
    await act(async () => {
      fireEvent.click(dashboardLink);
    });

    expect(handleToggleSidebar).toHaveBeenCalledTimes(1);
  });

  test('calls handleLogout and navigate when logout button is clicked', async () => {
    await act(async () => {
      setup({ isOpen: true, handleToggleSidebar: jest.fn() });
    });

    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    expect(Cookies.remove).toHaveBeenCalledWith('session');
    expect(mockNavigate).toHaveBeenCalledWith('/splash');
  });

  test('renders Sidebar with correct class when isOpen is true', async () => {
    await act(async () => {
      setup({ isOpen: true, handleToggleSidebar: jest.fn() });
    });

    expect(screen.getByRole('navigation').parentElement).toHaveClass('sidebar-open');
  });

  test('renders Sidebar with correct class when isOpen is false', async () => {
    await act(async () => {
      setup({ isOpen: false, handleToggleSidebar: jest.fn() });
    });

    expect(screen.getByRole('navigation').parentElement).toHaveClass('sidebar-closed');
  });
});
