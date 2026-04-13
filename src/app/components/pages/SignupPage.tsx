import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Mail, Lock, User, Chrome, AtSign } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !username || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      toast.error(
        'Username can only include letters, numbers, dots, underscores, and hyphens'
      );
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      await register({
        name: name,
        username,
        email,
        password,
        otpCode: otpCode || undefined,
      });

      toast.success(`Welcome, ${name}! Start your journaling journey.`);
      navigate('/');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const handleGoogleSignup = () => {
    toast.info('Google signup integration coming soon');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-amber-200"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-amber-900 mb-2">Create Account</h2>
        <p className="text-amber-700">Begin your personal diary journey</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-amber-900">
            Full Name
          </Label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-amber-50 border-amber-200 focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="username" className="text-amber-900">
            Username
          </Label>
          <div className="relative mt-1">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
            <Input
              id="username"
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 bg-amber-50 border-amber-200 focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-amber-900">
            Email
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-amber-50 border-amber-200 focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-amber-900">
            Password
          </Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-amber-50 border-amber-200 focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="otpCode" className="text-amber-900">
            OTP Code (Optional)
          </Label>
          <Input
            id="otpCode"
            type="text"
            placeholder="Enter OTP if you have one"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            maxLength={12}
            className="mt-1 bg-amber-50 border-amber-200 focus:border-amber-400"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
        >
          Create Account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-amber-200" />
        <span className="text-amber-600 text-sm">or</span>
        <div className="flex-1 h-px bg-amber-200" />
      </div>

      <Button
        onClick={handleGoogleSignup}
        variant="outline"
        className="w-full border-amber-300 text-amber-900 hover:bg-amber-50"
      >
        <Chrome className="w-5 h-5 mr-2" />
        Sign up with Google
      </Button>

      <p className="text-center mt-6 text-amber-700">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-amber-600 hover:text-amber-800 underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
};
