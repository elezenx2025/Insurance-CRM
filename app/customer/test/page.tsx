export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Test Page</h1>
        <p className="text-gray-600">This is a test page to check if customer routes work.</p>
        <div className="mt-8">
          <a href="/customer/login" className="text-blue-600 hover:text-blue-800">
            Go to Login
          </a>
        </div>
      </div>
    </div>
  )
}


