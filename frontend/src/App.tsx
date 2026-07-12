import Navbar from './components/Navbar'
import AssetsPage from './pages/AssetsPage'
import './App.css'

function App() {
  return (
    <>
      <Navbar userName="Prashant Kumawat" userRole="Admin" unreadCount={3} onLogout={() => {}} />
      <AssetsPage />
    </>
  )
}

export default App
