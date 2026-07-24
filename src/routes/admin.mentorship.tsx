import { createFileRoute } from '@tanstack/react-router'
import AdminMentorshipPage from '../features/admin/AdminMentorshipPage'

export const Route = createFileRoute('/admin/mentorship')({
  component: AdminMentorshipPage,
})
