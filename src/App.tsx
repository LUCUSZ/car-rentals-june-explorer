
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import Welcome from "@/pages/Welcome";
import SignUp from "@/pages/SignUp";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import CarDetails from "@/pages/CarDetails";
import Booking from "@/pages/Booking";
import RentalConfirmation from "@/pages/RentalConfirmation";
import Chat from "@/pages/Chat";
import MyRentals from "@/pages/MyRentals";
import Profile from "@/pages/Profile";
import ManageBookings from "@/pages/ManageBookings";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Authentication route wrapper (redirects if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (currentUser) {
    return <Navigate to="/home" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AuthRoute><Welcome /></AuthRoute>} />
    <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
    <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
    
    <Route path="/home" element={
      <ProtectedRoute>
        <Layout>
          <Home />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/car/:carId" element={
      <ProtectedRoute>
        <Layout>
          <CarDetails />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/booking/:carId" element={
      <ProtectedRoute>
        <Layout>
          <Booking />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/rental-confirmation/:carId" element={
      <ProtectedRoute>
        <Layout>
          <RentalConfirmation />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/chat" element={
      <ProtectedRoute>
        <Layout>
          <Chat />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/chat/:chatId" element={
      <ProtectedRoute>
        <Layout>
          <Chat />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/my-rentals" element={
      <ProtectedRoute>
        <Layout>
          <MyRentals />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/profile" element={
      <ProtectedRoute>
        <Layout>
          <Profile />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/manage-bookings" element={
      <ProtectedRoute>
        <Layout>
          <ManageBookings />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/admin" element={
      <ProtectedRoute>
        <Layout>
          <Admin />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
