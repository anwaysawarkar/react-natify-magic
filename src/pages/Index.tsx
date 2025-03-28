
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PullToRefresh from "@/components/ui/PullToRefresh";
import AppCard, { AppCardTitle, AppCardContent, AppCardMedia } from "@/components/ui/AppCard";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { AlertTriangle, Camera, MapPin, Bell, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
}

interface Alert {
  id: number;
  animalType: string;
  location: string;
  timestamp: Date;
  verified: boolean;
  message?: string;
}

const Index = () => {
  const [pendingAlerts, setPendingAlerts] = useState<Alert[]>([]);
  const [verifiedAlerts, setVerifiedAlerts] = useState<Alert[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const fetchData = async () => {
    setIsLoading(true);
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockAlerts: Alert[] = [
      {
        id: 1,
        animalType: "Tiger",
        location: "Core Zone Section A",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        verified: false
      },
      {
        id: 2,
        animalType: "Elephant",
        location: "Core Zone Section B",
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        verified: true,
        message: "Large elephant herd moving towards village. Stay indoors."
      },
      {
        id: 3,
        animalType: "Leopard",
        location: "Core Zone Section C",
        timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
        verified: true,
        message: "Leopard spotted near water source. Avoid area until further notice."
      }
    ];
    
    setPendingAlerts(mockAlerts.filter(alert => !alert.verified));
    setVerifiedAlerts(mockAlerts.filter(alert => alert.verified));
    setIsLoading(false);
  };
  
  const handleRefresh = async () => {
    await fetchData();
  };
  
  const verifyAlert = (alert: Alert, verified: boolean, message: string = "") => {
    // In a real app, this would be an API call
    const updatedAlert = { ...alert, verified, message };
    
    setPendingAlerts(pendingAlerts.filter(a => a.id !== alert.id));
    
    if (verified) {
      setVerifiedAlerts([updatedAlert, ...verifiedAlerts]);
      toast({
        title: "Alert Verified",
        description: `${alert.animalType} alert has been sent to villagers`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Alert Rejected",
        description: `${alert.animalType} alert has been marked as false detection`,
      });
    }
    
    setSelectedAlert(null);
    setInputMessage("");
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // Admin view rendering
  const renderAdminView = () => (
    <div className="mobile-container py-4">
      {isLoading ? (
        <div className="flex flex-col space-y-4 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-48 rounded-lg mb-4"></div>
              <div className="bg-muted h-6 rounded w-3/4 mb-2"></div>
              <div className="bg-muted h-4 rounded w-full"></div>
              <div className="bg-muted h-4 rounded w-4/5 mt-2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Pending Verification</h2>
            {pendingAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
                No pending alerts to verify
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAlerts.map((alert) => (
                  <div 
                    key={`pending-${alert.id}`} 
                    className="border border-border rounded-lg p-4 cursor-pointer"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="text-destructive mr-2 h-5 w-5" />
                      <span className="font-medium">{alert.animalType} Detection</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center mb-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {alert.location}
                      </div>
                      <div>{alert.timestamp.toLocaleString()}</div>
                    </div>
                    <div className="bg-amber-50 text-amber-800 text-sm p-2 rounded mt-2">
                      Requires verification before alerting villagers
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {selectedAlert && (
            <div className="mb-6 border border-primary rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Verify Detection</h3>
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="text-destructive mr-2 h-5 w-5" />
                  <span className="font-medium">{selectedAlert.animalType} at {selectedAlert.location}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {selectedAlert.timestamp.toLocaleString()}
                </div>
                <div className="bg-muted h-48 rounded-lg mb-4 flex items-center justify-center">
                  <Camera className="h-10 w-10 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Detection Image</span>
                </div>
                <div className="mb-4">
                  <label htmlFor="alertMessage" className="block text-sm font-medium mb-1">
                    Alert Message for Villagers
                  </label>
                  <textarea 
                    id="alertMessage"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Enter details about this sighting to inform villagers..."
                    className="w-full p-2 border border-border rounded-md h-24"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => verifyAlert(selectedAlert, true, inputMessage)}
                    className="flex-1"
                    disabled={!inputMessage.trim()}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Verify & Send Alert
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => verifyAlert(selectedAlert, false)}
                    className="flex-1"
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Reject Detection
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Recent Alerts</h2>
            {verifiedAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
                No recent alerts
              </div>
            ) : (
              <div className="space-y-3">
                {verifiedAlerts.map((alert) => (
                  <div 
                    key={`verified-${alert.id}`} 
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="text-destructive mr-2 h-5 w-5" />
                      <span className="font-medium">{alert.animalType} Alert</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center mb-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {alert.location}
                      </div>
                      <div>{alert.timestamp.toLocaleString()}</div>
                    </div>
                    {alert.message && (
                      <div className="bg-muted p-2 rounded mt-2 text-sm">
                        {alert.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3 mb-6">
            <Button
              onClick={() => navigate('/camera-feed')}
              className="flex-1"
            >
              <Camera className="mr-1 h-4 w-4" />
              View Cameras
            </Button>
            <Button
              onClick={() => navigate('/wildlife-map')}
              variant="outline"
              className="flex-1"
            >
              <MapPin className="mr-1 h-4 w-4" />
              Map View
            </Button>
          </div>
        </>
      )}
    </div>
  );
  
  // User (villager) view rendering
  const renderUserView = () => (
    <div className="mobile-container py-4">
      {isLoading ? (
        <div className="flex flex-col space-y-4 py-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-24 rounded-lg mb-4"></div>
              <div className="bg-muted h-6 rounded w-3/4 mb-2"></div>
              <div className="bg-muted h-4 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="text-destructive mr-3 mt-1" />
              <div>
                <h3 className="font-medium">Active Wildlife Alerts</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {verifiedAlerts.length > 0 
                    ? `${verifiedAlerts.length} active alerts in your area` 
                    : "No active alerts in your area"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Current Alerts</h2>
            {verifiedAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
                No active alerts at this time
              </div>
            ) : (
              <div className="space-y-3">
                {verifiedAlerts.map((alert) => (
                  <div 
                    key={`alert-${alert.id}`} 
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="text-destructive mr-2 h-5 w-5" />
                        <span className="font-medium">{alert.animalType} Alert</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        Snooze
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center mb-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {alert.location}
                      </div>
                      <div>{alert.timestamp.toLocaleString()}</div>
                    </div>
                    {alert.message && (
                      <div className="bg-destructive/10 border border-destructive/20 p-2 rounded mt-2 text-sm">
                        {alert.message}
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate('/wildlife-map')}>
                      <MapPin className="mr-1 h-4 w-4" />
                      View on Map
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Emergency Contacts</h2>
            </div>
            <div className="space-y-3">
              <div className="border border-border rounded-lg p-4">
                <div className="font-medium mb-1">Forest Department</div>
                <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="font-medium mb-1">Wildlife Rescue</div>
                <div className="text-sm text-muted-foreground">+1 (555) 987-6543</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
  return (
    <div className="pb-20 min-h-screen bg-background">
      <header className="bg-background sticky top-0 z-10 border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Wildlife Alert</h1>
          <div className="flex space-x-2">
            {userRole === "admin" && (
              <>
                <button 
                  onClick={() => navigate('/camera-feed')}
                  className="p-2 rounded-full bg-muted"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => navigate('/wildlife-map')}
                  className="p-2 rounded-full bg-muted"
                >
                  <MapPin className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <PullToRefresh onRefresh={handleRefresh}>
        <main>
          {userRole === "admin" ? renderAdminView() : renderUserView()}
        </main>
      </PullToRefresh>
      <BottomNavigation />
    </div>
  );
};

export default Index;
