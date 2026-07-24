import { createFileRoute } from '@tanstack/react-router'
import AdminSocialsPage from '../features/admin/AdminSocialsPage'

export const Route = createFileRoute('/admin/socials')({
  component: AdminSocialsPage,
})
