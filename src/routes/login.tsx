import { createFileRoute } from '@tanstack/react-router'
import LoginPage from '../features/auth/LoginPage'

export const Route = createFileRoute('/login')({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Admin Login | Aniket Saini" },
      { name: "description", content: "Secure gate link connection for administrative dashboard services." },
      { property: "og:title", content: "Admin Login | Aniket Saini" }
    ]
  })
})
