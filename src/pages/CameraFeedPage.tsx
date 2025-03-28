
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, AlertTriangle, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/layout/BottomNavigation";
import AppCard, { AppCardTitle, AppCardContent } from "@/components/ui/AppCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface DetectionAlert {
  id: number;
  animalType: string;
  confidence: number;
  timestamp: Date;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  cameraId: string;
  imageUrl: string;
}

const CameraFeedPage = () => {
  const [activeCameraId, setActiveCameraId] = useState<string>("cam-001");
  const [alerts, setAlerts] = useState<DetectionAlert[]>([]);
  const [isLive, setIsLive] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simulating receiving a new alert
  useEffect(() => {
    const alertInterval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance of detection
        const newAlert: DetectionAlert = {
          id: Date.now(),
          animalType: ["Tiger", "Elephant", "Leopard", "Bear"][Math.floor(Math.random() * 4)],
          confidence: Math.round(Math.random() * 30 + 70), // 70-100%
          timestamp: new Date(),
          location: "Core Zone Section A",
          coordinates: {
            lat: 26.8851 + (Math.random() * 0.02 - 0.01),
            lng: 93.7792 + (Math.random() * 0.02 - 0.01)
          },
          cameraId: `cam-00${Math.floor(Math.random() * 3) + 1}`,
          imageUrl: `https://images.unsplash.com/photo-${["1564349683", "1557008075", "1526763051", "1590417182"][Math.floor(Math.random() * 4)]}`
        };

        setAlerts(prev => [newAlert, ...prev].slice(0, 10));
        
        toast({
          title: `⚠️ ${newAlert.animalType} Detected!`,
          description: `${newAlert.confidence}% confidence at ${newAlert.location}`,
          variant: "destructive",
        });
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(alertInterval);
  }, [toast]);

  const handleViewMap = (alert: DetectionAlert) => {
    navigate("/wildlife-map", { state: { focusedAlert: alert } });
  };

  return (
    <div className="pb-20 min-h-screen bg-background">
      <header className="bg-background sticky top-0 z-10 border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Wildlife Monitor</h1>
          <div className="flex items-center">
            <button 
              className={`px-3 py-1 rounded-md mr-2 text-sm ${isLive ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? 'LIVE' : 'Paused'}
            </button>
            <select 
              value={activeCameraId}
              onChange={(e) => setActiveCameraId(e.target.value)}
              className="bg-background border border-border rounded-md px-2 py-1 text-sm"
            >
              <option value="cam-001">Camera 1</option>
              <option value="cam-002">Camera 2</option>
              <option value="cam-003">Camera 3</option>
            </select>
          </div>
        </div>
      </header>

      <main className="mobile-container py-4">
        <div className="bg-black rounded-xl overflow-hidden mb-6 relative">
          <div className="aspect-video bg-muted flex items-center justify-center">
            {isLive ? (
              <>
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-sm text-xs flex items-center">
                  <span className="animate-pulse mr-1">●</span> LIVE
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-sm text-xs">
                  Camera ID: {activeCameraId}
                </div>
                <Camera className="text-white/20" size={60} />
              </>
            ) : (
              <div className="text-white/50 flex flex-col items-center">
                <Camera size={40} />
                <span className="mt-2">Feed Paused</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Recent Alerts</h2>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent alerts. System is monitoring...
            </div>
          ) : (
            alerts.map((alert) => (
              <Alert key={alert.id} className="mb-3 border-destructive/20 bg-destructive/5">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <AlertTitle className="flex justify-between">
                    <span>{alert.animalType} Detected</span>
                    <span className="text-sm font-normal">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </AlertTitle>
                  <AlertDescription className="mt-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm">Confidence: {alert.confidence}%</div>
                        <div className="text-sm flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {alert.location}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleViewMap(alert)}
                        className="bg-primary text-white px-3 py-1 rounded-md text-xs"
                      >
                        View Map
                      </button>
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            ))
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CameraFeedPage;
