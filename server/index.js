
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

// Add a root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Memories API is running!' });
});

// Add a test route to create a sample post
app.post('/test-post', async (req, res) => {
  try {
    const PostMessage = (await import('./models/postMessage.js')).default;
    const testPost = new PostMessage({
      title: 'Test Post',
      message: 'This is a test post',
      creator: 'Test User',
      tags: ['test'],
      selectedFile: 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png',
      likeCount: 0
    });
    await testPost.save();
    res.json({ message: 'Test post created!', post: testPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/posts', postRoutes);
app.use('/auth', authRoutes);

const CONNECTION_URL = 'mongodb://127.0.0.1:27017/memories'; 
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));