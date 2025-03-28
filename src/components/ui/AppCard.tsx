
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppCardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
}

const AppCard = ({ children, className, onPress }: AppCardProps) => {
  return (
    <div 
      className={cn(
        "bg-card rounded-xl p-4 shadow-sm border border-border mb-4",
        onPress && "active:opacity-70 transition-opacity cursor-pointer",
        className
      )}
      onClick={onPress}
      role={onPress ? "button" : undefined}
      tabIndex={onPress ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export const AppCardTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h3 className={cn("font-semibold text-lg mb-2", className)}>{children}</h3>
);

export const AppCardContent = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("text-muted-foreground", className)}>{children}</div>
);

export const AppCardMedia = ({ 
  src, 
  alt = "", 
  className 
}: { 
  src: string; 
  alt?: string; 
  className?: string 
}) => (
  <div className={cn("rounded-lg overflow-hidden -mx-4 -mt-4 mb-4", className)}>
    <img src={src} alt={alt} className="w-full h-auto object-cover" />
  </div>
);

export default AppCard;
