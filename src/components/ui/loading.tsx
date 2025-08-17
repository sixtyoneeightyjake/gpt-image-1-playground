import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"
import { Loader2, Sparkles } from "lucide-react"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "glow" | "sparkle"
}

function LoadingSpinner({ className, size = "md", variant = "default" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  const baseClasses = "animate-spin"
  
  if (variant === "glow") {
    return (
      <div className={cn(
        "relative",
        className
      )}>
        <Loader2 className={cn(
          baseClasses,
          sizeClasses[size],
          "text-primary animate-glow-pulse"
        )} />
        <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full blur-md" />
      </div>
    )
  }

  if (variant === "sparkle") {
    return (
      <div className={cn(
        "relative flex items-center justify-center",
        className
      )}>
        <Sparkles className={cn(
          "animate-spin text-yellow-400",
          sizeClasses[size]
        )} style={{ animationDuration: '2s' }} />
        <div className="absolute inset-0 animate-pulse bg-yellow-400/20 rounded-full blur-lg" />
      </div>
    )
  }

  return (
    <Loader2 className={cn(
      baseClasses,
      sizeClasses[size],
      className
    )} />
  )
}

interface ImageSkeletonProps {
  className?: string
  aspectRatio?: "square" | "landscape" | "portrait"
}

function ImageSkeleton({ className, aspectRatio = "square" }: ImageSkeletonProps) {
  const aspectClasses = {
    square: "aspect-square",
    landscape: "aspect-[4/3]",
    portrait: "aspect-[3/4]"
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg",
      aspectClasses[aspectRatio],
      className
    )}>
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner variant="glow" size="lg" />
      </div>
    </div>
  )
}

interface LoadingTextProps {
  className?: string
  children: React.ReactNode
}

function LoadingText({ className, children }: LoadingTextProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 text-muted-foreground animate-pulse",
      className
    )}>
      <LoadingSpinner size="sm" />
      <span>{children}</span>
    </div>
  )
}

interface CardSkeletonProps {
  className?: string
  showHeader?: boolean
  showFooter?: boolean
  lines?: number
}

function CardSkeleton({ className, showHeader = true, showFooter = false, lines = 3 }: CardSkeletonProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card p-6 space-y-4",
      className
    )}>
      {showHeader && (
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn(
              "h-4",
              i === lines - 1 ? "w-2/3" : "w-full"
            )} 
          />
        ))}
      </div>
      
      {showFooter && (
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      )}
    </div>
  )
}

export { LoadingSpinner, ImageSkeleton, LoadingText, CardSkeleton, Skeleton }