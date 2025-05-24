import {
  Outlet,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'
import type { QueryClient } from '@tanstack/react-query'
import { Header } from '@/global-components'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const pathname = location.pathname

  const hiddenHeaderPaths = ['/', '/register']
  const shouldHideHeader = hiddenHeaderPaths.includes(pathname)

  return (
    <>
      {!shouldHideHeader ? <Header /> : null}

      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  )
}
