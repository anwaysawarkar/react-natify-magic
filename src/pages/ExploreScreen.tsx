
import { useState } from "react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import AppCard, { AppCardMedia, AppCardTitle, AppCardContent } from "@/components/ui/AppCard";

const categories = [
  "All", "React", "Mobile", "UI/UX", "Frontend", "Design", "Development", "Tutorials"
];

const ExploreScreen = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  return (
    <div className="pb-20 min-h-screen bg-background">
      <header className="bg-background sticky top-0 z-10 border-b border-border">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Explore</h1>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search topics, users, etc." 
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto pb-2 px-4">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="mobile-container py-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <div key={id} className="aspect-square">
              <AppCard 
                className="p-0 h-full"
                onPress={() => console.log(`Pressed explore item ${id}`)}
              >
                <img 
                  src={`https://images.unsplash.com/photo-148631233821${id}-ce68d2c6f44d`}
                  alt={`Explore item ${id}`}
                  className="object-cover w-full h-full rounded-lg"
                />
              </AppCard>
            </div>
          ))}
        </div>
        
        <h2 className="text-lg font-semibold mt-6 mb-3">Popular Tutorials</h2>
        {[1, 2, 3].map((id) => (
          <AppCard key={id} onPress={() => console.log(`Pressed tutorial ${id}`)}>
            <div className="flex gap-3">
              <div className="rounded-md overflow-hidden flex-shrink-0" style={{ width: "80px", height: "80px" }}>
                <img 
                  src={`https://images.unsplash.com/photo-1461749280684-dccba630e2f${id}`}
                  alt={`Tutorial ${id}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <AppCardTitle className="text-base mb-1">Advanced React Native Animations #{id}</AppCardTitle>
                <AppCardContent className="text-sm line-clamp-2">
                  Learn how to create smooth and interactive animations to enhance your mobile app user experience.
                </AppCardContent>
                <p className="text-xs text-muted-foreground mt-1">3.2k views • 4 min read</p>
              </div>
            </div>
          </AppCard>
        ))}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ExploreScreen;
