import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Alert, AlertDescription } from "../../ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (email === "admin@diary.com" && password === "admin123") {
        // Show 2FA step
        setShow2FA(true);
        setIsLoading(false);
      } else {
        setError("Invalid credentials. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };

  const handleVerifyOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (otp === "123456") {
        // Set auth token
        localStorage.setItem("admin-auth", "true");
        navigate("/admin");
      } else {
        setError("Invalid OTP code. Please try again.");
        setIsLoading(false);
        setOtp("");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-400">Secure access for administrators only</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {!show2FA ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="pl-10 bg-slate-50 border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-slate-50 border-slate-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </Button>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 font-medium mb-2">Demo Credentials:</p>
                <p className="text-xs text-blue-700">Email: admin@diary.com</p>
                <p className="text-xs text-blue-700">Password: admin123</p>
                <p className="text-xs text-blue-700 mt-1">2FA Code: 123456</p>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  Two-Factor Authentication
                </h2>
                <p className="text-sm text-slate-600">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOTP}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                  disabled={otp.length !== 6 || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </Button>

                <Button
                  onClick={() => {
                    setShow2FA(false);
                    setOtp("");
                    setError("");
                  }}
                  variant="ghost"
                  className="w-full text-slate-600"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Unauthorized access is strictly prohibited
        </p>

        {/* Back to User Portal */}
        <div className="text-center mt-3">
          <a
            href="/auth/login"
            className="text-xs text-slate-500 hover:text-slate-300 underline"
          >
            Back to User Portal
          </a>
        </div>
      </div>
    </div>
  );
}