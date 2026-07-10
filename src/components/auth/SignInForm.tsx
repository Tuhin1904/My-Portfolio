'use client'
import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';
import { requestForToken } from '@/lib/fcm';
import ButtonSpinner from '@/components/common/ButtonSpinner';
import { RootState } from '@/store';
import { setTokens } from '@/store/slices/AuthSlice';
import { setProfilePic, setUser } from '@/store/slices/UserInfo';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Link from 'next/link';

type FormValues = {
    email: string;
    password: string;
};

const SignInForm = () => {
    const [rememberMe, setRememberMe] = useState(
        () => typeof window !== "undefined" ? localStorage.getItem("rememberMe") === "true" : false
    );
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token, router]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormValues>();

    useEffect(() => {
        const encrypted = localStorage.getItem("authData");

        if (encrypted) {
            fetch("/api/decrypt", {
                method: "POST",
                body: JSON.stringify({ encrypted }),
            })
                .then(res => res.json())
                .then(data => {
                    setValue("email", data.email);
                    setValue("password", data.password);
                });
        }
    }, [setValue]);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: FormValues) => {
        try {
            const remember = localStorage.getItem("rememberMe") === "true";

            if (remember) {
                const res = await fetch("/api/encrypt", {
                    method: "POST",
                    body: JSON.stringify(data),
                });
                const { encrypted } = await res.json();
                localStorage.setItem("authData", encrypted);
            }

            let fcmToken = '';
            try {
                const tokenVal = await requestForToken();
                if (tokenVal) fcmToken = tokenVal;
            } catch (fcmErr) {
                console.error("FCM Token retrieval failed:", fcmErr);
            }

            setLoading(true);
            const res = await apiRequest({
                method: "POST",
                url: apiEndpoints.signIn,
                data: { ...data, fcmToken }
            })

            dispatch(setTokens({
                accessToken: res.data?.accessToken, refreshToken: res.data?.refreshToken
            }))
            dispatch(setUser({
                _id: res.data?.user?._id, email: res.data?.user?.email, name: res.data?.user?.name, userRole: res.data?.user?.userRole
            }))
            dispatch(setProfilePic({
                profilePicUrl: res.data?.user?.profilePicUrl,
            }))

            if (res.data?.user?.userRole == 2) {
                router.push("/my-project-requests");
            } else {
                router.push("/view-clients-req")
            }

            toast("Welcome!")

        } catch (err: any) {
            toast.error(err?.message || "Incorrect Email or Password")
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
            {/* Dot grid */}
            <div className="absolute inset-0 dot-grid-bg opacity-40 pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex flex-col items-center gap-3 group">
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-gray-505 text-sm">Sign in to your account to continue</p>
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl p-8"
                    style={{ border: '1px solid rgba(99,102,241,0.2)' }}>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                                })}
                                className={`w-full bg-gray-800/60 border text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 ${errors.email ? "border-red-500/60" : "border-white/8"}`}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
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
                                        minLength: { value: 6, message: "Minimum 6 characters" },
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

                        {/* Remember me + Forgot password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => {
                                        const value = e.target.checked;
                                        setRememberMe(value);
                                        localStorage.setItem("rememberMe", String(value));
                                    }}
                                    className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                                />
                                <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">Remember me</span>
                            </label>
                            <button
                                type="button"
                                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                                onClick={() => router.push("/forgot-password")}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full shimmer-btn text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? <ButtonSpinner text="Signing in..." /> : "Sign In"}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-white/8" />
                            <span className="text-gray-650 text-xs uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-white/8" />
                        </div>

                        {/* Sign up */}
                        <p className="text-center text-sm text-gray-500">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                                onClick={() => router.push("/sign-up")}
                            >
                                Sign Up
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignInForm;
