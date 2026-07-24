import { createFileRoute } from '@tanstack/react-router'
import AdminResearchPage from '../features/admin/AdminResearchPage'

export const Route = createFileRoute('/admin/research')({
  component: AdminResearchPage,
})
