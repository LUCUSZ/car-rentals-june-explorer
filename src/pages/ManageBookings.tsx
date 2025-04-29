
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Car, CheckCircle, Clock, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Mock data - in a real app this would come from API
interface BookingRequest {
  id: string;
  carId: string;
  carMake: string;
  carModel: string;
  carImage?: string;
  userName: string;
  userAvatar?: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "approved" | "declined" | "completed";
  totalAmount: number;
}

const ManageBookings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  useEffect(() => {
    // Simulate API call to fetch bookings
    const fetchBookings = () => {
      // Mock data
      const mockBookings: BookingRequest[] = [
        {
          id: "b1",
          carId: "c1",
          carMake: "Toyota",
          carModel: "Camry",
          carImage: "/placeholder.svg",
          userName: "John Doe",
          startDate: new Date(),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          status: "pending",
          totalAmount: 120,
        },
        {
          id: "b2",
          carId: "c2",
          carMake: "Honda",
          carModel: "Accord",
          carImage: "/placeholder.svg",
          userName: "Jane Smith",
          startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          status: "approved",
          totalAmount: 180,
        },
        {
          id: "b3",
          carId: "c3",
          carMake: "Tesla",
          carModel: "Model 3",
          carImage: "/placeholder.svg",
          userName: "Mike Johnson",
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          status: "completed",
          totalAmount: 250,
        },
        {
          id: "b4",
          carId: "c4",
          carMake: "BMW",
          carModel: "X5",
          carImage: "/placeholder.svg",
          userName: "Sarah Williams",
          startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          status: "declined",
          totalAmount: 300,
        },
      ];

      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    };

    fetchBookings();
  }, []);

  const handleApproveBooking = (bookingId: string) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "approved" } : booking
      )
    );
    toast.success("Booking approved successfully!");
  };

  const handleDeclineBooking = (bookingId: string) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "declined" } : booking
      )
    );
    toast.success("Booking declined successfully!");
  };

  // Filter bookings by status
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );
  const approvedBookings = bookings.filter(
    (booking) => booking.status === "approved"
  );
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );
  const declinedBookings = bookings.filter(
    (booking) => booking.status === "declined"
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-car">
              {pendingBookings.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-car">
              ${bookings
                .filter((b) => b.status === "completed")
                .reduce((acc, curr) => acc + curr.totalAmount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="declined">
            Declined ({declinedBookings.length})
          </TabsTrigger>
        </TabsList>

        {["pending", "approved", "completed", "declined"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {bookings
              .filter((booking) => booking.status === status)
              .map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 h-40 md:h-auto bg-gray-200">
                      <img
                        src={booking.carImage || "/placeholder.svg"}
                        alt={`${booking.carMake} ${booking.carModel}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {booking.carMake} {booking.carModel}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Requested by {booking.userName}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : status === "approved"
                              ? "bg-green-100 text-green-800"
                              : status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-car" />
                          <div className="text-sm">
                            <p className="text-gray-500">Start Date</p>
                            <p className="font-medium">
                              {format(booking.startDate, "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-car" />
                          <div className="text-sm">
                            <p className="text-gray-500">End Date</p>
                            <p className="font-medium">
                              {format(booking.endDate, "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="font-semibold">
                          Total: ${booking.totalAmount}
                        </div>

                        {status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveBooking(booking.id)}
                              className="bg-car hover:bg-car-secondary"
                              size="sm"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleDeclineBooking(booking.id)}
                              variant="outline"
                              size="sm"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Decline
                            </Button>
                          </div>
                        )}

                        {status === "approved" && (
                          <Button
                            onClick={() => toast.info("Booking details")}
                            variant="outline"
                            size="sm"
                          >
                            <Car className="mr-2 h-4 w-4" />
                            Track Rental
                          </Button>
                        )}

                        {status === "completed" && (
                          <Button
                            onClick={() => toast.info("Booking history")}
                            variant="outline"
                            size="sm"
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            View History
                          </Button>
                        )}

                        {status === "declined" && (
                          <Button
                            onClick={() => handleApproveBooking(booking.id)}
                            variant="outline"
                            size="sm"
                          >
                            Reconsider
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

            {bookings.filter((booking) => booking.status === status).length ===
              0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No {status} bookings found</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ManageBookings;
