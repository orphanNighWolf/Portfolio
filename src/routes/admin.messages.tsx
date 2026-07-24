import { createFileRoute } from '@tanstack/react-router'
import AdminMessagesPage from '../features/admin/AdminMessagesPage'

export const Route = createFileRoute('/admin/messages')({
  component: AdminMessagesPage,
})
