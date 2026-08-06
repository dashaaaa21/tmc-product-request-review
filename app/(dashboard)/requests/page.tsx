import { RequestForm } from "@/components/requests/RequestForm";

export default function RequestsPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="text-5xl font-black italic text-black mb-3">
          New Product Request
        </h1>
        <p className="text-zinc-600 text-lg">
          Describe the merchandise request. Our AI assistant will review completeness and create a product brief.
        </p>
      </div>
      
      <RequestForm />
    </div>
  );
}
