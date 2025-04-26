
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="animate-fade-in text-center">
        <div className="mb-8 flex justify-center">
          <div className="bg-car-light rounded-full p-6">
            <Car size={72} className="text-car" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Car Rentals <span className="text-car">June Explorer</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Find and rent your perfect car for your June 2025 adventure with just a few clicks.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs mx-auto">
          <Button asChild className="flex-1 bg-car hover:bg-car-secondary">
            <Link to="/login">Log In</Link>
          </Button>
          
          <Button asChild variant="outline" className="flex-1 border-car text-car hover:bg-car/10">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
