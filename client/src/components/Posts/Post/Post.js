import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Box, Menu, MenuItem, IconButton, TextField, useTheme, useMediaQuery, Avatar, Chip } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { deletePost, likePost, commentPost } from '../../../actions/posts';

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deletePost(post._id));
    handleMenuClose();
  };

  const handleEdit = () => {
    setCurrentId(post._id);
    handleMenuClose();
    navigate(`/create?edit=${post._id}`);
  };

  const handleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (commentText.trim() && isAuthenticated) {
      await dispatch(commentPost(commentText, post._id));
      setCommentText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleLike = () => {
    if (isAuthenticated) {
      dispatch(likePost(post._id));
    }
  };

  // Check if current user is the creator of the post
  const creatorId = post.creator?._id || post.creator;
  const isCreator = user && creatorId && creatorId.toString() === (user._id || user.id);
  const isAdmin = user && user.role === 'admin';
  const canModify = isCreator || isAdmin;

  // Check if user has liked the post
  const hasLiked = post.likes && post.likes.some(like => like.toString() === (user?._id || user?.id));

  // Check if the file is a video
  const isVideo = post.selectedFile && (
    post.selectedFile.includes('data:video') || 
    post.selectedFile.includes('video/') ||
    post.selectedFile.includes('.mp4') ||
    post.selectedFile.includes('.avi') ||
    post.selectedFile.includes('.mov') ||
    post.selectedFile.includes('.webm')
  );

  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      position: 'relative',
      borderRadius: '15px',
      height: 'auto',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      minHeight: isMobile ? 'auto' : '400px'
    }}>
      {/* Media Section */}
      <Box sx={{ 
        position: 'relative', 
        height: isMobile ? 200 : isTablet ? 250 : 300,
        overflow: 'hidden'
      }}>
        {isVideo ? (
          <video
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              backgroundColor: '#f5f5f5',
              borderRadius: '15px 15px 0 0'
            }}
            controls
            autoPlay
            muted
            loop
            preload="metadata"
          >
            <source src={post.selectedFile} type="video/mp4" />
            <source src={post.selectedFile} type="video/webm" />
            <source src={post.selectedFile} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <CardMedia 
            component="img"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              backgroundColor: '#f5f5f5',
              borderRadius: '15px 15px 0 0'
            }}
            image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} 
            title={post.title} 
          />
        )}
        
        {/* Overlay for creator and timestamp */}
        <Box sx={{
          position: 'absolute',
          top: isMobile ? '10px' : '20px',
          left: isMobile ? '10px' : '20px',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
        }}>
          <Typography variant={isMobile ? "body1" : "h6"}>
            {post.creatorName || post.creator}
          </Typography>
          <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
        </Box>
        
        {/* Options button - only show if user can modify */}
        {canModify && (
          <Box sx={{
            position: 'absolute',
            top: isMobile ? '10px' : '20px',
            right: isMobile ? '10px' : '20px',
            color: 'white'
          }}>
            <IconButton 
              sx={{ 
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.8)'
                },
                width: isMobile ? 36 : 44,
                height: isMobile ? 36 : 44,
                border: '2px solid rgba(255,255,255,0.3)'
              }} 
              size="small" 
              onClick={handleMenuClick}
              aria-label="Post options"
            >
              <MoreHorizIcon fontSize={isMobile ? "small" : "default"} />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEdit}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Edit
              </MenuItem>
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>
      
      <CardContent sx={{ 
        flexGrow: 1, 
        padding: isMobile ? '12px' : '16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Tags */}
        <Box sx={{ mb: 1 }}>
          {post.tags && post.tags.map((tag, index) => (
            <Chip 
              key={index} 
              label={tag} 
              size="small" 
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
        
        {/* Title */}
        <Typography 
          gutterBottom 
          variant={isMobile ? "h6" : "h5"} 
          component="h2" 
          sx={{ 
            marginBottom: 1, 
            fontWeight: 'bold',
            fontSize: isMobile ? '1rem' : '1.25rem'
          }}
        >
          {post.title}
        </Typography>
        
        {/* Message */}
        <Typography 
          variant="body2" 
          color="textSecondary" 
          component="p"
          sx={{
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            flexGrow: 1
          }}
        >
          {post.message}
        </Typography>

        {/* Comments Section */}
        {showComments && (
          <Box sx={{ 
            mt: 2, 
            p: isMobile ? 1 : 2, 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px' 
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: isMobile ? '1rem' : '1.25rem' }}>
              Comments ({post.comments?.length || 0})
            </Typography>
            
            {/* Comment Input */}
            {isAuthenticated && (
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={3}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  sx={{ minWidth: 'auto', px: isMobile ? 1 : 2 }}
                >
                  <SendIcon fontSize="small" />
                </Button>
              </Box>
            )}
            
            {/* Comments List */}
            {post.comments && post.comments.length > 0 ? (
              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                {post.comments.map((comment) => (
                  <Box key={comment._id} sx={{ 
                    mb: 1, 
                    p: isMobile ? 0.5 : 1, 
                    backgroundColor: 'white', 
                    borderRadius: '4px' 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          fontSize: '0.75rem',
                          mr: 1,
                          backgroundColor: '#1976d2'
                        }}
                      >
                        {comment.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                      }}>
                        {comment.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{
                      fontSize: isMobile ? '0.7rem' : '0.875rem',
                      ml: 3
                    }}>
                      {comment.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{
                fontSize: isMobile ? '0.75rem' : '0.875rem'
              }}>
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{
        justifyContent: 'space-between',
        padding: isMobile ? '12px' : '16px',
        marginTop: 'auto'
      }}>
        <Button 
          size="small" 
          color="primary" 
          onClick={handleLike}
          disabled={!isAuthenticated}
          sx={{
            fontSize: isMobile ? '0.75rem' : '0.875rem'
          }}
        >
          {hasLiked ? <ThumbUpAltIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
          {post.likeCount || 0}
        </Button>
        <Button 
          size="small" 
          color="primary" 
          onClick={handleComments}
          sx={{
            fontSize: isMobile ? '0.75rem' : '0.875rem'
          }}
        >
          <CommentIcon fontSize="small" /> 
          Comment {post.comments?.length > 0 && `(${post.comments.length})`}
        </Button>
      </CardActions>
    </Card>
  );
};

export default Post;
