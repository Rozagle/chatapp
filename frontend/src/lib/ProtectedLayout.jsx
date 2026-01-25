import { useQuery } from '@tanstack/react-query'
import axiosINSTANCE from '../lib/axios.js'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedLayout() {
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => (await axiosINSTANCE.get('/auth/test')).data,
    retry: false,
  })

  const authUser = authData?.user

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error || !authUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />  // auth varsa child routeları render et
}