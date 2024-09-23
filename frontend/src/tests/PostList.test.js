import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import PostsList from '../components/Posts/PostsList';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

// Mock axios
jest.mock('axios');

// Mock js-cookie
jest.mock('js-cookie');

describe('PostsList Component', () => {
  const mockPosts = [
    {
      _id: '1',
      title: 'Test Post 1',
      content: 'Content 1',
      authorId: 'user1',
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      _id: '2',
      title: 'Test Post 2',
      content: 'Content 2',
      authorId: 'user2',
      createdAt: '2023-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    Cookies.get.mockReturnValue('user1');
    axios.get.mockResolvedValue({ data: mockPosts });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders PostsList component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <PostsList />
        </BrowserRouter>
      );
    });

    expect(screen.getAllByText('Posts')[0]).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search posts by title or author...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Post' })).toBeInTheDocument();
  });

  test('fetches and displays posts', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <PostsList />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });
  });

  test('opens modal to create a new post', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <PostsList />
        </BrowserRouter>
      );
    });

    const createPostButton = screen.getByRole('button', { name: 'Create Post' });
    await act(async () => {
      fireEvent.click(createPostButton);
    });

    expect(screen.getByRole('heading', { name: 'Create Post' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
  });

  test('filters posts by search term', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <PostsList />
        </BrowserRouter>
      );
    });

    const searchBar = screen.getByPlaceholderText('Search posts by title or author...');
    await act(async () => {
      fireEvent.change(searchBar, { target: { value: 'Test Post 1' } });
    });

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Post 2')).not.toBeInTheDocument();
  });

  test('filters posts to show only user\'s posts', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <PostsList />
        </BrowserRouter>
      );
    });

    const filterButton = screen.getByText('Show My Posts');
    await act(async () => {
      fireEvent.click(filterButton);
    });

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Post 2')).not.toBeInTheDocument();
  });

  test('handles delete post', async () => {
    axios.delete.mockResolvedValue({ data: { message: 'Post deleted successfully' } });

    await act(async () => {
      render(
        <BrowserRouter>
          <PostsList />
        </BrowserRouter>
      );
    });

    const deleteButton = screen.getByText('Delete');
    window.confirm = jest.fn().mockImplementation(() => true);

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/posts/1`);
    });

    expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument();
  });
});