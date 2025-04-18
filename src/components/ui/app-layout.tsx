
import { ReactNode } from "react";
import BottomNav from "./bottom-nav";

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="pb-16">
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default AppLayout;
