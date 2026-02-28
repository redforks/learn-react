import type { RouteObject } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import productLoaderRoute from './pages/product-table/route'
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
        ...productLoaderRoute,
        path: '/product-table',
      },
    ],
  },
] as const satisfies RouteObject[]
