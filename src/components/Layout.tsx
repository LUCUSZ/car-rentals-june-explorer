
import { useAuth } from "@/contexts/auth-context";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Home, User, MessageSquare, Settings } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Check if user is an admin (for demo purposes)
  const isAdmin = currentUser?.email === "admin@example.com";

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
          
          <Link to="/chat" className={`flex flex-col items-center ${isActive('/chat') ? 'text-car' : 'text-gray-600'}`}>
            <MessageSquare size={24} />
            <span className="text-xs mt-1">Messages</span>
          </Link>
          
          <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-car' : 'text-gray-600'}`}>
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          
          {isAdmin && (
            <Link to="/admin" className={`flex flex-col items-center ${isActive('/admin') ? 'text-car' : 'text-gray-600'}`}>
              <Settings size={24} />
              <span className="text-xs mt-1">Admin</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
