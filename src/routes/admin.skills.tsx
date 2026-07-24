import { createFileRoute } from '@tanstack/react-router'
import AdminSkillsPage from '../features/admin/AdminSkillsPage'

export const Route = createFileRoute('/admin/skills')({
  component: AdminSkillsPage,
})
