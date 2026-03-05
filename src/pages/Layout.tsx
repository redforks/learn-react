import { Link, Outlet } from '@tanstack/react-router'

export default function Layout() {
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
