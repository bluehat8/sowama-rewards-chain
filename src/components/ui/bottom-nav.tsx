
import { Leaf, Gift, LineChart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    {
      icon: Leaf,
      label: "Inicio",
      path: "/",
    },
    {
      icon: Gift,
      label: "Canjear",
      path: "/marketplace",
    },
    {
      icon: LineChart,
      label: "Impacto",
      path: "/impact",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-md py-2 px-4 flex items-center justify-around z-50">
      {navItems.map((item) => {
        const isActive = item.path === location.pathname;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 rounded-lg",
              isActive 
                ? "text-sowama-leaf" 
                : "text-muted-foreground hover:text-sowama-leaf/80"
            )}
          >
            <item.icon 
              className={cn(
                "h-5 w-5 mb-1 transition-all",
                isActive 
                  ? "scale-110 stroke-[2.5px]" 
                  : "stroke-[1.5px]"
              )} 
            />
            <span className={cn("text-xs", isActive && "font-medium")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default BottomNav;
