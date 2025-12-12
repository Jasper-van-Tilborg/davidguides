import { Plug, Lightbulb } from 'lucide-react'

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-adventure-dark flex items-center justify-center p-8">
      <div className="bg-adventure-main border border-adventure-border p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Plug className="w-16 h-16 text-adventure-text" />
        </div>
        <h1 className="text-3xl font-medium text-adventure-text mb-4">
          You&apos;re Offline
        </h1>
        <p className="text-adventure-text-secondary mb-6 leading-relaxed">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry, all
          pages you&apos;ve visited before are still available!
        </p>
        <div className="bg-adventure-dark border border-adventure-border p-4">
          <p className="text-sm text-adventure-text-secondary flex items-center gap-2 justify-center">
            <Lightbulb className="w-4 h-4 text-adventure-text" />
            <span><strong>Tip:</strong> Try going back to a page you&apos;ve visited
            before, or check your internet connection.</span>
          </p>
        </div>
      </div>
    </main>
  )
}

