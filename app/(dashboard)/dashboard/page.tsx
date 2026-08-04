export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to TMC Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Create and review merchandise requests.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              New Request
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create a new product request with AI-powered analysis
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              History
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View all your previous requests and their status
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Product Brief
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access AI-generated product briefs and insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}