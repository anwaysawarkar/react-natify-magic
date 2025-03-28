
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Camera, MapPin, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("/");
  
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Camera, label: "Cameras", path: "/camera-feed" },
    { icon: MapPin, label: "Map", path: "/wildlife-map" },
    { icon: Bell, label: "Alerts", path: "/notifications" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

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
