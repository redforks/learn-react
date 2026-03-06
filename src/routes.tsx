import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Home from './pages/Home'
import Layout from './pages/Layout'
import { productRoute } from './pages/product-table/route'
import { ticTacToeRoute } from './pages/tic-tac-toe/route'
import { todoRoute } from './pages/todo/route'

const rootRoute = createRootRoute({
  component: () => {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    )
  },
  notFoundComponent: () => <div>Route not defined</div>,
})

export const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Layout,
  id: 'homeLayout',
})

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

export const routeTree = rootRoute.addChildren([
  homeRoute,
  layoutRoute.addChildren([ticTacToeRoute, todoRoute, productRoute]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
