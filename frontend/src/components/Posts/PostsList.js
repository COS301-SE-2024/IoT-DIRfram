import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Cookies from 'js-cookie';
import Header from '../Header/Header';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import './PostsList.css';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showMyPosts, setShowMyPosts] = useState(false);

  // Replace with the actual current user ID
  const currentUserId = Cookies.get("username");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
        setPosts(response.data);
        // console.log('Posts:', response.data);
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

  const getMyPosts = () => {
    setShowMyPosts(!showMyPosts);
  };

  const filteredPosts = posts.filter(post =>
    (post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.authorId.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!showMyPosts || post.authorId === currentUserId)
  );

  return (
    <div>
      <Header />
      <div className="devices-header">
        <h2 className='devices-title'>Posts</h2>
        <div className='info'>
          <p>
            <small style={{ color: '#B7B5B7' }}>
              <span style={{ color: 'white' }}>HINT:</span> Don't forget to consult our guide if you need help or get stuck 
              <span style={{ color: 'white' }}>*<span style={{ color: '#007BFF' }}>blue icon</span> - bottom right</span>
            </small>
          </p>
          <button onClick={openModal}>Create Post</button>
        </div>
        <input
          type="text"
          placeholder="Search posts by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button onClick={getMyPosts} className="filter-button">
          {showMyPosts ? 'Show All Posts' : 'Show My Posts'}
        </button>
        <hr className="section-break" />
      </div>
      <ul>
        {filteredPosts.length > 0 ? (
          filteredPosts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by most recent
            .map((post, index) => (
              <motion.div 
                key={post._id} 
                className="forum-post card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
              >
                <div className="post-header">
                  <div className="post-title-author">
                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                    <p className="post-details">
                      @{post.authorId} - <cite>{new Date(post.createdAt).toLocaleString()}</cite>
                    </p>
                  </div>
                  {post.authorId === currentUserId && (
                    <div>
                      <p>Your post</p>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="icon-button delete-button"
                      >
                        Delete <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
        ) : (
          <p>No posts match your search.</p>
        )}
      </ul>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-overlay">
        <div className="modal-content">
          <button className="close" onClick={closeModal}>
            &times;
          </button>
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
          <div className="modal-actions">
            <button onClick={handleCreatePost}>Post</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PostsList;