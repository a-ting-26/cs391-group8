'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const validateBUEmail = (email: string): boolean =>
    /^[a-zA-Z0-9._%+-]+@bu\.edu$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Reset resend state when email changes
    if (name === 'email') {
      setShowResend(false);
      setResendSuccess(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '', general: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateBUEmail(formData.email)) {
      newErrors.email = 'Please use a valid BU email address (@bu.edu)';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const supabase = supabaseBrowser();

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Handle email not confirmed error
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed') || error.message.includes('not confirmed')) {
          setShowResend(true);
          throw new Error('Email not confirmed. Please check your inbox and click the confirmation link, or use the resend button below.');
        }
        throw new Error(error.message);
      }

      // Get user role and redirect accordingly
      const user = data.user;
      if (user) {
        const role = user.user_metadata?.role;
        
        if (role === 'vendor') {
          router.push('/vendor');
        } else if (role === 'admin') {
          router.push('/admin');
        } else {
          // default: student
          router.push('/student');
        }
      } else {
        router.push('/student');
      }
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        general: err?.message || 'An error occurred during login',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required to resend confirmation' }));
      return;
    }

    setResendLoading(true);
    setResendSuccess(false);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw new Error(error.message);

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        general: `Failed to resend confirmation: ${err.message}`,
      }));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#8EDFA4] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="mb-8 text-center">
          <h1 
            className="text-5xl font-black uppercase tracking-widest text-emerald-900 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            SparkBytes!
          </h1>
          <p className="text-lg font-semibold text-emerald-800">Log in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-[20px] border-[3px] border-emerald-900 shadow-[0_8px_0_0_rgba(16,78,61,0.3)] p-8">
          <h2 className="text-3xl font-black uppercase tracking-wide text-emerald-900 mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-emerald-900 mb-2">
                BU Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@bu.edu"
                className={`w-full px-4 py-3 border-[2px] rounded-[12px] text-emerald-900 placeholder-emerald-400 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-900 outline-none transition ${
                  errors.email ? 'border-red-500' : 'border-emerald-700'
                }`}
                required
              />
              {errors.email && <p className="mt-2 text-sm font-semibold text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-emerald-900 mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`w-full px-4 py-3 border-[2px] rounded-[12px] text-emerald-900 placeholder-emerald-400 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-900 outline-none transition ${
                  errors.password ? 'border-red-500' : 'border-emerald-700'
                }`}
                required
              />
              {errors.password && <p className="mt-2 text-sm font-semibold text-red-600">{errors.password}</p>}
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="p-4 bg-red-50 border-[2px] border-red-500 rounded-[12px]">
                <p className="text-sm font-semibold text-red-700">{errors.general}</p>
                {showResend && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resendLoading}
                    className="mt-3 w-full py-3 px-4 bg-red-600 text-white rounded-full text-sm font-black uppercase tracking-wider hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-[0_4px_0_0_rgba(16,78,61,0.3)]"
                  >
                    {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
                  </button>
                )}
                {resendSuccess && (
                  <p className="mt-3 text-sm text-green-700 font-bold">
                    Confirmation email sent! Please check your inbox.
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-full border-[3px] border-emerald-900 font-black uppercase tracking-wider text-lg transition-all ${
                isLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed border-gray-400'
                  : 'bg-[#BBF7D0] text-emerald-900 shadow-[0_6px_0_0_rgba(16,78,61,0.4)] hover:-translate-y-1 hover:shadow-[0_8px_0_0_rgba(16,78,61,0.5)] hover:bg-[#86EFAC] active:translate-y-0'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm font-semibold text-emerald-800">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-emerald-900 hover:text-emerald-700 font-black underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-sm font-semibold text-emerald-800">
          Only BU students and faculty can sign up
        </p>
      </div>
    </div>
  );
}

