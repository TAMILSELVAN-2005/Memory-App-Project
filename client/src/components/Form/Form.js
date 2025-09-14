import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Box, Alert } from '@mui/material';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { createPost, updatePost } from '../../actions/posts';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: '', selectedFile: '' });
  const [fileError, setFileError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const post = useSelector((state) => (currentId ? state.posts.posts?.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) {
      setPostData({
        title: post.title || '',
        message: post.message || '',
        tags: post.tags ? post.tags.join(', ') : '',
        selectedFile: post.selectedFile || ''
      });
    }
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', message: '', tags: '', selectedFile: '' });
    setFileError('');
    setFormErrors({});
    // Navigate back to clean /create URL
    navigate('/create');
  };

  const validateForm = () => {
    const errors = {};
    if (!postData.title.trim()) errors.title = 'Title is required';
    if (!postData.message.trim()) errors.message = 'Message is required';
    if (!postData.selectedFile) errors.selectedFile = 'Please select an image or video';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setFormErrors({ auth: 'Please log in to create or edit posts' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    const postToSubmit = {
      ...postData,
      tags: postData.tags ? postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };

    if (currentId === 0) {
      dispatch(createPost(postToSubmit, navigate));
      clear();
    } else {
      dispatch(updatePost(currentId, postToSubmit));
      clear();
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      // Check if it's a video file
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (isVideo || isImage) {
        setPostData({ ...postData, selectedFile: file.base64 });
        setFileError('');
        setFormErrors(prev => ({ ...prev, selectedFile: '' }));
      } else {
        setFileError('Please select an image or video file');
        setFormErrors(prev => ({ ...prev, selectedFile: 'Please select an image or video file' }));
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <Paper sx={{ 
        padding: '20px', 
        borderRadius: '15px',
        height: 'fit-content',
        position: 'sticky',
        top: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
          Sign in to create memories
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Please log in or create an account to start sharing your memories.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      padding: '20px', 
      borderRadius: '15px',
      height: 'fit-content',
      position: 'sticky',
      top: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h6" sx={{ marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
        {currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}
      </Typography>
      
      {formErrors.auth && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formErrors.auth}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField 
          name="title" 
          variant="outlined" 
          label="Title" 
          fullWidth 
          value={postData.title} 
          onChange={(e) => setPostData({ ...postData, title: e.target.value })} 
          error={!!formErrors.title}
          helperText={formErrors.title}
        />
        
        <TextField 
          name="message" 
          variant="outlined" 
          label="Message" 
          fullWidth 
          multiline 
          rows={4} 
          value={postData.message} 
          onChange={(e) => setPostData({ ...postData, message: e.target.value })} 
          error={!!formErrors.message}
          helperText={formErrors.message}
        />
        
        <TextField 
          name="tags" 
          variant="outlined" 
          label="Tags (comma separated)" 
          fullWidth 
          value={postData.tags} 
          onChange={(e) => setPostData({ ...postData, tags: e.target.value })} 
          placeholder="e.g., vacation, summer, family"
        />
        
        <Box sx={{ width: '100%', margin: '10px 0' }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Upload Image or Video
          </Typography>
          <FileBase 
            type="file" 
            multiple={false} 
            accept="image/*,video/*"
            onDone={handleFileChange}
          />
          {fileError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {fileError}
            </Alert>
          )}
          {formErrors.selectedFile && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {formErrors.selectedFile}
            </Alert>
          )}
        </Box>
        
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          type="submit" 
          fullWidth
          sx={{ marginBottom: 1 }}
        >
          {currentId ? 'Update' : 'Submit'}
        </Button>
        
        {currentId && (
          <Button 
            variant="outlined" 
            color="error" 
            size="small" 
            onClick={clear} 
            fullWidth
            sx={{ marginBottom: 1 }}
          >
            Cancel Edit
          </Button>
        )}
        
        <Button 
          variant="outlined" 
          color="secondary" 
          size="small" 
          onClick={clear} 
          fullWidth
        >
          Clear
        </Button>
      </Box>
    </Paper>
  );
};

export default Form;
