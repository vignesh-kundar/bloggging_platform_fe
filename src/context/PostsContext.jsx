import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { postsApi } from '../services/postsApi';

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = useCallback(async (term = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = term 
        ? await postsApi.search(term)
        : await postsApi.getAll();
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsApi.getById(id);
      setCurrentPost(data);
    } catch (err) {
      setError(err.message || 'Failed to load post');
      setCurrentPost(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (postData) => {
    try {
      setError(null);
      const newPost = await postsApi.create(postData);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError(err.message || 'Failed to create post');
      throw err;
    }
  }, []);

  const deletePost = useCallback(async (id) => {
    try {
      setError(null);
      await postsApi.delete(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      if (currentPost?.id === id) {
        setCurrentPost(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      throw err;
    }
  }, [currentPost]);

  const search = useCallback((term) => {
    setSearchQuery(term);
    fetchPosts(term);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    posts,
    currentPost,
    loading,
    error,
    searchQuery,
    setCurrentPost,
    fetchPosts,
    fetchPostById,
    createPost,
    deletePost,
    search,
    clearError
  }), [
    posts, 
    currentPost, 
    loading, 
    error, 
    searchQuery, 
    setCurrentPost, 
    fetchPosts, 
    fetchPostById, 
    createPost, 
    deletePost, 
    search, 
    clearError
  ]);

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}
