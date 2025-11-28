import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});


// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchPosts = (page) => api.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery) => api.get(`/posts/search?q=${searchQuery.search || ''}`);
export const createPost = (newPost) => api.post('/posts', newPost);
export const likePost = (id) => api.patch(`/posts/${id}/likePost`);
export const comment = (value, id) => api.post(`/posts/${id}/comments`, { text: value });
export const updatePost = (id, updatedPost) => api.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => api.delete(`/posts/${id}`);
