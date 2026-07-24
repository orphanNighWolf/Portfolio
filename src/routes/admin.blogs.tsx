import { createFileRoute } from '@tanstack/react-router'
import AdminBlogsPage from '../features/admin/AdminBlogsPage'

export const Route = createFileRoute('/admin/blogs')({
  component: AdminBlogsPage,
})
