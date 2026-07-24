import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../store/useAuthStore'
import AdminLayout from '../features/admin/AdminLayout'

export const Route = createFileRoute('/admin')({
  beforeLoad: ({ location }) => {
    const { isAuthenticated, user } = useAuthStore.getState()
    if (!isAuthenticated || !user || user.role !== 'admin') {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Command Center | Admin Panel" },
      { name: "robots", content: "noindex, nofollow" }
    ]
  })
})
