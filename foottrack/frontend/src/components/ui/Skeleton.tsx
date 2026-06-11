import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={clsx("animate-pulse bg-surface2 rounded-lg", className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-white/[0.08] rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-surface border border-white/[0.08] rounded-xl p-4 space-y-3">
      <Skeleton className="w-9 h-9 rounded-lg" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function SkeletonPlayerCard() {
  return (
    <div className="bg-surface border border-white/[0.08] rounded-xl p-5 text-center space-y-3">
      <Skeleton className="w-16 h-16 rounded-full mx-auto" />
      <Skeleton className="h-4 w-24 mx-auto" />
      <Skeleton className="h-5 w-16 mx-auto rounded-full" />
      <div className="grid grid-cols-3 gap-2 pt-2">
        <Skeleton className="h-8 rounded" />
        <Skeleton className="h-8 rounded" />
        <Skeleton className="h-8 rounded" />
      </div>
    </div>
  );
}

export function SkeletonMatchCard() {
  return (
    <div className="bg-surface border border-white/[0.08] rounded-xl p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr auto 1fr auto" }}>
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-20 mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
        <div className="flex items-center gap-3 flex-row-reverse">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded" />
      </div>
    </div>
  );
}