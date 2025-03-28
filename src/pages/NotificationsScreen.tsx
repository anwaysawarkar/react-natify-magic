
import { useState } from "react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PullToRefresh from "@/components/ui/PullToRefresh";

interface Notification {
  id: number;
  type: "follow" | "like" | "comment" | "mention";
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  time: string;
  read: boolean;
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "follow",
      user: {
        name: "Jordan Smith",
        avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
        username: "jordansmith"
      },
      content: "started following you",
      time: "2m ago",
      read: false
    },
    {
      id: 2,
      type: "like",
      user: {
        name: "Taylor Wilson",
        avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
        username: "taylorwilson"
      },
      content: "liked your post 'Creating responsive layouts'",
      time: "1h ago",
      read: false
    },
    {
      id: 3,
      type: "comment",
      user: {
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
        username: "alexjohnson"
      },
      content: "commented: 'This is such a helpful guide!'",
      time: "3h ago",
      read: true
    },
    {
      id: 4,
      type: "mention",
      user: {
        name: "Jamie Lee",
        avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        username: "jamielee"
      },
      content: "mentioned you in a comment: '@user check this out!'",
      time: "5h ago",
      read: true
    }
  ]);
  
  const handleRefresh = async () => {
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mark all as read
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  return (
    <div className="pb-20 min-h-screen bg-background">
      <header className="bg-background sticky top-0 z-10 border-b border-border">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Notifications</h1>
          <Button variant="ghost" size="sm">Mark all as read</Button>
        </div>
      </header>

      <PullToRefresh onRefresh={handleRefresh}>
        <main>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full mb-2 px-4">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="mentions" className="flex-1">Mentions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 flex items-start gap-3",
                      !notification.read && "bg-muted/30"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <img src={notification.user.avatar} alt={notification.user.name} />
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{notification.user.name}</span>{" "}
                        {notification.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                    
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                ))}
                
                {notifications.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="mentions">
              <div className="divide-y divide-border">
                {notifications
                  .filter(n => n.type === "mention")
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 flex items-start gap-3",
                        !notification.read && "bg-muted/30"
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <img src={notification.user.avatar} alt={notification.user.name} />
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{notification.user.name}</span>{" "}
                          {notification.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                  ))}
                
                {notifications.filter(n => n.type === "mention").length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground">No mentions yet</p>
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
