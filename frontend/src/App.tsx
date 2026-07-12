import { useEffect, useState } from 'react';
import Navbar from './components/Navbar'
import AssetsPage from './pages/AssetsPage'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import './App.css'

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  if (currentPath === '/') {
    return <LandingPage />
  }

  if (currentPath === '/login') {
    return <AuthPage initialMode="login" />;
  }

  if (currentPath === '/signup') {
    return <AuthPage initialMode="signup" />;
  }

  return (
    <>
      <Navbar
        userName="Prashant Kumawat"
        userRole="Admin"
        unreadCount={3}
        activePath={currentPath}
        onLogout={() => {}}
      />
      <AssetsPage />
    </>
  )
}

export default App
