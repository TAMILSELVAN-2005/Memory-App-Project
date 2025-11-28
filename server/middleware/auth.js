// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import PostMessage from '../models/postMessage.js'; // sync import for ownerAuth
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key_12345';

export const auth = (req, res, next) => {
  try {
    const header =
      req.headers.authorization ||
      req.headers.Authorization ||
      req.headers['x-access-token'];

    // Logging (helpful in Render logs)
    console.log('auth middleware - header present?', Boolean(header));

    if (!header) {
      return res.status(401).json({ message: 'No auth header provided' });
    }

    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : header;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // expose both shapes for compatibility
      req.userId = decoded?.id || decoded?._id || decoded?.userId || null;
      req.user = decoded || null;
      console.log('auth middleware - decoded id:', req.userId);
      return next();
    } catch (err) {
      console.error('auth middleware - token verify error:', err.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (err) {
    console.error('auth middleware unexpected error:', err);
    return res.status(500).json({ message: 'Auth middleware error' });
  }
};

export const adminAuth = (req, res, next) => {
  try {
    // Ensure auth has run or run it inline
    if (!req.user && !req.userId) {
      return auth(req, res, () => {});
    }

    const role = req.user?.role;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    return next();
  } catch (err) {
    console.error('adminAuth error:', err);
    return res.status(500).json({ message: 'Admin auth error' });
  }
};

export const ownerAuth = async (req, res, next) => {
  try {
    // ensure auth has run
    if (!req.user && !req.userId) {
      await new Promise((resolve) => auth(req, res, resolve));
      if (!req.user && !req.userId) return; // auth already sent response
    }

    // admins can do everything
    if (req.user?.role === 'admin') return next();

    const postId = req.params.id;
    if (!postId) return res.status(400).json({ message: 'Post id required' });

    const post = await PostMessage.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // post.creator may be string id or object
    const ownerId = (post.creator && typeof post.creator === 'string')
      ? post.creator
      : (post.creator?._id || post.creator?.toString());

    if (!ownerId) {
      console.warn('ownerAuth: post has no creator field', postId);
      return res.status(403).json({ message: 'Access denied. Owner not found.' });
    }

    const requesterId = (req.userId || req.user?.id || req.user?._id)?.toString();

    if (ownerId.toString() !== requesterId) {
      return res.status(403).json({ message: 'Access denied. You can only modify your own posts.' });
    }

    // attach post for downstream use
    req.post = post;
    return next();
  } catch (err) {
    console.error('ownerAuth error:', err);
    return res.status(500).json({ message: 'Owner auth error' });
  }
};
