import { createFileRoute } from '@tanstack/react-router'
import AdminResumePage from '../features/admin/AdminResumePage'

export const Route = createFileRoute('/admin/resume')({
  component: AdminResumePage,
})
