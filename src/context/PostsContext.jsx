import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { postsApi } from '../services/postsApi';

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const searchTermRef = useRef('');

  const fetchPosts = useCallback(async (term = '', pageNum = 0, append = false) => {
    const isNewSearch = !append;
    if (!isNewSearch) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      setError(null);
      const res = term
        ? await postsApi.search(term, pageNum)
        : await postsApi.getAll(pageNum);
      const newPosts = res.content || [];
      setPosts(prev => isNewSearch ? newPosts : [...prev, ...newPosts]);
      setHasMore(!res.last);
      setPage(pageNum);
      searchTermRef.current = term;
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      if (isNewSearch) setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPosts(searchTermRef.current, page + 1, true);
    }
  }, [fetchPosts, loadingMore, hasMore, page]);

  const fetchPostById = useCallback(async (id) => {
    try {
      setError(null);
      const data = await postsApi.getById(id);
      setCurrentPost(data);
    } catch (err) {
      setError(err.message || 'Failed to load post');
      setCurrentPost(null);
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
    fetchPosts(term, 0, false);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    posts,
    currentPost,
    loading,
    loadingMore,
    error,
    searchQuery,
    hasMore,
    setCurrentPost,
    fetchPosts,
    loadMore,
    fetchPostById,
    createPost,
    deletePost,
    search,
    clearError
  }), [
    posts,
    currentPost,
    loading,
    loadingMore,
    error,
    searchQuery,
    hasMore,
    setCurrentPost,
    fetchPosts,
    loadMore,
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

// eslint-disable-next-line react-refresh/only-export-components
export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}
