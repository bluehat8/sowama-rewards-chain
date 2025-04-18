
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Leaf, Gift, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import MotivationalMessage from "@/components/ui/motivational-message";
import FloatingParticles from "@/components/ui/floating-particles";
import { currentUser } from "@/services/dataService";
import blockchainService from "@/services/blockchainService";
import { Activity as ActivityType } from "@/lib/types";
import AppLayout from "@/components/ui/app-layout";

export default function Dashboard() {
  const [user, setUser] = useState(currentUser);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Initialize wallet silently
        await blockchainService.initializeWallet(user.id);
        
        // Get points from blockchain
        const points = await blockchainService.getUserPoints(user.id);
        setUser(prev => ({ ...prev, points }));
        
        // Get activity from blockchain transactions
        const activities = await blockchainService.getUserActivity(user.id);
        setActivities(activities);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Define activity type styles
  const activityStyles = {
    delivery: {
      bg: "bg-sowama-leafLight/20",
      border: "border-sowama-leafLight",
      text: "text-sowama-leafDark",
    },
    redeem: {
      bg: "bg-sowama-soilLight/20",
      border: "border-sowama-soilLight",
      text: "text-sowama-soilDark",
    },
    donation: {
      bg: "bg-sowama-skyLight/20",
      border: "border-sowama-skyLight",
      text: "text-sowama-skyDark",
    },
  };

  return (
    <AppLayout>
      <div className="container mx-auto max-w-md px-4 py-8 relative">
        <FloatingParticles 
          quantity={15} 
          type="mixed" 
          speed="slow" 
        />
      
      {/* Motivational Message */}
      <MotivationalMessage 
        message="¡Gracias por cuidar el planeta!" 
        icon="🌱" 
        className="mb-6"
      />
      
      {/* Points Card */}
      <Card className="mb-6 overflow-hidden bg-gradient-to-br from-sowama-leaf to-sowama-leafDark text-white border-none shadow-lg">
        <CardContent className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Tu saldo de puntos</div>
            <div className="text-xs opacity-70">Sowama Points</div>
          </div>
          <div className="flex items-center gap-3">
            <Leaf size={32} className="text-white/80" />
            <span className="text-4xl font-bold">{user.points.toLocaleString()}</span>
          </div>
          <p className="text-xs opacity-80">Puntos disponibles para canjear</p>
        </CardContent>
      </Card>
      
      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link to="/waste-delivery">
          <Button 
            className="bg-sowama-leaf hover:bg-sowama-leafDark text-white py-6 h-auto flex flex-col gap-2 w-full"
          >
            <Leaf className="h-6 w-6" />
            <span>Entregar Residuos</span>
          </Button>
        </Link>
        <Link to="/marketplace">
          <Button 
            className="bg-sowama-soil hover:bg-sowama-soilDark text-white py-6 h-auto flex flex-col gap-2 w-full"
          >
            <Gift className="h-6 w-6" />
            <span>Canjear Puntos</span>
          </Button>
        </Link>
      </div>
      
      {/* Recent Activity */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-sowama-leafDark">
            Actividad Reciente
          </h2>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-sowama-leaf"
          >
            <Activity className="h-4 w-4 mr-1" />
            Ver todo
          </Button>
        </div>
        
        <div className="space-y-3">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className={`p-3 rounded-lg border ${activityStyles[activity.type].bg} ${activityStyles[activity.type].border} flex items-center gap-3`}
            >
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${activityStyles[activity.type].text}`}>
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div className={`text-sm font-medium ${activity.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {activity.points > 0 ? `+${activity.points}` : activity.points}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </AppLayout>
  );
}
