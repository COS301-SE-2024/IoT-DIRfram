import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [responses, setResponses] = useState([]);
  const [newResponse, setNewResponse] = useState('');

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postResponse = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
        setPost(postResponse.data.post);
        console.log(postResponse);
        setResponses(postResponse.data.responses);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleAddResponse = async (e) => {
    e.preventDefault();
    try {
      const currentUserId = Cookies.get("username"); // Replace with actual user ID
      await axios.post(`${process.env.REACT_APP_API_URL}/posts/responses`, {
        postId,
        content: newResponse,
        authorId: currentUserId,
      });

      setResponses([...responses, { content: newResponse, authorId: currentUserId }]);
      setNewResponse('');
    } catch (error) {
      console.error('Error adding response:', error);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <h6>{post.authorId}</h6>
      <br/>
      <h2>Responses</h2>
      <ul>
        {responses.map((response, index) => (
          <li key={index}>{response.content} - {response.authorId}</li>
        ))}
      </ul>
      <form onSubmit={handleAddResponse}>
        <textarea
          value={newResponse}
          onChange={(e) => setNewResponse(e.target.value)}
          placeholder="Add a response"
          required
        />
        <button type="submit">Submit Response</button>
      </form>
    </div>
  );
};

export default PostDetails;
