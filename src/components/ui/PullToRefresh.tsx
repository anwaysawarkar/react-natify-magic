
import { useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
}

const PullToRefresh = ({ onRefresh, children, className }: PullToRefreshProps) => {
  const [isPulling, setIsPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const pullThreshold = 80;

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, (currentY - startY) * 0.4);
    
    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(distance);
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    
    if (pullDistance > pullThreshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setIsPulling(false);
  };

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isPulling, startY, pullDistance, isRefreshing]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div 
        className="transition-transform duration-200 ease-out"
        style={{ transform: `translateY(${isPulling || isRefreshing ? pullDistance : 0}px)` }}
      >
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 flex items-center justify-center transition-opacity",
            (pullDistance > 0 || isRefreshing) ? "opacity-100" : "opacity-0"
          )}
          style={{ height: `${pullThreshold}px`, marginTop: "-80px" }}
        >
          <RefreshCw 
            className={cn(
              "text-primary w-6 h-6 transition-transform",
              isRefreshing ? "animate-spin" : ""
            )}
            style={{ 
              transform: !isRefreshing ? `rotate(${Math.min(pullDistance/pullThreshold * 270, 270)}deg)` : "none" 
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
