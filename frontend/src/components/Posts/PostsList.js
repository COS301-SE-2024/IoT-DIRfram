import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Cookies from 'js-cookie';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  // Replace with the actual current user ID
  const currentUserId = Cookies.get("username");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewPost({ title: '', content: '' });
  };

  const handleCreatePost = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/posts`, {
        ...newPost,
        authorId: currentUserId,
      });
      setPosts([...posts, { ...newPost, _id: response.data.postId, authorId: currentUserId }]);
      closeModal();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      <button onClick={openModal}>Create Post</button>
      <ul>
        {posts.map((post) => (
          <div key={post._id}>
            <Link to={`/posts/${post._id}`}>{post.title}</Link>
            {post.authorId === currentUserId && (
              <button onClick={() => handleDeletePost(post._id)}>Delete</button>
            )}
          </div>
        ))}
      </ul>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Create Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <button onClick={handleCreatePost}>Post</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default PostsList;
