import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../Header/Header';
import './PostDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp, faThumbsDown as regularThumbsDown } from '@fortawesome/free-regular-svg-icons';

const PostDetails = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [responses, setResponses] = useState([]);
    const [newResponse, setNewResponse] = useState('');
    const currentUserId = Cookies.get("username"); // Replace with actual user ID

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const postResponse = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
                const fetchedResponses = postResponse.data.responses;
                // console.log(fetchedResponses);//debug
                // Calculate netLikes and sort responses
                const sortedResponses = fetchedResponses
                    .map(response => ({
                        ...response,
                        netLikes: (response.likes?.length || 0) - (response.dislikes?.length || 0)
                    }))
                    .sort((a, b) => b.netLikes - a.netLikes);
                setPost(postResponse.data.post);
                // console.log('Post:', postResponse.data.post);
                setResponses(sortedResponses);
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };

        fetchPostDetails();
    }, [postId]);

    const handleAddResponse = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post(`${process.env.REACT_APP_API_URL}/posts/responses`, {
                postId,
                content: newResponse,
                authorId: currentUserId,
            });
            // console.log(result.data);//debug
            const newData = result.data;

            // Add the new response to the state
            setResponses([...responses, newData]);
            setNewResponse('');
        } catch (error) {
            console.error('Error adding response:', error);
        }
    };

    const handleDeleteResponse = async (responseId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/posts/responses/${responseId}`, {
                data: { username: currentUserId }
            });
            setResponses(responses.filter(response => response._id !== responseId));
        } catch (error) {
            console.error('Error deleting response:', error);
        }
    };

    const toggleLike = async (responseId, hasLiked) => {
        try {
            if (hasLiked) {
                // Remove the like
                await axios.post(`${process.env.REACT_APP_API_URL}/posts/responses/${responseId}/unlike`, { userId: currentUserId });

                const updatedResponses = responses.map(response => {
                    if (response._id === responseId) {
                        return {
                            ...response,
                            likes: response.likes?.filter(id => id !== currentUserId),
                        };
                    }
                    return response;
                });
                setResponses(updatedResponses);
            } else {
                // Add the like
                await axios.post(`${process.env.REACT_APP_API_URL}/posts/responses/${responseId}/like`, { userId: currentUserId });

                const updatedResponses = responses.map(response => {
                    if (response._id === responseId) {
                        const dislikes = Array.isArray(response.dislikes) ? response.dislikes : [];

                        return {
                            ...response,
                            likes: [...response.likes, currentUserId],
                            dislikes: dislikes.filter(id => id !== currentUserId)
                        };
                    }
                    return response;
                });
                setResponses(updatedResponses);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const toggleDislike = async (responseId, hasDisliked) => {
        try {
            if (hasDisliked) {
                // Remove the dislike
                await axios.post(`${process.env.REACT_APP_API_URL}/posts/responses/${responseId}/undislike`, { userId: currentUserId });

                const updatedResponses = responses.map(response => {
                    if (response._id === responseId) {
                        return {
                            ...response,
                            dislikes: response.dislikes?.filter(id => id !== currentUserId),
                        };
                    }
                    return response;
                });
                setResponses(updatedResponses);
            } else {
                // Add the dislike
                await axios.post(`${process.env.REACT_APP_API_URL}/posts/responses/${responseId}/dislike`, { userId: currentUserId });

                const updatedResponses = responses.map(response => {
                    if (response._id === responseId) {
                        const likes = Array.isArray(response.likes) ? response.likes : [];

                        return {
                            ...response,
                            dislikes: [...response?.dislikes, currentUserId],
                            likes: likes.filter(id => id !== currentUserId)
                        };
                    }
                    return response;
                });
                setResponses(updatedResponses);
            }
        } catch (error) {
            console.error('Error toggling dislike:', error);
        }
    };

    if (!post) return <p>Loading...</p>;

    return (
        <div>
            <Header />
            <div className="post-container">
                <div className="post-header">
                    <h1 className="post-title">{post.title}</h1>
                    <span className="post-author">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <p className="post-content">{post.content}</p>
                <h6 className="post-author" id='username'> @{post.authorId}</h6>
                <div className="post-divider"></div>
            </div>

            <form onSubmit={handleAddResponse} className="response-form">
                <label htmlFor="response" className="response-label">Add a response:</label>
                <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Add a response"
                    required
                    className="response-textarea"
                />
                <button type="submit" className="submit-button">Submit Response</button>
            </form>
            <h2>Responses</h2>
            <ul>
                {responses.map((response, index) => {
                    const likeCount = response.likes?.length || 0;
                    const dislikeCount = response.dislikes?.length || 0;
                    const netLikes = likeCount - dislikeCount;
                    const hasLiked = response.likes?.includes(currentUserId);
                    const hasDisliked = response.dislikes?.includes(currentUserId);

                    return (
                        <div key={index} className='post-response'>
                            <div className="response-header">
                                <h4>@{response.authorId}'s response:</h4>
                                <span className="response-date">{new Date(response.createdAt).toLocaleString()}</span>
                            </div>
                            <p>{response.content} </p>
                            <button
                                onClick={() => toggleLike(response._id, hasLiked)}
                                className={`like-button ${hasLiked ? 'liked' : ''}`}
                            >
                                <FontAwesomeIcon icon={hasLiked ? faThumbsUp : regularThumbsUp} size='xs' />
                            </button>
                            <button
                                onClick={() => toggleDislike(response._id, hasDisliked)}
                                className={`dislike-button ${hasDisliked ? 'disliked' : ''}`}
                            >
                                <FontAwesomeIcon icon={hasDisliked ? faThumbsDown : regularThumbsDown} size='xs' />
                            </button>
                            {response.authorId === currentUserId && (
                                <button
                                    onClick={() => handleDeleteResponse(response._id)}
                                    className="delete-button"
                                    title="You can delete your own response"
                                >
                                    <FontAwesomeIcon icon={faTrash} size='xs' />
                                </button>
                            )}
                            <hr />
                            <span>
                                <h6 style={{ color: netLikes >= 0 ? 'green' : 'red' }}>
                                    {netLikes >= 0 ? netLikes + ' user(s) found this helpful' : Math.abs(netLikes) + ' user(s) found this unhelpful'}
                                </h6>
                            </span>
                        </div>
                    );
                })}
            </ul>

        </div>
    );
};

export default PostDetails;