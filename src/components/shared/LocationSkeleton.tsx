/**
 * Location Selection Skeleton Loader
 * Loading state for location selection step
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function LocationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-3">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-4 mt-1" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-4 mt-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-4 mt-1" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <Skeleton className="h-9 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
