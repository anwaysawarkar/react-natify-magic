
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle, MapPin } from "lucide-react";
import AppCard, { AppCardTitle, AppCardContent } from "@/components/ui/AppCard";
import { useAuth } from "@/contexts/AuthContext";

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
  verified: boolean;
  message?: string;
}

interface LocationState {
  focusedAlert?: DetectionAlert;
}

const WildlifeMapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<DetectionAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<DetectionAlert | null>(null);
  const state = location.state as LocationState;
  const { userRole } = useAuth();

  useEffect(() => {
    // Mock data for the map
    const mockAlerts: DetectionAlert[] = [
      {
        id: 1,
        animalType: "Tiger",
        confidence: 95,
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        location: "Core Zone Section A",
        coordinates: { lat: 26.8851, lng: 93.7792 },
        cameraId: "cam-001",
        imageUrl: "https://images.unsplash.com/photo-1564349683",
        verified: true,
        message: "Large tiger spotted moving south. Stay alert."
      },
      {
        id: 2,
        animalType: "Elephant",
        confidence: 88,
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        location: "Core Zone Section B",
        coordinates: { lat: 26.8950, lng: 93.7850 },
        cameraId: "cam-002",
        imageUrl: "https://images.unsplash.com/photo-1557008075",
        verified: true,
        message: "Herd of elephants near eastern village boundary."
      },
      {
        id: 3,
        animalType: "Leopard",
        confidence: 82,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        location: "Core Zone Section C",
        coordinates: { lat: 26.8750, lng: 93.7650 },
        cameraId: "cam-003",
        imageUrl: "https://images.unsplash.com/photo-1526763051",
        verified: false
      }
    ];

    // If we have a focused alert from navigation, add it to our alerts
    if (state?.focusedAlert) {
      setAlerts([state.focusedAlert, ...mockAlerts]);
      setSelectedAlert(state.focusedAlert);
    } else {
      // For users, only show verified alerts
      if (userRole === "user") {
        setAlerts(mockAlerts.filter(alert => alert.verified));
      } else {
        setAlerts(mockAlerts);
      }
    }
  }, [state, userRole]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="pb-6 min-h-screen bg-background">
      <header className="bg-background sticky top-0 z-10 border-b border-border">
        <div className="p-4 flex items-center">
          <button 
            onClick={handleBack}
            className="mr-3"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Wildlife Map</h1>
        </div>
      </header>

      <main className="mobile-container py-4">
        <div className="bg-muted rounded-xl overflow-hidden mb-6 relative">
          <div className="aspect-square flex items-center justify-center">
            {/* This would be replaced with an actual map component */}
            <div className="w-full h-full bg-[#e8eaed] relative">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <span>Interactive Map</span>
              </div>
              
              {alerts.map((alert) => {
                // Calculate random positions for our mock map
                const topPercent = Math.random() * 70 + 15; // Between 15% and 85%
                const leftPercent = Math.random() * 70 + 15; // Between 15% and 85%
                
                return (
                  <div 
                    key={alert.id}
                    style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${selectedAlert?.id === alert.id ? 'z-20' : 'z-10'}`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full 
                      ${!alert.verified ? 'bg-amber-100 text-amber-600 border-amber-300' : 
                        selectedAlert?.id === alert.id ? 'bg-destructive text-white' : 'bg-background text-destructive'}
                      border-2 ${alert.verified ? 'border-destructive' : 'border-amber-400'} shadow-lg
                    `}>
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className={`
                      absolute top-full left-1/2 transform -translate-x-1/2 mt-1
                      bg-background border border-border px-2 py-1 rounded whitespace-nowrap text-xs
                      ${selectedAlert?.id === alert.id ? 'block' : 'hidden'}
                    `}>
                      {alert.animalType} {!alert.verified && "(Unverified)"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {selectedAlert && (
          <AppCard className="mb-6">
            <AppCardTitle className="flex justify-between">
              <span>{selectedAlert.animalType} {selectedAlert.verified ? 'Alert' : 'Detection'}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {selectedAlert.timestamp.toLocaleTimeString()}
              </span>
            </AppCardTitle>
            <AppCardContent>
              <div className="flex items-center mt-2 mb-2">
                <MapPin className="h-4 w-4 mr-2 text-destructive" />
                <span>{selectedAlert.location}</span>
              </div>
              
              {userRole === "admin" && (
                <div className="flex justify-between text-sm mb-3">
                  <span>Camera ID: {selectedAlert.cameraId}</span>
                  <span>Confidence: {selectedAlert.confidence}%</span>
                </div>
              )}
              
              {selectedAlert.message && (
                <div className="bg-destructive/10 border border-destructive/20 p-2 rounded my-2 text-sm">
                  {selectedAlert.message}
                </div>
              )}
              
              {userRole === "admin" && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img 
                    src={selectedAlert.imageUrl} 
                    alt={`${selectedAlert.animalType} detected`} 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <div className="mt-4 flex justify-between">
                {userRole === "admin" ? (
                  <>
                    <button 
                      className="bg-primary text-white px-4 py-2 rounded-md text-sm"
                      onClick={() => navigate('/camera-feed')}
                    >
                      View Live Feed
                    </button>
                    {!selectedAlert.verified && (
                      <button 
                        className="border border-border px-4 py-2 rounded-md text-sm"
                        onClick={() => navigate('/')}
                      >
                        Verify Alert
                      </button>
                    )}
                  </>
                ) : (
                  <button 
                    className="w-full bg-primary text-white px-4 py-2 rounded-md text-sm"
                    onClick={() => {
                      /* Would mark as acknowledged in a real app */
                      navigate('/');
                    }}
                  >
                    Acknowledge Alert
                  </button>
                )}
              </div>
            </AppCardContent>
          </AppCard>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-2">
            {userRole === "admin" ? "Detection History" : "Alert History"}
          </h2>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
              No alerts to display
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`
                  p-3 mb-3 rounded-lg border cursor-pointer
                  ${!alert.verified ? 'border-amber-200 bg-amber-50/30' : 
                    selectedAlert?.id === alert.id ? 'border-primary bg-primary/5' : 'border-border'}
                `}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertTriangle className={`h-4 w-4 mr-2 ${alert.verified ? 'text-destructive' : 'text-amber-500'}`} />
                    <span className="font-medium">{alert.animalType}</span>
                    {!alert.verified && userRole === "admin" && (
                      <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                        Unverified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{alert.location}</span>
                </div>
                {alert.message && (
                  <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {alert.message}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default WildlifeMapPage;
