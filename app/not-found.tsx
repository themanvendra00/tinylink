import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center glass rounded-2xl shadow-2xl p-12 border border-white/30 max-w-md">
        <div className="text-8xl mb-6">🔗</div>
        <h1 className="text-7xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Link Not Found</h2>
        <p className="text-gray-600 mb-8 text-lg">The short link you're looking for doesn't exist or has been deleted.</p>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-lg"
        >
          ✨ Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

