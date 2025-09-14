import React, { useState, useEffect } from 'react';
import { Container, Grid, Grow, Paper, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useSearchParams } from 'react-router-dom';

import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import { getPosts } from '../../actions/posts';

const Home = () => {
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isCreatePage = location.pathname === '/create';
  
  // Check if we're editing a post from URL parameter
  const editPostId = searchParams.get('edit');


  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getPosts(1));
    }
  }, [currentId, dispatch, isAuthenticated]);

  // Set currentId when editing from URL parameter
  useEffect(() => {
    if (editPostId && editPostId !== currentId.toString()) {
      setCurrentId(editPostId);
    }
  }, [editPostId, currentId]);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Welcome to Memories
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Share your precious moments with the world. Create, discover, and connect through memories.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please sign in or create an account to start sharing your memories.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // If we're on the create page, show the form
  if (isCreatePage) {
    return (
      <Grow in>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Posts setCurrentId={setCurrentId} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Form currentId={currentId} setCurrentId={setCurrentId} />
            </Grid>
          </Grid>
        </Container>
      </Grow>
    );
  }

  // If we're on the home page, only show posts
  return (
    <Grow in>
      <Container>
        <Posts setCurrentId={setCurrentId} />
      </Container>
    </Grow>
  );
};

export default Home;
