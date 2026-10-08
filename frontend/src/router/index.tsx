import { createBrowserRouter, Navigate } from 'react-router-dom'
import { HomePage } from '../pages/public/HomePage'
import { AdminLoginPage } from '../pages/admin/AdminLoginPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
