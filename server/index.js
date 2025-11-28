// server/index.js
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// CORS - allow all origins for development. In production set origin to your frontend URL.
app.use(cors({ origin: true, credentials: true }));

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Memories API is running!' });
});

// Health-check route for hosting providers
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Test post route (keeps your previous test)
app.post('/test-post', async (req, res) => {
  try {
    const PostMessage = (await import('./models/postMessage.js')).default;
    const testPost = new PostMessage({
      title: 'Test Post',
      message: 'This is a test post',
      creator: 'Test User',
      tags: ['test'],
      selectedFile:
        'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png',
      likeCount: 0,
    });
    await testPost.save();
    res.json({ message: 'Test post created!', post: testPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// App routes
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);

// Config from env
const CONNECTION_URL =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/memories';
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start the server
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // exit with failure - deploy platforms will log this
  });

// Graceful shutdown (optional but helpful)
process.on('SIGINT', () => {
  console.log('SIGINT received — closing MongoDB connection');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
