/**
 * Service Selection Skeleton Loader
 * Loading state for service selection step
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ServiceSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search skeleton */}
      <Skeleton className="h-10 w-full" />

      {/* Category and Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category List Skeleton */}
        <div className="lg:col-span-1 space-y-2">
          <Skeleton className="h-8 w-24 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>

        {/* Service Cards Skeleton */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
