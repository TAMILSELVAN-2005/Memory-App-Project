import express from 'express';
import { auth, ownerAuth } from '../middleware/auth.js';
import { 
    getPosts, 
    getPost, 
    createPost, 
    updatePost, 
    likePost, 
    deletePost,
    searchPosts,
    addComment,
    removeComment
} from '../controllers/posts.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', auth, createPost);
router.patch('/:id', ownerAuth, updatePost);
router.delete('/:id', ownerAuth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/comments', auth, addComment);
router.delete('/:id/comments/:commentId', auth, removeComment);

export default router;