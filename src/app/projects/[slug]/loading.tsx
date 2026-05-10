import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProject() {
  return (
    <div className="min-h-dvh px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="mt-16 h-20 max-w-2xl" />
        <Skeleton className="mt-8 aspect-[16/8] w-full rounded-lg" />
      </div>
    </div>
  );
}
