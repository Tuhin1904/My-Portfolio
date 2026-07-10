'use client'
import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';
import { requestForToken } from '@/lib/fcm';
import ButtonSpinner from '@/components/common/ButtonSpinner';
import { RootState, AppDispatch } from '@/store';
import { loginUserThunk, verifyOtpThunk } from '@/store/slices/AuthThunks';
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
    const dispatch = useDispatch<AppDispatch>();

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
    const [resendLoading, setResendLoading] = useState(false);

    // OTP validation states for unverified users
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [emailForVerification, setEmailForVerification] = useState('');
    const [otpCode, setOtpCode] = useState('');

    // Forgot password / reset password states
    const [isForgotStep, setIsForgotStep] = useState(false);
    const [isResetStep, setIsResetStep] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [resetOtp, setResetOtp] = useState('');
    const [resetPasswordVal, setResetPasswordVal] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);

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
            const resultAction = await dispatch(loginUserThunk({ ...data, fcmToken }));

            if (loginUserThunk.fulfilled.match(resultAction)) {
                const user = resultAction.payload?.user;
                if (user?.userRole == 2) {
                    router.push("/my-project-requests");
                } else {
                    router.push("/view-clients-req");
                }
                toast("Welcome!");
            } else {
                const errorMsg = resultAction.payload as string;
                if (errorMsg && errorMsg.includes("Please verify your email")) {
                    toast.error(errorMsg);
                    setEmailForVerification(data.email);
                    setIsOtpStep(true);
                } else {
                    toast.error(errorMsg || "Incorrect Email or Password");
                }
            }
        } catch (err: any) {
            toast.error(err?.message || "Incorrect Email or Password");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode || otpCode.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            const resultAction = await dispatch(verifyOtpThunk({ email: emailForVerification, otp: otpCode }));

            if (verifyOtpThunk.fulfilled.match(resultAction)) {
                const user = resultAction.payload?.user;
                if (user?.userRole == 2) {
                    router.push("/my-project-requests");
                } else {
                    router.push("/view-clients-req");
                }
                toast.success("Email verified successfully! Welcome.");
            } else {
                const errorMsg = resultAction.payload as string;
                toast.error(errorMsg || "Verification failed");
            }
        } catch (err: any) {
            console.error("Verification error:", err);
            toast.error(err?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setResendLoading(true);
            await apiRequest({
                method: "POST",
                url: apiEndpoints.resendOtp,
                data: { email: emailForVerification }
            });
            toast.success("A new OTP has been sent to your email.");
        } catch (err: any) {
            console.error("Resend OTP error:", err);
            toast.error(err?.message || "Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail) {
            toast.error("Email is required");
            return;
        }

        try {
            setLoading(true);
            await apiRequest({
                method: "POST",
                url: apiEndpoints.forgotPassword,
                data: { email: forgotEmail }
            });
            toast.success("If the email is registered, a password reset OTP has been sent.");
            setIsForgotStep(false);
            setIsResetStep(true);
        } catch (err: any) {
            console.error("Forgot password error:", err);
            toast.error(err?.message || "Forgot password request failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetOtp || resetOtp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        if (!resetPasswordVal || resetPasswordVal.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await apiRequest({
                method: "POST",
                url: apiEndpoints.resetPassword,
                data: { email: forgotEmail, otp: resetOtp, newPassword: resetPasswordVal }
            });
            toast.success("Password reset successfully! Please sign in.");
            setIsResetStep(false);
            setResetOtp('');
            setResetPasswordVal('');
        } catch (err: any) {
            console.error("Reset password error:", err);
            toast.error(err?.message || "Password reset failed");
        } finally {
            setLoading(false);
        }
    };

    if (isOtpStep) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                {/* Dot grid */}
                <div className="absolute inset-0 dot-grid-bg opacity-40 pointer-events-none" />

                <div className="relative w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
                        <p className="text-gray-400 text-sm">Please verify your email address to complete registration.</p>
                        <p className="text-gray-400 text-sm mt-1">We sent a 6-digit code to <span className="text-indigo-400 font-semibold">{emailForVerification}</span></p>
                    </div>

                    <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(99,102,241,0.2)' }}>
                        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Verification Code</label>
                                <input
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-gray-800/60 border border-white/8 text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none text-center text-2xl tracking-[10px] font-bold transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full shimmer-btn text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                {loading ? <ButtonSpinner text="Verifying..." /> : "Verify Code"}
                            </button>

                            <div className="flex flex-col gap-2.5 mt-2">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendLoading}
                                    className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {resendLoading ? "Resending..." : "Resend Verification Code"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOtpStep(false);
                                        setOtpCode('');
                                    }}
                                    className="text-sm text-gray-400 hover:text-gray-450 transition-colors cursor-pointer"
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (isForgotStep) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
                <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 dot-grid-bg opacity-40 pointer-events-none" />

                <div className="relative w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
                        <p className="text-gray-400 text-sm">Enter your email and we'll send you an OTP to reset your password</p>
                    </div>

                    <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(99,102,241,0.2)' }}>
                        <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full bg-gray-800/60 border border-white/8 text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full shimmer-btn text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {loading ? <ButtonSpinner text="Sending OTP..." /> : "Send Reset OTP"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsForgotStep(false);
                                    setForgotEmail('');
                                }}
                                className="text-sm text-gray-400 hover:text-gray-450 transition-colors cursor-pointer mt-2"
                            >
                                Back to Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (isResetStep) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
                <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 dot-grid-bg opacity-40 pointer-events-none" />

                <div className="relative w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                        <p className="text-gray-400 text-sm">Verify the reset OTP and enter a new secure password</p>
                    </div>

                    <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(99,102,241,0.2)' }}>
                        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    disabled
                                    className="w-full bg-gray-800/40 border border-white/4 text-gray-500 rounded-xl px-4 py-3 outline-none cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Enter OTP</label>
                                <input
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    value={resetOtp}
                                    onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-gray-800/60 border border-white/8 text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none text-center text-xl tracking-[5px] font-semibold transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showResetPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={resetPasswordVal}
                                        onChange={(e) => setResetPasswordVal(e.target.value)}
                                        className="w-full bg-gray-800/60 border border-white/8 text-white placeholder-gray-600 rounded-xl px-4 py-3 pr-11 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowResetPassword(prev => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                                    >
                                        {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full shimmer-btn text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {loading ? <ButtonSpinner text="Resetting..." /> : "Reset Password"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsResetStep(false);
                                    setIsForgotStep(true);
                                    setResetOtp('');
                                    setResetPasswordVal('');
                                }}
                                className="text-sm text-gray-400 hover:text-gray-450 transition-colors cursor-pointer mt-2"
                            >
                                Back to Forgot Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

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
                    <p className="text-gray-400 text-sm">Sign in to your account to continue</p>
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
                                onClick={() => {
                                    setIsForgotStep(true);
                                    setForgotEmail('');
                                }}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full shimmer-btn text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
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
