import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Pagination from '../components/Pagination/Pagination';

describe('Pagination Component', () => {
  const setup = (props) => {
    return render(<Pagination {...props} />);
  };

  test('renders Pagination component with correct number of pages', async () => {
    const props = {
      filteredDevices: new Array(50).fill(null),
      devicesPerPage: 10,
      currentPage: 1,
      paginate: jest.fn(),
    };

    await act(async () => {
      setup(props);
    });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('6')).not.toBeInTheDocument();
  });

  test('renders ellipsis for large number of pages', async () => {
    const props = {
      filteredDevices: new Array(100).fill(null),
      devicesPerPage: 10,
      currentPage: 1,
      paginate: jest.fn(),
    };

    await act(async () => {
      setup(props);
    });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('calls paginate function when page number is clicked', async () => {
    const paginateMock = jest.fn();
    const props = {
      filteredDevices: new Array(50).fill(null),
      devicesPerPage: 10,
      currentPage: 1,
      paginate: paginateMock,
    };

    await act(async () => {
      setup(props);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('2'));
    });

    expect(paginateMock).toHaveBeenCalledWith(2);
  });

  test('disables ellipsis buttons', async () => {
    const props = {
      filteredDevices: new Array(100).fill(null),
      devicesPerPage: 10,
      currentPage: 1,
      paginate: jest.fn(),
    };

    await act(async () => {
      setup(props);
    });

    const ellipsisButtons = screen.getAllByText('...');
    ellipsisButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  test('navigates to previous and next pages', async () => {
    const paginateMock = jest.fn();
    const props = {
      filteredDevices: new Array(50).fill(null),
      devicesPerPage: 10,
      currentPage: 3,
      paginate: paginateMock,
    };

    await act(async () => {
      setup(props);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('«'));
    });

    expect(paginateMock).toHaveBeenCalledWith(2);

    await act(async () => {
      fireEvent.click(screen.getByText('»'));
    });

    expect(paginateMock).toHaveBeenCalledWith(4);
  });
});
