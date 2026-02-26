import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import ProductTable from './pages/ProductTablePage'
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

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen p-8">
      <nav className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          ← Home
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen p-8">
              <Home />
            </div>
          }
        />
        <Route
          path="/tic-tac-toe"
          element={
            <Layout>
              <Game />
            </Layout>
          }
        />
        <Route
          path="/todo"
          element={
            <Layout>
              <Todo />
            </Layout>
          }
        />
        <Route
          path="/product-table"
          element={
            <Layout>
              <ProductTable />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
