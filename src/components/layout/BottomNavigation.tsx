
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Camera, MapPin, Bell, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BottomNavigation = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("/");
  const { userRole, logout } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: "Home", path: "/" },
      { icon: Bell, label: "Alerts", path: "/notifications" },
      { icon: MapPin, label: "Map", path: "/wildlife-map" },
      { icon: User, label: "Profile", path: "/profile" },
    ];

    // Admin-specific items
    if (userRole === "admin") {
      return [
        baseItems[0],
        { icon: Camera, label: "Cameras", path: "/camera-feed" },
        baseItems[1],
        baseItems[2],
        baseItems[3],
      ];
    }

    // Regular user items (remove camera)
    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="safe-bottom">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <item.icon
                className={cn(
                  "w-6 h-6 mb-1 transition-colors",
                  activeTab === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-xs transition-colors",
                  activeTab === item.path
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default BottomNavigation;
