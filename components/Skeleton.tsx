"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-2xl bg-primary/10 shimmer-effect relative overflow-hidden",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
    );
}
