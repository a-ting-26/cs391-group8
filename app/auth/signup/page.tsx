'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // 'student' or 'vendor'
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Set role from URL query parameter if present
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'vendor' || roleParam === 'student') {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);

  const validateBUEmail = (email: string): boolean =>
    /^[a-zA-Z0-9._%+-]+@bu\.edu$/.test(email);

  const validatePassword = (password: string): boolean =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '', confirmPassword: '', general: '' };
    let isValid = true;

    if (!formData.email) { newErrors.email = 'Email is required'; isValid = false; }
    else if (!validateBUEmail(formData.email)) { newErrors.email = 'Please use a valid BU email address (@bu.edu)'; isValid = false; }

    if (!formData.password) { newErrors.password = 'Password is required'; isValid = false; }
    else if (!validatePassword(formData.password)) { newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number'; isValid = false; }

    if (!formData.confirmPassword) { newErrors.confirmPassword = 'Please confirm your password'; isValid = false; }
    else if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = 'Passwords do not match'; isValid = false; }

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

      // Sign up with metadata (role)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: formData.role, // 'student' or 'vendor'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw new Error(error.message);

      // If email confirmations are enabled, user must check inbox
      // Route based on role
      if (formData.role === 'vendor') {
        router.replace('/vendor');
      } else {
        router.replace('/landing?checkEmail=1');
      }
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        general: err?.message || 'An error occurred during sign up',
      }));
    } finally {
      setIsLoading(false);
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
          <p className="text-lg font-semibold text-emerald-800">Sign up to find free food on campus</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-[20px] border-[3px] border-emerald-900 shadow-[0_8px_0_0_rgba(16,78,61,0.3)] p-8">
          <h2 className="text-3xl font-black uppercase tracking-wide text-emerald-900 mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Create Account
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
              <p className="mt-2 text-xs font-medium text-emerald-700">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-emerald-900 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={`w-full px-4 py-3 border-[2px] rounded-[12px] text-emerald-900 placeholder-emerald-400 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-900 outline-none transition ${
                  errors.confirmPassword ? 'border-red-500' : 'border-emerald-700'
                }`}
                required
              />
              {errors.confirmPassword && <p className="mt-2 text-sm font-semibold text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-3">
                I am signing up as: *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="mr-2 h-5 w-5 text-emerald-900 focus:ring-emerald-500 border-emerald-700"
                  />
                  <span className="text-emerald-900 font-semibold">Student</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="vendor"
                    checked={formData.role === 'vendor'}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="mr-2 h-5 w-5 text-emerald-900 focus:ring-emerald-500 border-emerald-700"
                  />
                  <span className="text-emerald-900 font-semibold">Organizer/Vendor</span>
                </label>
              </div>
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="p-4 bg-red-50 border-[2px] border-red-500 rounded-[12px]">
                <p className="text-sm font-semibold text-red-700">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-full border-[3px] border-emerald-900 font-black uppercase tracking-wider text-lg transition-all ${
                isLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed border-gray-400'
                  : 'bg-[#FEF3C7] text-emerald-900 shadow-[0_6px_0_0_rgba(16,78,61,0.4)] hover:-translate-y-1 hover:shadow-[0_8px_0_0_rgba(16,78,61,0.5)] hover:bg-[#FDE68A] active:translate-y-0'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm font-semibold text-emerald-800">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-emerald-900 hover:text-emerald-700 font-black underline">
                Log in
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
