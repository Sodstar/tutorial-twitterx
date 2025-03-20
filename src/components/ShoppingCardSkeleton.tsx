import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";

export function ShoppingCardSkeleton() {
  // array of 5 items
  const skeletonItems = Array.from({ length: 1 }, (_, i) => i);

  return (
  <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {skeletonItems.map((index) => (
              <div key={index} className="flex items-start gap-4 p-4 border-b">
                <Skeleton className="h-50 w-50 rounded-md" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="pl-6 space-y-2">
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

  );
}