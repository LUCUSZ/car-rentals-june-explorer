
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Car,
  Search,
  UserRound,
  BarChart3,
  Settings,
  Users,
  MessageSquare,
  FileText,
  PlusCircle,
  Trash2,
  Edit,
  AlertCircle,
  Check,
  X
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Car as CarType, User } from "@/lib/types";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState<CarType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Mock statistics data
  const stats = {
    totalUsers: 256,
    totalCars: 124,
    activeRentals: 43,
    totalRevenue: 12580
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock car data
      const mockCars = [
        {
          id: "car1",
          make: "Toyota",
          model: "Camry",
          color: "White",
          rentals: []
        },
        {
          id: "car2",
          make: "Honda",
          model: "Civic",
          color: "Black",
          rentals: []
        },
        {
          id: "car3",
          make: "Tesla",
          model: "Model 3",
          color: "Red",
          rentals: []
        },
        {
          id: "car4",
          make: "BMW",
          model: "X5",
          color: "Silver",
          rentals: []
        },
        {
          id: "car5",
          make: "Mercedes",
          model: "C-Class",
          color: "Blue",
          rentals: []
        }
      ];
      
      // Mock user data
      const mockUsers = [
        {
          id: "user1",
          fullName: "John Doe",
          email: "john@example.com"
        },
        {
          id: "user2",
          fullName: "Jane Smith",
          email: "jane@example.com"
        },
        {
          id: "user3",
          fullName: "Michael Johnson",
          email: "michael@example.com"
        },
        {
          id: "user4",
          fullName: "Sarah Williams",
          email: "sarah@example.com"
        },
        {
          id: "user5",
          fullName: "Robert Brown",
          email: "robert@example.com"
        }
      ];
      
      setCars(mockCars);
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDeleteCar = (id: string) => {
    setCars(cars.filter(car => car.id !== id));
    toast.success("Car removed successfully");
  };
  
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("User removed successfully");
  };
  
  const filteredCars = searchQuery 
    ? cars.filter(car => 
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
        car.model.toLowerCase().includes(searchQuery.toLowerCase()))
    : cars;
    
  const filteredUsers = searchQuery
    ? users.filter(user => 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    : users;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-car hover:bg-car-secondary">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-6 w-6 mr-2 text-car" />
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Cars Listed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Car className="h-6 w-6 mr-2 text-car" />
              <div className="text-2xl font-bold">{stats.totalCars}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 mr-2 text-car" />
              <div className="text-2xl font-bold">{stats.activeRentals}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-car" />
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="cars">
        <TabsList>
          <TabsTrigger value="cars" className="flex items-center">
            <Car className="mr-2 h-4 w-4" />
            Cars
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <UserRound className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cars" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Car Management</h2>
            <Button className="bg-car hover:bg-car-secondary">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Car
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell className="font-medium">{car.id}</TableCell>
                    <TableCell>{car.make}</TableCell>
                    <TableCell>{car.model}</TableCell>
                    <TableCell>{car.color}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => toast.info(`Edit car: ${car.make} ${car.model}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteCar(car.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchQuery ? (
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">No cars found matching "{searchQuery}"</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Car className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">No cars available</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">User Management</h2>
            <Button className="bg-car hover:bg-car-secondary">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => toast.info(`Edit user: ${user.fullName}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {searchQuery ? (
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">No users found matching "{searchQuery}"</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">No users available</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Reports</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Export Reports
              </Button>
              <Button className="bg-car hover:bg-car-secondary">
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(3).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">R-{1001 + index}</TableCell>
                  <TableCell>{["Monthly Revenue", "User Growth", "Car Utilization"][index]}</TableCell>
                  <TableCell>{["Financial", "Analytics", "Performance"][index]}</TableCell>
                  <TableCell>{new Date(2023, 5 + index, 15).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      index === 0 
                        ? "bg-green-50 text-green-600 border-green-200"
                        : index === 1
                          ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                          : "bg-blue-50 text-blue-600 border-blue-200"
                    }>
                      {["Complete", "Processing", "Published"][index]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`View Report ${1001 + index}`)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">System Notices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-yellow-100 p-1 rounded">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">Database Maintenance</p>
              <p className="text-sm text-gray-500">System will be down for maintenance on July 1st, 2025 from 2-4 AM.</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => toast.info("Notice dismissed")}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-1 rounded">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Payment System Updated</p>
              <p className="text-sm text-gray-500">New payment system has been successfully integrated with the platform.</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => toast.info("Notice dismissed")}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
