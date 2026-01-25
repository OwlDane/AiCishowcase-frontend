import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
    return (
        <div 
            className={cn(
                "bg-gray-200 animate-pulse rounded-lg",
                className
            )} 
        />
    );
}

export function ImageSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("bg-gray-100 animate-pulse flex items-center justify-center", className)}>
            <svg 
                className="w-12 h-12 text-gray-200" 
                fill="currentColor" 
                viewBox="0 0 24 24"
            >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
        </div>
    );
}
