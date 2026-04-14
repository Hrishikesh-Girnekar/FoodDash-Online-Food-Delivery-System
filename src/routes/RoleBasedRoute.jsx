import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLE_HOME } from '../utils/helpers'
import Spinner from '../components/common/Spinner'


export default function RoleBasedRoute({ children, allowedRoles }) {
  const { user, loading, role } = useAuth()

  if (loading) return <Spinner fullScreen />

  if (!user) return <Navigate to="/login" replace />

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role] || '/'} replace />
  }

  return children
}
