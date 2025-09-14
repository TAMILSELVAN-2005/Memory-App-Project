import express from 'express';
import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';
import User from '../models/user.js';

const router = express.Router();

export const getPosts = async (req, res) => { 
    try {
        const { page = 1, limit = 8, tag, search } = req.query;
        
        let query = {};
        
        // Search by tag
        if (tag) {
            query.tags = { $in: [tag] };
        }
        
        // Search by title or message
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }
        
        const postMessages = await PostMessage.find(query)
            .populate('creator', 'name avatar')
            .populate('likes', 'name avatar')
            .populate('comments.user', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
                
        const total = await PostMessage.countDocuments(query);
        
        res.status(200).json({
            posts: postMessages,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const searchPosts = async (req, res) => {
    try {
        const { q, tag } = req.query;
        
        let query = {};
        
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { message: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ];
        }
        
        if (tag) {
            query.tags = { $in: [tag] };
        }
        
        const posts = await PostMessage.find(query)
            .populate('creator', 'name avatar')
            .populate('likes', 'name avatar')
            .populate('comments.user', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(20);
        
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id)
            .populate('creator', 'name avatar')
            .populate('likes', 'name avatar')
            .populate('comments.user', 'name avatar');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    try {
        const { title, message, selectedFile, tags } = req.body;
        const creator = req.user.id;

        const newPostMessage = new PostMessage({ 
            title, 
            message, 
            selectedFile, 
            creator,
            creatorName: req.user.name,
            tags 
        });

        await newPostMessage.save();
        
        const populatedPost = await PostMessage.findById(newPostMessage._id)
            .populate('creator', 'name avatar');

        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No post with id: ${id}` });
    }

    try {
        const updatedPost = await PostMessage.findByIdAndUpdate(
            id, 
            { title, message, tags, selectedFile }, 
            { new: true }
        ).populate('creator', 'name avatar');

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No post with id: ${id}` });
    }

    try {
        await PostMessage.findByIdAndDelete(id);
        res.json({ message: "Post deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const likePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No post with id: ${id}` });
    }
    
    try {
        const post = await PostMessage.findById(id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Ensure likes array exists
        if (!post.likes) {
            post.likes = [];
        }

        const likeIndex = post.likes.findIndex(like => like.toString() === userId.toString());
        
        if (likeIndex === -1) {
            // Like the post
            post.likes.push(userId);
            post.likeCount = post.likes.length;
        } else {
            // Unlike the post
            post.likes.splice(likeIndex, 1);
            post.likeCount = post.likes.length;
        }

        const updatedPost = await post.save();
        const populatedPost = await PostMessage.findById(id)
            .populate('creator', 'name avatar')
            .populate('likes', 'name avatar')
            .populate('comments.user', 'name avatar');
        
        res.json(populatedPost);
    } catch (error) {
        console.error('Error in likePost:', error);
        res.status(500).json({ message: error.message });
    }
}

export const addComment = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No post with id: ${id}` });
    }

    try {
        const post = await PostMessage.findById(id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            user: userId,
            text,
            name: req.user.name,
            avatar: req.user.avatar || ''
        };

        post.comments.unshift(newComment);
        await post.save();

        const populatedPost = await PostMessage.findById(id)
            .populate('creator', 'name avatar')
            .populate('likes', 'name avatar')
            .populate('comments.user', 'name avatar');

        res.json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeComment = async (req, res) => {
    const { id, commentId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No post with id: ${id}` });
    }

    try {
        const post = await PostMessage.findById(id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.find(comment => comment._id.toString() === commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is comment owner or admin
        if (comment.user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        const removeIndex = post.comments.map(comment => comment._id.toString()).indexOf(commentId);
        post.comments.splice(removeIndex, 1);
        await post.save();

        const populatedPost = await PostMessage.findById(id)
            .populate('creator', 'name avatar')
            .populate('likes', 'name avatar')
            .populate('comments.user', 'name avatar');

        res.json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default router;