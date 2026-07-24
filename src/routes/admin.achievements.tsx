import { createFileRoute } from '@tanstack/react-router'
import AdminAchievementsPage from '../features/admin/AdminAchievementsPage'

export const Route = createFileRoute('/admin/achievements')({
  component: AdminAchievementsPage,
})
