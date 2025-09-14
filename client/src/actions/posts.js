import { FETCH_ALL, CREATE, UPDATE, DELETE, LIKE, FETCH_BY_SEARCH, COMMENT } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: 'START_LOADING' });
    const { data } = await api.fetchPosts(page);
    
    dispatch({ type: FETCH_ALL, payload: data });
    dispatch({ type: 'END_LOADING' });
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    dispatch({ type: 'END_LOADING' });
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: 'START_LOADING' });
    const { data } = await api.fetchPostsBySearch(searchQuery);
    
    dispatch({ type: FETCH_BY_SEARCH, payload: data });
    dispatch({ type: 'END_LOADING' });
  } catch (error) {
    console.error('Error searching posts:', error.message);
    dispatch({ type: 'END_LOADING' });
  }
};

export const createPost = (post, navigate) => async (dispatch) => {
  try {
    dispatch({ type: 'START_LOADING' });
    const { data } = await api.createPost(post);
    
    dispatch({ type: CREATE, payload: data });
    if (navigate && typeof navigate === 'function') {
      navigate('/');
    }
  } catch (error) {
    console.error('Error creating post:', error.message);
    dispatch({ type: 'END_LOADING' });
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.error('Error updating post:', error.message);
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.error('Error liking post:', error.message);
  }
};

export const commentPost = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.comment(value, id);
    dispatch({ type: COMMENT, payload: data });
    return data;
  } catch (error) {
    console.error('Error commenting on post:', error.message);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.error('Error deleting post:', error.message);
  }
};
