
import { useState } from "react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import PullToRefresh from "@/components/ui/PullToRefresh";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Alert {
  id: number;
  animalType: string; 
  location: string;
  timestamp: Date;
  message?: string;
  verified: boolean;
  read: boolean;
}

const NotificationsScreen = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      animalType: "Tiger",
      location: "Core Zone Section A",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      message: "Large tiger spotted moving south. Stay indoors and secure livestock.",
      verified: true,
      read: false
    },
    {
      id: 2,
      animalType: "Elephant",
      location: "Core Zone Section B",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      message: "Herd of elephants near eastern village boundary.",
      verified: true,
      read: false
    },
    {
      id: 3,
      animalType: "Leopard",
      location: "Core Zone Section C",
      timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
      message: "Leopard spotted near water source. Avoid area until further notice.",
      verified: true,
      read: true
    },
    {
      id: 4,
      animalType: "Wild Boar",
      location: "Core Zone Section D",
      timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
      verified: false,
      read: true
    }
  ]);
  
  const handleRefresh = async () => {
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
  };
  
  const markAsRead = (id: number) => {
    setAlerts(
      alerts.map(alert =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };
  
  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };
  
  // For users, only show verified alerts
  const filteredAlerts = userRole === "user" 
    ? alerts.filter(alert => alert.verified)
    : alerts;
  
  return (
    <div className="pb-20 min-h-screen bg-background">
      <header className="bg-background sticky top-0 z-10 border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {userRole === "admin" ? "Alert Management" : "Alerts"}
          </h1>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>Mark all as read</Button>
        </div>
      </header>

      <PullToRefresh onRefresh={handleRefresh}>
        <main>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full mb-2 px-4">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="mobile-container py-2">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground">
                    <p>No alerts to display</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={cn(
                          "p-4 border rounded-lg",
                          !alert.read && "bg-muted/30 border-primary/50",
                          !alert.verified && "border-amber-200 bg-amber-50/30"
                        )}
                        onClick={() => {
                          markAsRead(alert.id);
                          navigate('/wildlife-map');
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <AlertTriangle className={`h-5 w-5 mr-2 ${alert.verified ? 'text-destructive' : 'text-amber-500'}`} />
                            <span className="font-medium">{alert.animalType}</span>
                            {!alert.verified && userRole === "admin" && (
                              <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                                Unverified
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{alert.location}</span>
                        </div>
                        
                        {alert.message && (
                          <div className="mt-2 text-sm border-l-2 pl-2 border-muted">
                            {alert.message}
                          </div>
                        )}
                        
                        <div className="flex justify-between mt-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/wildlife-map');
                            }}
                          >
                            <MapPin className="mr-1 h-4 w-4" /> View on Map
                          </Button>
                          
                          {!alert.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(alert.id);
                              }}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" /> Mark as Read
                            </Button>
                          )}
                        </div>
                        
                        {!alert.read && (
                          <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="unread">
              <div className="mobile-container py-2">
                {filteredAlerts.filter(a => !a.read).length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground">
                    <p>No unread alerts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAlerts
                      .filter(a => !a.read)
                      .map((alert) => (
                        <div
                          key={alert.id}
                          className={cn(
                            "p-4 border rounded-lg",
                            "bg-muted/30 border-primary/50",
                            !alert.verified && "border-amber-200 bg-amber-50/30"
                          )}
                          onClick={() => {
                            markAsRead(alert.id);
                            navigate('/wildlife-map');
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <AlertTriangle className={`h-5 w-5 mr-2 ${alert.verified ? 'text-destructive' : 'text-amber-500'}`} />
                              <span className="font-medium">{alert.animalType}</span>
                              {!alert.verified && userRole === "admin" && (
                                <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                                  Unverified
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {alert.timestamp.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{alert.location}</span>
                          </div>
                          
                          {alert.message && (
                            <div className="mt-2 text-sm border-l-2 pl-2 border-muted">
                              {alert.message}
                            </div>
                          )}
                          
                          <div className="flex justify-between mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/wildlife-map');
                              }}
                            >
                              <MapPin className="mr-1 h-4 w-4" /> View on Map
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(alert.id);
                              }}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" /> Mark as Read
                            </Button>
                          </div>
                          
                          <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </PullToRefresh>
      
      <BottomNavigation />
    </div>
  );
};

export default NotificationsScreen;
