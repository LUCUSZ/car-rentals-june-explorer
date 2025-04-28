
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await signIn(email, password);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      // Toast is already handled in auth context
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="animate-fade-in w-full max-w-md space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-blue-50 rounded-full p-4">
              <Car className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Car Rental</h1>
            <p className="mt-2 text-sm text-gray-600">
              Your Ultimate Car Rental Experience
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Let's Get Started"}
          </Button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
