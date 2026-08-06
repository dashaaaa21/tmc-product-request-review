import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
    implemented: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{request.title}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Created: {formattedDate}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[request.status]
            }`}
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {request.description}
        </p>
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Category:{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {request.category}
            </span>
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/requests/${request.id}/review`)}
          >
            Review
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/requests/${request.id}/brief`)}
          >
            Product Brief
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
