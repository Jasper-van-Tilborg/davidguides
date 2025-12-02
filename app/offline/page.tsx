export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-adventure-dark via-adventure-dark to-adventure-purple/20 flex items-center justify-center p-8">
      <div className="glass rounded-2xl p-8 max-w-md text-center shadow-2xl border border-adventure-purple/30">
        <div className="text-6xl mb-4">🔌</div>
        <h1 className="text-3xl font-bold text-white mb-4">
          You&apos;re Offline
        </h1>
        <p className="text-white/80 mb-6 leading-relaxed">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry, all
          pages you&apos;ve visited before are still available!
        </p>
        <div className="bg-adventure-dark/50 rounded-lg p-4 border border-adventure-purple/20">
          <p className="text-sm text-white/70">
            💡 <strong>Tip:</strong> Try going back to a page you&apos;ve visited
            before, or check your internet connection.
          </p>
        </div>
      </div>
    </main>
  )
}

