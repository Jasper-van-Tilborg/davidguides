import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-adventure-text">404</h1>
        <p className="text-adventure-light/70 mb-8">Page not found</p>
        <Link
          href="/"
          className="px-6 py-3 bg-adventure-main hover:bg-adventure-main/80 rounded-lg font-semibold transition-colors text-adventure-light"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}


