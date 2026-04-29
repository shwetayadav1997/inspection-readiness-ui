import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Systems from './pages/Systems'
import SystemDetail from './pages/SystemDetail'
import Gaps from './pages/Gaps'
import Notifications from './pages/Notifications'
import Runs from './pages/Runs'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="systems" element={<Systems />} />
          <Route path="systems/:ciId" element={<SystemDetail />} />
          <Route path="gaps" element={<Gaps />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="runs" element={<Runs />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
