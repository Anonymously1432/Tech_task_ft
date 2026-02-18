import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductsPage from './pages/ProductsPage'
import ProductFormPage from './pages/ProductFormPage'
import DashboardPage from './pages/DashboardPage'
import PoliciesPage from './pages/PoliciesPage'
import ProfilePage from './pages/ProfilePage'
import ManagerLoginPage from './pages/manager/ManagerLoginPage'
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage'
import ManagerApplicationsPage from './pages/manager/ManagerApplicationsPage'
import ManagerApplicationDetailPage from './pages/manager/ManagerApplicationDetailPage'
import ManagerStatisticsPage from './pages/manager/ManagerStatisticsPage'

function ProtectedRoute({
  children,
  requireClient,
  requireManager,
}: {
  children: React.ReactNode
  requireClient?: boolean
  requireManager?: boolean
}) {
  const { user, loading } = useAuth()
  if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>
  if (!user) return <Navigate to="/login" replace />
  if (requireClient && user.role !== 'client') return <Navigate to="/manager/login" replace />
  if (requireManager && user.role !== 'manager') return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:type" element={<ProductFormPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requireClient>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="policies"
          element={
            <ProtectedRoute requireClient>
              <PoliciesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute requireClient>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/manager/login" element={<ManagerLoginPage />} />
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute requireManager>
              <ManagerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/applications"
          element={
            <ProtectedRoute requireManager>
              <ManagerApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/applications/:id"
          element={
            <ProtectedRoute requireManager>
              <ManagerApplicationDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/statistics"
          element={
            <ProtectedRoute requireManager>
              <ManagerStatisticsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
