import React from 'react';
import { Grid, useTheme, useMediaQuery, Typography, Paper } from '@mui/material';
import { useSelector } from 'react-redux';

import Post from './Post/Post';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!posts || posts.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No memories found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start creating your first memory or explore what others have shared.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid 
      container 
      spacing={isMobile ? 2 : 3} 
      sx={{ 
        padding: isMobile ? '10px 0' : '20px 0' 
      }}
    >
      {posts.map((post) => (
        <Grid 
          key={post._id} 
          item 
          xs={12} 
          sm={6} 
          md={6}
          sx={{
            display: 'flex'
          }}
        >
          <Post post={post} setCurrentId={setCurrentId} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Posts;
