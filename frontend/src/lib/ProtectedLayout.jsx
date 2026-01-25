import { useQuery } from '@tanstack/react-query'
import axiosINSTANCE from '../lib/axios'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function ProtectedLayout() {
  const location = useLocation()
  const { data, isLoading, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => (await axiosINSTANCE.get('/auth/test')).data,
    retry: false,
  })

  const authUser = data?.user
  const isOnboarding = authUser?.isOnboarding
  console.log("authUser:", authUser)
  console.log("isOnboarding:", isOnboarding)

  if (isLoading) return <div>Loading...</div>

  if (error || !authUser) {
    return <Navigate to="/login" replace />
  }

  if (!isOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  if (isOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}