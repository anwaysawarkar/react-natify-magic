
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, LogOut } from "lucide-react";
import AppCard, { AppCardTitle, AppCardContent } from "@/components/ui/AppCard";

const ProfilePage = () => {
  return (
    <div className="pb-20 min-h-screen bg-background">
      <header className="bg-background sticky top-0 z-10 border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Profile</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mobile-container py-4">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
              alt="Profile"
            />
          </Avatar>
          <h2 className="text-xl font-semibold">Alex Johnson</h2>
          <p className="text-muted-foreground mb-4">@alexjohnson</p>
          
          <div className="flex w-full justify-center space-x-8 mb-4">
            <div className="text-center">
              <p className="font-bold">485</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div className="text-center">
              <p className="font-bold">2.4k</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold">56</p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
          </div>
          
          <Button className="w-full">Edit Profile</Button>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
            <TabsTrigger value="liked" className="flex-1">Liked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            {[1, 2, 3].map((id) => (
              <AppCard key={id}>
                <AppCardTitle>My Amazing App Project #{id}</AppCardTitle>
                <AppCardContent>
                  Working on some exciting new mobile features today!
                </AppCardContent>
                <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                  <span>42 likes</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </AppCard>
            ))}
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-2">You haven't saved any posts yet</p>
              <Button variant="outline" className="mt-2">Discover posts</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="liked">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-2">You haven't liked any posts yet</p>
              <Button variant="outline" className="mt-2">Discover posts</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
