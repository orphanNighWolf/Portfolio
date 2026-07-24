import { createFileRoute } from '@tanstack/react-router'
import AdminJourneyPage from '../features/admin/AdminJourneyPage'

export const Route = createFileRoute('/admin/journey')({
  component: AdminJourneyPage,
})
