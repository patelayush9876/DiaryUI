import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Mail, Lock, Chrome } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await login({ identifier: email, password });
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google login integration coming soon');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-amber-200"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-amber-900 mb-2">Welcome Back</h2>
        <p className="text-amber-700">Continue your journaling journey</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
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

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
        >
          Sign In
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-amber-200" />
        <span className="text-amber-600 text-sm">or</span>
        <div className="flex-1 h-px bg-amber-200" />
      </div>

      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full border-amber-300 text-amber-900 hover:bg-amber-50"
      >
        <Chrome className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <p className="text-center mt-6 text-amber-700">
        Don't have an account?{' '}
        <Link to="/auth/signup" className="text-amber-600 hover:text-amber-800 underline">
          Sign up
        </Link>
      </p>

      {/* Admin Portal Link */}
      <div className="mt-4 pt-4 border-t border-amber-200">
        <p className="text-center text-xs text-amber-600">
          Administrator?{' '}
          <Link
            to="/admin/login"
            className="text-amber-700 hover:text-amber-900 underline font-medium"
          >
            Access Admin Portal
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
