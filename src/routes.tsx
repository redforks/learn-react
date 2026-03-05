import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import Home from './pages/Home'
import Layout from './pages/Layout'
import { productRoute } from './pages/product-table/route'
import { ticTacToeRoute } from './pages/tic-tac-toe/route'
import { todoRoute } from './pages/todo/route'

export const rootRoute = createRootRoute({
  component: Layout,
})

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  ticTacToeRoute,
  todoRoute,
  productRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
