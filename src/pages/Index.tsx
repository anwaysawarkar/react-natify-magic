
import { useEffect, useState } from "react";
import PullToRefresh from "@/components/ui/PullToRefresh";
import AppCard, { AppCardTitle, AppCardContent, AppCardMedia } from "@/components/ui/AppCard";
import BottomNavigation from "@/components/layout/BottomNavigation";

interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchPosts = async () => {
    setIsLoading(true);
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockPosts: Post[] = [
      {
        id: 1,
        title: "Getting Started with React Native",
        content: "Learn the basics of React Native and build your first mobile app with ease.",
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
      },
      {
        id: 2,
        title: "Mobile UX Best Practices",
        content: "Discover the essential UX principles for creating engaging mobile applications.",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
      },
      {
        id: 3,
        title: "Responsive Design Patterns",
        content: "Explore the most effective responsive design patterns for modern mobile apps.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
      },
      {
        id: 4,
        title: "Advanced Mobile Navigation",
        content: "Master the art of creating intuitive navigation systems for your mobile app.",
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
      }
    ];
    
    setPosts(mockPosts);
    setIsLoading(false);
  };
  
  const handleRefresh = async () => {
    await fetchPosts();
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  return (
    <div className="pb-20 min-h-screen bg-background">
      <header className="bg-background sticky top-0 z-10 border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">MobileApp</h1>
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
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Featured</h2>
                <div className="overflow-x-auto -mx-4 px-4 flex space-x-4 pb-2">
                  {posts.map((post) => (
                    <div 
                      key={`featured-${post.id}`} 
                      className="min-w-[280px] w-[280px] flex-shrink-0"
                    >
                      <AppCard onPress={() => console.log(`Pressed post ${post.id}`)}>
                        <AppCardMedia src={post.image} alt={post.title} />
                        <AppCardTitle>{post.title}</AppCardTitle>
                        <AppCardContent>{post.content}</AppCardContent>
                      </AppCard>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Recent Posts</h2>
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
