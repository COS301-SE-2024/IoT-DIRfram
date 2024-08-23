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
                createdAt: new Date(),
                likes: [],
                dislikes: []
            };
    
            // Insert the new response into the database
            const result = await db.collection('Responses').insertOne(newResponse);
    
            // Retrieve the newly created response with the generated _id
            const createdResponse = await db.collection('Responses').findOne({ _id: result.insertedId });
    
            if (!createdResponse) {
                return res.status(404).json({ error: 'Response not found' });
            }
    
            // Respond with the newly created response
            res.status(201).json(createdResponse);
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
            // console.log(responses);

            res.json({ post, responses });
        } catch (err) {
            console.error('Error fetching post details:', err);
            res.status(500).json({ error: 'Failed to fetch post details' });
        }
    });

    // POST /responses/:responseId/like
    router.post('/responses/:responseId/like', async (req, res) => {
        try {
            const { responseId } = req.params;
            const { userId } = req.body;

            if (!ObjectId.isValid(responseId)) {
                return res.status(400).json({ error: 'Invalid response ID' });
            }

            const response = await db.collection('Responses').findOne({ _id: new ObjectId(responseId) });
            if (!response) {
                return res.status(404).json({ message: 'Response not found' });
            }

            // Remove user from dislikes if they previously disliked
            await db.collection('Responses').updateOne(
                { _id: new ObjectId(responseId) },
                { $pull: { dislikes: userId } }
            );

            // Add user to likes if not already liked
            await db.collection('Responses').updateOne(
                { _id: new ObjectId(responseId) },
                { $addToSet: { likes: userId } }
            );

            res.status(200).json({ message: 'Response liked' });
        } catch (err) {
            console.error('Error liking response:', err);
            res.status(500).json({ error: 'Failed to like response' });
        }
    });

    // POST /responses/:responseId/dislike
    router.post('/responses/:responseId/dislike', async (req, res) => {
        try {
            const { responseId } = req.params;
            const { userId } = req.body;

            if (!ObjectId.isValid(responseId)) {
                return res.status(400).json({ error: 'Invalid response ID' });
            }

            const response = await db.collection('Responses').findOne({ _id: new ObjectId(responseId) });
            if (!response) {
                return res.status(404).json({ message: 'Response not found' });
            }

            // Remove user from likes if they previously liked
            await db.collection('Responses').updateOne(
                { _id: new ObjectId(responseId) },
                { $pull: { likes: userId } }
            );

            // Add user to dislikes if not already disliked
            await db.collection('Responses').updateOne(
                { _id: new ObjectId(responseId) },
                { $addToSet: { dislikes: userId } }
            );

            res.status(200).json({ message: 'Response disliked' });
        } catch (err) {
            console.error('Error disliking response:', err);
            res.status(500).json({ error: 'Failed to dislike response' });
        }
    });

    // POST /responses/:responseId/unlike
router.post('/responses/:responseId/unlike', async (req, res) => {
    try {
        const { responseId } = req.params;
        const { userId } = req.body;

        if (!ObjectId.isValid(responseId)) {
            return res.status(400).json({ error: 'Invalid response ID' });
        }

        const response = await db.collection('Responses').findOne({ _id: new ObjectId(responseId) });
        if (!response) {
            return res.status(404).json({ message: 'Response not found' });
        }

        // Remove user from likes if they previously liked
        const result = await db.collection('Responses').updateOne(
            { _id: new ObjectId(responseId) },
            { $pull: { likes: userId } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'User has not liked this response' });
        }

        res.status(200).json({ message: 'Like removed' });
    } catch (err) {
        console.error('Error removing like:', err);
        res.status(500).json({ error: 'Failed to remove like' });
    }
});

// POST /responses/:responseId/undislike
router.post('/responses/:responseId/undislike', async (req, res) => {
    try {
        const { responseId } = req.params;
        const { userId } = req.body;

        if (!ObjectId.isValid(responseId)) {
            return res.status(400).json({ error: 'Invalid response ID' });
        }

        const response = await db.collection('Responses').findOne({ _id: new ObjectId(responseId) });
        if (!response) {
            return res.status(404).json({ message: 'Response not found' });
        }

        // Remove user from dislikes if they previously disliked
        const result = await db.collection('Responses').updateOne(
            { _id: new ObjectId(responseId) },
            { $pull: { dislikes: userId } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'User has not disliked this response' });
        }

        res.status(200).json({ message: 'Dislike removed' });
    } catch (err) {
        console.error('Error removing dislike:', err);
        res.status(500).json({ error: 'Failed to remove dislike' });
    }
});

    return router;
};
