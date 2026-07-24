import { createFileRoute } from '@tanstack/react-router'
import AdminAboutPage from '../features/admin/AdminAboutPage'

export const Route = createFileRoute('/admin/about')({
  component: AdminAboutPage,
})
