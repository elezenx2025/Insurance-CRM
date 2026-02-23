export default function TestFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Test Form - Basic Implementation
          </h1>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter first name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="9876543210"
                  maxLength={10}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                name="state"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select State</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="delhi">Delhi</option>
                <option value="karnataka">Karnataka</option>
                <option value="tamil-nadu">Tamil Nadu</option>
                <option value="gujarat">Gujarat</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <select
                name="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select City</option>
                <option value="mumbai">Mumbai</option>
                <option value="pune">Pune</option>
                <option value="bangalore">Bangalore</option>
                <option value="chennai">Chennai</option>
                <option value="ahmedabad">Ahmedabad</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Form
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}












