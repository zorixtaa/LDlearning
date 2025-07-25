import React, { useState } from 'react';
import { LogIn, Truck, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Try admin@lineaeducatrack.com / demo123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-4">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100">LÍNEA EDUCATRACK</h1>
          <p className="text-gray-400 mt-2">Logistics Training Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
          <h3 className="font-medium text-blue-300 mb-2">Demo Credentials:</h3>
          <div className="text-sm text-blue-400 space-y-1">
            <p><strong>Admin:</strong> admin@lineaeducatrack.com / demo123</p>
            <p><strong>Candidate:</strong> candidate@lineaeducatrack.com / demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
};