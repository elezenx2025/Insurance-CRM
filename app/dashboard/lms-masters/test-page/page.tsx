export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-600">LMS Masters Test Page</h1>
      <p className="mt-4 text-gray-600">This page is working! The LMS Masters routing is functional.</p>
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-lg font-semibold text-green-800">Available LMS Masters Pages:</h2>
        <ul className="mt-2 space-y-1 text-green-700">
          <li>• Training Modules: /dashboard/lms-masters/training-modules</li>
          <li>• Training Material: /dashboard/lms-masters/training-material</li>
          <li>• Online Exam: /dashboard/lms-masters/online-exam</li>
          <li>• Examination Certificate: /dashboard/lms-masters/examination-certificate</li>
        </ul>
      </div>
    </div>
  )
}











