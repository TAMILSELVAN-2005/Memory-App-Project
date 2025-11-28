import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key_12345';

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {});
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authorization failed' });
    }
};

export const ownerAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {});
        
        // Check if user is admin or the owner of the post
        if (req.user.role === 'admin') {
            return next();
        }
        
        // For post operations, check if user is the creator
        if (req.params.id) {
            const PostMessage = (await import('../models/postMessage.js')).default;
            const post = await PostMessage.findById(req.params.id);
            
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            
            if (post.creator.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Access denied. You can only modify your own posts.' });
            }
        }
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authorization failed' });
    }
};
