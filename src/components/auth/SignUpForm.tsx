'use client'
import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';
import ButtonSpinner from '@/components/common/ButtonSpinner';

type FormValues = {
    email: string;
    password: string;
    location: string;
    phone: string;
    userName: string;
};

const SignUpForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true);
            await apiRequest({
                method: "POST",
                url: apiEndpoints.signUp,
                data: { ...data, userRole: 2 } // Registered Client user role is 2
            });

            toast.success("Account created! Please sign in.");
            router.push("/sign-in");
        } catch (err: any) {
            console.error("Sign up error:", err);
            toast.error(err?.message || "Sign up failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
            {/* Dot grid */}
            <div className="absolute inset-0 dot-grid-bg opacity-40 pointer-events-none" />

            <div className="relative w-full max-w-md z-10">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400 text-sm">Join to submit inquiries and track your projects</p>
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(99,102,241,0.2)' }}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Username</label>
                            <input
                                type="text"
                                placeholder="johndoe"
                                {...register("userName", { required: "Username is required" })}
                                className={`w-full bg-gray-800/60 border text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 ${errors.userName ? "border-red-500/60" : "border-white/8"}`}
                            />
                            {errors.userName && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.userName.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                                })}
                                className={`w-full bg-gray-800/60 border text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 ${errors.email ? "border-red-500/60" : "border-white/8"}`}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone Number</label>
                            <input
                                type="text"
                                placeholder="123-456-7890"
                                {...register("phone", {
                                    required: "Phone number is required",
                                    minLength: { value: 8, message: "Minimum 8 digits required" },
                                })}
                                className={`w-full bg-gray-800/60 border text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 ${errors.phone ? "border-red-500/60" : "border-white/8"}`}
                            />
                            {errors.phone && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Location</label>
                            <input
                                type="text"
                                placeholder="New York, USA"
                                {...register("location", { required: "Location is required" })}
                                className={`w-full bg-gray-800/60 border text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 ${errors.location ? "border-red-500/60" : "border-white/8"}`}
                            />
                            {errors.location && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.location.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 8, message: "Minimum 8 characters" },
                                    })}
                                    className={`w-full bg-gray-800/60 border text-white placeholder-gray-600 rounded-xl px-4 py-3 pr-11 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 ${errors.password ? "border-red-500/60" : "border-white/8"}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full shimmer-btn text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all mt-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? <ButtonSpinner text="Creating account..." /> : "Create Account"}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-px bg-white/8" />
                            <span className="text-gray-655 text-xs uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-white/8" />
                        </div>

                        {/* Sign in redirect */}
                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                                onClick={() => router.push("/sign-in")}
                            >
                                Sign In
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
