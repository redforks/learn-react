import type { RouteObject } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import productLoaderRoute from './pages/product-table/route'
import Game from './pages/tic-tac-toe/Game'
import todoRoute from './pages/todo/route'

export default [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'tic-tac-toe',
        element: <Game />,
      },
      todoRoute,
      productLoaderRoute,
    ],
  },
] as const satisfies RouteObject[]
