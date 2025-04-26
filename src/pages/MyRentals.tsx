
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { getUserRentals } from "@/services/carService";
import { Rental } from "@/lib/types";
import { toast } from "sonner";
import { Car } from "lucide-react";

const MyRentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchRentals = async () => {
      if (!currentUser) {
        return;
      }
      
      try {
        setLoading(true);
        const userRentals = await getUserRentals(currentUser.id);
        setRentals(userRentals);
      } catch (error) {
        console.error("Error fetching user rentals:", error);
        toast.error("Failed to load your rentals");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRentals();
  }, [currentUser]);
  
  const getStatusBadge = (rental: Rental) => {
    const now = new Date();
    const rentDate = rental.rentDate;
    const returnDate = rental.returnDate;
    
    if (now < rentDate) {
      return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Upcoming</span>;
    } else if (now > returnDate) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Completed</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
    }
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">My Rentals</h1>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p>Loading your rentals...</p>
        </div>
      ) : rentals.length > 0 ? (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <Card key={rental.id} className="overflow-hidden">
              <CardHeader className="bg-car-light pb-3">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span className="text-car-secondary">
                    {rental.car ? `${rental.car.make} ${rental.car.model}` : "Unknown Car"}
                  </span>
                  {getStatusBadge(rental)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-medium">{rental.car?.color || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rental Date</p>
                    <p className="font-medium">{format(rental.rentDate, "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Return Date</p>
                    <p className="font-medium">{format(rental.returnDate, "MMM d, yyyy")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Car size={48} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No rentals yet</h3>
          <p className="text-gray-500">You haven't rented any cars yet. Start by searching for available cars!</p>
        </div>
      )}
    </div>
  );
};

export default MyRentals;
