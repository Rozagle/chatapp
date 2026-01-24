import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import EnrollmentPage from './pages/EnrollmentPage'
import NotificationPage from './pages/NotificationPage'
// import chatPage from './pages/chatPage'
// import callPage from './pages/callPage'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <div>
      <Routes>
      <Route index element={<HomePage />} />

      <Route path="signup" element={<SignUpPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="call" element={<callPage />} />
      <Route path="chat" element={<chatPage />} />
      <Route path="notifications" element={<NotificationPage />} />
      <Route path="onboarding" element={<EnrollmentPage />} />


      

      {/* 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
    <Toaster />

    </div>
    
  )
}

export default App
