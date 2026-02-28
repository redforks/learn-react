import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from 'react-router-dom'
import ProductTable from './pages/product-table/ProductTable'
import Todo from './pages/Todo'
import Game from './pages/tic-tac-toe/Game'

function Home() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Learn React</h1>
      <nav>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link to="/tic-tac-toe" className="text-blue-600 hover:underline">
              Tic-Tac-Toe
            </Link>
          </li>
          <li>
            <Link to="/todo" className="text-blue-600 hover:underline">
              Todo
            </Link>
          </li>
          <li>
            <Link to="/product-table" className="text-blue-600 hover:underline">
              Product Table
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

function Layout() {
  return (
    <div className="min-h-screen p-8">
      <nav className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          ← Home
        </Link>
      </nav>
      <Outlet />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="min-h-screen p-8">
        <Home />
      </div>
    ),
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
])

export default function App() {
  return <RouterProvider router={router} />
}
