'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';
import { AlertCircle } from 'lucide-react';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData extends LoginData {
  name: string;
  confirmPassword: string;
}

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: LoginData | SignupData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Login failed');
        return;
      }

      // Add a slight delay to ensure cookie is set before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Sign in to your SkillBridge account
            </p>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <AuthForm
              type="login"
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
