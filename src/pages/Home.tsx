import { Link } from '@tanstack/react-router'

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col gap-4">
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
