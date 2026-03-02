import type { RouteObject } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import productLoaderRoute from './pages/product-table/route'
import ticTacToeRoute from './pages/tic-tac-toe/route'
import todoRoute from './pages/todo/route'

export default [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [ticTacToeRoute, todoRoute, productLoaderRoute],
  },
] as const satisfies RouteObject[]
