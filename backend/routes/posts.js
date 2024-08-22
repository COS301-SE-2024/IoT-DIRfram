const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (client) => {
    const db = client.db('uart_data');
    const clientDB = client.db('Auth');
    const piDevicesCollection = db.collection('pi_devices');
    const usersCollection = clientDB.collection('Users');
    const usersToDevicesCollection = db.collection('users_devices');
    const deviceFilesCollection = db.collection('file_data');

    router.post('/', async (req, res) => {
        try {
            const { title, content, authorId } = req.body;

            const newPost = {
                title,
                content,
                authorId,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await db.collection('Posts').insertOne(newPost);
            res.status(201).json({ message: 'Post created', postId: result.insertedId });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create post' });
        }
    });

    router.get('/', async (req, res) => {
        try {
            const posts = await db.collection('Posts').find().toArray();
            res.json(posts);
        } catch (err) {
            res.status(500).json({ error: 'Failed to get posts' });
        }
    });

    router.post('/responses', async (req, res) => {
        try {
            const { postId, content, authorId } = req.body;

            const newResponse = {
                postId,
                content,
                authorId,
                createdAt: new Date()
            };

            await db.collection('Responses').insertOne(newResponse);
            res.status(201).json({ message: 'Response created' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to create response' });
        }
    });

    router.delete('/:postId', async (req, res) => {
        try {
            const { postId } = req.params;

            // First delete all responses related to the post
            await db.collection('Responses').deleteMany({ postId });

            // Then delete the post
            const result = await db.collection('Posts').deleteOne({ _id: new ObjectId(postId) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Post not found' });
            }

            res.status(200).json({ message: 'Post deleted' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete post' });
        }
    });

    // Get post details along with responses
    router.get('/:postId', async (req, res) => {
        try {
            const { postId } = req.params;

            // Ensure the ID is a valid ObjectId
            if (!ObjectId.isValid(postId)) {
                return res.status(400).json({ error: 'Invalid post ID' });
            }

            // Convert string to ObjectId
            const objectId = new ObjectId(postId);

            // Find the post
            const post = await db.collection('Posts').findOne({ _id: objectId });
            // console.log(post);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Find the responses related to this post
            const responses = await db.collection('Responses').find({ postId: postId }).toArray();
             console.log(responses);

            res.json({ post, responses });
        } catch (err) {
            console.error('Error fetching post details:', err);
            res.status(500).json({ error: 'Failed to fetch post details' });
        }
    });

    return router;
};
