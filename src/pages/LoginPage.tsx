
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Shield, User } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (role: "admin" | "user") => {
    setIsLoading(true);
    
    // Simulate API login delay
    setTimeout(() => {
      login(role);
      toast({
        title: "Login successful",
        description: `You are now logged in as ${role}`,
      });
      navigate("/");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-background p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Wildlife Alert</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Login to receive or manage wildlife alerts
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin("admin")}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-4 bg-background border border-border rounded-lg transition hover:bg-muted"
          >
            <div className="flex items-center">
              <Shield className="mr-3 h-6 w-6 text-primary" />
              <div className="text-left">
                <div className="font-medium">Login as Admin</div>
                <div className="text-sm text-muted-foreground">
                  Verify and manage wildlife alerts
                </div>
              </div>
            </div>
            <span className="text-muted-foreground">→</span>
          </button>

          <button
            onClick={() => handleLogin("user")}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-4 bg-background border border-border rounded-lg transition hover:bg-muted"
          >
            <div className="flex items-center">
              <User className="mr-3 h-6 w-6 text-primary" />
              <div className="text-left">
                <div className="font-medium">Login as Villager</div>
                <div className="text-sm text-muted-foreground">
                  Receive wildlife alerts
                </div>
              </div>
            </div>
            <span className="text-muted-foreground">→</span>
          </button>
        </div>

        {isLoading && (
          <p className="text-center mt-4 text-muted-foreground">Logging in...</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
