
import { useQuery } from "@tanstack/react-query";

interface ApiResource {
  method: string;
  path: string;
  attribute?: string;
}

interface ApiRoute {
  method: string;
  path: string;
}

const fetchApiRoutes = async (): Promise<ApiRoute[]> => {
  // Fetch the routes from the provided endpoint.
  // Here we simulate it for demonstration; you can change this URL.
  const response = await fetch("/api/v1/publics/sys/routes");
  if (!response.ok) {
    throw new Error("Failed to fetch API routes");
  }
  return response.json();
};

export function useApiRoutes() {
  return useQuery<ApiRoute[], Error>({
    queryKey: ["apiRoutes"],
    queryFn: fetchApiRoutes,
  });
}
