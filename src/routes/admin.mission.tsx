import { createFileRoute } from '@tanstack/react-router'
import AdminMissionPage from '../features/admin/AdminMissionPage'

export const Route = createFileRoute('/admin/mission')({
  component: AdminMissionPage,
})
