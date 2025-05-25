import { Header } from '@/global-components'
import { Navbar } from '@/global-components/navbar/navbar'
import type { QueryClient } from '@tanstack/react-query'
import {
  Outlet,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'
import { useAuth } from '@/context/AuthContext.tsx'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname

  const isAuthPage = ['/', '/login', '/register'].includes(currentPath)

  return (
    <>
      {user ? <Navbar /> : isAuthPage ? <Header /> : null}
      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  )
}
