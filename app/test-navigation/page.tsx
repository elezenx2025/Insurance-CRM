'use client'

export default function TestNavigation() {
  const handleClick = (url: string) => {
    console.log('Navigating to:', url)
    window.location.href = url
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Navigation Test</h1>
      
      <div className="space-y-4">
        <button 
          onClick={() => handleClick('/dashboard')}
          className="block w-full p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </button>
        
        <button 
          onClick={() => handleClick('/dashboard/policies')}
          className="block w-full p-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Go to Policies
        </button>
        
        <button 
          onClick={() => handleClick('/dashboard/claims')}
          className="block w-full p-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Go to Claims
        </button>
        
        <button 
          onClick={() => handleClick('/dashboard/customers')}
          className="block w-full p-4 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Go to Customers
        </button>
      </div>
      
      <div className="mt-8">
        <p className="text-gray-600">Open browser console (F12) to see click events</p>
      </div>
    </div>
  )
}



























