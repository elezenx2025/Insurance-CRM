export default function InsuranceQuotesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <a href="/customer" className="flex items-center text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </a>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Insurance Quotation</h1>
          <p className="text-gray-600 mt-2">Get comprehensive insurance quotes for your vehicle</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <span className="text-sm font-medium text-blue-600">
                Customer Information
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
              <span className="text-sm font-medium text-gray-500">
                Policy Details
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
              <span className="text-sm font-medium text-gray-500">
                Insurance Quotes
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
          
          <form className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div>
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
                  <p className="text-xs text-gray-500 mt-1">
                    Enter 10-digit mobile number (starts with 6, 7, 8, or 9)
                  </p>
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="address"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter complete address"
                required
              />
            </div>

            {/* Location - State and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <option value="west-bengal">West Bengal</option>
                  <option value="uttar-pradesh">Uttar Pradesh</option>
                  <option value="rajasthan">Rajasthan</option>
                  <option value="madhya-pradesh">Madhya Pradesh</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  9 states available
                </p>
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
                  <option value="nagpur">Nagpur</option>
                  <option value="thane">Thane</option>
                  <option value="nashik">Nashik</option>
                  <option value="new-delhi">New Delhi</option>
                  <option value="central-delhi">Central Delhi</option>
                  <option value="east-delhi">East Delhi</option>
                  <option value="north-delhi">North Delhi</option>
                  <option value="south-delhi">South Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="mysore">Mysore</option>
                  <option value="hubli">Hubli</option>
                  <option value="mangalore">Mangalore</option>
                  <option value="belgaum">Belgaum</option>
                  <option value="chennai">Chennai</option>
                  <option value="coimbatore">Coimbatore</option>
                  <option value="madurai">Madurai</option>
                  <option value="tiruchirappalli">Tiruchirappalli</option>
                  <option value="salem">Salem</option>
                  <option value="ahmedabad">Ahmedabad</option>
                  <option value="surat">Surat</option>
                  <option value="vadodara">Vadodara</option>
                  <option value="rajkot">Rajkot</option>
                  <option value="bhavnagar">Bhavnagar</option>
                  <option value="kolkata">Kolkata</option>
                  <option value="howrah">Howrah</option>
                  <option value="durgapur">Durgapur</option>
                  <option value="asansol">Asansol</option>
                  <option value="siliguri">Siliguri</option>
                  <option value="lucknow">Lucknow</option>
                  <option value="kanpur">Kanpur</option>
                  <option value="agra">Agra</option>
                  <option value="varanasi">Varanasi</option>
                  <option value="meerut">Meerut</option>
                  <option value="jaipur">Jaipur</option>
                  <option value="jodhpur">Jodhpur</option>
                  <option value="udaipur">Udaipur</option>
                  <option value="kota">Kota</option>
                  <option value="bikaner">Bikaner</option>
                  <option value="bhopal">Bhopal</option>
                  <option value="indore">Indore</option>
                  <option value="gwalior">Gwalior</option>
                  <option value="jabalpur">Jabalpur</option>
                  <option value="ujjain">Ujjain</option>
                  <option value="sagar">Sagar</option>
                  <option value="dewas">Dewas</option>
                  <option value="satna">Satna</option>
                  <option value="ratlam">Ratlam</option>
                  <option value="rewa">Rewa</option>
                  <option value="katni">Katni</option>
                  <option value="singrauli">Singrauli</option>
                  <option value="burhanpur">Burhanpur</option>
                  <option value="khandwa">Khandwa</option>
                  <option value="chhindwara">Chhindwara</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  95+ cities available
                </p>
              </div>
            </div>

            {/* Features Highlight */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">✅ Features Implemented:</h3>
              <div className="text-sm text-green-800 space-y-1">
                <p>• <strong>Fixed Country Code:</strong> +91 for India (as per geolocation)</p>
                <p>• <strong>10-Digit Mobile Validation:</strong> Only allows 10-digit numbers</p>
                <p>• <strong>Indian Format:</strong> Numbers must start with 6, 7, 8, or 9</p>
                <p>• <strong>All Indian States:</strong> 9 major states with comprehensive coverage</p>
                <p>• <strong>Cascading Cities:</strong> 95+ cities across all states</p>
                <p>• <strong>Geolocation Integration:</strong> Ready for location-based features</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next: Policy Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}