// App.jsx (güncellenmiş hali)
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import OnboardingPage from './pages/OnboardingPage';
import NotificationPage from './pages/NotificationPage';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import CallPage from './pages/CallPage';       
import ChatPage from './pages/ChatPage';  
import FriendsPage from './pages/Friends';     
import ProtectedLayout from './lib/ProtectedLayout';  

function App() {
  return (
    <div>
      <Routes>
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />

        <Route element={<ProtectedLayout />}>
          <Route index element={<HomePage />} />
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="call" element={<CallPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="friends" element={<FriendsPage  />} /> 
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>Page Not Found 404</div>} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;