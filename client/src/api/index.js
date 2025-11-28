// client/src/api/index.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token to each request (tries multiple storage patterns)
api.interceptors.request.use((config) => {
  try {
    // Try common locations for token
    let token = localStorage.getItem('token'); // plain token
    if (!token) {
      const profile = localStorage.getItem('profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        // common keys used by different boilerplates
        token = parsed?.token || parsed?.accessToken || parsed?.authToken || parsed?.data?.token;
      }
    }

    if (token) {
      // ensure "Bearer " prefix
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
  } catch (err) {
    // don't break requests if localStorage read fails
    // console.warn('Error reading token from localStorage', err);
  }
  return config;
}, (error) => Promise.reject(error));

export const fetchPosts = (page) => api.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery) =>
  api.get(`/posts/search?q=${searchQuery.search || ''}`);
export const createPost = (newPost) => api.post('/posts', newPost);
export const likePost = (id) => api.patch(`/posts/${id}/likePost`);
export const comment = (value, id) => api.post(`/posts/${id}/comments`, { text: value });
export const updatePost = (id, updatedPost) => api.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export default api;
