// App.jsx (güncellenmiş hali)
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import EnrollmentPage from './pages/EnrollmentPage';
import NotificationPage from './pages/NotificationPage';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import callPage from './pages/callPage';       // yorumdan çıkar
import chatPage from './pages/chatPage';       // yorumdan çıkar

// ← Buraya ekle (dosya yolunu kendi yapına göre ayarla)
import ProtectedLayout from './lib/ProtectedLayout';  // veya './layouts/ProtectedLayout'

function App() {
  return (
    <div>
      <Routes>
        {/* Public routelar – auth kontrolü olmadan */}
        <Route index element={<HomePage />} />  {/* veya auth'a göre yönlendirme istiyorsan aşağıda ayrı yap */}
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />

        {/* Protected routelar – hepsini ProtectedLayout ile sar */}
        <Route element={<ProtectedLayout />}>
          <Route path="call" element={<callPage />} />
          <Route path="chat" element={<chatPage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="onboarding" element={<EnrollmentPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>Page Not Found 404</div>} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;