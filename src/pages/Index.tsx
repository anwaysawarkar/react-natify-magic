
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PullToRefresh from "@/components/ui/PullToRefresh";
import AppCard, { AppCardTitle, AppCardContent, AppCardMedia } from "@/components/ui/AppCard";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { AlertTriangle, Camera, MapPin } from "lucide-react";

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
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const fetchData = async () => {
    setIsLoading(true);
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockPosts: Post[] = [
      {
        id: 1,
        title: "Wildlife Monitoring System Launched",
        content: "Our new system uses AI to detect harmful wildlife and alert nearby communities to prevent human-animal conflicts.",
        image: "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd"
      },
      {
        id: 2,
        title: "Tiger Population Growing in Core Zone",
        content: "Recent camera trap data shows an increase in tiger population in the protected forest area.",
        image: "https://images.unsplash.com/photo-1564349683136-77e82a5da672"
      },
      {
        id: 3,
        title: "How to Respond to Wildlife Alerts",
        content: "Guidelines for community members on appropriate responses when receiving wildlife movement alerts.",
        image: "https://images.unsplash.com/photo-1590417182138-31c9681f8182"
      },
      {
        id: 4,
        title: "New Cameras Installed in Section B",
        content: "Additional monitoring capabilities have been added to improve coverage in the eastern section of the forest.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
      }
    ];
    
    const mockAlerts: Alert[] = [
      {
        id: 1,
        animalType: "Tiger",
        location: "Core Zone Section A",
        timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        id: 2,
        animalType: "Elephant",
        location: "Core Zone Section B",
        timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
      },
      {
        id: 3,
        animalType: "Leopard",
        location: "Core Zone Section C",
        timestamp: new Date(Date.now() - 1000 * 60 * 240) // 4 hours ago
      }
    ];
    
    setPosts(mockPosts);
    setRecentAlerts(mockAlerts);
    setIsLoading(false);
  };
  
  const handleRefresh = async () => {
    await fetchData();
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="pb-20 min-h-screen bg-background">
      <header className="bg-background sticky top-0 z-10 border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Wildlife Alert</h1>
          <div className="flex space-x-2">
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
          </div>
        </div>
      </header>
      
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="mobile-container py-4">
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
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="text-destructive mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">Recent Wildlife Activity</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {recentAlerts.length > 0 
                        ? `${recentAlerts.length} wildlife alerts in the last 24 hours` 
                        : "No wildlife alerts in the last 24 hours"}
                    </p>
                    
                    <div className="mt-3">
                      <button 
                        onClick={() => navigate('/camera-feed')}
                        className="bg-destructive text-white px-4 py-2 rounded-md text-sm mr-2"
                      >
                        View Cameras
                      </button>
                      <button 
                        onClick={() => navigate('/wildlife-map')}
                        className="bg-background border border-border px-4 py-2 rounded-md text-sm"
                      >
                        See Map
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Recent Alerts</h2>
                {recentAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-border rounded-lg">
                    No alerts in the last 24 hours
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-4 px-4 flex space-x-4 pb-2">
                    {recentAlerts.map((alert) => (
                      <div 
                        key={`alert-${alert.id}`} 
                        className="min-w-[280px] w-[280px] flex-shrink-0 border border-border rounded-lg p-4 cursor-pointer"
                        onClick={() => navigate('/wildlife-map')}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Information</h2>
                {posts.map((post) => (
                  <AppCard 
                    key={post.id} 
                    onPress={() => console.log(`Pressed post ${post.id}`)}
                  >
                    <AppCardMedia src={post.image} alt={post.title} />
                    <AppCardTitle>{post.title}</AppCardTitle>
                    <AppCardContent>{post.content}</AppCardContent>
                    <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                      <span>5 min read</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </AppCard>
                ))}
              </div>
            </>
          )}
        </main>
      </PullToRefresh>
      <BottomNavigation />
    </div>
  );
};

export default Index;
