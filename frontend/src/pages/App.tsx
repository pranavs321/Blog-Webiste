import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import Dashboard from '../components/Dashboard';

const App = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (isAuthenticated) return <Dashboard />;

  return showLogin ? (
    <Login onToggle={() => setShowLogin(false)} />
  ) : (
    <Register onToggle={() => setShowLogin(true)} />
  );
};

export default App;
