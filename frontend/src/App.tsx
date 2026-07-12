import Navbar from './components/Navbar'
import AssetsPage from './pages/AssetsPage'
import LandingPage from './pages/LandingPage'
import './App.css'

function App() {
  const path = window.location.pathname

  if (path === '/') {
    return <LandingPage />
  }

  return (
    <>
      <Navbar
        userName="Prashant Kumawat"
        userRole="Admin"
        unreadCount={3}
        activePath={path}
        onLogout={() => {}}
      />
      <AssetsPage />
    </>
  )
}

export default App
