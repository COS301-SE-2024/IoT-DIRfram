import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Modal from '../pages/Dashboard/Modal';

describe('Modal Component', () => {
  const mockHandleClose = jest.fn();
  const mockHandleSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when show is false', () => {
    render(<Modal show={false} handleClose={mockHandleClose} handleSave={mockHandleSave} />);
    expect(screen.queryByText('Add Device')).not.toBeInTheDocument();
  });

  test('renders modal content when show is true', () => {
    render(<Modal show={true} handleClose={mockHandleClose} handleSave={mockHandleSave} />);
    expect(screen.getByText('Add Device')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter device serial number')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('calls handleClose when close button is clicked', () => {
    render(<Modal show={true} handleClose={mockHandleClose} handleSave={mockHandleSave} />);
    fireEvent.click(screen.getByText('✖'));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  test('calls handleSave with input value when Save button is clicked', () => {
    render(<Modal show={true} handleClose={mockHandleClose} handleSave={mockHandleSave} />);
    const input = screen.getByPlaceholderText('Enter device serial number');
    fireEvent.change(input, { target: { value: 'test-device-id' } });
    fireEvent.click(screen.getByText('Save'));
    expect(mockHandleSave).toHaveBeenCalledWith('test-device-id');
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  test('calls handleClose when Cancel button is clicked', () => {
    render(<Modal show={true} handleClose={mockHandleClose} handleSave={mockHandleSave} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});
