import { Header } from '@/global-components'
import { Navbar } from '@/global-components/navbar/navbar'
import type { QueryClient } from '@tanstack/react-query'
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const router = useRouter()
    const currentPath = router.state.location.pathname

    // Show only logo header on these pages
    const showOnlyLogoHeader = ['/', '/login', '/register'].includes(
      currentPath,
    )

    return (
      <>
        {showOnlyLogoHeader ? <Header /> : <Navbar />}
        <Outlet />
        <TanStackRouterDevtools />
        <TanStackQueryLayout />
      </>
    )
  },
})
