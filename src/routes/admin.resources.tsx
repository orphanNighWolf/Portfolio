import { createFileRoute } from '@tanstack/react-router'
import AdminResourcesPage from '../features/admin/AdminResourcesPage'

export const Route = createFileRoute('/admin/resources')({
  component: AdminResourcesPage,
})
