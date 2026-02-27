import { Link } from 'react-router'

export function Layout({ children }: { children: React.ReactNode }) {
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
