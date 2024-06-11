//testing if preloader actually renders and also if the login/signup button are rendering correctly

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Splash from '../pages/Splash/Splash';
import '@testing-library/jest-dom/extend-expect'; // for additional matchers

// Mock gsap and preLoaderAnim to avoid actual animations during tests
jest.mock('gsap', () => ({
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    repeat: jest.fn().mockReturnThis(),
  })),
}));

jest.mock('../pages/Splash/SplashAnime', () => ({
  preLoaderAnim: jest.fn(),
  openMenu: jest.fn(),
  closeMenu: jest.fn(),
  fadeUp: jest.fn(),
  mobileLanding: jest.fn(),
  animateShapes: jest.fn(),
  animateMainShape: jest.fn(),
  boxHover: jest.fn(),
  boxExit: jest.fn(),
  fadeIn: jest.fn(),
  fadeOut: jest.fn(),
}));

describe('Splash Component', () => {
  test('renders Preloader initially', () => {
    render(
      <MemoryRouter>
        <Splash />
      </MemoryRouter>
    );
    expect(screen.getByAltText('Code_Crafters_logo')).toBeInTheDocument();
    expect(screen.getByText(/IoT-DIRfram/i)).toBeInTheDocument();
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
    expect(screen.getByText('Welcome to Code Crafters')).toBeInTheDocument();
    expect(screen.getByText(/This project aims to develop software/i)).toBeInTheDocument();
  });
});
