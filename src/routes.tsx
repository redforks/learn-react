import type { RouteObject } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import ProductTable from './pages/product-table/ProductTable'
import Todo from './pages/Todo'
import Game from './pages/tic-tac-toe/Game'

export default [
  {
    path: '/',
    element: <Home />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/tic-tac-toe',
        element: <Game />,
      },
      {
        path: '/todo',
        element: <Todo />,
      },
      {
        path: '/product-table',
        element: <ProductTable />,
      },
    ],
  },
] as const satisfies RouteObject[]
