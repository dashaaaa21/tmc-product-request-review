import { ProductRequest } from "@/types/request.types";
import { useRouter } from "next/navigation";

interface RequestHistoryCardProps {
  request: ProductRequest;
}

// Display single request in history list
export function RequestHistoryCard({ request }: RequestHistoryCardProps) {
  const router = useRouter();

  // Format date
  const formattedDate = new Date(request.created_at).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  // Status badge color
  const statusColors = {
    pending: "bg-orange-100 text-orange-700 border-orange-200",
    approved: "bg-lime-100 text-lime-700 border-lime-300",
    rejected: "bg-red-100 text-red-700 border-red-200",
    implemented: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <div className="border-2 border-zinc-200 rounded-3xl p-6 bg-white hover:border-lime-400 transition-all shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-black italic text-black mb-1">{request.title}</h3>
          <p className="text-sm text-zinc-500">Created: {formattedDate}</p>
        </div>
        <span
          className={`px-5 py-2.5 rounded-full text-base font-bold border-2 ${statusColors[request.status]}`}
        >
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </div>
      
      <p className="text-zinc-700 mb-4 line-clamp-2">
        {request.description}
      </p>
      
      <div className="text-sm text-zinc-600 mb-6">
        Category: <span className="font-bold text-black">{request.category}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/requests/${request.id}/review`);
          }}
          className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-full font-bold text-sm border-2 border-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          View Review →
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/requests/${request.id}/brief`);
          }}
          className="flex-1 px-4 py-2 bg-white text-black rounded-full font-bold text-sm border-2 border-zinc-200 hover:border-lime-400 transition-colors"
        >
          Product Brief
        </button>
      </div>
    </div>
  );
}
