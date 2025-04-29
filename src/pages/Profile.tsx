
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserRound, 
  Settings, 
  LogOut, 
  Mail, 
  Bell, 
  Shield, 
  CreditCard, 
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Profile = () => {
  const { currentUser, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    phone: "123-456-7890", // Mock data
  });

  // Mock payment methods
  const paymentMethods = [
    {
      id: "1",
      type: "visa",
      last4: "4242",
      expiry: "04/25",
    },
    {
      id: "2",
      type: "mastercard",
      last4: "5678",
      expiry: "09/24",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile in the database
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="container mx-auto pb-20 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Button variant="outline" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col items-center mb-8">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="/placeholder.svg" alt={userData.fullName} />
          <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">{userData.fullName}</h2>
        <p className="text-gray-500">{userData.email}</p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardContent className="pt-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={userData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleSaveProfile} className="bg-car hover:bg-car-secondary">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Full Name</span>
                    <span className="font-medium">{userData.fullName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="font-medium">{userData.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span className="font-medium">{userData.phone}</span>
                  </div>
                  <Button onClick={() => setIsEditing(true)} className="bg-car hover:bg-car-secondary">
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 space-y-2">
            <div
              className="flex items-center justify-between p-4 bg-white rounded-lg border cursor-pointer"
              onClick={() => toast.info("ID verification would open here")}
            >
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-3 text-car" />
                <span>ID Verification</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div
              className="flex items-center justify-between p-4 bg-white rounded-lg border cursor-pointer"
              onClick={() => toast.info("Support would open here")}
            >
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-3 text-car" />
                <span>Help & Support</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>

              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-6 bg-gray-200 rounded mr-3 flex items-center justify-center">
                      {method.type === "visa" ? "Visa" : "MC"}
                    </div>
                    <div>
                      <p className="font-medium">•••• {method.last4}</p>
                      <p className="text-xs text-gray-500">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toast.info("Edit payment method")}
                  >
                    Edit
                  </Button>
                </div>
              ))}

              <Button onClick={() => toast.info("Add payment method")} variant="outline" className="w-full mt-4">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>

              <h3 className="text-lg font-semibold mt-6">Billing History</h3>
              <div className="text-center py-6 text-gray-500">
                <p>No billing history available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <h3 className="text-lg font-semibold mb-4">Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about your rental activity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => toast.error("This action is disabled in the demo")}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
