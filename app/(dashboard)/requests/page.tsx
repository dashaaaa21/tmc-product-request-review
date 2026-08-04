import { RequestForm } from "@/components/requests/RequestForm";

export default function RequestsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          New Product Request
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Describe the merchandise request. Our AI assistant will review completeness and create a product brief.
        </p>
      </div>
      
      <RequestForm />
    </div>
  );
}
