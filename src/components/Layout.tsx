
import { useAuth } from "@/contexts/auth-context";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Home, User } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 mb-16">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
        <div className="flex items-center justify-around h-16">
          <Link to="/home" className={`flex flex-col items-center ${isActive('/home') ? 'text-car' : 'text-gray-600'}`}>
            <Home size={24} />
            <span className="text-xs mt-1">Search</span>
          </Link>
          <Link to="/my-rentals" className={`flex flex-col items-center ${isActive('/my-rentals') ? 'text-car' : 'text-gray-600'}`}>
            <Car size={24} />
            <span className="text-xs mt-1">My Rentals</span>
          </Link>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center h-full rounded-none text-gray-600 hover:text-car hover:bg-transparent"
            onClick={() => signOut()}
          >
            <User size={24} />
            <span className="text-xs mt-1">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
