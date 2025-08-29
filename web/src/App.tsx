import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import PostDetail from './pages/PostDetail';
import PostEditor from './pages/PostEditor';
import Profile from './pages/Profile';
import Spaces from './pages/Spaces';
import Admin from './pages/Admin';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/new" element={<PostEditor />} />
        <Route path="/edit/:id" element={<PostEditor />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Layout>
  );
}

export default App;
