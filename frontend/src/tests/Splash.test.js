import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Splash from '../pages/Splash/Splash';
import '@testing-library/jest-dom/extend-expect'; // for additional matchers

jest.mock('../../assets/Raspberrypi1.jpeg', () => 'test-file-stub');
jest.mock('../../assets/Raspberrypi2.jpeg', () => 'test-file-stub');
jest.mock('../../assets/Raspberrypi3.jpeg', () => 'test-file-stub');
jest.mock('../../assets/Raspberrypi4.jpeg', () => 'test-file-stub');

// Mock gsap and preLoaderAnim to avoid actual animations during tests
jest.mock('gsap', () => ({
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    repeat: jest.fn().mockReturnThis(),
  })),
}));

jest.mock('../pages/Splash/SplashAnime', () => ({
  preLoaderAnim: jest.fn().mockResolvedValue(), // Ensure it returns a resolved Promise
  openMenu: jest.fn().mockResolvedValue(), // Ensure it returns a resolved Promise
  closeMenu: jest.fn().mockResolvedValue(), // Ensure it returns a resolved Promise
  fadeUp: jest.fn().mockResolvedValue(), // Ensure it returns a resolved Promise
  mobileLanding: jest.fn().mockResolvedValue(), // Ensure it returns a resolved Promise
  animateShapes: jest.fn().mockResolvedValue(), // Ensure it returns a resolved Promise
  animateMainShape: jest.fn().mockResolvedValue(), // Ensure it returns a resolved Promise
  boxHover: jest.fn().mockResolvedValue(), // Ensure it returns a resolved Promise
  boxExit: jest.fn().mockResolvedValue(), // Ensure it returns a resolved Promise
  fadeIn: jest.fn().mockResolvedValue(), // Ensure it returns a resolved Promise
  fadeOut: jest.fn().mockResolvedValue(), // Ensure it returns a resolved Promise
}));

describe('Splash Component', () => {
  test('renders Preloader initially', () => {
    render(
      <MemoryRouter>
        <Splash />
      </MemoryRouter>
    );
    expect(screen.getByAltText('Code_Crafters_logo')).toBeInTheDocument();
  });

  test('renders Login and Signup buttons', () => {
    render(
      <MemoryRouter>
        <Splash />
      </MemoryRouter>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('renders main content', () => {
    render(
      <MemoryRouter>
        <Splash />
      </MemoryRouter>
    );
    expect(screen.getByText('Welcome to IoT-DIRfram')).toBeInTheDocument();
    expect(screen.getByText(/This project aims to develop software/i)).toBeInTheDocument();
  });
});
